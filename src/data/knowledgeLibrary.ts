// Structured, versionable knowledge-library content. Rendering logic lives entirely
// in src/app/learn/*; this file holds only data, so the library can grow without
// touching UI code. See KnowledgeArticle for the schema every article must satisfy.

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ArticleSection {
  heading: string;
  kind?: 'text' | 'example' | 'mistake' | 'worked-example';
  body: string[];
}

export interface KnowledgeCheck {
  id: string;
  kind: 'Recall' | 'Comprehension' | 'Application' | 'Reasoning';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface NumericTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  subcategory?: string;
  summary: string;
  objectives: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  hook: string;
  whyItMatters: string;
  sections: ArticleSection[];
  keyTerms?: KeyTerm[];
  numericTable?: NumericTable;
  flowSteps?: string[];
  tryItYourself: string;
  keyTakeaways: string[];
  knowledgeChecks: KnowledgeCheck[];
  tags: string[];
  relatedIds: string[];
  version: number;
}

export const libraryCategories = [
  { id: 'money', title: 'Money & Finance', icon: 'cash-outline', description: 'Budgeting, interest, debt, and informed financial decisions.' },
  { id: 'critical-thinking', title: 'Critical Thinking', icon: 'telescope-outline', description: 'Evaluate claims, spot bad reasoning, and argue well.' },
  { id: 'technology', title: 'Technology', icon: 'hardware-chip-outline', description: 'How the systems you use every day actually work.' },
  { id: 'learning', title: 'Learning Skills', icon: 'bulb-outline', description: 'Techniques that make studying and remembering actually work.' },
] as const;

