import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { generateReply } from '@/ai/localModel';
import { isBookmarked, isCompleted, markCompleted, toggleBookmark } from '@/ai/libraryProgress';
import { useModel } from '@/ai/ModelProvider';
import {
  Button,
  Chip,
  ChatBubble,
  DataTable,
  EmptyState,
  ExpandableSection,
  FlowDiagram,
  FoxCompanion,
  IconButton,
  KeyTermCard,
  StatusPill,
  ThemedText,
  TopAppBar,
} from '@/components/ui';
import { getArticle, KnowledgeCheck, relatedArticles } from '@/data/knowledgeLibrary';
import { useAppTheme } from '@/theme/ThemeProvider';

function Callout({ icon, label, children }: { icon: keyof typeof Ionicons.glyphMap; label: string; children: string | string[] }) {
  const { colors, spacing, radius } = useAppTheme();
  const paragraphs = Array.isArray(children) ? children : [children];
  return (
    <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Ionicons name={icon} size={16} color={colors.accent} />
        <ThemedText variant="label" color="accent">
          {label.toUpperCase()}
        </ThemedText>
      </View>
      {paragraphs.map((p, i) => (
        <ThemedText key={i} variant="body" color="secondary">
          {p}
        </ThemedText>
      ))}
    </View>
  );
}

function QuizQuestion({ question, index }: { question: KnowledgeCheck; index: number }) {
  const { colors, spacing, radius } = useAppTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={{ gap: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <StatusPill label={question.kind} />
        <ThemedText variant="caption" color="muted">
          Question {index + 1}
        </ThemedText>
      </View>
      <ThemedText variant="bodyMedium">{question.prompt}</ThemedText>
      <View style={{ gap: spacing.sm }}>
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = revealed && i === question.correctIndex;
          const isWrongSelected = revealed && isSelected && i !== question.correctIndex;
          return (
            <Pressable
              key={option}
              disabled={revealed}
              onPress={() => setSelected(i)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                padding: spacing.md,
                borderRadius: radius.md,
                backgroundColor: isCorrect ? colors.successSurface : isWrongSelected ? colors.errorSurface : isSelected ? colors.background : 'transparent',
                borderWidth: 1,
                borderColor: isCorrect ? colors.success : isWrongSelected ? colors.error : isSelected ? colors.accent : colors.border,
              }}>
              <ThemedText variant="body" color={isCorrect ? 'success' : isWrongSelected ? 'error' : 'primary'} style={{ flex: 1 }}>
                {option}
              </ThemedText>
              {isCorrect && <Ionicons name="checkmark-circle" size={16} color={colors.success} />}
              {isWrongSelected && <Ionicons name="close-circle" size={16} color={colors.error} />}
            </Pressable>
          );
        })}
      </View>
      {revealed ? (
        <ThemedText variant="body" color="secondary">
          {question.explanation}
        </ThemedText>
      ) : (
        <Button label="Check answer" variant="secondary" disabled={selected === null} onPress={() => setRevealed(true)} />
      )}
    </View>
  );
}

