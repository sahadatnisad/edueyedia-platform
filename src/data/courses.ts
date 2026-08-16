import type { CoverStyle } from "./catalog";

/**
 * Edueyedia course catalog.
 *
 * Courses are the structured-learning pillar (/courses). No course is live
 * yet — every entry is marked `status: "coming-soon"` so the platform shows
 * its real state instead of fake enrollments or fabricated reviews. Phase 2
 * of the roadmap moves courses, modules and lessons into Convex with
 * enrollments and progress stored server-side.
 */
export type CourseStatus = "coming-soon" | "published";

export interface Course {
  slug: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  level: "Beginner" | "Intermediate" | "All levels";
  duration: string;
  lessonCount: number;
  isFree: boolean;
  price: number;
  compareAt?: number;
  status: CourseStatus;
  shortDescription: string;
  description: string;
  whatYouLearn: string[];
  audience: string[];
  cover: CoverStyle;
  modules: { title: string; lessons: string[] }[];
}

export const courses: Course[] = [
  {
    slug: "research-methodology-foundations",
    title: "Research Methodology Foundations",
    titleBn: "রিসার্চ মেথডোলজি ফাউন্ডেশনস",
    category: "Research",
    categoryBn: "গবেষণা",
    level: "Beginner",
    duration: "4 weeks",
    lessonCount: 18,
    isFree: true,
    price: 0,
    status: "coming-soon",
    shortDescription:
      "Research questions, designs, sampling and ethics — the foundations every researcher needs, in clear Bangla.",
    description:
      "A structured introduction to research methodology: what a research question is, how to choose between qualitative, quantitative and mixed designs, how sampling actually works, and the ethics rules every university expects you to follow. Built for first-time researchers, thesis students and scholarship applicants.",
    whatYouLearn: [
      "Formulate a researchable question from a broad interest",
      "Choose and justify a research design",
      "Understand sampling, measurement and bias",
      "Apply basic research ethics and informed-consent practice",
    ],
    audience: [
      "Students starting their thesis or proposal",
      "Scholarship applicants with a research component",
      "Anyone new to academic research",
    ],
    cover: { tone: "navy", pattern: "nodes", glyph: "M" },
    modules: [
      {
        title: "Module 1 — Introduction to Research",
        lessons: [
          "What is research?",
          "Research questions",
          "Research objectives",
        ],
      },
      {
        title: "Module 2 — Research Design",
        lessons: [
          "Qualitative, quantitative and mixed methods",
          "Case study, survey, experiment",
          "Choosing a design",
        ],
      },
      {
        title: "Module 3 — Sampling & Measurement",
        lessons: [
          "Populations, samples and sampling strategies",
          "Measurement and validity",
          "Bias and how to control it",
        ],
      },
      {
        title: "Module 4 — Ethics",
        lessons: [
          "Informed consent",
          "Data protection",
          "Institutional ethics approval",
        ],
      },
    ],
  },
  {
    slug: "academic-writing-for-thesis",
    title: "Academic Writing for Thesis & Papers",
    titleBn: "থিসিস ও পেপারের জন্য অ্যাকাডেমিক রাইটিং",
    category: "Academic Writing",
    categoryBn: "অ্যাকাডেমিক রাইটিং",
    level: "Intermediate",
    duration: "5 weeks",
    lessonCount: 24,
    isFree: false,
    price: 499,
    compareAt: 699,
    status: "coming-soon",
    shortDescription:
      "Write clear, citation-correct academic English and Bangla — paragraph by paragraph, chapter by chapter.",
    description:
      "A structured writing course: building paragraphs that argue, synthesising literature without copying, handling citations in APA and MLA, and revising your own work like an editor. Includes model passages in parallel Bangla and English.",
    whatYouLearn: [
      "Write argument-driven paragraphs and sections",
      "Synthesise sources without plagiarism",
      "Apply APA/MLA citation rules confidently",
      "Self-edit with a repeatable revision checklist",
    ],
    audience: [
      "Thesis and report writers",
      "Students preparing journal submissions",
      "Anyone writing academically in a second language",
    ],
    cover: { tone: "teal", pattern: "paper", glyph: "¶" },
    modules: [
      {
        title: "Module 1 — The Building Blocks",
        lessons: [
          "Topic sentences and paragraph logic",
          "Claim–evidence–analysis",
          "Transitions and signposting",
        ],
      },
      {
        title: "Module 2 — Writing From Sources",
        lessons: [
          "Paraphrase, summary, quotation",
          "Synthesis paragraphs",
          "Avoiding plagiarism intentionally",
        ],
      },
      {
        title: "Module 3 — Citation in Practice",
        lessons: [
          "APA 7th essentials",
          "MLA 9th essentials",
          "Citing Bangla sources",
        ],
      },
      {
        title: "Module 4 — Revision",
        lessons: [
          "The three-pass edit",
          "Common errors of ESL academic writers",
          "From first draft to final draft",
        ],
      },
    ],
  },
  {
    slug: "scholarship-application-masterclass",
    title: "Scholarship Application Masterclass",
    titleBn: "স্কলারশিপ অ্যাপ্লিকেশন মাস্টারক্লাস",
    category: "Scholarships",
    categoryBn: "স্কলারশিপ",
    level: "All levels",
    duration: "6 weeks",
    lessonCount: 26,
    isFree: false,
    price: 599,
    compareAt: 799,
    status: "coming-soon",
    shortDescription:
      "A complete application system: shortlisting, SOP, CV, recommendation letters and interviews — structured week by week.",
    description:
      "A structured six-week system for building a competitive scholarship application: researching and shortlisting programs, writing your story-based SOP, preparing an academic CV, briefing recommenders, and performing in the interview.",
    whatYouLearn: [
      "Shortlist scholarships with a fit-scoring framework",
      "Write a story-first statement of purpose",
      "Build an academic CV that survives screening",
      "Prepare for panel interviews with a story framework",
    ],
    audience: [
      "Applicants for funded master's programs",
      "Students targeting Europe, US, Australia and Asia",
      "Working professionals returning to study",
    ],
    cover: { tone: "gold", pattern: "grid", glyph: "S" },
    modules: [
      {
        title: "Module 1 — Research & Shortlisting",
        lessons: [
          "How funding actually works",
          "The fit-scoring framework",
          "Building your application timeline",
        ],
      },
      {
        title: "Module 2 — Documents",
        lessons: [
          "SOP: structure and story",
          "Academic CV essentials",
          "Transcripts, translations and recommendation letters",
        ],
      },
      {
        title: "Module 3 — The Interview",
        lessons: [
          "What panels test",
          "The three-story framework",
          "Mock interview practice",
        ],
      },
    ],
  },
  {
    slug: "study-abroad-foundations",
    title: "Study Abroad Foundations",
    titleBn: "স্টাডি অ্যাব্রোড ফাউন্ডেশনস",
    category: "Study Abroad",
    categoryBn: "বিদেশে উচ্চশিক্ষা",
    level: "Beginner",
    duration: "3 weeks",
    lessonCount: 14,
    isFree: true,
    price: 0,
    status: "coming-soon",
    shortDescription:
      "Admissions, language tests, budgets and visas — the real sequence of studying abroad, step by step.",
    description:
      "A calm, structured introduction to the study-abroad process: how admissions and language tests work, how to budget a full first semester, what visa rules actually say, and how to avoid the most expensive mistakes Bangladeshi applicants make.",
    whatYouLearn: [
      "Understand the admissions sequence and timeline",
      "Plan language tests and target scores",
      "Budget a full first semester realistically",
      "Read official visa rules and work limits correctly",
    ],
    audience: [
      "Students starting to explore study abroad",
      "Parents who want the real costs",
      "Career changers considering overseas study",
    ],
    cover: { tone: "moss", pattern: "lines", glyph: "✈" },
    modules: [
      {
        title: "Module 1 — The Process",
        lessons: [
          "How admissions work",
          "Intakes and timelines",
          "Language tests explained",
        ],
      },
      {
        title: "Module 2 — The Money",
        lessons: [
          "Total cost of the first semester",
          "Funding, savings and part-time work rules",
          "The budget planner in practice",
        ],
      },
      {
        title: "Module 3 — The Visa",
        lessons: [
          "Reading official visa pages",
          "Document checklists",
          "Common refusal reasons and how to avoid them",
        ],
      },
    ],
  },
  {
    slug: "thesis-writing-system",
    title: "The Thesis Writing System",
    titleBn: "থিসিস রাইটিং সিস্টেম",
    category: "Thesis",
    categoryBn: "থিসিস",
    level: "Intermediate",
    duration: "8 weeks",
    lessonCount: 30,
    isFree: false,
    price: 549,
    compareAt: 749,
    status: "coming-soon",
    shortDescription:
      "A chapter-by-chapter, week-by-week system for finishing a thesis — introduction to viva.",
    description:
      "The structured companion to the Thesis Writing Blueprint: a week-by-week writing system covering every chapter, supervisor communication, word budgets, and defence preparation.",
    whatYouLearn: [
      "Structure every thesis chapter correctly",
      "Manage the writing workload week by week",
      "Handle supervisor feedback professionally",
      "Prepare for the viva with confidence",
    ],
    audience: [
      "Final-year thesis students",
      "Master's students preparing for viva",
      "Students writing alongside a job",
    ],
    cover: { tone: "graphite", pattern: "grid", glyph: "T" },
    modules: [
      {
        title: "Module 1 — Foundations",
        lessons: [
          "The thesis skeleton",
          "Word budgets per chapter",
          "The 6-month writing calendar",
        ],
      },
      {
        title: "Module 2 — Writing Chapters",
        lessons: [
          "Introduction and literature review",
          "Methodology and results",
          "Discussion and conclusion",
        ],
      },
      {
        title: "Module 3 — Working With Your Supervisor",
        lessons: [
          "Meeting playbooks",
          "Handling feedback",
          "Revision systems",
        ],
      },
      {
        title: "Module 4 — The Defence",
        lessons: [
          "Common viva questions",
          "Model answers",
          "Final formatting and submission",
        ],
      },
    ],
  },
];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

export const courseCategories = [
  "All",
  "Free",
  "Paid",
  "Research",
  "Academic Writing",
  "Scholarships",
  "Study Abroad",
] as const;