export const knowledgeArticles: KnowledgeArticle[] = [
  // ---------- MONEY & FINANCE ----------
  {
    id: 'money-compound-interest',
    title: 'Compound Interest: Why Starting Early Beats Earning More',
    subtitle: 'The quiet math behind long-term saving',
    category: 'money',
    subcategory: 'Saving',
    summary: 'How compound interest turns small, consistent saving into large sums over time, and why time matters more than the amount you start with.',
    objectives: ['Explain compound interest in your own words', 'Estimate roughly how an amount grows over time', 'Compare the cost of delaying saving'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: "Two people each save for retirement. One starts at 25, saves $200 a month for 10 years, then stops entirely. The other starts at 35 and saves $200 a month for 30 years straight — putting in three times as much money overall. Who ends up with more at 65?",
    whyItMatters: 'Nearly every major financial decision — saving, borrowing, investing — is shaped by compound interest. Understanding it changes how urgent "starting now" actually is, and makes loan and credit card interest make sense instead of feeling arbitrary.',
    sections: [
      {
        heading: 'The core concept',
        body: [
          'Simple interest pays a fixed percentage of the original amount, every period. Compound interest pays a percentage of the current total, which includes any interest already earned. That small difference, repeated over many periods, is what makes compounding powerful: interest starts earning interest of its own.',
          'The formula is A = P × (1 + r)^t, where P is the starting amount, r is the interest rate per period, and t is the number of periods. The exponent is the important part — growth accelerates rather than staying flat.',
        ],
      },
      {
        heading: 'How it works',
        kind: 'worked-example',
        body: [
          "Imagine $1,000 growing at 7% a year. After year 1 it's $1,070. After year 2, interest is earned on $1,070, not the original $1,000, giving $1,144.90. After 10 years it's roughly $1,967 — nearly double. After 30 years, it's over $7,600, more than seven times the original, with no new money ever added.",
        ],
      },
      {
        heading: 'Back to the two savers',
        body: [
          "The saver who put in $24,000 total starting at 25 typically ends up with more money at 65 than the saver who put in $72,000 total starting at 35, assuming a similar rate of return. The first saver's money simply had more years to compound. This is sometimes summarized as: time in the market usually matters more than the size of each contribution.",
        ],
      },
      {
        heading: 'Common mistakes',
        kind: 'mistake',
        body: [
          "Treating 'I'll start once I earn more' as a cost-free delay. Because growth compounds, a 10-year delay isn't a 10-year setback — it's often a much larger gap by retirement, since those are the years the money would have compounded the longest.",
          'Applying the same optimism to debt. Credit card balances also compound, usually at much higher rates, which is why an unpaid balance can grow uncomfortably fast.',
        ],
      },
    ],
    numericTable: {
      caption: '$1,000 growing at 7% annually, untouched',
      headers: ['Year', 'Value'],
      rows: [
        ['1', '$1,070'],
        ['5', '$1,403'],
        ['10', '$1,967'],
        ['20', '$3,870'],
        ['30', '$7,612'],
      ],
    },
    tryItYourself:
      "Pick a number you could realistically save per month. Using the 'Rule of 72' (money roughly doubles every 72 ÷ interest-rate years), estimate how long your savings would take to double at a 6% annual return — then try it at 3% and compare.",
    keyTakeaways: [
      'Compound interest grows the total, not just the original amount, so growth accelerates over time.',
      'Time matters more than the size of each contribution — starting earlier usually beats contributing more later.',
      'The same math that grows savings also grows unpaid debt, which is why high-interest debt is costly to delay paying off.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: "In compound interest, what does each period's interest get calculated on?",
        options: ['Only the original amount', 'The current total, including previously earned interest', 'A fixed amount set at the start'],
        correctIndex: 1,
        explanation: 'Compound interest is paid on the current total, which is why growth accelerates rather than staying flat.',
      },
      {
        id: 'q2',
        kind: 'Application',
        prompt: 'Using the Rule of 72, about how many years would it take $1,000 to double at an 8% annual return?',
        options: ['Exactly 8 years', 'About 9 years (72 ÷ 8)', 'About 72 years'],
        correctIndex: 1,
        explanation: '72 ÷ 8 = 9, so the amount roughly doubles in about 9 years at 8% annual growth.',
      },
      {
        id: 'q3',
        kind: 'Reasoning',
        prompt: "Why might starting to save at 25 beat starting at 35, even if the later saver contributes more money in total?",
        options: [
          "Because the earlier saver's money has more years to compound, even with smaller total contributions",
          'Because interest rates are always higher for younger savers',
          'Because banks charge fees to people who start saving later',
        ],
        correctIndex: 0,
        explanation: "Extra compounding years, not a special rate, is what lets the earlier saver end up ahead.",
      },
    ],
    tags: ['money', 'saving', 'interest'],
    relatedIds: ['money-opportunity-cost'],
    version: 1,
  },
  {
    id: 'money-needs-wants-budget',
    title: 'Needs vs. Wants: Building a Budget That Actually Sticks',
    subtitle: "The real skill isn't math, it's honest categorizing",
    category: 'money',
    subcategory: 'Budgeting',
    summary: 'A practical framework for telling needs from wants, and why most budgets fail for behavioral reasons, not mathematical ones.',
    objectives: ['Sort a real expense list into needs, wants, and gray areas', 'Build a simple three-category budget', 'Identify why a past budget attempt failed'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: 'Is a smartphone a need or a want? What about the data plan? A gym membership? Most budgeting advice says "cut your wants," but the hard part is rarely the math — it\'s that the line between need and want is blurrier than it looks.',
    whyItMatters:
      'A budget is really just a plan for where money goes before it goes there. Getting the needs-versus-wants question right is what makes that plan realistic enough to actually follow, instead of something abandoned after two weeks.',
    sections: [
      {
        heading: 'The core concept',
        body: [
          'A need is something required to maintain your basic ability to live, work, and stay healthy: housing, utilities, groceries, transportation to work, minimum debt payments. A want is something that improves quality of life but isn\'t required: dining out, streaming subscriptions, a nicer apartment than a cheaper one would provide, the newest phone when an older one still works.',
          'Most expenses aren\'t purely one or the other. A phone is often a genuine need in a modern job market; an $1,100 phone instead of a $300 one is the "want" part layered on top. The useful move isn\'t labeling the whole expense — it\'s splitting it into its need portion and its want portion.',
        ],
      },
      {
        heading: 'A simple three-category budget',
        body: [
          'One widely used starting split allocates roughly 50% of income to needs, 30% to wants, and 20% to savings and debt paydown beyond the minimum. It is a starting point, not a law — someone with high rent in an expensive city will need to adjust the percentages, and that is fine. The structure matters more than the exact numbers.',
        ],
      },
      {
        heading: 'Why budgets actually fail',
        kind: 'mistake',
        body: [
          "The most common failure isn't bad math, it's an unrealistic plan: a budget that allocates $0 to wants rarely survives contact with real life, because it treats every want as equally cuttable when some provide real, sustainable value. A budget that allows a modest, deliberate amount for wants is more likely to be followed than one that assumes willpower alone will hold.",
          "The second common failure is not tracking irregular expenses — car repairs, annual subscriptions, holiday spending — which then show up as 'surprise' overspending every single time, even though they were predictable in hindsight.",
        ],
      },
    ],
    tryItYourself:
      "List five things you spent money on in the last week. For each one, decide: need, want, or split (part need, part want). For anything marked 'split,' estimate roughly what the need-only version would have cost.",
    keyTakeaways: [
      'Most expenses are a mix of need and want, not purely one or the other.',
      'A sustainable budget deliberately allows some spending on wants, rather than assuming willpower will hold at zero.',
      'Irregular expenses (repairs, annual fees) should be planned for monthly, not treated as surprises when they happen.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Comprehension',
        prompt: 'According to the passage, why is labeling an entire expense as "need" or "want" often misleading?',
        options: [
          'Because most expenses are a mix of a need portion and a want portion layered on top',
          'Because all expenses are actually wants in disguise',
          'Because needs and wants mean the same thing financially',
        ],
        correctIndex: 0,
        explanation: 'The phone example shows how a genuine need can have an optional, more expensive "want" layer added on top.',
      },
      {
        id: 'q2',
        kind: 'Application',
        prompt: 'Someone buys groceries, including both basic staples and some premium snacks. How would this article suggest categorizing that purchase?',
        options: [
          'Split it: the staples are a need, the premium snacks are a want',
          'The whole purchase is a need, since it was groceries',
          "The whole purchase is a want, since snacks were involved",
        ],
        correctIndex: 0,
        explanation: 'The article recommends splitting mixed expenses into their need and want portions rather than labeling the whole thing.',
      },
      {
        id: 'q3',
        kind: 'Reasoning',
        prompt: 'Why does the article argue that a budget allocating $0 to wants is likely to fail?',
        options: [
          "Because it treats every want as equally cuttable and assumes willpower alone will sustain it, which rarely holds up in real life",
          'Because wants are legally required to be included in a budget',
          'Because $0 is mathematically impossible to track',
        ],
        correctIndex: 0,
        explanation: 'The "why budgets fail" section argues an all-needs budget is unrealistic and prone to abandonment.',
      },
    ],
    tags: ['money', 'budgeting'],
    relatedIds: ['money-opportunity-cost', 'money-compound-interest'],
    version: 1,
  },
  {
    id: 'money-opportunity-cost',
    title: 'Opportunity Cost: The Price of the Road Not Taken',
    subtitle: 'Every choice costs you the next-best option you gave up',
    category: 'money',
    subcategory: 'Decision-making',
    summary: 'Opportunity cost is the value of the best alternative you give up when you make a choice — a concept that applies to money, time, and effort alike.',
    objectives: ['Define opportunity cost precisely', 'Identify the opportunity cost in a real decision', 'Apply it to a choice involving both time and money'],
    difficulty: 'Beginner',
    estimatedMinutes: 4,
    hook: 'A ticket to a concert was free — a friend gave it to you. Is going to the concert "free"? Economically, no: the evening you spend there is an evening you can\'t spend doing anything else.',
    whyItMatters:
      'Opportunity cost is one of the most transferable ideas in economics. Once you see it, it quietly reframes decisions about money, time, and career in a way that "what does this cost" alone never does.',
    sections: [
      {
        heading: 'The core concept',
        body: [
          'Opportunity cost is the value of the next-best alternative you give up by choosing one option over another. It is not the sum of everything you didn\'t choose — only the single best thing you gave up.',
          "If you spend $30 and three hours at a movie, the money's opportunity cost is whatever else that $30 would have been best spent on, and the time's opportunity cost is whatever else you'd have most valued doing with those three hours.",
        ],
      },
      {
        heading: 'Why "free" things often aren\'t',
        body: [
          'The free concert ticket has no dollar opportunity cost, but it still has a time opportunity cost: the evening. If the single best alternative use of that evening was something you valued more — studying for an exam the next day, say — then the "free" ticket was not actually free in the way that matters.',
        ],
      },
      {
        heading: 'A worked example',
        kind: 'worked-example',
        body: [
          'A student can spend Saturday either working a shift for $120, or studying for an upcoming exam. If studying raises their expected exam score enough to be worth more to them than $120 — because of a scholarship threshold, say — then the opportunity cost of taking the shift is the better exam outcome, and the opportunity cost of studying is the $120. Whichever they pick, the other is the cost.',
        ],
      },
    ],
    tryItYourself:
      'Think of a recent decision where you chose between two things (two purchases, two ways to spend an afternoon, two commitments). Name the specific next-best alternative you gave up — not everything you didn\'t choose, just the single best option.',
    keyTakeaways: [
      'Opportunity cost is the value of the single best alternative given up, not everything foregone.',
      'Time has an opportunity cost just as money does, even when no money changes hands.',
      'Comparing options by their opportunity cost, not just their price tag, often changes which option looks better.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What exactly does opportunity cost measure?',
        options: ['The value of the single best alternative given up', 'The total of every alternative not chosen', 'The dollar price listed for an item'],
        correctIndex: 0,
        explanation: 'The passage specifies it is the best alternative given up, not the sum of all foregone options.',
      },
      {
        id: 'q2',
        kind: 'Comprehension',
        prompt: 'Why might a "free" concert ticket still have a real cost?',
        options: [
          'Because the time spent at the concert has an opportunity cost — the next-best use of that evening',
          'Because concert venues always charge hidden fees',
          "Because friends' gifts are never truly free in a legal sense",
        ],
        correctIndex: 0,
        explanation: 'The passage explains that even with no money involved, the evening itself carries a time-based opportunity cost.',
      },
      {
        id: 'q3',
        kind: 'Application',
        prompt: 'A freelancer can take a $300 project or spend the same two days improving a skill that could lead to higher-paying work later. What is the opportunity cost of taking the $300 project?',
        options: [
          'The value of the skill-building they gave up',
          '$300',
          'There is no opportunity cost since they earned money either way',
        ],
        correctIndex: 0,
        explanation: 'Whichever option is chosen, the opportunity cost is the value of the other option — here, the skill-building given up.',
      },
    ],
    tags: ['money', 'decision-making', 'economics'],
    relatedIds: ['money-compound-interest', 'money-needs-wants-budget'],
    version: 1,
  },
  {
    id: 'money-insurance-basics',
    title: "Insurance Basics: Why You Pay For Things That (Usually) Don't Happen",
    subtitle: 'Understanding premiums, deductibles, and what you\'re really buying',
    category: 'money',
    subcategory: 'Risk & safety',
    summary: 'Insurance is a way of trading a small, certain cost for protection against a large, unlikely one. Understanding premiums and deductibles clarifies what a policy actually promises.',
    objectives: ['Explain what insurance actually does in plain terms', 'Define premium and deductible correctly', 'Evaluate a basic insurance trade-off'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: "You pay for car insurance every month for years and, if nothing goes wrong, you never collect a single dollar from it. Did you waste that money?",
    whyItMatters:
      'Nearly every adult deals with insurance decisions — health, auto, renters, or home. Understanding the basic mechanics turns a confusing wall of jargon into a straightforward trade-off you can actually evaluate.',
    sections: [
      {
        heading: 'The core concept',
        body: [
          'Insurance pools risk across many people. Most people who pay into a pool never file a large claim in a given year, but a few do, and the pool of smaller payments from everyone covers the larger payouts for those few. You are not betting that something bad will happen to you — you are paying to not be financially devastated if it does.',
          "Seen this way, paying for insurance and never using it isn't a loss any more than paying for a smoke detector and never having a fire is a loss. The value was the protection, not a payout.",
        ],
      },
      {
        heading: 'Two key terms',
        body: [
          'A premium is the amount you pay, usually monthly or yearly, to keep the coverage active. A deductible is the amount you pay out of pocket before the insurance starts covering a claim. These two numbers usually move in opposite directions: a higher deductible typically means a lower premium, because you are absorbing more of the small-to-medium risk yourself in exchange for cheaper ongoing cost.',
        ],
      },
      {
        heading: 'Choosing a deductible',
        kind: 'worked-example',
        body: [
          'A driver is choosing between a $500 deductible plan costing $140 a month, and a $1,000 deductible plan costing $110 a month — a $30 monthly difference, or $360 a year. If they go a full year without a claim, the higher-deductible plan saved them $360. If they do file a claim, the higher-deductible plan costs them $500 more out of pocket at that moment, but they already saved $360 in premiums that year, so the real difference is smaller than the deductible gap alone suggests.',
        ],
      },
      {
        heading: 'Common mistakes',
        kind: 'mistake',
        body: [
          'Choosing the lowest premium without checking the deductible, and being caught off guard by a large out-of-pocket cost at the worst possible moment.',
          'Treating "I never filed a claim" as proof the insurance was a waste, rather than as the expected, normal outcome for most policyholders in most years.',
        ],
      },
    ],
    tryItYourself:
      'Find (or recall) a real insurance premium and deductible you have, or look up a sample policy. Calculate: if you went three years without a claim, how much would you have paid in premiums? How does that compare to the deductible you would owe if something happened in year four?',
    keyTakeaways: [
      'Insurance trades a small, certain cost for protection against a large, unlikely one — not filing a claim is the normal, expected outcome.',
      'A premium is the ongoing cost of coverage; a deductible is what you pay out of pocket before coverage kicks in.',
      'Higher deductibles usually mean lower premiums, so the right choice depends on how much risk you can comfortably absorb yourself.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What is a deductible?',
        options: [
          'The amount you pay out of pocket before insurance coverage starts paying for a claim',
          'The monthly cost of keeping a policy active',
          'The maximum amount an insurance company will ever pay out',
        ],
        correctIndex: 0,
        explanation: 'The passage defines the deductible as the out-of-pocket amount paid before coverage begins.',
      },
      {
        id: 'q2',
        kind: 'Comprehension',
        prompt: 'According to the passage, why isn\'t paying for insurance and never filing a claim considered a waste?',
        options: [
          'Because the value purchased was protection against a large loss, not a guaranteed payout',
          'Because insurance companies refund unused premiums',
          'Because filing a claim is actually bad for the policyholder',
        ],
        correctIndex: 0,
        explanation: 'The passage compares this to a smoke detector: the value is the protection itself, not a payout.',
      },
      {
        id: 'q3',
        kind: 'Application',
        prompt: 'Based on the worked example, what happens to the "extra" out-of-pocket cost of a higher deductible if you already went a claim-free year saving on premiums?',
        options: [
          'The premium savings partly offset the higher deductible, making the real difference smaller than it first appears',
          'The premium savings have no relationship to the deductible at all',
          'The deductible always costs more than any premium savings, no matter what',
        ],
        correctIndex: 0,
        explanation: 'The worked example shows the $360 saved in premiums partly offsets the $500 higher deductible.',
      },
    ],
    tags: ['money', 'insurance', 'risk'],
    relatedIds: ['money-opportunity-cost'],
    version: 1,
  },
  {
    id: 'money-how-businesses-make-money',
    title: 'How Businesses Make Money: Revenue Is Not Profit',
    subtitle: 'The one-sentence idea a lot of business advice skips',
    category: 'money',
    subcategory: 'Business basics',
    summary: 'Revenue is everything a business brings in; profit is what remains after costs. Confusing the two leads to badly misjudged business decisions.',
    objectives: ['Distinguish revenue from profit', 'Identify fixed versus variable costs', 'Calculate a simple profit margin'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: 'A lemonade stand sells $200 worth of lemonade in a weekend. Is that $200 the business "made"? Not quite — it depends entirely on what the cups, lemons, sugar, and table rental cost.',
    whyItMatters:
      "Headlines love to report a company's revenue because it's a big, impressive number. But revenue alone says almost nothing about whether a business is actually healthy — profit is the number that matters.",
    sections: [
      {
        heading: 'The core concept',
        body: [
          "Revenue is the total money a business brings in from sales, before subtracting anything. Profit is what's left after subtracting all the costs of running the business. A company can have enormous revenue and still lose money overall if its costs are even larger.",
          'Profit = Revenue − Costs. It sounds almost too simple to write down, but a surprising amount of business confusion comes from skipping this subtraction.',
        ],
      },
      {
        heading: 'Fixed costs vs. variable costs',
        body: [
          "Fixed costs stay roughly the same regardless of how much you sell: rent, insurance, a salaried employee's pay. Variable costs scale with how much you produce or sell: ingredients, shipping, hourly wages tied to volume.",
          'This distinction matters because it determines how much extra profit you earn from one more sale. If fixed costs are already covered, the next sale often contributes mostly profit, minus just its variable cost.',
        ],
      },
      {
        heading: 'The lemonade stand, with numbers',
        kind: 'worked-example',
        body: [
          'Revenue: $200 from sales. Variable costs: $40 in lemons, sugar, and cups. Fixed cost: $20 to rent the table for the weekend. Total costs: $60. Profit: $200 − $60 = $140. The profit margin — profit as a percentage of revenue — is $140 ÷ $200 = 70%.',
        ],
      },
      {
        heading: 'Common mistakes',
        kind: 'mistake',
        body: [
          'Treating revenue growth as automatically good news. A business can grow revenue while losing more money overall if costs grow even faster.',
          'Forgetting fixed costs when pricing a product, which can make a seemingly profitable sale actually lose money once rent, equipment, or salaries are factored in.',
        ],
      },
    ],
    tryItYourself:
      'Pick a small business you know of (real or imagined). List three things that would be fixed costs and three that would be variable costs for it. Then estimate: if sales doubled, which costs would roughly double too, and which would stay about the same?',
    keyTakeaways: [
      'Revenue is total money in; profit is what remains after subtracting all costs — the two are easy to confuse but very different.',
      'Fixed costs stay roughly constant regardless of sales volume; variable costs scale with it.',
      'Profit margin (profit ÷ revenue) is a quick way to judge how much of each sales dollar a business actually keeps.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What is the correct relationship between revenue, costs, and profit?',
        options: ['Profit = Revenue − Costs', 'Profit = Revenue + Costs', 'Revenue = Profit − Costs'],
        correctIndex: 0,
        explanation: 'The passage states this directly: profit is revenue minus costs.',
      },
      {
        id: 'q2',
        kind: 'Comprehension',
        prompt: 'Which of these is an example of a fixed cost for a small bakery?',
        options: ['Monthly rent for the shop space', 'Flour and sugar used per batch of bread', 'Hourly wages paid only when extra staff are scheduled for busy days'],
        correctIndex: 0,
        explanation: 'Rent stays roughly the same regardless of how much the bakery sells, making it a fixed cost.',
      },
      {
        id: 'q3',
        kind: 'Reasoning',
        prompt: 'A news headline says "Company X revenue hits a record $2 billion." Based on this passage, what question should a careful reader ask next?',
        options: [
          'What were the costs, and was the company actually profitable?',
          'Nothing else — record revenue always means record success',
          'How many employees does the company have?',
        ],
        correctIndex: 0,
        explanation: 'The passage warns that revenue alone says little about financial health without knowing the costs.',
      },
    ],
    tags: ['money', 'business'],
    relatedIds: ['money-opportunity-cost'],
    version: 1,
  },

  // ---------- CRITICAL THINKING ----------
  {
    id: 'ct-confirmation-bias',
    title: 'Confirmation Bias: Why Being Wrong Can Feel Like Being Right',
    subtitle: 'The mental shortcut that quietly protects our existing beliefs',
    category: 'critical-thinking',
    subcategory: 'Cognitive biases',
    summary: 'Confirmation bias is the tendency to notice, favor, and remember information that confirms what we already believe, while overlooking what contradicts it.',
    objectives: ['Define confirmation bias precisely', 'Recognize it in a real example', 'Apply one practical countermeasure'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: 'Someone convinced a certain brand of car is unreliable will notice every one they see broken down on the roadside, and barely register the hundreds driving by just fine. Did they actually gather evidence, or just confirm what they already thought?',
    whyItMatters:
      'Confirmation bias affects how we evaluate news, arguments, products, other people, and our own past decisions. It is one of the most well-documented patterns in how human judgment goes wrong, specifically because it feels like careful reasoning from the inside.',
    sections: [
      {
        heading: 'The core concept',
        body: [
          'Confirmation bias is the tendency to search for, interpret, and recall information in a way that confirms one\'s existing beliefs, while giving disproportionately less attention to information that contradicts them. It is not the same as being closed-minded on purpose — it usually happens without anyone noticing it happening.',
        ],
      },
      {
        heading: 'How it shows up',
        body: [
          'Search: when checking a belief, people tend to search for examples that would confirm it, rather than examples that would test it.',
          'Interpretation: ambiguous evidence tends to get read as support for an existing view, rather than evaluated neutrally.',
          'Memory: confirming instances are often remembered more easily than disconfirming ones, which were never attended to closely in the first place.',
        ],
      },
      {
        heading: 'An example',
        kind: 'example',
        body: [
          "Two people watch the same referee make a borderline call in a sports match. The fan of the team that benefited sees a fair call. The fan of the team that lost out sees an obviously bad one. Both watched the identical replay. The difference wasn't the evidence, it was which conclusion each person was primed to confirm.",
        ],
      },
      {
        heading: 'Common mistakes',
        kind: 'mistake',
        body: [
          "Assuming confirmation bias is something other people do, not you. Because it operates without conscious intent, feeling confident you've reasoned carefully is not actually evidence that you haven't fallen into it.",
          'Trying to "just be more objective" as a fix. Vague intentions rarely work against an automatic bias; a specific habit (see below) works better.',
        ],
      },
    ],
    tryItYourself:
      'Think of an opinion you hold fairly strongly. Spend two minutes actively looking for the single strongest piece of evidence against it — not a weak version of the counterargument, the strongest one you can find. Notice how that search felt different from your usual way of thinking about the topic.',
    keyTakeaways: [
      'Confirmation bias is the automatic tendency to search for, interpret, and remember information that confirms existing beliefs.',
      'It shows up in what we search for, how we interpret ambiguous evidence, and what we remember afterward.',
      'Deliberately searching for the strongest counter-evidence is a more reliable countermeasure than simply intending to "be objective."',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What is confirmation bias?',
        options: [
          'The tendency to favor information that confirms existing beliefs while underweighting contradicting information',
          'The tendency to always believe the newest information you encounter',
          'A deliberate strategy to win arguments by ignoring evidence',
        ],
        correctIndex: 0,
        explanation: 'The passage defines it as favoring confirming information while giving less attention to disconfirming information.',
      },
      {
        id: 'q2',
        kind: 'Application',
        prompt: 'Someone researching whether a diet trend works only reads articles that already support it, and skips ones that are skeptical. What is this an example of?',
        options: ['Confirmation bias in the search stage', 'A scientifically rigorous research process', 'Opportunity cost'],
        correctIndex: 0,
        explanation: 'This matches the "search" pattern the passage describes: seeking confirming examples rather than testing ones.',
      },
      {
        id: 'q3',
        kind: 'Reasoning',
        prompt: 'Why does the passage suggest that feeling confident you reasoned carefully is not strong evidence you avoided confirmation bias?',
        options: [
          'Because the bias operates automatically and without conscious intent, so confidence from the inside is not a reliable signal',
          'Because confidence is always a sign of poor reasoning',
          'Because confirmation bias only affects people who reason quickly',
        ],
        correctIndex: 0,
        explanation: 'The passage explicitly notes the bias "usually happens without anyone noticing it happening."',
      },
    ],
    tags: ['psychology', 'bias', 'reasoning'],
    relatedIds: ['ct-correlation-causation', 'ct-logical-fallacies'],
    version: 1,
  },
  {
    id: 'ct-correlation-causation',
    title: "Correlation Isn't Causation (But It's Not Nothing, Either)",
    subtitle: "Two things moving together doesn't prove one causes the other",
    category: 'critical-thinking',
    subcategory: 'Evaluating evidence',
    summary: 'When two things are correlated, one possibility is that one causes the other — but reverse causation, a shared hidden cause, or coincidence are just as possible.',
    objectives: ['Explain why correlation does not prove causation', 'Identify a plausible alternative explanation for a correlation', 'Recognize when a correlation is still useful evidence'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: 'Ice cream sales and drowning deaths rise and fall together throughout the year. Does ice cream cause drowning?',
    whyItMatters:
      'Correlational claims appear constantly, in news headlines, advertising, and casual conversation. Being able to ask "what else could explain this?" is one of the single highest-leverage critical-thinking habits.',
    sections: [
      {
        heading: 'The core concept',
        body: [
          'A correlation means two variables tend to change together. That alone does not tell you which one, if either, causes the other. There are at least four possibilities whenever A and B are correlated: A causes B, B causes A, some third factor C causes both, or it is coincidence.',
        ],
      },
      {
        heading: 'The ice cream example, resolved',
        kind: 'example',
        body: [
          'Ice cream does not cause drowning. Both rise in the summer because of a shared third cause: hot weather. More people swim when it is hot, which increases drowning risk, and more people buy ice cream when it is hot, for an unrelated reason. The correlation is real; the direct causal story is not.',
        ],
      },
      {
        heading: 'Reverse causation',
        body: [
          "Sometimes the arrow points the opposite way from the first guess. A study might find that people who own more books tend to be wealthier. It's tempting to think owning books causes wealth, but it is at least as plausible that wealth allows people to buy more books — the causal arrow may run backward from the assumed direction.",
        ],
      },
      {
        heading: 'When correlation is still useful',
        body: [
          'None of this means correlation is worthless. It is often the first clue that leads researchers to investigate a real causal relationship, and when a correlation is strong, consistent across many different studies, has a plausible mechanism, and survives attempts to rule out other explanations, it becomes much stronger evidence of causation. The caution is against jumping straight from "correlated" to "therefore causes," not against taking correlation seriously as a starting point.',
        ],
      },
    ],
    tryItYourself:
      'Find a cause-and-effect claim in a headline or advertisement (real or recalled from memory). Write down at least one alternative explanation for the pattern that isn\'t "the first thing causes the second thing directly."',
    keyTakeaways: [
      'A correlation between A and B could mean A causes B, B causes A, a shared third factor causes both, or coincidence.',
      'A classic example: ice cream sales and drowning rates correlate because both are caused by hot weather, not by each other.',
      'Correlation is a useful starting clue for investigation, but strong causal claims need more: consistency, a plausible mechanism, and ruling out alternative explanations.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'According to the passage, what are the possible explanations when A and B are correlated?',
        options: [
          'A causes B, B causes A, a shared third factor causes both, or coincidence',
          'A always causes B',
          'Correlation always means there is no real relationship at all',
        ],
        correctIndex: 0,
        explanation: 'The passage lists these four possibilities explicitly.',
      },
      {
        id: 'q2',
        kind: 'Application',
        prompt: 'Towns with more fire trucks present at fires tend to have more fire damage. Does this mean fire trucks cause fire damage?',
        options: [
          "No — a plausible shared cause is fire severity: bigger fires both draw more trucks and cause more damage",
          'Yes, this proves fire trucks make fires worse',
          'The data is meaningless and tells us nothing',
        ],
        correctIndex: 0,
        explanation: 'This mirrors the ice-cream example: a third factor (fire severity) plausibly explains both observations.',
      },
      {
        id: 'q3',
        kind: 'Reasoning',
        prompt: 'What would make a correlation stronger evidence of actual causation, according to the passage?',
        options: [
          'Consistency across many studies, a plausible mechanism, and ruling out alternative explanations',
          'A single study with a large, surprising correlation number',
          'The correlation being reported by a popular news source',
        ],
        correctIndex: 0,
        explanation: 'The passage lists these specific factors as what strengthens a correlation into real causal evidence.',
      },
    ],
    tags: ['critical thinking', 'statistics', 'reasoning'],
    relatedIds: ['ct-confirmation-bias', 'ct-logical-fallacies'],
    version: 1,
  },
  {
    id: 'ct-logical-fallacies',
    title: 'Five Logical Fallacies Worth Recognizing',
    subtitle: 'Arguments that sound persuasive without actually being valid',
    category: 'critical-thinking',
    subcategory: 'Argumentation',
    summary: 'A logical fallacy is a flaw in reasoning that makes an argument invalid, even when it sounds convincing. Recognizing a few common ones sharpens how you evaluate claims.',
    objectives: ['Identify five common logical fallacies by name', 'Spot a fallacy in a sample argument', 'Distinguish a fallacious argument from a merely unpopular one'],
    difficulty: 'Intermediate',
    estimatedMinutes: 6,
    hook: '"If we let students retake this one test, soon we\'ll have to let them retake every assignment, and the whole grading system will collapse." Does that conclusion actually follow — or does it just sound like it does?',
    whyItMatters:
      'Fallacies are common in advertising, political debate, and everyday arguments, precisely because they are persuasive despite being logically weak. Naming them is often enough to defuse their pull.',
    sections: [
      {
        heading: 'Straw man',
        kind: 'example',
        body: [
          'Misrepresenting someone\'s argument as a weaker, more extreme version, then attacking that version instead of what they actually said. "You think we should have some gun regulations? So you want to ban all guns entirely?" replaces a moderate claim with an extreme one that is easier to knock down.',
        ],
      },
      {
        heading: 'Slippery slope',
        kind: 'example',
        body: [
          'Claiming that one step will inevitably lead to a chain of increasingly extreme consequences, without showing why each link in the chain would actually follow. The retake-test example at the top is a slippery slope: it assumes one reasonable exception must snowball into total collapse, without explaining why.',
        ],
      },
      {
        heading: 'Ad hominem',
        kind: 'example',
        body: [
          'Attacking the person making an argument instead of addressing the argument itself. "You can\'t trust his opinion on nutrition, he\'s not even in great shape" dismisses the claim without engaging with whether it is actually true.',
        ],
      },
      {
        heading: 'False dilemma',
        kind: 'example',
        body: [
          'Presenting only two options when more actually exist. "Either we cut this program completely, or the budget collapses" ignores every middle-ground option, like partial funding or cuts elsewhere.',
        ],
      },
      {
        heading: 'Appeal to popularity',
        kind: 'example',
        body: [
          'Arguing a claim is true because many people believe it. "Millions of people use this product, so it must be the best one" treats popularity as proof of quality, when popularity can come from marketing, price, or habit instead.',
        ],
      },
      {
        heading: 'A useful distinction',
        body: [
          'A fallacious argument is not the same as a wrong or unpopular conclusion. The retake-policy conclusion might even be correct for other reasons — the fallacy is specifically that the slippery-slope reasoning used to get there does not logically hold up on its own.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Straw man', definition: "Misrepresenting an argument as weaker than it is, then attacking that weaker version." },
      { term: 'Slippery slope', definition: 'Assuming one step inevitably leads to an extreme chain of consequences, without justifying each link.' },
      { term: 'Ad hominem', definition: 'Attacking the person making a claim instead of the claim itself.' },
      { term: 'False dilemma', definition: 'Presenting only two options when more realistically exist.' },
      { term: 'Appeal to popularity', definition: "Arguing a claim is true mainly because many people believe or do it." },
    ],
    tryItYourself:
      'Think of an argument you\'ve heard recently — an ad, a debate, a social media post. Try to match it to one of the five fallacies above. If it doesn\'t fit any of them cleanly, that\'s fine too; not every weak argument is a named fallacy.',
    keyTakeaways: [
      'A logical fallacy is a flaw in reasoning that can make a persuasive-sounding argument invalid.',
      'Straw man, slippery slope, ad hominem, false dilemma, and appeal to popularity are five especially common patterns.',
      'A fallacious argument and a wrong conclusion are different things — the reasoning can be flawed even if the conclusion happens to be true.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What is a straw man argument?',
        options: [
          "Misrepresenting someone's argument as a weaker version, then attacking that version",
          'Attacking the character of the person making an argument',
          'Presenting only two choices when more exist',
        ],
        correctIndex: 0,
        explanation: 'This is the definition given directly in the passage.',
      },
      {
        id: 'q2',
        kind: 'Application',
        prompt: '"You only think recycling matters because you drive a hybrid car" — which fallacy is this?',
        options: ['Ad hominem', 'False dilemma', 'Appeal to popularity'],
        correctIndex: 0,
        explanation: "This attacks the person's circumstances rather than addressing whether recycling actually matters.",
      },
      {
        id: 'q3',
        kind: 'Reasoning',
        prompt: 'According to the passage, why is it a mistake to assume a fallacious argument always has a false conclusion?',
        options: [
          'Because the reasoning can be flawed even when the conclusion happens to be true for other reasons',
          'Because all arguments with fallacies are automatically true',
          'Because fallacies only occur in formal debates, not everyday claims',
        ],
        correctIndex: 0,
        explanation: 'The passage draws this distinction explicitly using the retake-policy example.',
      },
    ],
    tags: ['critical thinking', 'logic', 'argumentation'],
    relatedIds: ['ct-confirmation-bias', 'ct-correlation-causation'],
    version: 1,
  },

  // ---------- TECHNOLOGY ----------
  {
    id: 'tech-how-internet-works',
    title: 'How the Internet Actually Works, in Five Steps',
    subtitle: "What happens between tapping a link and seeing a page",
    category: 'technology',
    subcategory: 'Fundamentals',
    summary: "A plain-language walkthrough of what happens between typing a web address and a page appearing on your screen.",
    objectives: ['Describe the basic journey of a web request', 'Define DNS, server, and IP address in plain language', 'Explain why a "down" website might still have a working internet connection'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: "You type a website address and, less than a second later, a page appears. What actually happened in that second?",
    whyItMatters:
      "Understanding the internet's basic plumbing makes troubleshooting less mysterious, and makes it much easier to reason about things like privacy, outages, and why some sites load faster than others.",
    sections: [
      {
        heading: 'The core concept',
        body: [
          "Every device connected to the internet has an address, similar in spirit to a street address, called an IP address. Humans are bad at remembering strings of numbers, so we use domain names (like example.com) instead, and a system called DNS translates the name into the address behind the scenes.",
        ],
      },
      {
        heading: 'The five-step journey',
        body: [
          "The steps, in order, are: (1) you type or tap a web address, (2) your device asks a DNS server to translate that name into an IP address, (3) your device sends a request to the server at that address, asking for the page, (4) the server processes the request and sends the page's data back, (5) your browser assembles that data into the page you see.",
        ],
      },
      {
        heading: 'Why a site can be "down" while your internet works fine',
        body: [
          'Your internet connection only handles getting requests out and responses back — it has nothing to do with whether a specific server is working. If a website\'s server is overloaded, crashed, or undergoing maintenance, your perfectly working connection will simply get no response, or an error, from that one destination, while every other site works normally.',
        ],
      },
      {
        heading: 'Common mistakes',
        kind: 'mistake',
        body: [
          'Assuming "my internet is down" whenever one site fails to load. Checking whether a different site loads is a quick way to tell a local connection problem from a single server\'s problem.',
          'Thinking DNS is "the internet" rather than one specific lookup step within it — it only translates names to addresses, nothing more.',
        ],
      },
    ],
    flowSteps: [
      'You tap a link or type an address',
      'DNS translates the name into an IP address',
      'Your device sends a request to that address',
      'The server processes the request and responds',
      'Your browser assembles the response into a page',
    ],
    tryItYourself:
      "Next time a site fails to load, run a quick check: does a completely different website load normally? If yes, the problem is very likely with that one site's server, not your connection.",
    keyTakeaways: [
      "Every device has an IP address; DNS translates human-readable domain names into those addresses.",
      "Loading a page is a five-step round trip: lookup, request, processing, response, and rendering.",
      'A single site being down does not mean your internet connection is the problem — it usually means that one server is.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What does DNS do?',
        options: [
          'Translates human-readable domain names into IP addresses',
          'Physically carries data between two computers',
          'Stores a permanent copy of every website you visit',
        ],
        correctIndex: 0,
        explanation: 'The passage defines DNS as the system that translates domain names into IP addresses.',
      },
      {
        id: 'q2',
        kind: 'Comprehension',
        prompt: 'In the five-step journey described, what happens right after DNS provides the IP address?',
        options: [
          'Your device sends a request to the server at that address',
          "Your browser immediately displays the page",
          'Your internet connection is established for the first time',
        ],
        correctIndex: 0,
        explanation: 'Step 3 in the passage is sending the request to the now-known address.',
      },
      {
        id: 'q3',
        kind: 'Reasoning',
        prompt: "One website won't load, but several others work fine in the same browser. Based on the passage, what's the most likely explanation?",
        options: [
          "That one site's server is having a problem, not your internet connection",
          'Your internet connection is completely down',
          'DNS has stopped working for all websites',
        ],
        correctIndex: 0,
        explanation: 'The passage specifically explains this scenario: other working sites point to a local connection being fine.',
      },
    ],
    tags: ['technology', 'internet', 'how things work'],
    relatedIds: ['tech-phishing-scams'],
    version: 1,
  },
  {
    id: 'tech-phishing-scams',
    title: 'Spotting Phishing: The Patterns Behind the Scam',
    subtitle: "What separates a real message from an attempt to trick you",
    category: 'technology',
    subcategory: 'Digital safety',
    summary: 'Phishing messages impersonate trusted sources to trick people into giving up credentials or money. A handful of recurring patterns make most attempts recognizable.',
    objectives: ['Define phishing in plain terms', 'Recognize at least three common phishing patterns', 'Know the safe way to verify a suspicious message'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: 'An email arrives claiming to be from your bank: "Suspicious activity detected. Verify your account within 24 hours or it will be suspended." Your heart rate ticks up a little. That reaction is exactly what the message is designed to produce.',
    whyItMatters:
      'Phishing is one of the most common ways accounts and money are stolen, specifically because it targets normal human reactions — urgency, trust, fear — rather than any technical weakness.',
    sections: [
      {
        heading: 'The core concept',
        body: [
          'Phishing is a message, usually an email, text, or call, that impersonates a trusted source (a bank, employer, delivery service, or government agency) in order to trick the recipient into revealing credentials, personal information, or money. The "fishing" in the name is deliberate: it is a lure, cast widely, hoping someone bites.',
        ],
      },
      {
        heading: 'Recurring patterns',
        body: [
          "Manufactured urgency: deadlines, threats of account suspension, or claims that immediate action is required. Urgency is used specifically to short-circuit careful thinking.",
          "A mismatched sender: the display name says 'Your Bank,' but the actual email address, when checked carefully, is an unrelated or slightly misspelled domain.",
          "A request that a legitimate institution wouldn't normally make this way: banks generally don't ask you to confirm your full password by email; tax agencies generally don't demand payment via gift cards.",
          "A link that doesn't go where it claims. Hovering over or long-pressing a link (without tapping it) often reveals a different, unrelated destination address.",
        ],
      },
      {
        heading: 'The safe way to verify',
        kind: 'worked-example',
        body: [
          "Instead of clicking a link or calling a number provided in a suspicious message, independently navigate to the organization's website by typing the address yourself, or call the number printed on an existing bill or the back of a card. This sidesteps the entire trap, because you're no longer trusting any contact information the suspicious message provided.",
        ],
      },
      {
        heading: 'Common mistakes',
        kind: 'mistake',
        body: [
          'Assuming phishing always looks obviously fake. Well-crafted attempts can closely copy real logos, formatting, and tone.',
          "Believing you'd never fall for it. Phishing specifically exploits momentary urgency and distraction, which affects careful people too, not just careless ones.",
        ],
      },
    ],
    tryItYourself:
      "Next time you get an unexpected message asking you to log in, verify an account, or act urgently, pause and ask: did I initiate this contact, or did it arrive out of nowhere? If it arrived out of nowhere, verify independently before clicking anything.",
    keyTakeaways: [
      'Phishing impersonates a trusted source to trick people into giving up credentials, information, or money — usually by creating urgency.',
      'Mismatched sender addresses, unusual requests, and links that go somewhere other than they claim are common tells.',
      'The safest verification method is contacting the organization directly through information you already trust, not through the suspicious message itself.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What is phishing?',
        options: [
          'A message that impersonates a trusted source to trick someone into revealing information or money',
          'A type of computer virus that spreads automatically',
          'A legitimate security check performed by banks',
        ],
        correctIndex: 0,
        explanation: 'The passage defines phishing as impersonation designed to trick the recipient into revealing something valuable.',
      },
      {
        id: 'q2',
        kind: 'Comprehension',
        prompt: 'Why does the passage say manufactured urgency is a common phishing pattern?',
        options: [
          'Because urgency is used to short-circuit careful thinking',
          'Because urgent messages are always sent by real banks',
          'Because urgency makes a message easier to read',
        ],
        correctIndex: 0,
        explanation: 'The passage states urgency is "used specifically to short-circuit careful thinking."',
      },
      {
        id: 'q3',
        kind: 'Application',
        prompt: "You get a text claiming to be your bank, with a link to 'verify your account immediately.' Based on this passage, what's the safest next step?",
        options: [
          "Don't click the link — instead, go to the bank's website yourself or call the number on your card",
          'Click the link quickly before the deadline mentioned in the message',
          'Reply to the text asking if it is legitimate',
        ],
        correctIndex: 0,
        explanation: 'The passage recommends independently verifying through information you already trust, not the message itself.',
      },
    ],
    tags: ['technology', 'safety', 'scams'],
    relatedIds: ['tech-how-internet-works'],
    version: 1,
  },

  // ---------- LEARNING SKILLS ----------
  {
    id: 'learn-active-recall-spaced-repetition',
    title: 'Active Recall and Spaced Repetition: Why Rereading Doesn\'t Work Well',
    subtitle: "Two techniques with strong evidence behind them",
    category: 'learning',
    subcategory: 'Study techniques',
    summary: 'Active recall (testing yourself) and spaced repetition (reviewing at increasing intervals) are two of the best-supported techniques for actually remembering what you study.',
    objectives: ['Explain why rereading feels productive but often isn\'t', 'Define active recall and spaced repetition', 'Apply both techniques to a real study task'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    hook: "You reread your notes three times before a test and feel confident. Then the test asks you to explain a concept from memory, and it's suddenly much harder than the confident feeling predicted. What happened?",
    whyItMatters:
      'How you study usually matters more than how long you study. Two specific, well-tested techniques consistently outperform rereading and highlighting, which are the most common but least effective study habits.',
    sections: [
      {
        heading: 'Why rereading feels productive but often isn\'t',
        body: [
          "Rereading creates a feeling of fluency: the material feels familiar and easy to follow, and that fluency gets mistaken for actual understanding or memory. But recognizing information when it's right in front of you is a much easier task than retrieving it from memory later, with no prompt, which is what a test or real-life application actually requires.",
        ],
      },
      {
        heading: 'Active recall',
        body: [
          'Active recall means testing yourself on material instead of re-reading it: closing the book and trying to write down what you remember, or answering practice questions without looking at the answer first. The act of retrieving information strengthens memory of it far more than passively viewing it again, even though it feels harder and less comfortable in the moment.',
        ],
      },
      {
        heading: 'Spaced repetition',
        body: [
          'Spaced repetition means reviewing material at increasing intervals — for example, one day, then three days, then a week, then two weeks — rather than cramming repeated reviews close together. Reviewing right before you would otherwise forget something strengthens memory more efficiently than reviewing it again while it is still fresh.',
        ],
      },
      {
        heading: 'Putting them together',
        kind: 'worked-example',
        body: [
          "A student learning new vocabulary could, instead of rereading a list five times in one sitting, write down each word's meaning from memory the next day (active recall), then review only the words gotten wrong a few days later, and the rest a week or two out (spaced repetition). This takes less total time than repeated rereading, and produces stronger long-term memory.",
        ],
      },
    ],
    tryItYourself:
      "Pick something you're currently learning. Instead of rereading your notes on it, close them and write down everything you remember, unprompted. Then check what you missed — that gap is exactly what rereading alone would have let you overlook.",
    keyTakeaways: [
      'Rereading creates a false sense of fluency that is often mistaken for real understanding or memory.',
      'Active recall — testing yourself instead of re-reading — strengthens memory more effectively, even though it feels harder.',
      'Spaced repetition — reviewing at increasing intervals, closer to the point of forgetting — is more efficient than cramming repeated reviews close together.',
    ],
    knowledgeChecks: [
      {
        id: 'q1',
        kind: 'Recall',
        prompt: 'What is active recall?',
        options: [
          'Testing yourself on material from memory, rather than re-reading it',
          'Reading a text out loud instead of silently',
          'Highlighting important sentences in a textbook',
        ],
        correctIndex: 0,
        explanation: 'The passage defines active recall as retrieving information from memory rather than passively reviewing it.',
      },
      {
        id: 'q2',
        kind: 'Comprehension',
        prompt: "Why does the passage say rereading can feel productive without actually working well?",
        options: [
          'Because it creates a feeling of fluency that gets mistaken for real memory or understanding',
          'Because rereading is always faster than other study methods',
          "Because rereading is the only method scientifically proven to work",
        ],
        correctIndex: 0,
        explanation: 'The passage explains fluency from recognizing familiar material is mistaken for genuine retrieval ability.',
      },
      {
        id: 'q3',
        kind: 'Application',
        prompt: 'A student reviews flashcards on day 1, day 2, and day 3 in a row, then stops. Based on this passage, what change would likely improve long-term retention?',
        options: [
          'Spacing the reviews out further apart over time (e.g., day 1, day 3, day 7, day 14) instead of three days in a row',
          'Reviewing the same flashcards ten times on day 1 instead of three separate days',
          'Switching entirely to rereading the textbook instead of using flashcards',
        ],
        correctIndex: 0,
        explanation: 'Spaced repetition recommends increasing intervals over time, not repeated review in immediate succession.',
      },
    ],
    tags: ['learning', 'study skills', 'memory'],
    relatedIds: [],
    version: 1,
  },
];

export function getArticle(id: string): KnowledgeArticle | undefined {
  return knowledgeArticles.find(a => a.id === id);
}

export function articlesByCategory(categoryId: string): KnowledgeArticle[] {
  return knowledgeArticles.filter(a => a.category === categoryId);
}

export function relatedArticles(article: KnowledgeArticle): KnowledgeArticle[] {
  return article.relatedIds.map(id => getArticle(id)).filter((a): a is KnowledgeArticle => !!a);
}
