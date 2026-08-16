import type { Article } from "./catalog";

/**
 * New editorial articles for the Research hub (/research) and the Blog (/blog).
 *
 * These live alongside the articles in `src/data/catalog.ts` (the frontend
 * content catalog). Phase 2 of the roadmap moves all content into Convex.
 * No sources, DOIs or statistics are invented — references below point only
 * to Edueyedia's own resources and to well-known published guides.
 */
export const extraArticles: Article[] = [
  {
    slug: "qualitative-vs-quantitative-research",
    title: "Qualitative vs Quantitative Research: Choosing the Right Method",
    titleBn: "Qualitative এবং Quantitative Research-এর পার্থক্য",
    contentType: "methodology",
    category: "research",
    categoryLabel: "Research",
    author: "Rafi Chowdhury",
    authorRole: "PhD Candidate & Research Writing Coach",
    date: "February 18, 2026",
    readingTime: "10 min read",
    excerpt:
      "Qualitative or quantitative? The question stalls more proposals than any other methodology decision. Here is a practical way to choose — based on your research question, not your comfort zone.",
    cover: { tone: "teal", pattern: "bars", glyph: "Q" },
    keywords: [
      "qualitative research",
      "quantitative research",
      "mixed methods",
      "methodology",
      "মেথডোলজি",
      "গবেষণা পদ্ধতি",
    ],
    blocks: [
      {
        type: "p",
        text: "Every research student faces the same fork in the road: qualitative or quantitative? And most pick by default — the student who 'hates maths' picks interviews, the student who 'loves Excel' picks surveys. Neither reason is a methodology. The right choice comes from your research question, and only from your research question.",
      },
      {
        type: "callout",
        variant: "key",
        text: "Quantitative answers 'how many, how much, how strong?' Qualitative answers 'how, why, what does it mean?' If your question mixes both, that is not a mistake — that is a mixed-methods design.",
      },
      {
        type: "h2",
        text: "The one-sentence difference",
        id: "one-sentence-difference",
      },
      {
        type: "p",
        text: "Quantitative research counts and measures. You collect numbers from many respondents, run statistical tests, and generalise to a larger population. Qualitative research interprets. You collect words, images or observations from fewer participants, and build a deep understanding of meaning, context and process.",
      },
      {
        type: "list",
        items: [
          "Quantitative → breadth. Survey 400 students, measure a relationship, report a p-value.",
          "Qualitative → depth. Interview 12 students, trace how they actually decide, quote them.",
          "Mixed → both. A survey that finds the pattern, plus interviews that explain it.",
        ],
      },
      {
        type: "h2",
        text: "When qualitative wins",
        id: "when-qualitative-wins",
      },
      {
        type: "p",
        text: "Choose qualitative when the phenomenon is poorly understood, when you care about meaning and process, or when you cannot (and should not) reduce people to numbers. If your question starts with 'how do students experience…' or 'why do farmers reject…', you are asking a qualitative question. Trying to force it into a survey produces shallow numbers.",
      },
      {
        type: "callout",
        variant: "example",
        text: "'Why do rural women in Bangladesh under-use mobile advisory services?' — an experience-and-context question. Depth interviews and focus groups fit it better than a closed questionnaire.",
      },
      {
        type: "h2",
        text: "When quantitative wins",
        id: "when-quantitative-wins",
      },
      {
        type: "p",
        text: "Choose quantitative when the concepts can be measured, when you need to test a relationship between variables, or when you want results that generalise beyond your sample. If your question is 'does X relate to Y among Z?', you are asking a quantitative question.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Define your variables and how each will be measured.",
          "Choose a sampling strategy that represents your population.",
          "Run the analysis and report effect sizes, not just significance.",
        ],
      },
      {
        type: "h2",
        text: "Mixed methods and the false war",
        id: "mixed-methods",
      },
      {
        type: "p",
        text: "Qualitative versus quantitative is a false war — the best studies often combine them. The common pattern: a survey establishes the pattern across a population, then interviews explain the pattern's why. What matters is that each method is used well and that the design is justified. A methodology section that says 'I used mixed methods' without explaining why is a red flag for any reviewer.",
      },
      {
        type: "callout",
        variant: "important",
        text: "Choose the method that answers your question, then justify it in one paragraph: what the method is, why it fits your question, and what its limitations are. That single paragraph saves most proposals from rejection.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia Methodology Matrix — 14 approaches compared side by side",
          "Creswell, J. W. — Research Design: Qualitative, Quantitative, and Mixed Methods Approaches",
          "Edueyedia Research Proposal Master Guide, ch. 4 (Methodology)",
        ],
      },
    ],
    relatedResources: ["methodology-matrix", "research-proposal-master-guide"],
  },
  {
    slug: "research-gap-explained",
    title: "Research Gap: What It Really Is and How to Find Yours",
    titleBn: "Research Gap আসলে কী এবং কীভাবে শনাক্ত করবেন",
    contentType: "research-discussion",
    category: "research",
    categoryLabel: "Research",
    author: "Dr. Farhana Noor",
    authorRole: "Senior Research Fellow, Edueyedia Research Desk",
    date: "February 20, 2026",
    readingTime: "9 min read",
    excerpt:
      "Supervisors keep saying 'find the gap' — but nobody explains what a research gap actually is. A gap is not a missing topic. It is a missing piece of an existing conversation.",
    cover: { tone: "navy", pattern: "nodes", glyph: "G" },
    keywords: [
      "research gap",
      "গবেষণা ফাঁক",
      "literature review",
      "proposal",
      "research question",
    ],
    blocks: [
      {
        type: "p",
        text: "Every supervisor has said it: 'Your topic needs a clear research gap.' And every student has nodded, then gone home to Google 'research gap meaning' for the third time. The confusion is reasonable — the phrase is used to mean three different things, and you need to know which one your supervisor means.",
      },
      {
        type: "h2",
        text: "The three kinds of gaps",
        id: "three-kinds-of-gaps",
      },
      {
        type: "list",
        items: [
          "Evidence gap — nobody has studied this population, place or time. Example: mobile banking adoption studied in urban areas but not in the Chittagong Hill Tracts.",
          "Knowledge gap — the studies exist but they conflict, or the mechanism is unexplained. Example: two studies report opposite effects of social media on attention.",
          "Method gap — the question has been asked, but only with one method. Example: adoption studied only through surveys, never through interviews.",
        ],
      },
      {
        type: "callout",
        variant: "key",
        text: "A research gap is only worth pursuing if closing it matters to someone. 'Nobody has studied X' is a reason to study X only when the answer would change a decision, a policy, or a field's understanding.",
      },
      {
        type: "h2",
        text: "How to find yours in three passes",
        id: "find-in-three-passes",
      },
      {
        type: "p",
        text: "First pass: read the introductions and discussion sections of five recent papers in your area. The limitations section is a goldmine — authors literally tell you what they could not do, which is a polite way of pointing at your gap. Second pass: build a small matrix of the studies and look for the empty cells: population × method × setting. Third pass: test the gap with your supervisor before you commit a single week to it.",
      },
      {
        type: "callout",
        variant: "example",
        text: "Weak gap statement: 'Few studies have been done on this topic.' Strong gap statement: 'Existing research measures adoption among urban respondents using surveys, leaving rural adoption — and its reasons — unexplored.' The second names what exists, what is missing, and why it matters.",
      },
      {
        type: "h2",
        text: "Where the gap lives in your document",
        id: "where-gap-lives",
      },
      {
        type: "p",
        text: "The gap should appear twice: once at the end of your introduction (the funnel narrows to it), and once at the end of your literature review (the literature lands on it). If a reader cannot point to the exact paragraph where you state what is missing, your gap is not clear enough yet.",
      },
      {
        type: "callout",
        variant: "important",
        text: "Never claim a gap you have not verified. A reviewer in your field will know within one paragraph whether 'no research exists' is true. If you have not searched properly, say what you searched and when.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia Literature Review Toolkit — the screening & synthesis system",
          "Edueyedia Research Proposal Master Guide, ch. 1–2",
          "Booth, W. C., Colomb, G. G., & Williams, J. M. — The Craft of Research",
        ],
      },
    ],
    relatedResources: [
      "research-proposal-master-guide",
      "literature-review-toolkit",
      "research-topic-brainstormer",
    ],
  },
  {
    slug: "study-abroad-real-cost-bangladesh",
    title: "The Real Cost of Studying Abroad: A Bangladeshi Student's Budget",
    titleBn: "বিদেশে পড়ার আসল খরচ: একজন বাংলাদেশি শিক্ষার্থীর বাজেট",
    category: "study-abroad",
    categoryLabel: "Study Abroad",
    author: "Edueyedia Opportunity Desk",
    authorRole: "Editorial Team",
    date: "February 10, 2026",
    readingTime: "8 min read",
    excerpt:
      "Tuition is only half the number. Visa fees, flights, deposits, insurance, living costs — here is a realistic budget framework before you apply anywhere.",
    cover: { tone: "moss", pattern: "bars", glyph: "৳" },
    keywords: [
      "study abroad",
      "cost of living",
      "budget",
      "বিদেশে পড়াশোনা",
      "খরচ",
      "application cost",
    ],
    blocks: [
      {
        type: "p",
        text: "Most students start their study-abroad journey with one number in mind: the tuition fee. The students who actually land abroad work with a very different number — the total cost of getting there, which is two or three times the tuition you see on a university website.",
      },
      {
        type: "h2",
        text: "The costs people forget",
        id: "costs-people-forget",
      },
      {
        type: "list",
        items: [
          "Application fees — often $50–150 per university, before any decision.",
          "Language tests — IELTS/TOEFL registration plus prep materials.",
          "Credential evaluation & document translation.",
          "Visa fee + biometric appointment + immigration health surcharge where it applies.",
          "One-way flight, initial accommodation deposit, and two months of living costs before the first stipend or part-time pay arrives.",
          "Health insurance for the first semester (some countries require it upfront).",
        ],
      },
      {
        type: "callout",
        variant: "key",
        text: "A safe rule of thumb: budget for the full first semester — tuition, flights, deposit, insurance and living costs — before you accept any offer. 'Fully funded' scholarships cover most of this; loans and family savings should cover the rest only after you have written the number down.",
      },
      {
        type: "h2",
        text: "Working the number backwards",
        id: "work-backwards",
      },
      {
        type: "p",
        text: "Start from the country's realistic yearly cost of living, add your program's tuition, then subtract exactly what your funding covers. The remainder is your gap. Now work backwards: how much can you realistically earn from part-time work (check your visa's hour limits first), how much can family contribute, and how much do you need before departure. If the gap number makes you uncomfortable, that discomfort is information — apply to more funded programs or cheaper destinations.",
      },
      {
        type: "callout",
        variant: "note",
        text: "Visa rules matter more than exchange rates. A 20-hour work limit on a student visa changes your budget completely — always read the official immigration page of the country, not a Facebook group.",
      },
      {
        type: "h2",
        text: "The honest checklist before you apply",
        id: "honest-checklist",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Write the full first-semester number for each shortlisted country.",
          "Confirm what your scholarship or program actually covers in writing.",
          "Check the student visa work rules and health insurance requirement.",
          "Set a hard budget for applications and tests before you start applying.",
          "Keep one month of emergency money outside the study fund.",
        ],
      },
      {
        type: "callout",
        variant: "important",
        text: "A number you write down is a plan. A number in your head is a hope. Use the Edueyedia Budget Planner to build a real, city-level estimate before you spend a single taka on applications.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia Study Abroad Budget Planner — city-level yearly estimates",
          "Edueyedia Study Abroad Starter Pack — the full application workflow",
          "Official immigration pages of your target country (always the authority on visa rules)",
        ],
      },
    ],
    relatedResources: [
      "study-abroad-budget-planner",
      "study-abroad-starter-pack",
      "fully-funded-scholarships-map-2026",
    ],
  },
];