const ASK_PROMPTS = ['Explain this more simply', 'Give me another example', 'Why does this matter?', 'Quiz me on this'];

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { status, loaded, loadModel } = useModel();
  const modelReady = status === 'downloaded';

  const article = id ? getArticle(id) : undefined;
  const [bookmarked, setBookmarked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [askMessages, setAskMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [asking, setAsking] = useState(false);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (!article) return;
    isBookmarked(article.id).then(setBookmarked);
    isCompleted(article.id).then(setCompleted);
  }, [article]);

  if (!article) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <TopAppBar title="Not found" leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />} />
        <EmptyState icon="book-outline" title="This lesson isn't available" description="It may have been removed. Try another topic from Explore." />
      </View>
    );
  }

  const handleBookmark = async () => {
    const next = await toggleBookmark(article.id);
    setBookmarked(next);
  };

  const handleComplete = async () => {
    await markCompleted(article.id);
    setCompleted(true);
  };

  const askFox = async (question: string) => {
    if (!modelReady || asking) return;
    const isFirst = askMessages.length === 0;
    setAskMessages(prev => [...prev, { role: 'user', text: question }, { role: 'assistant', text: '' }]);
    setAsking(true);
    setThinking(true);
    try {
      if (!loaded) {
        await loadModel();
      }
      const context = `The reader just read this article: "${article.title}". Summary: ${article.summary} Key takeaways: ${article.keyTakeaways.join(' ')}`;
      const history = [
        ...askMessages,
        { role: 'user' as const, text: isFirst ? `${context}\n\nReader's question: ${question}` : question },
      ];
      await generateReply('Teacher', history, {
        maxTokens: 220,
        onToken: token => {
          setThinking(false);
          setAskMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { ...next[next.length - 1], text: next[next.length - 1].text + token };
            return next;
          });
        },
      });
    } catch (e) {
      setAskMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], text: `Sorry, something went wrong: ${(e as Error).message}` };
        return next;
      });
    } finally {
      setAsking(false);
      setThinking(false);
    }
  };

  const related = relatedArticles(article);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar
        title={article.title}
        subtitle={article.subtitle}
        leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />}
        trailing={<IconButton name={bookmarked ? 'bookmark' : 'bookmark-outline'} accessibilityLabel="Bookmark" onPress={handleBookmark} />}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl, paddingBottom: insets.bottom + spacing.massive }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <StatusPill label={article.difficulty} />
          <StatusPill label={`${article.estimatedMinutes} min`} />
          {completed && <StatusPill label="Completed" tone="success" icon="checkmark-circle-outline" />}
        </View>

        <Callout icon="help-circle-outline" label="Let's start here">
          {article.hook}
        </Callout>

        <View style={{ gap: spacing.sm }}>
          <ThemedText variant="h3">Why this matters</ThemedText>
          <ThemedText variant="bodyLarge" color="secondary" style={{ lineHeight: 26 }}>
            {article.whyItMatters}
          </ThemedText>
        </View>

        {article.sections.map((section, i) => (
          <View key={i} style={{ gap: spacing.sm }}>
            <ThemedText variant="h3">{section.heading}</ThemedText>
            {section.kind === 'mistake' || section.kind === 'worked-example' || section.kind === 'example' ? (
              <Callout icon={section.kind === 'mistake' ? 'warning-outline' : section.kind === 'worked-example' ? 'calculator-outline' : 'bulb-outline'} label={section.kind === 'mistake' ? 'Watch out for' : section.kind === 'worked-example' ? 'Worked example' : 'Example'}>
                {section.body}
              </Callout>
            ) : (
              section.body.map((p, j) => (
                <ThemedText key={j} variant="bodyLarge" style={{ lineHeight: 26 }}>
                  {p}
                </ThemedText>
              ))
            )}
          </View>
        ))}

        {article.keyTerms && article.keyTerms.length > 0 && (
          <View style={{ gap: spacing.sm }}>
            <ThemedText variant="h3">Key terms</ThemedText>
            <View style={{ gap: spacing.sm }}>
              {article.keyTerms.map(kt => (
                <KeyTermCard key={kt.term} term={kt.term} definition={kt.definition} />
              ))}
            </View>
          </View>
        )}

        {article.numericTable && (
          <DataTable caption={article.numericTable.caption} headers={article.numericTable.headers} rows={article.numericTable.rows} />
        )}

        {article.flowSteps && (
          <View style={{ gap: spacing.sm }}>
            <ThemedText variant="h3">How it flows</ThemedText>
            <FlowDiagram steps={article.flowSteps} />
          </View>
        )}

        <Callout icon="create-outline" label="Try it yourself">
          {article.tryItYourself}
        </Callout>

        <View style={{ gap: spacing.sm }}>
          <ThemedText variant="h3">Key takeaways</ThemedText>
          <View style={{ gap: spacing.sm }}>
            {article.keyTakeaways.map((t, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: spacing.sm }}>
                <ThemedText variant="body" color="accent">
                  •
                </ThemedText>
                <ThemedText variant="body" color="secondary" style={{ flex: 1 }}>
                  {t}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <ExpandableSection title="Test your understanding" subtitle={`${article.knowledgeChecks.length} questions · optional`} icon="help-circle-outline">
          {article.knowledgeChecks.map((q, i) => (
            <QuizQuestion key={q.id} question={q} index={i} />
          ))}
        </ExpandableSection>

        {!completed && <Button label="Mark as complete" size="lg" fullWidth onPress={handleComplete} />}

        <ExpandableSection title="Ask Fox about this" subtitle="Get it explained differently, or quizzed on it" icon="chatbubble-ellipses-outline">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <FoxCompanion size={24} state={thinking ? 'thinking' : asking ? 'speaking' : 'idle'} />
            <ThemedText variant="caption" color="muted">
              {thinking ? 'Thinking…' : asking ? 'Replying…' : 'Ready when you are'}
            </ThemedText>
          </View>

          {!modelReady ? (
            <View style={{ gap: spacing.sm }}>
              <ThemedText variant="body" color="secondary">
                Download the offline model in Settings to discuss this article with your fox.
              </ThemedText>
              <Button label="Open Settings" variant="secondary" onPress={() => router.push('/settings')} />
            </View>
          ) : (
            <>
              {askMessages.length === 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                  {ASK_PROMPTS.map(prompt => (
                    <Chip key={prompt} label={prompt} onPress={() => askFox(prompt)} />
                  ))}
                </ScrollView>
              )}
              <View style={{ gap: spacing.sm }}>
                {askMessages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} text={m.text} streaming={m.role === 'assistant' && i === askMessages.length - 1 && asking} />
                ))}
              </View>
            </>
          )}
        </ExpandableSection>

        {related.length > 0 && (
          <View style={{ gap: spacing.sm }}>
            <ThemedText variant="h3">Related</ThemedText>
            {related.map(r => (
              <Pressable
                key={r.id}
                onPress={() => router.push({ pathname: '/learn/[id]', params: { id: r.id } })}
                style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm }}>
                <Ionicons name="arrow-forward-circle-outline" size={18} color={colors.accent} />
                <ThemedText variant="body" color="secondary" style={{ flex: 1 }}>
                  {r.title}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
