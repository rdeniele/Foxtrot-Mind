import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { deriveTitle, getConversation, saveConversation, StoredConversation } from '@/ai/conversationStore';
import { extractMemoryCandidate, generateReply, MemoryCandidate, stopGeneration } from '@/ai/localModel';
import { listMemories, MemoryItem, saveMemory, touchMemories } from '@/ai/memoryStore';
import { useModel } from '@/ai/ModelProvider';
import { BottomSheet, Button, ChatBubble, Chip, Composer, FoxCompanion, IconButton, SheetAction, StatusPill, ThemedText, TopAppBar } from '@/components/ui';
import { ChatMessage, companionModes, suggestedPrompts } from '@/data/sampleContent';
import { RESPONSE_LENGTH_TOKENS, useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function TalkScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const { companionMode, setCompanionMode, responseLength, memoryEnabled, memoryAutoSave } = useAppState();
  const { status, loaded, loadModel } = useModel();
  const { id: paramId } = useLocalSearchParams<{ id?: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [waking, setWaking] = useState(false);
  const [modeSheetOpen, setModeSheetOpen] = useState(false);
  const [actionsFor, setActionsFor] = useState<ChatMessage | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [pendingMemory, setPendingMemory] = useState<MemoryCandidate | null>(null);
  const nextId = useRef(0);
  const conversationId = useRef<string | null>(null);
  const createdAt = useRef(Date.now());
  const loadedParamId = useRef<string | undefined>(undefined);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const modelReady = status === 'downloaded';
  const thinking = generating && streamingId !== null && messages.find(m => m.id === streamingId)?.text === '';

  const refreshMemories = useCallback(() => {
    listMemories().then(setMemories);
  }, []);

  useEffect(() => {
    refreshMemories();
  }, [refreshMemories]);

  // Resume a past conversation when navigated here from History (?id=...).
  useEffect(() => {
    if (!paramId || paramId === loadedParamId.current) return;
    loadedParamId.current = paramId;
    getConversation(paramId).then(conv => {
      if (!conv) return;
      setMessages(conv.messages);
      setCompanionMode(conv.mode);
      conversationId.current = conv.id;
      createdAt.current = conv.createdAt;
    });
  }, [paramId, setCompanionMode]);

  const persist = (allMessages: ChatMessage[]) => {
    if (allMessages.length === 0) return;
    if (!conversationId.current) conversationId.current = `c-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const conv: StoredConversation = {
      id: conversationId.current,
      title: deriveTitle(allMessages[0].text),
      mode: companionMode,
      messages: allMessages,
      createdAt: createdAt.current,
      updatedAt: Date.now(),
    };
    saveConversation(conv);
  };

  const startNewChat = () => {
    setMessages([]);
    conversationId.current = null;
    createdAt.current = Date.now();
    loadedParamId.current = undefined;
    router.setParams({ id: undefined });
  };

  const showPendingMemoryBriefly = (candidate: MemoryCandidate) => {
    setPendingMemory(candidate);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => setPendingMemory(null), 6000);
  };

  const confirmPendingMemory = async () => {
    if (!pendingMemory) return;
    await saveMemory({ content: pendingMemory.content, category: pendingMemory.category, confidence: pendingMemory.confidence, source: 'talk' });
    setPendingMemory(null);
    refreshMemories();
  };

  const send = async (text: string) => {
    if (!modelReady) return;

    const userMsg: ChatMessage = { id: `u-${nextId.current++}`, role: 'user', text };
    const assistantId = `a-${nextId.current++}`;
    const history = [...messages, userMsg];
    const usedMemories = memories.slice(0, 6);
    setMessages(prev => [...prev, userMsg, { id: assistantId, role: 'assistant', text: '' }]);
    setGenerating(true);
    setStreamingId(assistantId);

    let finalMessages: ChatMessage[] = [];
    let replyText = '';
    try {
      if (!loaded) {
        setWaking(true);
        await loadModel();
        setWaking(false);
      }
      replyText = await generateReply(
        companionMode,
        history.map(m => ({ role: m.role, text: m.text })),
        {
          maxTokens: RESPONSE_LENGTH_TOKENS[responseLength],
          memories: usedMemories.map(m => m.content),
          onToken: token =>
            setMessages(prev => {
              const next = prev.map(m => (m.id === assistantId ? { ...m, text: m.text + token } : m));
              finalMessages = next;
              return next;
            }),
        },
      );
      if (usedMemories.length > 0) touchMemories(usedMemories.map(m => m.id));
    } catch (e) {
      setMessages(prev => {
        const next = prev.map(m => (m.id === assistantId ? { ...m, text: `Sorry, something went wrong: ${(e as Error).message}` } : m));
        finalMessages = next;
        return next;
      });
    } finally {
      setWaking(false);
      setGenerating(false);
      setStreamingId(null);
      persist(finalMessages.length ? finalMessages : history);
    }

    // Skip the extra inference pass for short, low-signal messages ("ok", "lol", "thanks") —
    // they're never worth remembering and this keeps the per-turn cost down on-device.
    if (memoryEnabled && replyText && text.trim().split(/\s+/).length >= 4) {
      extractMemoryCandidate(text, replyText).then(candidate => {
        if (!candidate) return;
        if (memoryAutoSave) {
          saveMemory({ content: candidate.content, category: candidate.category, confidence: candidate.confidence, source: 'talk' }).then(refreshMemories);
        }
        showPendingMemoryBriefly(candidate);
      });
    }
  };

  const handleStop = async () => {
    await stopGeneration();
    setGenerating(false);
    setStreamingId(null);
    setMessages(prev => {
      persist(prev);
      return prev;
    });
  };

  const handleAction = async (action: string) => {
    if (!actionsFor) return;
    if (action === 'copy') await Clipboard.setStringAsync(actionsFor.text);
    if (action === 'delete') setMessages(prev => prev.filter(m => m.id !== actionsFor.id));
    if (action === 'memory') {
      await saveMemory({ content: actionsFor.text.slice(0, 200), category: 'other', confidence: 'stated', source: 'manual' });
      refreshMemories();
      Alert.alert('Saved to memory', 'You can review or remove it in Settings → Manage memories.');
    } else if (action !== 'delete' && action !== 'copy') {
      Alert.alert('Saved', `Added to ${action}.`);
    }
    setActionsFor(null);
  };

  const companionState = thinking ? 'thinking' : generating ? 'speaking' : 'idle';

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopAppBar
        title="Talk"
        subtitle={modelReady ? `${companionMode} mode` : 'AI model not downloaded'}
        trailing={
          <>
            {messages.length > 0 && <IconButton name="add-circle-outline" accessibilityLabel="New chat" onPress={startNewChat} />}
            <IconButton name="time-outline" accessibilityLabel="Conversation history" onPress={() => router.push('/talk/history')} />
            <IconButton name="person-circle-outline" accessibilityLabel="Change companion mode" onPress={() => setModeSheetOpen(true)} />
          </>
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.sm }}>
        {companionModes.map(m => (
          <Chip key={m.mode} label={m.mode} selected={companionMode === m.mode} onPress={() => setCompanionMode(m.mode)} />
        ))}
      </ScrollView>

      {!modelReady ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.lg }}>
          <FoxCompanion size={48} />
          <StatusPill label={status === 'downloading' ? 'Downloading…' : 'Model not downloaded'} tone={status === 'downloading' ? 'warning' : 'neutral'} />
          <ThemedText variant="h2" style={{ textAlign: 'center' }}>
            Talk needs the offline model
          </ThemedText>
          <ThemedText variant="body" color="secondary" style={{ textAlign: 'center', maxWidth: 320 }}>
            {status === 'downloading'
              ? 'Hang tight — it’s downloading. You can check progress in Settings.'
              : 'Download the small on-device model in Settings to start talking. Everything then runs offline.'}
          </ThemedText>
          {status !== 'downloading' && <Button label="Open Settings" onPress={() => router.push('/settings')} />}
        </ScrollView>
      ) : messages.length === 0 ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.lg }}>
          <FoxCompanion size={48} />
          <ThemedText variant="h2" style={{ textAlign: 'center' }}>
            Hey. What&apos;s on your mind?
          </ThemedText>
          <View style={{ gap: spacing.sm, width: '100%', maxWidth: 420 }}>
            {suggestedPrompts.map(prompt => (
              <Pressable
                key={prompt}
                onPress={() => send(prompt)}
                style={{
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  borderRadius: 14,
                  backgroundColor: colors.surfaceElevated,
                }}>
                <ThemedText variant="body" color="secondary">
                  {prompt}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
          renderItem={({ item }) => (
            <Pressable onLongPress={() => setActionsFor(item)} delayLongPress={280}>
              <ChatBubble
                role={item.role}
                text={item.id === streamingId && waking ? 'Waking up the model…' : item.text}
                streaming={item.id === streamingId}
              />
            </Pressable>
          )}
        />
      )}

      {modelReady && generating && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingBottom: spacing.xs }}>
          <FoxCompanion size={20} state={companionState} />
          <ThemedText variant="caption" color="muted">
            {waking ? 'Waking up…' : thinking ? 'Thinking…' : 'Replying…'}
          </ThemedText>
        </View>
      )}

      {modelReady && pendingMemory && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            marginHorizontal: spacing.xl,
            marginBottom: spacing.sm,
            padding: spacing.md,
            borderRadius: radius.md,
            backgroundColor: colors.accentSoft,
          }}>
          <Ionicons name="bookmark-outline" size={16} color={colors.accent} />
          <ThemedText variant="caption" color="secondary" style={{ flex: 1 }} numberOfLines={2}>
            {memoryAutoSave ? `Remembered: ${pendingMemory.content}` : `Remember this? "${pendingMemory.content}"`}
          </ThemedText>
          {memoryAutoSave ? (
            <Pressable
              onPress={async () => {
                refreshMemories();
                setPendingMemory(null);
              }}>
              <ThemedText variant="captionMedium" color="accent">
                Nice
              </ThemedText>
            </Pressable>
          ) : (
            <>
              <Pressable onPress={confirmPendingMemory}>
                <ThemedText variant="captionMedium" color="accent">
                  Save
                </ThemedText>
              </Pressable>
              <Pressable onPress={() => setPendingMemory(null)}>
                <ThemedText variant="captionMedium" color="muted">
                  Not now
                </ThemedText>
              </Pressable>
            </>
          )}
        </View>
      )}

      {modelReady && <Composer onSend={send} isGenerating={generating} onStop={handleStop} />}

      <BottomSheet visible={modeSheetOpen} onClose={() => setModeSheetOpen(false)} title="Companion mode">
        {companionModes.map(m => (
          <SheetAction
            key={m.mode}
            icon={m.icon as keyof typeof Ionicons.glyphMap}
            label={m.mode}
            description={m.description}
            onPress={() => {
              setCompanionMode(m.mode);
              setModeSheetOpen(false);
            }}
          />
        ))}
      </BottomSheet>

      <BottomSheet visible={!!actionsFor} onClose={() => setActionsFor(null)} title="Message">
        <SheetAction icon="copy-outline" label="Copy" onPress={() => handleAction('copy')} />
        <SheetAction icon="bookmark-outline" label="Save as memory" onPress={() => handleAction('memory')} />
        <SheetAction icon="bulb-outline" label="Save as idea" onPress={() => handleAction('idea')} />
        <SheetAction icon="journal-outline" label="Add to journal" onPress={() => handleAction('journal')} />
        <SheetAction icon="help-circle-outline" label="Explain further" onPress={() => handleAction('explanation')} />
        <SheetAction icon="flash-outline" label="Challenge this" onPress={() => handleAction('challenge')} />
        <SheetAction icon="trash-outline" label="Delete" onPress={() => handleAction('delete')} />
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}
