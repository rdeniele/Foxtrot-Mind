export interface ComprehensionQuestion {
  id: string;
  kind: 'Main idea' | 'Recall' | 'Inference' | 'Vocabulary' | 'Critical thinking';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  progress: number;
  minutesLeft: number;
  kind: 'Book' | 'Article' | 'Short read';
}

export interface ReadingContent {
  id: string;
  title: string;
  author: string;
  category: string;
  estimatedMinutes: number;
  concepts: string[];
  paragraphs: string[];
  questions: ComprehensionQuestion[];
}

export const readingContent: Record<string, ReadingContent> = {
  b1: {
    id: 'b1',
    title: 'The Practice of Deep Work',
    author: 'Essay collection',
    category: 'Psychology',
    estimatedMinutes: 6,
    concepts: ['Focus', 'Avoidance'],
    paragraphs: [
      'Deep work is the ability to focus without distraction on a cognitively demanding task. It is a skill that allows you to quickly master complicated information and produce better results in less time.',
      'Most people, when faced with a hard problem, reach for something easier instead — not because the hard problem is unsolvable, but because sustained attention is uncomfortable. The discomfort passes. The habit of avoiding it does not.',
      'The paradox is that the tasks we avoid because they require deep focus are usually the ones that matter most. Shallow work fills a day; deep work defines a career.',
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Deep work is only useful for creative careers.',
          'Sustained, undistracted focus produces outsized results compared to shallow work.',
          'Most people are incapable of deep focus.',
        ],
        correctIndex: 1,
        explanation: 'The passage centers on deep work as a skill that produces outsized results, and contrasts it with shallow, easier work.',
      },
      {
        id: 'q2',
        kind: 'Inference',
        prompt: 'Why does the author suggest people avoid hard problems?',
        options: [
          'Because the problems are usually unsolvable.',
          'Because sustained attention is uncomfortable, not because the task is impossible.',
          'Because they lack the necessary skills entirely.',
        ],
        correctIndex: 1,
        explanation: 'The passage states discomfort — not inability — is what drives people toward easier tasks.',
      },
      {
        id: 'q3',
        kind: 'Recall',
        prompt: 'According to the passage, what does deep work allow you to do?',
        options: [
          'Quickly master complicated information and produce better results',
          'Avoid working on hard problems entirely',
          'Complete more tasks regardless of difficulty',
        ],
        correctIndex: 0,
        explanation: 'This is stated directly in the first sentence of the passage.',
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In the passage, what does 'shallow work' most likely mean?",
        options: [
          "Work that is easy and doesn't require deep concentration",
          'Work that is done underwater',
          'Work that is deeply meaningful but poorly executed',
        ],
        correctIndex: 0,
        explanation: "The passage contrasts 'shallow work' directly with 'deep work' in its final sentence.",
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: "Based on the passage's argument, which habit would most likely prevent someone from building a meaningful career?",
        options: [
          'Consistently choosing easier, shallow tasks over harder ones that matter',
          'Taking breaks between difficult tasks',
          'Asking for help when a problem is too difficult',
        ],
        correctIndex: 0,
        explanation: 'The passage argues shallow work fills a day but deep work defines a career — consistently avoiding deep work would prevent that.',
      },
    ],
  },
  b2: {
    id: 'b2',
    title: 'Why We Sleep on Decisions',
    author: 'Local article',
    category: 'Psychology',
    estimatedMinutes: 5,
    concepts: ['Decision fatigue', 'Unconscious thought'],
    paragraphs: [
      "When people face a difficult decision, they often say they need to 'sleep on it.' This isn't just a figure of speech. Researchers have found that stepping away from a hard choice, especially overnight, can genuinely improve the quality of the decision that follows.",
      'One explanation is that conscious thought is good at holding only a few pieces of information at once. When a decision involves many competing factors, like comparing job offers or choosing between two homes, conscious deliberation can get overwhelmed and fixate on whichever detail was considered most recently.',
      'Time away appears to let the mind process information in the background, without the narrow spotlight of focused attention. This is sometimes called unconscious thought, and it may be better suited to weighing many loosely connected factors against each other.',
      'The practical lesson is not that every decision benefits from delay. Simple decisions are usually best made quickly, since extra deliberation mostly adds doubt. But for genuinely complex decisions, a night of distance can reveal a preference that hours of pro-and-con lists could not.',
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Stepping away from a complex decision can improve its quality by allowing background mental processing',
          'All decisions become better the longer you wait to make them',
          'Conscious thought is always superior to unconscious processing',
        ],
        correctIndex: 0,
        explanation: 'The passage argues that distance from complex decisions allows unconscious processing that can improve decision quality.',
      },
      {
        id: 'q2',
        kind: 'Recall',
        prompt: 'According to the passage, what kind of decisions benefit most from delay?',
        options: ['Simple, quick decisions', 'Genuinely complex decisions with many competing factors', 'Decisions that have already been made'],
        correctIndex: 1,
        explanation: 'The final paragraph states simple decisions are best made quickly, while complex ones benefit from distance.',
      },
      {
        id: 'q3',
        kind: 'Inference',
        prompt: "Why might conscious deliberation 'fixate on whichever detail was considered most recently'?",
        options: [
          'Because conscious thought can only hold a few pieces of information at once, so recent details crowd out earlier ones',
          'Because people are naturally forgetful',
          'Because recent information is always more accurate',
        ],
        correctIndex: 0,
        explanation: "The passage links this fixation directly to conscious thought's limited capacity to hold information.",
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In this passage, 'unconscious thought' most nearly means",
        options: [
          'Background mental processing that happens without focused, deliberate attention',
          'Being asleep or unaware',
          'A decision made entirely at random',
        ],
        correctIndex: 0,
        explanation: 'The passage defines it as processing that happens "without the narrow spotlight of focused attention."',
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: 'A friend is trying to decide between two job offers and wants to decide within the hour. Based on the passage, what might you suggest?',
        options: [
          'Since this is a complex decision with many factors, consider taking at least a night before deciding',
          'Complex decisions are always best made under time pressure',
          'Unconscious thought only works for simple decisions, so decide quickly',
        ],
        correctIndex: 0,
        explanation: 'Comparing job offers involves many competing factors, which the passage identifies as the kind of decision that benefits from delay.',
      },
    ],
  },
  b3: {
    id: 'b3',
    title: 'A Short History of Curiosity',
    author: 'Imported EPUB',
    category: 'History',
    estimatedMinutes: 7,
    concepts: ['Curiosity', 'Changing values'],
    paragraphs: [
      'Curiosity has not always been celebrated. In much of medieval Europe, idle curiosity — the desire to know things with no practical use — was often treated with suspicion. Wanting to understand the stars or dissect a frog for its own sake could be seen as a distraction from more important spiritual concerns.',
      'That view began to shift during the Renaissance and accelerated during the Enlightenment. Thinkers increasingly argued that understanding the natural world was not a distraction from meaning but a path toward it. Curiosity, once viewed warily, became associated with progress.',
      "By the nineteenth century, scientific curiosity had become something closer to a virtue, encouraged in schools and celebrated in public life. The same impulse once treated as a temptation — the itch to ask 'why' without an immediate practical reason — was now seen as the engine behind nearly every major discovery.",
      'The shift says less about curiosity itself, which has presumably always worked the same way in the human mind, and more about what a given era chooses to value. Idle questions, it turns out, have a way of eventually paying for themselves.',
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Attitudes toward curiosity have shifted dramatically across history, from suspicion to celebration',
          'Curiosity was invented during the Enlightenment',
          'Medieval scholars had no interest in the natural world',
        ],
        correctIndex: 0,
        explanation: 'The passage traces curiosity\'s reputation from medieval suspicion to a celebrated virtue by the nineteenth century.',
      },
      {
        id: 'q2',
        kind: 'Recall',
        prompt: 'How was idle curiosity often viewed in medieval Europe, according to the passage?',
        options: ['As a virtue to be encouraged', 'With suspicion, as a possible distraction from spiritual concerns', 'As the foundation of the education system'],
        correctIndex: 1,
        explanation: 'The first paragraph states it was "often treated with suspicion."',
      },
      {
        id: 'q3',
        kind: 'Inference',
        prompt: "What does the passage suggest caused curiosity's reputation to improve?",
        options: [
          "A change in an era's values, not a change in curiosity itself",
          'Curiosity became less common and therefore more valued',
          'The invention of formal science education',
        ],
        correctIndex: 0,
        explanation: 'The final paragraph states the shift "says less about curiosity itself... and more about what a given era chooses to value."',
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In the passage, 'idle curiosity' most nearly refers to",
        options: ['Wanting to know something with no immediate practical use', 'Curiosity that has stopped working', 'A lazy or unmotivated person'],
        correctIndex: 0,
        explanation: 'The passage defines it directly as "the desire to know things with no practical use."',
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: "Based on the passage's closing line, what might the author predict about a seemingly pointless question asked today?",
        options: [
          'It could eventually turn out to be useful, even if that is not obvious now',
          'It will definitely be proven useless',
          'It should be discouraged until its use is clear',
        ],
        correctIndex: 0,
        explanation: 'The passage ends by noting idle questions "have a way of eventually paying for themselves."',
      },
    ],
  },
  r1: {
    id: 'r1',
    title: 'The Paradox of Choice',
    author: 'Offline pack · Psychology',
    category: 'Psychology',
    estimatedMinutes: 5,
    concepts: ['Choice overload', 'Regret'],
    paragraphs: [
      'More options should make us happier. If ten flavors of jam are good, surely twenty are better, and a hundred better still. Yet researchers who study decision-making have repeatedly found the opposite: past a certain point, additional choices can make people less satisfied, not more.',
      'Part of the problem is effort. Comparing a hundred options takes real mental work, and that work does not feel like freedom. It feels like a chore, and often leads people to simply avoid deciding at all.',
      'The other part is regret. When there were only two jams to choose from, whichever one you picked was probably good enough. When there were a hundred, it becomes easy to imagine that one of the other ninety-nine would have been better, even if you cannot say which.',
      'This does not mean choice itself is bad. A world with no options is worse than a world with a few good ones. The lesson is narrower: beyond a certain point, adding more options does not add more satisfaction. It can quietly subtract it.',
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Beyond a certain point, having more choices can decrease satisfaction rather than increase it',
          'People should always have as few choices as possible',
          'Choice is entirely bad and should be eliminated',
        ],
        correctIndex: 0,
        explanation: 'The final paragraph clarifies the narrower point: too much choice, not choice itself, is the issue.',
      },
      {
        id: 'q2',
        kind: 'Recall',
        prompt: 'According to the passage, what are the two reasons extra choices can reduce satisfaction?',
        options: ['Cost and time', 'Effort and regret', 'Fear and confusion'],
        correctIndex: 1,
        explanation: 'The passage dedicates one paragraph each to the effort of comparing options and the regret that follows.',
      },
      {
        id: 'q3',
        kind: 'Inference',
        prompt: 'Why might someone with a hundred jam options feel regret, even after choosing a good jam?',
        options: [
          'Because it becomes easy to imagine one of the many unchosen options might have been better',
          'Because jam always tastes worse than expected',
          'Because they spent too much money',
        ],
        correctIndex: 0,
        explanation: 'The third paragraph explains that with many options, it is easy to imagine an unchosen one would have been better.',
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In the passage, the word 'paradox' in the title suggests",
        options: [
          "A situation that seems to contradict what we'd expect (more choice leading to less satisfaction)",
          'A simple, expected outcome',
          'A type of statistical error',
        ],
        correctIndex: 0,
        explanation: 'A paradox is a seemingly contradictory outcome — here, that more options can leave people less, not more, satisfied.',
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: 'A store wants to increase customer satisfaction and is deciding between stocking 5 or 50 varieties of a product. Based on this passage, what might you advise?',
        options: [
          'Consider that 50 varieties could overwhelm customers and reduce satisfaction compared to a smaller, well-chosen set',
          'Always choose the maximum number of varieties possible',
          'The number of varieties has no effect on customer satisfaction',
        ],
        correctIndex: 0,
        explanation: 'This applies the passage\'s core finding — that excess choice can reduce satisfaction — to a real decision.',
      },
    ],
  },
  r2: {
    id: 'r2',
    title: 'How Rivers Shape Cities',
    author: 'Offline pack · Science',
    category: 'Science',
    estimatedMinutes: 6,
    concepts: ['Trade', 'Geography'],
    paragraphs: [
      "Look at a map of the world's oldest cities and a pattern appears almost immediately: Cairo on the Nile, Baghdad on the Tigris, Shanghai on the Yangtze. Rivers did not just happen to be nearby. They were often the reason a city existed at all.",
      'A river supplies fresh water, a resource no settlement can do without, but its influence goes well beyond drinking water. Before railroads and highways, moving goods over land was slow and expensive, while a boat could carry far more weight for far less effort. A city on a navigable river had a built-in trade advantage over one that did not.',
      "Rivers also shaped cities more subtly, through their bends. A meander — a looping curve in a river's path — often creates a natural defensive position, with water on three sides, or a wide floodplain good for farming once the water recedes each season.",
      "Even today, long after trade shifted to roads, rails, and air, the imprint remains. Many a modern city's oldest, densest neighborhoods sit exactly where its river made life easiest first — a layout decided less by any planner than by water finding its path downhill.",
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Rivers played a foundational role in determining where and how early cities developed',
          'All modern cities were built in the last century',
          'Rivers are no longer relevant to city planning',
        ],
        correctIndex: 0,
        explanation: "The passage traces a city's location, trade, defense, and even modern layout back to its river.",
      },
      {
        id: 'q2',
        kind: 'Recall',
        prompt: 'According to the passage, why was a navigable river a trade advantage before railroads?',
        options: ['Boats could carry more weight for less effort than overland transport', 'Rivers were the only source of food', 'Rivers prevented invasions entirely'],
        correctIndex: 0,
        explanation: 'The second paragraph states a boat "could carry far more weight for far less effort" than overland transport.',
      },
      {
        id: 'q3',
        kind: 'Inference',
        prompt: "Why might a river's meander have been useful for defense?",
        options: [
          'Because having water on three sides naturally limits the directions from which a settlement could be approached',
          'Because meanders made rivers flow faster',
          'Because meanders were always guarded by soldiers',
        ],
        correctIndex: 0,
        explanation: 'The passage notes a meander creates "a natural defensive position, with water on three sides."',
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In the passage, a 'meander' is",
        options: ["A looping curve or bend in a river's path", 'A type of boat used for trade', 'A dam built across a river'],
        correctIndex: 0,
        explanation: "The passage defines it directly: \"a looping curve in a river's path.\"",
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: 'Based on the passage, what might you expect to find in the oldest, densest part of a city that was founded centuries ago?',
        options: [
          'That it likely sits near the river, where water once made trade and daily life easiest',
          'That it is always located far from any water source',
          'That it was planned entirely by modern urban designers',
        ],
        correctIndex: 0,
        explanation: 'The closing paragraph states old, dense neighborhoods "sit exactly where its river made life easiest first."',
      },
    ],
  },
  r3: {
    id: 'r3',
    title: 'The IKEA Effect',
    author: 'Offline pack · Psychology',
    category: 'Psychology',
    estimatedMinutes: 4,
    concepts: ['Ownership', 'Effort'],
    paragraphs: [
      'Ask someone to put a price on a bookshelf they bought ready-made, and then ask someone else to price an identical bookshelf they assembled themselves from a flat-pack kit. On average, the person who built it will value it noticeably higher, even though the two shelves are, in every physical sense, the same.',
      "Researchers named this the IKEA effect, after the furniture company whose products are famous for requiring assembly. The effort of building something, even a small, simple effort, seems to attach a kind of ownership to it that an identical finished product never earns.",
      'The effect isn\'t limited to furniture. People report more pride in meals they cooked from scratch than identical meals ordered in, and more attachment to presentations they built slide by slide than ones a colleague handed them finished. The labor itself becomes part of the value.',
      'There is a limit, though. If the assembly is too difficult and ends in failure, the effect reverses: an unfinished, frustrating project is liked less than if it had never been started at all. The effort has to succeed to count.',
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'People tend to value things more highly when they put effort into creating or assembling them themselves',
          'IKEA furniture is of higher quality than other furniture',
          'Ready-made products are always preferred over self-assembled ones',
        ],
        correctIndex: 0,
        explanation: 'The passage opens with and builds around this effect: effort increases perceived value, with furniture as one example among several.',
      },
      {
        id: 'q2',
        kind: 'Recall',
        prompt: 'What happens to the IKEA effect when an assembly attempt fails?',
        options: [
          'It stays exactly the same',
          'It reverses, and the unfinished project is liked less than if it had never been started',
          "It only applies to furniture, so failure doesn't matter",
        ],
        correctIndex: 1,
        explanation: 'The final paragraph states the effect "reverses" when assembly fails.',
      },
      {
        id: 'q3',
        kind: 'Inference',
        prompt: 'Why might someone feel more pride in a meal they cooked than an identical meal they ordered?',
        options: [
          'Because the effort of making it becomes attached to the value they place on it',
          'Because home-cooked food always tastes better',
          'Because restaurant food is more expensive',
        ],
        correctIndex: 0,
        explanation: 'The passage generalizes the furniture finding to cooking, attributing the extra pride to the labor itself.',
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In the passage, 'flat-pack' most likely describes",
        options: ['Furniture sold unassembled in a flat box, to be built by the buyer', 'Furniture that is unusually thin', 'A type of furniture store'],
        correctIndex: 0,
        explanation: 'Context ties "flat-pack kit" to something the buyer must assemble themselves.',
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: 'A company wants customers to feel more attached to its product. Based on this passage, what strategy might work, and what risk should it avoid?',
        options: [
          'Have customers assemble part of the product themselves, but keep the assembly simple enough that they are likely to succeed',
          'Make the product as difficult as possible to assemble, since more effort always means more attachment',
          'Avoid any customer involvement, since finished products are always preferred',
        ],
        correctIndex: 0,
        explanation: 'The passage shows effort increases attachment only when the effort succeeds — difficulty that causes failure backfires.',
      },
    ],
  },
  r4: {
    id: 'r4',
    title: 'Survivorship Bias',
    author: 'Offline pack · Critical thinking',
    category: 'Critical thinking',
    estimatedMinutes: 5,
    concepts: ['Hidden data', 'Statistics'],
    paragraphs: [
      'During the Second World War, military researchers studied returning bomber planes to decide where to add armor. They examined the damage patterns and found bullet holes clustered on the wings, the tail, and the body, but almost none on the engines. The obvious conclusion seemed to be: reinforce the areas that were hit most.',
      "A statistician named Abraham Wald disagreed, and his reasoning became famous. The planes being studied were the ones that made it back. Their damage showed where a bomber could be hit and still survive. The planes that didn't return were the ones more likely to be hit in the engines, and those planes weren't available to study at all.",
      "Wald's recommendation was the opposite of the obvious one: armor the engines, the area with suspiciously little visible damage, because planes hit there usually never made it home to be counted.",
      "This pattern — drawing conclusions only from the survivors of some process while ignoring those that didn't make it — shows up far beyond wartime planes. Studying only successful companies to learn 'what makes a business succeed' ignores the equally instructive failures that never got written up. The missing data is often the most important data.",
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Drawing conclusions only from survivors or successes, while ignoring the failures, can lead to the wrong conclusion',
          'Military engineers always make the correct decisions',
          'Armor should always be placed where the most damage is visible',
        ],
        correctIndex: 0,
        explanation: "The bomber story illustrates the broader pattern the final paragraph names directly: survivorship bias.",
      },
      {
        id: 'q2',
        kind: 'Recall',
        prompt: 'Where did Abraham Wald recommend adding armor to the bombers?',
        options: ["The wings and tail, since that's where damage was seen", 'The engines, where damage was rarely seen on returning planes', 'Nowhere, since the planes already survived'],
        correctIndex: 1,
        explanation: 'The third paragraph states his recommendation was to armor the engines.',
      },
      {
        id: 'q3',
        kind: 'Inference',
        prompt: "Why weren't planes that were hit in the engines available to study?",
        options: [
          'They were likely shot down and never returned, so researchers never saw that damage',
          'They were repaired before researchers could see them',
          'Engine damage was too small to notice',
        ],
        correctIndex: 0,
        explanation: 'The second paragraph explains that planes hit in the engines "weren\'t available to study at all," implying they didn\'t return.',
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In the passage, 'survivorship bias' refers to",
        options: [
          "The error of drawing conclusions only from the cases that survived or succeeded, while overlooking those that didn't",
          'A military strategy for armoring planes',
          'A statistical method for choosing the best sample',
        ],
        correctIndex: 0,
        explanation: 'The final paragraph defines the pattern this way, using the bomber story as its illustrating example.',
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: "A magazine studies 50 highly successful entrepreneurs and concludes 'dropping out of college leads to success.' What might the passage suggest is wrong with this conclusion?",
        options: [
          'It likely ignores the many people who dropped out of college and did not succeed, which is survivorship bias',
          'The conclusion is certainly correct since the entrepreneurs are real',
          'Fifty examples is too large a sample to be meaningful',
        ],
        correctIndex: 0,
        explanation: 'This mirrors the passage\'s business example: studying only the successes ignores the uncounted failures.',
      },
    ],
  },
  r5: {
    id: 'r5',
    title: 'The Fermi Paradox',
    author: 'Offline pack · Science',
    category: 'Science',
    estimatedMinutes: 6,
    concepts: ['Scale', 'Unanswered questions'],
    paragraphs: [
      'The universe is enormous, and it is old. There are hundreds of billions of stars in our galaxy alone, many with planets, and the galaxy has existed long enough for intelligent life to have evolved many times over, in theory. So, the physicist Enrico Fermi reportedly asked over lunch one day: where is everybody?',
      'The question is less flippant than it sounds. If even a small fraction of star systems developed intelligent, technological life, and if that life had millions of years to spread, some civilization should have had time to expand across the galaxy by now. We should see some evidence: signals, probes, something. We see nothing.',
      'The explanations people have proposed range from comforting to unsettling. Perhaps intelligent life is simply far rarer than the numbers suggest. Perhaps civilizations tend to destroy themselves before they can spread very far. Perhaps interstellar travel is harder than physics textbooks make it sound. Or perhaps we are, for now, quite alone — not because life is rare, but because the specific combination that leads to a lasting, expansive civilization is rarer still.',
      "No explanation has enough evidence behind it to be called an answer. The Fermi paradox remains less a problem to be solved than a mirror: whatever you believe is the likely reason for the silence tends to say something about what you think a technological civilization's odds of long-term survival actually are.",
    ],
    questions: [
      {
        id: 'q1',
        kind: 'Main idea',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Given the size and age of the universe, the apparent absence of detectable alien civilizations is a genuine, unresolved puzzle',
          'Scientists have proven that aliens do not exist',
          'Enrico Fermi discovered alien life',
        ],
        correctIndex: 0,
        explanation: 'The passage lays out why the silence is surprising given the universe\'s scale, and notes no explanation is proven.',
      },
      {
        id: 'q2',
        kind: 'Recall',
        prompt: 'Who is credited with originally asking the question behind the Fermi paradox?',
        options: ['Enrico Fermi', 'Abraham Wald', 'A science fiction author'],
        correctIndex: 0,
        explanation: 'The first paragraph credits physicist Enrico Fermi with the question.',
      },
      {
        id: 'q3',
        kind: 'Inference',
        prompt: "Why does the passage call the Fermi paradox 'less a problem to be solved than a mirror'?",
        options: [
          'Because which explanation someone favors reveals their own assumptions about civilizations\' odds of survival',
          'Because the paradox can be solved using mirrors and light',
          'Because it was first described using a mirror analogy by Fermi himself',
        ],
        correctIndex: 0,
        explanation: 'The final sentence explains the "mirror" framing directly: your preferred explanation reflects your own assumptions.',
      },
      {
        id: 'q4',
        kind: 'Vocabulary',
        prompt: "In the passage, 'flippant' most nearly means",
        options: ['Not serious; casual to the point of being dismissive', 'Extremely serious and well-researched', 'Related to flight or aviation'],
        correctIndex: 0,
        explanation: 'The passage argues the question is "less flippant than it sounds," then explains the serious reasoning behind it.',
      },
      {
        id: 'q5',
        kind: 'Critical thinking',
        prompt: 'Which of the following, if discovered, would most directly address the Fermi paradox?',
        options: [
          'Clear evidence of a technological signal from another star system',
          'A new, larger telescope with better image resolution',
          'A faster way to travel between continents on Earth',
        ],
        correctIndex: 0,
        explanation: 'The paradox is specifically about the absence of detectable civilizations, so direct evidence of one would address it.',
      },
    ],
  },
};

