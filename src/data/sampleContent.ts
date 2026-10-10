export type CompanionMode = 'Friend' | 'Listener' | 'Idea Partner' | 'Teacher' | 'Challenger' | 'Coach';

export const companionModes: { mode: CompanionMode; description: string; icon: string }[] = [
  { mode: 'Friend', description: 'Natural, relaxed conversation.', icon: 'happy-outline' },
  { mode: 'Listener', description: 'Vent without immediate advice.', icon: 'ear-outline' },
  { mode: 'Idea Partner', description: 'Develop concepts and plans.', icon: 'bulb-outline' },
  { mode: 'Teacher', description: 'Clear explanations that build understanding.', icon: 'school-outline' },
  { mode: 'Challenger', description: 'Questions assumptions respectfully.', icon: 'flash-outline' },
  { mode: 'Coach', description: 'Organizes goals and next steps.', icon: 'flag-outline' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const sampleConversation: ChatMessage[] = [
  { id: 'm1', role: 'user', text: "I keep putting off this side project. I don't know why." },
  {
    id: 'm2',
    role: 'assistant',
    text: "That's worth sitting with for a second. Is it the size of the project, or something about starting that feels uncertain?",
  },
  { id: 'm3', role: 'user', text: "Probably that I don't know if the idea is even good." },
  {
    id: 'm4',
    role: 'assistant',
    text: 'Fair. What if the first step wasn’t "prove the idea is good" but just "learn one thing about whether it could work"? That’s a much smaller bar.',
  },
];

export const suggestedPrompts = [
  'I have an idea.',
  'I need to get something off my chest.',
  'Teach me something interesting.',
  "Let's think through a problem.",
  "I'm bored. Surprise me.",
];

export interface ConversationSummary {
  id: string;
  title: string;
  lastActivity: string;
  mode: CompanionMode;
  preview: string;
}

export const conversationHistory: ConversationSummary[] = [
  { id: 'c1', title: 'Side project doubts', lastActivity: 'Today, 8:42 AM', mode: 'Coach', preview: "What if the first step wasn't..." },
  { id: 'c2', title: 'Idea: offline reading app', lastActivity: 'Yesterday', mode: 'Idea Partner', preview: 'Let’s map the core loop first.' },
  { id: 'c3', title: 'Just needed to vent', lastActivity: 'Monday', mode: 'Listener', preview: "That sounds genuinely frustrating." },
  { id: 'c4', title: 'Explaining opportunity cost', lastActivity: 'Last week', mode: 'Teacher', preview: 'Think of it as the next-best option.' },
];

export interface Challenge {
  id: string;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes: number;
  icon: string;
  prompt: string;
  hints: string[];
  answerOptions: string[];
  correctIndex: number;
  explanation: string;
}

export const challenges: Challenge[] = [
  {
    id: 'ch1',
    category: 'Logic',
    title: 'The three switches',
    difficulty: 'Medium',
    estimatedMinutes: 6,
    icon: 'git-branch-outline',
    prompt:
      'Three switches outside a room control one bulb inside. You can flip switches as much as you like, but may only enter the room once. How do you determine which switch controls the bulb?',
    hints: [
      'Identify what is known: you get exactly one observation inside the room.',
      'Consider using more than just the bulb’s on/off state — what else changes over time?',
      'Try leaving one switch on for a while before entering, to use heat as a second signal.',
    ],
    answerOptions: [
      'Turn on switch 1, wait, turn it off, turn on switch 2, then enter.',
      'Turn on two switches at once and enter immediately.',
      'Flip each switch once in sequence and listen for a click.',
    ],
    correctIndex: 0,
    explanation:
      'Leaving switch 1 on long enough heats the bulb. Turning it off before entering lets you distinguish "on and warm" (switch 1), "on" (switch 2), and "off and cold" (switch 3).',
  },
  {
    id: 'ch2',
    category: 'Probability',
    title: 'Two children',
    difficulty: 'Hard',
    estimatedMinutes: 8,
    icon: 'shuffle-outline',
    prompt:
      'A family has two children. At least one is a girl. What is the probability that both children are girls?',
    hints: [
      'List the equally likely combinations of two children before applying the condition.',
      'Remove combinations that don’t satisfy "at least one girl."',
      'Count how many of the remaining combinations have two girls.',
    ],
    answerOptions: ['1/2', '1/3', '1/4'],
    correctIndex: 1,
    explanation:
      'Of the four equally likely combinations (BB, BG, GB, GG), removing BB leaves three with at least one girl. Only one of those three is GG, so the probability is 1/3.',
  },
];

export interface SkillArea {
  label: string;
  value: number;
}

export const skillAreas: SkillArea[] = [
  { label: 'Reading', value: 0.72 },
  { label: 'Reasoning', value: 0.58 },
  { label: 'Problem solving', value: 0.64 },
  { label: 'Vocabulary', value: 0.41 },
  { label: 'Writing', value: 0.35 },
  { label: 'Consistency', value: 0.8 },
];

export const weeklyActivity = [
  { day: 'Mon', minutes: 14 },
  { day: 'Tue', minutes: 22 },
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 18 },
  { day: 'Fri', minutes: 9 },
  { day: 'Sat', minutes: 26 },
  { day: 'Sun', minutes: 12 },
];

export const goalOptions = [
  'Reading comprehension',
  'Problem solving',
  'Critical thinking',
  'Vocabulary',
  'General knowledge',
  'Writing and reflection',
  'Creative thinking',
  'Having someone to talk to',
];

export const timeOptions = ['5 minutes', '10 minutes', '20 minutes', '30 minutes or more'];
