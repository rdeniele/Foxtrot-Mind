import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { generateReply, stopGeneration } from '@/ai/localModel';
import { useModel } from '@/ai/ModelProvider';
import { BottomSheet, Button, ChatBubble, Chip, Composer, FoxMark, IconButton, SheetAction, StatusPill, ThemedText, TopAppBar } from '@/components/ui';
import { ChatMessage, companionModes, suggestedPrompts } from '@/data/sampleContent';
import { RESPONSE_LENGTH_TOKENS, useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function TalkScreen() {
  const { colors, spacing } = useAppTheme();
  const { companionMode, setCompanionMode, responseLength } = useAppState();
  const { status, loaded, loadModel } = useModel();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [waking, setWaking] = useState(false);
  const [modeSheetOpen, setModeSheetOpen] = useState(false);
  const [actionsFor, setActionsFor] = useState<ChatMessage | null>(null);
  const nextId = useRef(0);

  const modelReady = status === 'downloaded';

  const send = async (text: string) => {
    if (!modelReady) return;

    const userMsg: ChatMessage = { id: `u-${nextId.current++}`, role: 'user', text };
    const assistantId = `a-${nextId.current++}`;
    const history = [...messages, userMsg];
    setMessages(prev => [...prev, userMsg, { id: assistantId, role: 'assistant', text: '' }]);
    setGenerating(true);
    setStreamingId(assistantId);

    try {
      if (!loaded) {
        setWaking(true);
        await loadModel();
        setWaking(false);
      }
      await generateReply(
        companionMode,
        history.map(m => ({ role: m.role, text: m.text })),
        {
          maxTokens: RESPONSE_LENGTH_TOKENS[responseLength],
          onToken: token => setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, text: m.text + token } : m))),
        },
      );
    } catch (e) {
      setMessages(prev =>
        prev.map(m => (m.id === assistantId ? { ...m, text: `Sorry, something went wrong: ${(e as Error).message}` } : m)),
      );
    } finally {
      setWaking(false);
      setGenerating(false);
      setStreamingId(null);
    }
  };

  const handleStop = async () => {
    await stopGeneration();
    setGenerating(false);
    setStreamingId(null);
  };

  const handleAction = async (action: string) => {
    if (!actionsFor) return;
    if (action === 'copy') await Clipboard.setStringAsync(actionsFor.text);
    if (action === 'delete') setMessages(prev => prev.filter(m => m.id !== actionsFor.id));
    if (action !== 'delete' && action !== 'copy') Alert.alert('Saved', `Added to ${action}.`);
    setActionsFor(null);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopAppBar
        title="Talk"
        subtitle={modelReady ? `${companionMode} mode` : 'AI model not downloaded'}
        trailing={
          <>
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
          <FoxMark size={48} opacity={0.5} />
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
          <FoxMark size={48} opacity={0.9} />
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