export const library: BookItem[] = [
  { id: 'b1', title: 'The Practice of Deep Work', author: 'Essay collection', progress: 0.64, minutesLeft: 3, kind: 'Book' },
  { id: 'b2', title: 'Why We Sleep on Decisions', author: 'Local article', progress: 0.2, minutesLeft: 4, kind: 'Article' },
  { id: 'b3', title: 'A Short History of Curiosity', author: 'Imported EPUB', progress: 0.05, minutesLeft: 7, kind: 'Book' },
];

export const recommendedOffline: BookItem[] = [
  { id: 'r1', title: 'The Paradox of Choice', author: 'Offline pack · Psychology', progress: 0, minutesLeft: 5, kind: 'Short read' },
  { id: 'r2', title: 'How Rivers Shape Cities', author: 'Offline pack · Science', progress: 0, minutesLeft: 6, kind: 'Article' },
  { id: 'r3', title: 'The IKEA Effect', author: 'Offline pack · Psychology', progress: 0, minutesLeft: 4, kind: 'Short read' },
  { id: 'r4', title: 'Survivorship Bias', author: 'Offline pack · Critical thinking', progress: 0, minutesLeft: 5, kind: 'Short read' },
  { id: 'r5', title: 'The Fermi Paradox', author: 'Offline pack · Science', progress: 0, minutesLeft: 6, kind: 'Article' },
];
