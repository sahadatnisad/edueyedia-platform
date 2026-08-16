/* ------------------------------------------------------------------ */
/*  Edueyedia content catalog — v1: learning resources                 */
/*  Single source of truth for resources, articles, scholarships,      */
/*  collections, testimonials and site copy.                           */
/* ------------------------------------------------------------------ */

export type Category =
  | "research"
  | "scholarships"
  | "academic-writing"
  | "study-abroad"
  | "career"
  | "bundles";

export type ResourceKind = "paid" | "free";

export type CoverTone =
  | "navy"
  | "teal"
  | "gold"
  | "ivory"
  | "graphite"
  | "moss";

export type CoverPattern =
  | "grid"
  | "dots"
  | "lines"
  | "nodes"
  | "quote"
  | "bars"
  | "paper";

export interface CoverStyle {
  tone: CoverTone;
  pattern: CoverPattern;
  glyph?: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Review {
  name: string;
  role: string;
  rating: number;
  text: string;
}

export interface PreviewPage {
  label: string;
  lines: string[];
}

export interface Resource {
  slug: string;
  title: string;
  titleBn?: string;
  category: Category;
  tag: string;
  tagBn?: string;
  kind: ResourceKind;
  summary: string;
  description: string;
  format: string;
  language: string;
  pages: number;
  updated: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  cover: CoverStyle;
  includes: string[];
  audience: string[];
  previewPages: PreviewPage[];
  faqs: Faq[];
  reviews: Review[];
  related: string[];
  featured?: boolean;
  popular?: boolean;
  bestseller?: boolean;
  bundleItems?: string[];
}

export interface Collection {
  slug: string;
  index: string;
  title: string;
  titleBn: string;
  description: string;
  cover: CoverStyle;
  resourceSlugs: string[];
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "quote"; text: string; source?: string }
  | {
      type: "callout";
      variant: "key" | "note" | "important" | "example" | "source";
      text: string;
    }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "timeline"; steps: string[] }
  | { type: "reference"; items: string[] };

/* --------------------------- research taxonomy ---------------------- */

export type ResearchContentType =
  | "research-guide"
  | "paper-review"
  | "methodology"
  | "research-discussion"
  | "literature-review"
  | "data-analysis"
  | "research-ethics"
  | "publication"
  | "research-tools"
  | "evidence-review";

export const RESEARCH_TOPICS: {
  id: ResearchContentType;
  label: string;
  bn: string;
}[] = [
  { id: "research-guide", label: "Research Guide", bn: "গবেষণা গাইড" },
  { id: "methodology", label: "Methodology", bn: "মেথডোলজি" },
  { id: "literature-review", label: "Literature Review", bn: "লিটারেচার রিভিউ" },
  { id: "research-discussion", label: "Research Discussion", bn: "গবেষণা আলোচনা" },
  { id: "data-analysis", label: "Data & Analysis", bn: "ডেটা ও বিশ্লেষণ" },
  { id: "academic-writing", label: "Academic Writing", bn: "অ্যাকাডেমিক রাইটিং" },
  { id: "research-ethics", label: "Research Ethics", bn: "রিসার্চ এথিক্স" },
  { id: "publication", label: "Publication", bn: "প্রকাশনা" },
  { id: "paper-review", label: "Paper Review", bn: "পেপার রিভিউ" },
  { id: "research-tools", label: "Research Tools", bn: "রিসার্চ টুলস" },
];

export const researchArticles = () =>
  articles.filter((a) => a.category === "research");

export interface Article {
  slug: string;
  title: string;
  titleBn?: string;
  contentType?: ResearchContentType;
  category: Category | "insights";
  categoryLabel: string;
  author: string;
  authorRole: string;
  date: string;
  readingTime: string;
  excerpt: string;
  featured?: boolean;
  cover: CoverStyle;
  blocks: ArticleBlock[];
  relatedResources: string[];
  keywords: string[];
}

export interface Scholarship {
  slug: string;
  country: string;
  region: "Europe" | "Asia" | "USA" | "Australia";
  name: string;
  degree: "Masters" | "PhD" | "Both";
  funding: string;
  deadline: string;
  fullyFunded: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  resource: string;
  text: string;
  verified: boolean;
}

/* ------------------------------- labels ------------------------------ */

export const CATEGORY_LABELS: Record<Category, string> = {
  research: "Research",
  scholarships: "Scholarships",
  "academic-writing": "Academic Writing",
  "study-abroad": "Study Abroad",
  career: "Career",
  bundles: "Bundles",
};

export const CATEGORY_TAGS: Record<Category, string> = {
  research: "RESEARCH",
  scholarships: "SCHOLARSHIPS",
  "academic-writing": "ACADEMIC WRITING",
  "study-abroad": "STUDY ABROAD",
  career: "CAREER",
  bundles: "BUNDLES",
};

export const CATEGORY_TAGS_BN: Record<Category, string> = {
  research: "গবেষণা",
  scholarships: "স্কলারশিপ",
  "academic-writing": "অ্যাকাডেমিক রাইটিং",
  "study-abroad": "বিদেশে উচ্চশিক্ষা",
  career: "ক্যারিয়ার",
  bundles: "প্যাকেজ",
};

/* ------------------------------ resources ---------------------------- */

export const resources: Resource[] = [
  {
    slug: "research-proposal-master-guide",
    title: "Research Proposal Master Guide",
    titleBn: "রিসার্চ প্রপোজাল মাস্টার গাইড",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "paid",
    summary:
      "Step-by-step Bangla guide to writing a research proposal that gets approved — from idea to final draft.",
    description:
      "The complete research proposal guide in Bangla. Learn how to shape a raw idea into a structured, fundable proposal: problem statement, objectives, methodology, timeline, ethics, and references. Includes 3 full annotated proposal examples and editable templates.",
    format: "PDF (152 pages)",
    language: "বাংলা + English",
    pages: 152,
    updated: "Updated Jan 2026",
    price: 299,
    compareAt: 449,
    rating: 4.9,
    reviewCount: 214,
    cover: { tone: "navy", pattern: "nodes", glyph: "R" },
    includes: [
      "152-page Bangla guide with English technical terms",
      "3 annotated research proposal examples",
      "Editable proposal template (DOCX)",
      "Gantt chart + timeline planner",
      "Supervisor review checklist",
      "Ethics & data protection section",
    ],
    audience: [
      "Master's & PhD students starting research",
      "Students preparing proposals for supervisors",
      "Applicants for research grants & scholarships",
      "First-time researchers in Bangladesh",
    ],
    previewPages: [
      {
        label: "Chapter 1 — The Idea",
        lines: [
          "A research proposal is not a document. It is an argument.",
          "Every section answers one question the reader is silently asking...",
        ],
      },
      {
        label: "Chapter 4 — Methodology",
        lines: [
          "Your methodology is the section reviewers read twice.",
          "Qualitative, quantitative or mixed — justify before you choose...",
        ],
      },
      {
        label: "Annotated Example B",
        lines: [
          "A funded proposal on 'Digital literacy among rural women in Bangladesh'.",
          "Notice how the research gap is stated in the first paragraph...",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the guide suitable for undergraduates?",
        a: "Yes. The first chapters assume zero prior research experience and build up gradually.",
      },
      {
        q: "Do I get the template in editable format?",
        a: "Yes — every purchase includes the DOCX proposal template and a Notion-style planner.",
      },
    ],
    reviews: [
      {
        name: "Nusrat Jahan",
        role: "MSc Student, University of Dhaka",
        rating: 5,
        text: "My supervisor approved my proposal on the second review. The annotated examples made all the difference.",
      },
      {
        name: "Tanvir Ahmed",
        role: "Research Assistant, Brac University",
        rating: 5,
        text: "The Bangla explanations with English terms finally made methodology click for me.",
      },
    ],
    related: [
      "literature-review-toolkit",
      "methodology-matrix",
      "research-topic-brainstormer",
      "citation-style-guide-bangla",
    ],
    featured: true,
    popular: true,
    bestseller: true,
  },
  {
    slug: "thesis-writing-blueprint",
    title: "Thesis Writing Blueprint",
    titleBn: "থিসিস রাইটিং ব্লুপ্রিন্ট",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "paid",
    summary:
      "A chapter-by-chapter system for writing a thesis from introduction to defence — without the panic.",
    description:
      "A practical, chapter-by-chapter thesis writing system. Learn how to structure each chapter, manage your word budget, handle supervisor feedback, and survive the final defence. Built around a realistic 6-month writing plan.",
    format: "PDF (188 pages)",
    language: "বাংলা + English",
    pages: 188,
    updated: "Updated Nov 2025",
    price: 349,
    rating: 4.8,
    reviewCount: 156,
    cover: { tone: "moss", pattern: "grid", glyph: "T" },
    includes: [
      "Chapter-by-chapter writing system",
      "6-month writing calendar with weekly targets",
      "Word-budget planner per chapter",
      "Supervisor meeting playbook",
      "Defence preparation checklist",
      "Common viva questions with model answers",
    ],
    audience: [
      "Final-year thesis students",
      "Master's students preparing for viva",
      "Students juggling thesis with a job",
    ],
    previewPages: [
      {
        label: "The 6-Month Plan",
        lines: [
          "Month 1: consolidate your proposal and build the skeleton.",
          "Month 2: write the literature review in small daily sessions...",
        ],
      },
      {
        label: "Chapter 4 — Results",
        lines: [
          "Report findings before you interpret them.",
          "Tables and figures carry the chapter; your text explains the pattern...",
        ],
      },
    ],
    faqs: [
      {
        q: "Does this replace my supervisor?",
        a: "No — it helps you use your supervisor better. It includes a meeting playbook so every review counts.",
      },
    ],
    reviews: [
      {
        name: "Farhana Islam",
        role: "MSS Graduate, Jahangirnagar University",
        rating: 5,
        text: "The word-budget planner saved my thesis. I knew exactly what to cut before my supervisor asked.",
      },
    ],
    related: [
      "methodology-matrix",
      "thesis-planning-checklist",
      "literature-review-toolkit",
      "citation-style-guide-bangla",
    ],
    popular: true,
  },
  {
    slug: "methodology-matrix",
    title: "Methodology Matrix",
    titleBn: "মেথডোলজি ম্যাট্রিক্স",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "paid",
    summary:
      "Qualitative, quantitative and mixed methods compared side by side — with Bangla explanations and real examples.",
    description:
      "The methodology chapter is where most proposals stall. This guide compares every common method side by side: when to use it, what to write, common mistakes, and model paragraphs in Bangla with English terminology.",
    format: "PDF (96 pages)",
    language: "বাংলা + English",
    pages: 96,
    updated: "Updated Dec 2025",
    price: 249,
    rating: 4.8,
    reviewCount: 98,
    cover: { tone: "teal", pattern: "bars", glyph: "M" },
    includes: [
      "Method comparison matrix for 14 approaches",
      "Model methodology paragraphs (Bangla + English)",
      "Sampling strategy guide for Bangladesh contexts",
      "Ethics checklist for local universities",
      "Justification phrases in both languages",
    ],
    audience: [
      "Students stuck on the methodology chapter",
      "Mixed-methods beginners",
      "Supervisors who want consistent student writing",
    ],
    previewPages: [
      {
        label: "Comparison Matrix",
        lines: [
          "Survey → when you need breadth across a population.",
          "Interview → when you need depth in individual experience...",
        ],
      },
      {
        label: "Model Paragraph",
        lines: [
          "This study adopts a mixed-methods design...",
          "এটি একটি মিশ্র পদ্ধতির গবেষণা নকশা গ্রহণ করে...",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need any statistics background?",
        a: "Not for choosing a method. The guide focuses on justification and structure; analysis tools are referenced for later.",
      },
    ],
    reviews: [
      {
        name: "Rafiul Karim",
        role: "MPhil Researcher, University of Rajshahi",
        rating: 5,
        text: "I finally understood the difference between purposive and snowball sampling. Worth every taka.",
      },
    ],
    related: [
      "research-proposal-master-guide",
      "thesis-writing-blueprint",
      "literature-review-matrix-template",
    ],
    popular: true,
  },
  {
    slug: "literature-review-toolkit",
    title: "Literature Review Toolkit",
    titleBn: "লিটারেচার রিভিউ টুলকিট",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "paid",
    summary:
      "Find, read, organise and write your literature review in weeks — not months.",
    description:
      "A complete literature review workflow: searching databases, screening papers, organising notes into themes, and writing a review that reads like an argument rather than a list. Includes the Literature Review Matrix template.",
    format: "PDF (112 pages)",
    language: "বাংলা + English",
    pages: 112,
    updated: "Updated Jan 2026",
    price: 279,
    rating: 4.9,
    reviewCount: 131,
    cover: { tone: "ivory", pattern: "lines", glyph: "L" },
    includes: [
      "Search strategy builder (Google Scholar, Scopus, PubMed)",
      "Screening & note-taking system",
      "Literature Review Matrix template",
      "Synthesis writing formulas",
      "12 common review mistakes to avoid",
    ],
    audience: [
      "Students writing their first literature review",
      "Researchers preparing journal submissions",
      "Supervisors coaching student reviews",
    ],
    previewPages: [
      {
        label: "The Search Builder",
        lines: [
          "Start from 3 core papers, then follow citations forward and backward.",
          "Use keyword combinations: population × intervention × outcome...",
        ],
      },
      {
        label: "Synthesis Formulas",
        lines: [
          "Theme + 2–3 studies + your comment = a synthesis paragraph.",
          "Never list: 'Smith found X. Jones found Y.' Always connect...",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the matrix template included?",
        a: "Yes — the spreadsheet-style matrix is included as a PDF insert and a separate template file.",
      },
    ],
    reviews: [
      {
        name: "Mehjabin Chowdhury",
        role: "MSc Student, KUET",
        rating: 5,
        text: "Wrote my entire literature review in three weeks using the screening system. My supervisor thought I had help.",
      },
    ],
    related: [
      "literature-review-matrix-template",
      "research-proposal-master-guide",
      "citation-style-guide-bangla",
    ],
  },
  {
    slug: "citation-style-guide-bangla",
    title: "Citation Style Guide",
    titleBn: "সাইটেশন স্টাইল গাইড",
    category: "academic-writing",
    tag: "ACADEMIC WRITING",
    tagBn: "অ্যাকাডেমিক রাইটিং",
    kind: "paid",
    summary:
      "APA, MLA and IEEE citation rules explained in Bangla — with 200+ worked examples.",
    description:
      "Citation rules explained in Bangla so you never guess again. Covers APA 7th, MLA 9th and IEEE with 200+ worked examples for journal articles, books, websites, theses, AI tools and Bangla-language sources.",
    format: "PDF (134 pages)",
    language: "বাংলা + English",
    pages: 134,
    updated: "Updated Feb 2026",
    price: 199,
    rating: 4.9,
    reviewCount: 187,
    cover: { tone: "graphite", pattern: "quote", glyph: "¶" },
    includes: [
      "APA 7th, MLA 9th and IEEE complete rules",
      "200+ worked examples in both languages",
      "Citing Bangla books & newspapers correctly",
      "Reference list formatting checklist",
      "AI-tool citation guidance (new)",
      "PDF quick-reference card",
    ],
    audience: [
      "Undergraduate & graduate students",
      "Journal authors in Bangladesh",
      "Students writing theses in Bangla or English",
    ],
    previewPages: [
      {
        label: "Citing a Bangla book",
        lines: [
          "Author, A. (বছর). বইয়ের শিরোনাম [Book title]. প্রকাশক।",
          "Show the transliteration, then the Bangla original in brackets...",
        ],
      },
      {
        label: "APA vs MLA at a glance",
        lines: [
          "APA: Author, A. (Year). Title. Source.",
          "MLA: Author, A. \"Title.\" Source, Year...",
        ],
      },
    ],
    faqs: [
      {
        q: "Does it cover citation of AI-generated text?",
        a: "Yes — a dedicated section covers how to cite and disclose AI tools under APA 7th and common journal policies.",
      },
    ],
    reviews: [
      {
        name: "Sadia Rahman",
        role: "BBA Graduate, NSU",
        rating: 5,
        text: "The Bangla examples ended my citation anxiety. My final report had zero citation deductions.",
      },
    ],
    related: [
      "academic-writing-phrases-bangla",
      "apa-quick-reference",
      "thesis-writing-blueprint",
    ],
    popular: true,
  },
  {
    slug: "scholarship-application-essentials",
    title: "Scholarship Application Essentials",
    titleBn: "স্কলারশিপ অ্যাপ্লিকেশন এসেনশিয়ালস",
    category: "scholarships",
    tag: "SCHOLARSHIPS",
    tagBn: "স্কলারশিপ",
    kind: "paid",
    summary:
      "The complete system for building a competitive scholarship application from Bangladesh.",
    description:
      "Everything a Bangladeshi applicant needs: finding suitable scholarships, structuring your application, preparing transcripts and recommendation letters, and presenting yourself honestly but powerfully. Built around real admission committee expectations.",
    format: "PDF (168 pages)",
    language: "বাংলা + English",
    pages: 168,
    updated: "Updated Dec 2025",
    price: 349,
    compareAt: 499,
    rating: 4.9,
    reviewCount: 243,
    cover: { tone: "navy", pattern: "grid", glyph: "S" },
    includes: [
      "Scholarship search & shortlisting framework",
      "Application timeline for each intake",
      "Recommendation letter request templates",
      "Transcript & document preparation checklist",
      "Interview preparation module",
      "Real acceptance stories with annotated essays",
    ],
    audience: [
      "Undergraduates applying for funded master's",
      "Students applying to European & US programs",
      "Working professionals seeking scholarships",
    ],
    previewPages: [
      {
        label: "The Shortlisting Framework",
        lines: [
          "Score every scholarship on fit, funding, and language requirements.",
          "Apply to 6–8 well-matched programs, not 30 random ones...",
        ],
      },
      {
        label: "Interview Module",
        lines: [
          "The panel is testing motivation, not knowledge.",
          "Prepare 3 stories: why this field, why this program, why you...",
        ],
      },
    ],
    faqs: [
      {
        q: "Does this include specific scholarship lists?",
        a: "It includes the framework and case studies. The regularly updated scholarship map is a separate resource.",
      },
    ],
    reviews: [
      {
        name: "Israt Zaman",
        role: "Chevening Scholar 2025",
        rating: 5,
        text: "The interview module is gold. I used the story framework and my panel interview felt calm.",
      },
      {
        name: "Mahmudul Hasan",
        role: "DAAD Scholarship Holder",
        rating: 5,
        text: "The timeline told me exactly when to start. Without it I would have missed the recommendation deadline.",
      },
    ],
    related: [
      "fully-funded-scholarships-map-2026",
      "sop-writer-bangla",
      "cv-academic-bangla",
      "scholarship-deadline-tracker",
    ],
    featured: true,
    popular: true,
  },
  {
    slug: "fully-funded-scholarships-map-2026",
    title: "Fully Funded Scholarships Map 2026",
    titleBn: "ফুলি ফান্ডেড স্কলারশিপ ম্যাপ ২০২৬",
    category: "scholarships",
    tag: "SCHOLARSHIPS",
    tagBn: "স্কলারশিপ",
    kind: "paid",
    summary:
      "40+ fully funded scholarships mapped by country, degree and deadline — updated for 2026.",
    description:
      "A visual map of 40+ fully funded scholarships open to Bangladeshi students in 2026. Each entry includes eligibility, funding coverage, application window, official link, and a difficulty rating based on real acceptance patterns.",
    format: "PDF (64 pages) + Tracker",
    language: "English + বাংলা notes",
    pages: 64,
    updated: "Updated Feb 2026",
    price: 249,
    rating: 4.8,
    reviewCount: 172,
    cover: { tone: "gold", pattern: "nodes", glyph: "◉" },
    includes: [
      "40+ fully funded programs with official links",
      "Eligibility & funding summary per program",
      "2026 application windows at a glance",
      "Difficulty rating per program",
      "Linked deadline tracker sheet",
    ],
    audience: [
      "Students planning 2026–27 applications",
      "Anyone overwhelmed by scholarship research",
      "Career changers exploring funded study",
    ],
    previewPages: [
      {
        label: "How to read the map",
        lines: [
          "Each entry: country → funding → degree → window → difficulty.",
          "Green rows = best fit for Bangladeshi applicants...",
        ],
      },
      {
        label: "Sample entry — Erasmus Mundus",
        lines: [
          "Funding: full tuition + living allowance.",
          "Window: usually Oct–Jan. Difficulty: competitive, 8/10...",
        ],
      },
    ],
    faqs: [
      {
        q: "How often is this updated?",
        a: "The map is refreshed every cycle — roughly twice a year — and buyers get the update at no extra cost.",
      },
    ],
    reviews: [
      {
        name: "Nafis Ahmed",
        role: "Applicant, 2026 cycle",
        rating: 5,
        text: "The difficulty ratings stopped me wasting months on programs I had no real shot at.",
      },
    ],
    related: [
      "scholarship-deadline-tracker",
      "scholarship-application-essentials",
      "study-abroad-budget-planner",
    ],
    popular: true,
  },
  {
    slug: "sop-writer-bangla",
    title: "SOP Writing Masterclass",
    titleBn: "এসওপি রাইটিং মাস্টারক্লাস",
    category: "academic-writing",
    tag: "ACADEMIC WRITING",
    tagBn: "অ্যাকাডেমিক রাইটিং",
    kind: "paid",
    summary:
      "Write a statement of purpose that admissions committees remember — structure, stories and editing.",
    description:
      "A masterclass in statement writing: the story-first structure, how to connect your past and future, how to handle weak grades or gaps, and a line-by-line editing pass on real SOPs that won admission.",
    format: "PDF (142 pages)",
    language: "বাংলা + English",
    pages: 142,
    updated: "Updated Jan 2026",
    price: 299,
    compareAt: 399,
    rating: 4.9,
    reviewCount: 198,
    cover: { tone: "teal", pattern: "paper", glyph: "S" },
    includes: [
      "Story-first SOP structure with templates",
      "3 full SOPs that won admission (annotated)",
      "Weak grades & gap year playbooks",
      "Opening line bank (20 strong starts)",
      "Editing checklist & Bangla-to-English drafting method",
    ],
    audience: [
      "Master's applicants to Europe, US, Australia",
      "Scholarship applicants needing SOPs",
      "Students writing in English as a second language",
    ],
    previewPages: [
      {
        label: "The Story Arc",
        lines: [
          "Hook → why this field → evidence → why this program → future.",
          "Admissions read 300 SOPs; yours must move in one paragraph...",
        ],
      },
      {
        label: "Weak Grades Playbook",
        lines: [
          "Never apologise in the SOP. Contextualise instead.",
          "One sentence of honest context beats two paragraphs of excuses...",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this a ghostwriting service?",
        a: "No — and we intentionally keep it that way. You learn to write your own story convincingly, which matters in interviews.",
      },
    ],
    reviews: [
      {
        name: "Arif Hossain",
        role: "Admitted, TU Delft 2025",
        rating: 5,
        text: "The Bangla-to-English drafting method is genius. My SOP finally sounded like me, not a template.",
      },
    ],
    related: [
      "sop-outline-template",
      "scholarship-application-essentials",
      "cv-academic-bangla",
    ],
    popular: true,
  },
  {
    slug: "cv-academic-bangla",
    title: "Academic CV & Cover Letter Kit",
    titleBn: "অ্যাকাডেমিক সিভি ও কভার লেটার কিট",
    category: "career",
    tag: "CAREER",
    tagBn: "ক্যারিয়ার",
    kind: "paid",
    summary:
      "University-ready CV and cover letter templates designed for researchers, scholars and professionals.",
    description:
      "An academic CV is not a job CV. This kit shows you the difference: publications, teaching, conference papers, grants — and provides polished templates plus cover letters for research and professional roles.",
    format: "PDF (88 pages) + Templates",
    language: "English + বাংলা",
    pages: 88,
    updated: "Updated Oct 2025",
    price: 229,
    rating: 4.7,
    reviewCount: 84,
    cover: { tone: "graphite", pattern: "lines", glyph: "CV" },
    includes: [
      "Academic CV template (research & teaching)",
      "Professional CV template (industry)",
      "3 cover letter templates",
      "Phrase bank for achievements",
      "ATS-friendly formatting guide",
    ],
    audience: [
      "Graduate students applying to RA positions",
      "Scholarship applicants needing CVs",
      "Early-career professionals",
    ],
    previewPages: [
      {
        label: "Academic vs professional CV",
        lines: [
          "Academic: publications first, detailed education.",
          "Professional: impact statements, quantified results...",
        ],
      },
      {
        label: "Phrase Bank",
        lines: [
          "'Developed a survey instrument used by 400+ respondents.'",
          "'Co-authored 2 peer-reviewed conference papers.'",
        ],
      },
    ],
    faqs: [
      {
        q: "Are the templates editable?",
        a: "Yes — DOCX templates are included with the PDF guide.",
      },
    ],
    reviews: [
      {
        name: "Rubaiya Akter",
        role: "Research Assistant, IUB",
        rating: 5,
        text: "Got an RA interview within three weeks of switching to the academic CV template.",
      },
    ],
    related: [
      "career-transition-guide",
      "scholarship-application-essentials",
      "sop-writer-bangla",
    ],
  },
  {
    slug: "study-abroad-starter-pack",
    title: "Study Abroad Starter Pack",
    titleBn: "স্টাডি অ্যাব্রোড স্টার্টার প্যাক",
    category: "bundles",
    tag: "BUNDLES",
    tagBn: "প্যাকেজ",
    kind: "paid",
    summary:
      "Everything you need for your first study-abroad application — in one discounted bundle.",
    description:
      "A curated bundle for first-time applicants: scholarship essentials, SOP masterclass, academic CV kit, and the fully funded map — plus the budget planner. Buy as a set and save 35% versus individual purchase.",
    format: "5 resources + bonus",
    language: "বাংলা + English",
    pages: 494,
    updated: "Updated Feb 2026",
    price: 999,
    compareAt: 1475,
    rating: 4.9,
    reviewCount: 121,
    cover: { tone: "navy", pattern: "dots", glyph: "★" },
    bundleItems: [
      "Scholarship Application Essentials",
      "SOP Writing Masterclass",
      "Academic CV & Cover Letter Kit",
      "Fully Funded Scholarships Map 2026",
      "Study Abroad Budget Planner (free bonus)",
    ],
    includes: [
      "Scholarship Application Essentials",
      "SOP Writing Masterclass",
      "Academic CV & Cover Letter Kit",
      "Fully Funded Scholarships Map 2026",
      "Bonus: Study Abroad Budget Planner",
      "Priority email support (14 days)",
    ],
    audience: [
      "First-time international applicants",
      "Students starting the 2026–27 cycle",
      "Anyone who wants one complete set",
    ],
    previewPages: [
      {
        label: "What's inside",
        lines: [
          "Five resources, one workflow: research → documents → apply.",
          "Follow the pack in order and your application is complete...",
        ],
      },
      {
        label: "The 12-week plan",
        lines: [
          "Weeks 1–2: shortlist with the map and tracker.",
          "Weeks 3–8: draft SOP and CV...",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the bundle better value than separate purchases?",
        a: "Yes — it saves roughly 35%, and the free budget planner is only available inside the bundle.",
      },
    ],
    reviews: [
      {
        name: "Tasnim Ferdous",
        role: "Applicant, 2026 cycle",
        rating: 5,
        text: "Bought the pack, followed the 12-week plan, and had a complete application by February. Unreal value.",
      },
    ],
    related: [
      "scholarship-application-essentials",
      "sop-writer-bangla",
      "fully-funded-scholarships-map-2026",
    ],
    featured: true,
  },
  {
    slug: "ielts-toefl-roadmap",
    title: "IELTS & TOEFL Prep Roadmap",
    titleBn: "আইইএলটিএস ও টোফেল প্রস্তুতি রোডম্যাপ",
    category: "study-abroad",
    tag: "STUDY ABROAD",
    tagBn: "বিদেশে উচ্চশিক্ষা",
    kind: "paid",
    summary:
      "A realistic 8-week preparation roadmap for IELTS and TOEFL — no wasted study hours.",
    description:
      "An 8-week preparation system for IELTS and TOEFL focused on the sections Bangladeshi students lose marks in: writing task 2, speaking fluency, and listening for detail. Includes weekly schedules and free practice source lists.",
    format: "PDF (104 pages)",
    language: "বাংলা + English",
    pages: 104,
    updated: "Updated Nov 2025",
    price: 199,
    rating: 4.7,
    reviewCount: 143,
    cover: { tone: "teal", pattern: "lines", glyph: "8" },
    includes: [
      "8-week study calendar (both tests)",
      "Band/score diagnostic grid",
      "Writing task 2 essay frameworks",
      "Speaking part 2 cue card system",
      "Curated free practice resources",
    ],
    audience: [
      "Students preparing for language tests",
      "Applicants targeting 6.5+ / 90+",
      "Busy students with limited hours",
    ],
    previewPages: [
      {
        label: "Week 1 — Diagnostic",
        lines: [
          "Take one full practice test before studying anything.",
          "Your score report, not your feelings, sets the plan...",
        ],
      },
      {
        label: "Task 2 Frameworks",
        lines: [
          "Opinion, discussion, problem-solution: three skeletons.",
          "Memorise the skeleton, not the essay...",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this a substitute for coaching?",
        a: "It works as a self-study system. If you attend classes, use it to make those classes count.",
      },
    ],
    reviews: [
      {
        name: "Shakil Khan",
        role: "IELTS 7.5, admitted to UoM",
        rating: 5,
        text: "Went from 6.0 to 7.5 in nine weeks following the calendar exactly.",
      },
    ],
    related: [
      "study-abroad-starter-pack",
      "study-abroad-budget-planner",
      "fully-funded-scholarships-map-2026",
    ],
  },
  {
    slug: "bangla-research-publishing",
    title: "Publishing in English Journals",
    titleBn: "ইংরেজি জার্নালে প্রকাশনা",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "paid",
    summary:
      "From first draft to acceptance: how to publish your research in indexed international journals.",
    description:
      "The publishing playbook for Bangladeshi researchers: choosing a suitable journal, formatting your manuscript, writing cover letters, handling reviewer comments, and avoiding predatory journals.",
    format: "PDF (126 pages)",
    language: "বাংলা + English",
    pages: 126,
    updated: "Updated Oct 2025",
    price: 299,
    rating: 4.8,
    reviewCount: 67,
    cover: { tone: "gold", pattern: "paper", glyph: "P" },
    includes: [
      "Journal selection & credibility checklist",
      "Manuscript formatting for 5 major styles",
      "Cover letter & response-to-reviewers templates",
      "Predatory journal red flags",
      "Rejection recovery framework",
    ],
    audience: [
      "Early-career researchers",
      "Faculty members writing their first papers",
      "Master's students publishing from theses",
    ],
    previewPages: [
      {
        label: "Predatory journal red flags",
        lines: [
          "Unsolicited invitations, fast-track fees, no indexing.",
          "Check DOAJ, Scopus and the think-check-submit flow...",
        ],
      },
      {
        label: "Responding to reviewers",
        lines: [
          "Thank, restate, respond, revise — in that order.",
          "Every comment gets a numbered reply, even the rude ones...",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this only for STEM fields?",
        a: "No — examples cover social sciences, humanities and STEM equally.",
      },
    ],
    reviews: [
      {
        name: "Dr. Anika Sultana",
        role: "Assistant Professor, DU",
        rating: 5,
        text: "Used the response-to-reviewers template on my first international submission. Accepted after one revision.",
      },
    ],
    related: [
      "citation-style-guide-bangla",
      "academic-writing-phrases-bangla",
      "literature-review-toolkit",
    ],
  },
  {
    slug: "career-transition-guide",
    title: "Career Transition Guide",
    titleBn: "ক্যারিয়ার ট্রানজিশন গাইড",
    category: "career",
    tag: "CAREER",
    tagBn: "ক্যারিয়ার",
    kind: "paid",
    summary:
      "Move from studies to a research, policy or tech career with a clear 90-day plan.",
    description:
      "For graduates who want more than a generic job search: map your skills, choose between research, policy, teaching and industry, and execute a 90-day transition plan with templates for every step.",
    format: "PDF (118 pages)",
    language: "বাংলা + English",
    pages: 118,
    updated: "Updated Sep 2025",
    price: 249,
    rating: 4.7,
    reviewCount: 59,
    cover: { tone: "moss", pattern: "nodes", glyph: "→" },
    includes: [
      "Skill mapping & gap analysis worksheet",
      "Research vs policy vs industry comparison",
      "90-day transition calendar",
      "Networking scripts for LinkedIn & email",
      "Portfolio starter templates",
    ],
    audience: [
      "Recent graduates in Bangladesh",
      "Students unsure of their next step",
      "Early professionals seeking a pivot",
    ],
    previewPages: [
      {
        label: "The 90-day plan",
        lines: [
          "Days 1–30: map skills and target roles.",
          "Days 31–60: build portfolio and network...",
        ],
      },
      {
        label: "Networking scripts",
        lines: [
          "Ask for 15 minutes, prepare 5 questions, follow up in 24h.",
          "Specificity beats flattery in every message...",
        ],
      },
    ],
    faqs: [
      {
        q: "Does it include job application templates?",
        a: "It links to the CV kit for applications — this guide is about direction, positioning and networking.",
      },
    ],
    reviews: [
      {
        name: "Pritom Das",
        role: "Policy Analyst (2025)",
        rating: 5,
        text: "The research-vs-policy comparison helped me choose. Landed my first policy role in month three.",
      },
    ],
    related: ["cv-academic-bangla", "sop-writer-bangla"],
  },
  {
    slug: "phd-application-kit",
    title: "PhD Application Kit",
    titleBn: "পিএইচডি অ্যাপ্লিকেশন কিট",
    category: "bundles",
    tag: "BUNDLES",
    tagBn: "প্যাকেজ",
    kind: "paid",
    summary:
      "Proposal, CV, publications and emails — the complete PhD application system in one bundle.",
    description:
      "For PhD applicants: the research proposal guide, academic CV kit, publishing playbook and methodology matrix bundled together, with the research proposal template and supervisor email scripts.",
    format: "4 resources + bonus",
    language: "বাংলা + English",
    pages: 468,
    updated: "Updated Jan 2026",
    price: 899,
    compareAt: 1176,
    rating: 4.9,
    reviewCount: 44,
    cover: { tone: "graphite", pattern: "dots", glyph: "PhD" },
    bundleItems: [
      "Research Proposal Master Guide",
      "Academic CV & Cover Letter Kit",
      "Methodology Matrix",
      "Publishing in English Journals",
      "Supervisor email script pack (bonus)",
    ],
    includes: [
      "Research Proposal Master Guide",
      "Academic CV & Cover Letter Kit",
      "Methodology Matrix",
      "Publishing in English Journals",
      "Bonus: supervisor cold-email scripts",
    ],
    audience: [
      "Master's students planning PhDs",
      "Applicants to Europe, US, Australia & Asia",
      "Students who want one complete system",
    ],
    previewPages: [
      {
        label: "The application order",
        lines: [
          "1. Choose direction → 2. Draft proposal → 3. Contact supervisors.",
          "Supervisors reply faster to a one-page idea than a CV alone...",
        ],
      },
      {
        label: "Email script sample",
        lines: [
          "Subject: PhD enquiry — [your idea] fits your work on X.",
          "Three sentences: who you are, what you propose, what you ask...",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I combine this with the Study Abroad Starter Pack?",
        a: "They overlap on the CV kit, so we recommend choosing the kit that matches your degree level.",
      },
    ],
    reviews: [
      {
        name: "Labib Rahman",
        role: "PhD Offer Holder, 2026",
        rating: 5,
        text: "The supervisor email scripts got me three replies in two weeks. Two became interviews.",
      },
    ],
    related: [
      "research-proposal-master-guide",
      "cv-academic-bangla",
      "methodology-matrix",
    ],
  },

  /* ------------------------------ free ------------------------------ */

  {
    slug: "research-topic-brainstormer",
    title: "Research Topic Brainstormer",
    titleBn: "রিসার্চ টপিক ব্রেনস্টর্মার",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "free",
    summary:
      "A guided worksheet to turn your vague interests into three testable research topics.",
    description:
      "A printable worksheet with prompts, filters and scoring to move from 'I want to research something' to three concrete, feasible topics — plus a feasibility checklist.",
    format: "Worksheet (12 pages)",
    language: "বাংলা + English",
    pages: 12,
    updated: "Updated Jan 2026",
    price: 0,
    rating: 4.8,
    reviewCount: 310,
    cover: { tone: "ivory", pattern: "dots", glyph: "?" },
    includes: [
      "Interest mapping prompts",
      "Topic scoring matrix",
      "Feasibility checklist (data, access, ethics)",
    ],
    audience: [
      "Students who have no topic yet",
      "Workshop facilitators",
      "Supervisors guiding topic selection",
    ],
    previewPages: [
      {
        label: "Prompt 1 — Your interests",
        lines: [
          "List 10 things you're curious about. No filtering yet.",
          "Now circle the 3 you'd defend in public...",
        ],
      },
      {
        label: "Feasibility checklist",
        lines: [
          "Can I reach respondents in your city?",
          "Is the data public or obtainable?",
          "Can a supervisor guide this?",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["research-proposal-master-guide"],
    popular: true,
  },
  {
    slug: "thesis-planning-checklist",
    title: "Thesis Planning Checklist",
    titleBn: "থিসিস প্ল্যানিং চেকলিস্ট",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "free",
    summary:
      "A 40-item checklist that takes your thesis from 'started' to 'submitted' without panic.",
    description:
      "A practical, printer-friendly checklist covering every milestone: proposal sign-off, ethics, data collection, analysis, writing drafts, formatting and submission.",
    format: "Checklist (8 pages)",
    language: "বাংলা",
    pages: 8,
    updated: "Updated Nov 2025",
    price: 0,
    rating: 4.7,
    reviewCount: 186,
    cover: { tone: "teal", pattern: "bars", glyph: "✓" },
    includes: [
      "40 milestone items across 7 phases",
      "Due-date column for each item",
      "Supervisor sign-off trackers",
    ],
    audience: ["Final-year students", "Master's thesis students"],
    previewPages: [
      {
        label: "Phase 3 — Data collection",
        lines: [
          "Ethics approval documented.",
          "Pilot test completed with 5 respondents.",
          "Fieldwork schedule confirmed with supervisor...",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["thesis-writing-blueprint", "thesis-writing-blueprint"],
  },
  {
    slug: "scholarship-deadline-tracker",
    title: "Scholarship Deadline Tracker",
    titleBn: "স্কলারশিপ ডেডলাইন ট্র্যাকার",
    category: "scholarships",
    tag: "SCHOLARSHIPS",
    tagBn: "স্কলারশিপ",
    kind: "free",
    summary:
      "A spreadsheet to track every scholarship, deadline and application status in one place.",
    description:
      "A clean spreadsheet with columns for program, country, deadline, documents, status and notes — plus a colour-coded urgency system so nothing slips.",
    format: "Spreadsheet (CSV + Sheets)",
    language: "English",
    pages: 1,
    updated: "Updated Feb 2026",
    price: 0,
    rating: 4.9,
    reviewCount: 402,
    cover: { tone: "gold", pattern: "grid", glyph: "▤" },
    includes: [
      "Ready-made tracker columns",
      "Urgency colour system",
      "Document checklist per program",
    ],
    audience: ["Scholarship applicants", "Study-abroad advisors"],
    previewPages: [
      {
        label: "Columns",
        lines: [
          "Program | Country | Deadline | Status | Docs | Notes.",
          "Deadline = 2 weeks → row turns amber...",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["fully-funded-scholarships-map-2026"],
    popular: true,
  },
  {
    slug: "apa-quick-reference",
    title: "APA 7th Quick Reference",
    titleBn: "এপিএ ৭ম সংস্করণ কুইক রেফারেন্স",
    category: "academic-writing",
    tag: "ACADEMIC WRITING",
    tagBn: "অ্যাকাডেমিক রাইটিং",
    kind: "free",
    summary:
      "A one-page cheat sheet for the APA citations you'll actually use in your thesis.",
    description:
      "The 30 most common APA 7th citation formats on one page — journal articles, books, websites, theses, newspapers and more — with inline citation examples.",
    format: "Cheat sheet (1 page)",
    language: "বাংলা + English",
    pages: 1,
    updated: "Updated Dec 2025",
    price: 0,
    rating: 4.8,
    reviewCount: 521,
    cover: { tone: "graphite", pattern: "quote", glyph: "¶" },
    includes: [
      "30 citation formats on one page",
      "Inline citation examples",
      "Print-friendly layout",
    ],
    audience: ["All thesis & report writers"],
    previewPages: [
      {
        label: "The sheet",
        lines: [
          "Journal: Author, A. (Year). Title. Journal, 1(2), 3–4.",
          "Website: Author. (Year). Title. Site. URL",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["citation-style-guide-bangla"],
  },
  {
    slug: "sop-outline-template",
    title: "SOP Outline Template",
    titleBn: "এসওপি আউটলাইন টেমপ্লেট",
    category: "academic-writing",
    tag: "ACADEMIC WRITING",
    tagBn: "অ্যাকাডেমিক রাইটিং",
    kind: "free",
    summary:
      "A five-part skeleton that makes any statement of purpose easier to write.",
    description:
      "Fill-in-the-blanks outline for a 1,000-word SOP: hook, motivation, evidence, program fit and future. Includes guiding questions for each section.",
    format: "Template (6 pages)",
    language: "বাংলা + English",
    pages: 6,
    updated: "Updated Jan 2026",
    price: 0,
    rating: 4.7,
    reviewCount: 264,
    cover: { tone: "ivory", pattern: "lines", glyph: "§" },
    includes: [
      "Five-part SOP skeleton",
      "Guiding questions per section",
      "Word-count guidance",
    ],
    audience: ["Master's applicants", "Scholarship applicants"],
    previewPages: [
      {
        label: "Part 3 — Evidence",
        lines: [
          "Show, don't claim: a project, a grade, a responsibility.",
          "What did you DO, LEARN, and CHANGE?",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["sop-writer-bangla"],
  },
  {
    slug: "study-abroad-budget-planner",
    title: "Study Abroad Budget Planner",
    titleBn: "স্টাডি অ্যাব্রোড বাজেট প্ল্যানার",
    category: "study-abroad",
    tag: "STUDY ABROAD",
    tagBn: "বিদেশে উচ্চশিক্ষা",
    kind: "free",
    summary:
      "Estimate your real yearly cost — tuition, rent, food, visa — before you apply anywhere.",
    description:
      "A budget planner that turns vague 'cost of living' fears into a real number: tuition, rent, food, transport, visa, insurance and contingency, with city-level estimates for popular destinations.",
    format: "Spreadsheet + Guide (10 pages)",
    language: "English + বাংলা",
    pages: 10,
    updated: "Updated Nov 2025",
    price: 0,
    rating: 4.8,
    reviewCount: 231,
    cover: { tone: "moss", pattern: "bars", glyph: "৳" },
    includes: [
      "Yearly cost calculator",
      "City-level estimates (12 cities)",
      "Funding shortfall worksheet",
    ],
    audience: ["Prospective students", "Parents & guardians"],
    previewPages: [
      {
        label: "Calculator",
        lines: [
          "Tuition + rent + food + transport + misc = real number.",
          "Then subtract scholarship coverage to see the gap...",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["ielts-toefl-roadmap", "fully-funded-scholarships-map-2026"],
    popular: true,
  },
  {
    slug: "academic-writing-phrases-bangla",
    title: "Academic Writing Phrase Bank",
    titleBn: "অ্যাকাডেমিক রাইটিং ফ্রেজ ব্যাংক",
    category: "academic-writing",
    tag: "ACADEMIC WRITING",
    tagBn: "অ্যাকাডেমিক রাইটিং",
    kind: "free",
    summary:
      "200 ready-to-use Bangla and English phrases for every section of your paper or thesis.",
    description:
      "A phrase bank organised by section — introduction, literature review, methods, results, discussion, limitations — in parallel Bangla and English, so your academic voice stays consistent.",
    format: "PDF (24 pages)",
    language: "বাংলা + English",
    pages: 24,
    updated: "Updated Dec 2025",
    price: 0,
    rating: 4.9,
    reviewCount: 389,
    cover: { tone: "navy", pattern: "paper", glyph: "আ" },
    includes: [
      "200 phrases across 8 sections",
      "Parallel Bangla–English columns",
      "Tone & hedging guidance",
    ],
    audience: ["Thesis writers", "Journal authors", "ESL researchers"],
    previewPages: [
      {
        label: "Discussion section",
        lines: [
          "The findings suggest that… — ফলাফল ইঙ্গিত করে যে…",
          "This is consistent with… — এটি …-এর সঙ্গে সামঞ্জস্যপূর্ণ।",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["bangla-research-publishing", "citation-style-guide-bangla"],
    popular: true,
  },
  {
    slug: "literature-review-matrix-template",
    title: "Literature Review Matrix Template",
    titleBn: "লিটারেচার রিভিউ ম্যাট্রিক্স টেমপ্লেট",
    category: "research",
    tag: "RESEARCH",
    tagBn: "গবেষণা",
    kind: "free",
    summary:
      "Compare every paper you read — method, findings, gaps — in one organised matrix.",
    description:
      "The matrix researchers use to synthesise sources: author, year, method, sample, findings, strengths, limitations and relevance. Fill it as you read, and your review writes itself.",
    format: "Spreadsheet + Guide (8 pages)",
    language: "English",
    pages: 8,
    updated: "Updated Oct 2025",
    price: 0,
    rating: 4.8,
    reviewCount: 287,
    cover: { tone: "teal", pattern: "grid", glyph: "▦" },
    includes: [
      "10-column comparison matrix",
      "Synthesis prompts",
      "Example completed rows",
    ],
    audience: ["Thesis students", "Systematic review beginners"],
    previewPages: [
      {
        label: "Example row",
        lines: [
          "Ahmed (2023) | Survey, n=320 | Urban farmers | Adoption drivers...",
        ],
      },
    ],
    faqs: [],
    reviews: [],
    related: ["literature-review-toolkit"],
  },
];

/* ------------------------------ helpers ------------------------------ */

export const getResource = (slug: string) =>
  resources.find((r) => r.slug === slug);

export const premiumResources = resources.filter((r) => r.kind === "paid");
export const freeResources = resources.filter((r) => r.kind === "free");
export const popularResources = resources.filter((r) => r.popular);
export const featuredResources = resources.filter((r) => r.featured);
export const bestsellerResources = resources.filter((r) => r.bestseller);

export const resourcesByCategory = (category: Category) =>
  resources.filter((r) => r.category === category);

export const resourceTabs: Array<"All" | Category> = [
  "All",
  "research",
  "scholarships",
  "academic-writing",
  "study-abroad",
  "career",
  "bundles",
];

/* ---------------------------- collections ---------------------------- */

export const collections: Collection[] = [
  {
    slug: "start-your-research-journey",
    index: "01",
    title: "Start Your Research Journey",
    titleBn: "আপনার গবেষণা যাত্রা শুরু করুন",
    description:
      "From zero to an approved proposal — the exact sequence our researchers recommend.",
    cover: { tone: "navy", pattern: "nodes", glyph: "01" },
    resourceSlugs: [
      "research-proposal-master-guide",
      "literature-review-toolkit",
      "research-topic-brainstormer",
      "methodology-matrix",
    ],
  },
  {
    slug: "scholarship-application-essentials-collection",
    index: "02",
    title: "Scholarship Application Essentials",
    titleBn: "স্কলারশিপ অ্যাপ্লিকেশন এসেনশিয়ালস",
    description:
      "Shortlist, write and submit — a complete application system in four resources.",
    cover: { tone: "gold", pattern: "grid", glyph: "02" },
    resourceSlugs: [
      "scholarship-application-essentials",
      "sop-writer-bangla",
      "cv-academic-bangla",
      "scholarship-deadline-tracker",
      "fully-funded-scholarships-map-2026",
    ],
  },
  {
    slug: "thesis-survival-kit",
    index: "03",
    title: "Thesis Survival Kit",
    titleBn: "থিসিস সারভাইভাল কিট",
    description:
      "The plan, the matrix and the citations — everything a thesis actually needs.",
    cover: { tone: "moss", pattern: "bars", glyph: "03" },
    resourceSlugs: [
      "thesis-writing-blueprint",
      "methodology-matrix",
      "thesis-planning-checklist",
      "literature-review-matrix-template",
      "citation-style-guide-bangla",
    ],
  },
  {
    slug: "academic-writing-toolkit",
    index: "04",
    title: "Academic Writing Toolkit",
    titleBn: "অ্যাকাডেমিক রাইটিং টুলকিট",
    description:
      "Phrases, citations and publishing — write with an academic voice in both languages.",
    cover: { tone: "teal", pattern: "paper", glyph: "04" },
    resourceSlugs: [
      "academic-writing-phrases-bangla",
      "citation-style-guide-bangla",
      "bangla-research-publishing",
      "apa-quick-reference",
    ],
  },
  {
    slug: "study-abroad-starter-pack-collection",
    index: "05",
    title: "Study Abroad Starter Pack",
    titleBn: "স্টাডি অ্যাব্রোড স্টার্টার প্যাক",
    description:
      "Language test, budget and funding map — prepare for your first international application.",
    cover: { tone: "graphite", pattern: "lines", glyph: "05" },
    resourceSlugs: [
      "study-abroad-starter-pack",
      "ielts-toefl-roadmap",
      "study-abroad-budget-planner",
      "fully-funded-scholarships-map-2026",
    ],
  },
];

export const collectionBySlug = (slug: string) =>
  collections.find((c) => c.slug === slug);

/* ------------------------------ articles ----------------------------- */

export const articles: Article[] = [
  {
    slug: "how-to-choose-a-research-topic",
    title: "How to Choose a Research Topic That Matters",
    titleBn: "গুরুত্বপূর্ণ একটি গবেষণা বিষয় কীভাবে বেছে নেবেন",
    contentType: "research-guide",
    category: "research",
    categoryLabel: "Research",
    author: "Dr. Farhana Noor",
    authorRole: "Senior Research Fellow, Edueyedia Research Desk",
    date: "February 12, 2026",
    readingTime: "9 min read",
    excerpt:
      "The topic decides 50% of your research outcome before you write a single word. Here is the framework our researchers use to pick topics that are feasible, original and worth defending.",
    featured: true,
    cover: { tone: "navy", pattern: "nodes", glyph: "R" },
    keywords: [
      "research topic",
      "গবেষণা বিষয়",
      "topic selection",
      "research proposal",
      "thesis topic",
    ],
    blocks: [
      {
        type: "p",
        text: "Most students don't fail research because they write badly. They fail because the topic was wrong from the start — too broad to finish, too narrow to matter, or too crowded to be original. Topic selection is not the first chapter of your thesis. It is the decision that shapes every chapter after it.",
      },
      {
        type: "callout",
        variant: "key",
        text: "A good research topic is feasible, original and meaningful — all three at once. Drop any one and the project will struggle, no matter how smart the researcher is.",
      },
      {
        type: "h2",
        text: "Start with a problem, not a title",
        id: "start-with-a-problem",
      },
      {
        type: "p",
        text: "Beginners search for 'interesting topics'. Experienced researchers search for 'uncomfortable problems' — things in their own community, institution or daily life that don't work as well as they should. A title is the answer you hope to find; a problem is what makes the search worth doing.",
      },
      {
        type: "list",
        items: [
          "What frustrates people around you that could be studied?",
          "What claim do you hear repeated without evidence?",
          "What changed recently that nobody has measured yet?",
          "What works elsewhere but hasn't been tested here?",
        ],
      },
      {
        type: "quote",
        text: "The best topics come from the place where your curiosity, your skills and your community's needs overlap.",
        source: "Edueyedia Research Method, Topic Selection",
      },
      {
        type: "h2",
        text: "The three-filter test",
        id: "three-filter-test",
      },
      {
        type: "p",
        text: "Once you have a candidate problem, run it through three filters before you commit. This is where most promising ideas die — or get saved.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Feasibility — can you access respondents, data or documents within your timeline and budget?",
          "Originality — is there a gap you can name, or are you repeating a study done here five times already?",
          "Meaning — would the result be useful to someone: a community, an institution, a policy, a field?",
        ],
      },
      {
        type: "callout",
        variant: "important",
        text: "Feasibility is the filter students skip most. 'Interesting' is not a research plan — 'I can reach 200 respondents in Chattogram within six weeks' is.",
      },
      {
        type: "h2",
        text: "Narrow it until it hurts",
        id: "narrow-it",
      },
      {
        type: "p",
        text: "A topic that can be 'covered' in a book is not a thesis topic. Narrow until your topic fits a single study: one population, one setting, one period, one clear question. A classic formula: 'The effect of X on Y among Z in [place], [time]'.",
      },
      {
        type: "callout",
        variant: "example",
        text: "Broad: 'Social media and students' → Narrow: 'How Instagram Reels usage relates to attention span among first-year students at Dhaka University, 2026'.",
      },
      {
        type: "h2",
        text: "Test your topic in five conversations",
        id: "test-in-conversations",
      },
      {
        type: "p",
        text: "Before you write the proposal, explain the topic to five different people: a classmate, a supervisor, a working professional, someone outside academia, and yourself in one sentence. If any of them can't follow it, the topic isn't clear yet — and an unclear topic produces an unclear proposal.",
      },
      {
        type: "callout",
        variant: "note",
        text: "The one-sentence test: 'My research is about ___ because ___ matters for ___.' If you can't fill that in, the idea needs another round of narrowing.",
      },
      {
        type: "h2",
        text: "A decision, not a discovery",
        id: "a-decision",
      },
      {
        type: "p",
        text: "You will never find the perfect topic, because it doesn't exist. You are looking for a good-enough topic you can defend with confidence — then the work of research begins, and the topic grows with you. Choose deliberately, commit, and let the evidence reshape the question as you learn.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia Research Proposal Master Guide, ch. 1–2",
          "Booth, W. C., Colomb, G. G., & Williams, J. M. — The Craft of Research",
          "University of Dhaka Faculty Research Guidelines (2025)",
        ],
      },
    ],
    relatedResources: [
      "research-topic-brainstormer",
      "research-proposal-master-guide",
      "literature-review-toolkit",
    ],
  },
  {
    slug: "literature-review-in-7-days",
    title: "The Literature Review, Decoded in 7 Days",
    titleBn: "৭ দিনে লিটারেচার রিভিউ",
    contentType: "literature-review",
    category: "research",
    categoryLabel: "Research",
    author: "Rafi Chowdhury",
    authorRole: "PhD Candidate & Writing Coach",
    date: "January 28, 2026",
    readingTime: "11 min read",
    excerpt:
      "A literature review is not a summary of papers — it is an argument you build from them. Here is a day-by-day system to build yours in a week.",
    featured: true,
    cover: { tone: "moss", pattern: "lines", glyph: "L" },
    keywords: [
      "literature review",
      "লিটারেচার রিভিউ",
      "thesis writing",
      "synthesis",
      "systematic review",
    ],
    blocks: [
      {
        type: "p",
        text: "Every student dreads the literature review, and almost everyone writes it wrong: paper after paper, author after author, a parade of summaries with no argument. Read this instead — a seven-day workflow that produces a review your supervisor actually enjoys reading.",
      },
      {
        type: "callout",
        variant: "key",
        text: "A literature review answers one question: 'What do we already know, and where does your study fit?' Every paragraph should serve that question.",
      },
      {
        type: "h2",
        text: "The 7-day workflow",
        id: "the-workflow",
      },
      {
        type: "timeline",
        steps: [
          "Day 1 — Map the territory",
          "Day 2 — Screen & save",
          "Day 3 — Read strategically",
          "Day 4 — Fill the matrix",
          "Day 5 — Find the themes",
          "Day 6 — Write the synthesis",
          "Day 7 — Edit & connect",
        ],
      },
      {
        type: "h2",
        text: "Days 1–2: search with a plan",
        id: "search-with-a-plan",
      },
      {
        type: "p",
        text: "Start from three to five recent, highly cited papers in your area. Read their introductions and references, and follow the citation trail both directions. Record every paper in your matrix as you find it — do not wait until you have fifty papers and no memory of why you saved them.",
      },
      {
        type: "callout",
        variant: "note",
        text: "Save papers with a keyword you understand ('sample: university students, 2023'). Future-you will thank present-you during Day 4.",
      },
      {
        type: "h2",
        text: "Days 3–5: read for the matrix, not for pleasure",
        id: "read-for-matrix",
      },
      {
        type: "p",
        text: "You do not need to read every paper cover to cover. For each source, extract five things: the research question, the method, the sample, the key finding, and one limitation. That is a matrix row. Ten strong rows beat forty vague memories.",
      },
      {
        type: "callout",
        variant: "example",
        text: "Matrix row example: Ahmed (2023) — survey, n=320 urban farmers — 'mobile advisory services improve yield but not adoption among older farmers' — limitation: self-reported data.",
      },
      {
        type: "h2",
        text: "Day 6: write themes, not summaries",
        id: "write-themes",
      },
      {
        type: "p",
        text: "Group your matrix rows into three to five themes, then write one synthesis paragraph per theme. The formula: state the theme, cite two or three studies that support or complicate it, and add your own observation about the pattern. A paragraph that only describes one paper is not synthesis.",
      },
      {
        type: "quote",
        text: "Never write 'Smith found X. Jones found Y.' Write 'Research on X is divided — Smith found one pattern while Jones found another, and this study tests which holds in the Bangladeshi context.'",
        source: "Edueyedia Literature Review Toolkit",
      },
      {
        type: "h2",
        text: "Day 7: connect to your gap",
        id: "connect-to-gap",
      },
      {
        type: "p",
        text: "The final paragraph of your literature review should do one job: land on the gap. 'While the literature has explored X and Y, no study has examined Z in [your setting] with [your method] — this thesis addresses that gap.' That single paragraph is what makes your whole chapter feel like an argument.",
      },
      {
        type: "callout",
        variant: "important",
        text: "If your review ends without a gap statement, it is still a summary. Rewrite the ending before you move on.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia Literature Review Toolkit & Matrix Template",
          "Ridley, D. — The Literature Review: A Step-by-Step Guide",
          "Jesson, J., Matheson, L., & Lacey, F. M. — Doing Your Literature Review",
        ],
      },
    ],
    relatedResources: [
      "literature-review-toolkit",
      "literature-review-matrix-template",
      "thesis-writing-blueprint",
    ],
  },
  {
    slug: "fully-funded-masters-europe-guide",
    title: "Fully Funded Master's in Europe: The Real Map",
    titleBn: "ইউরোপে ফুলি ফান্ডেড মাস্টার্স: বাস্তব মানচিত্র",
    category: "scholarships",
    categoryLabel: "Scholarships",
    author: "Edueyedia Scholarship Desk",
    authorRole: "Research & Applications Team",
    date: "February 5, 2026",
    readingTime: "10 min read",
    excerpt:
      "Erasmus Mundus, DAAD, Chevening and more — how these programs actually work, who wins them, and how to position yourself.",
    featured: true,
    cover: { tone: "gold", pattern: "nodes", glyph: "E" },
    keywords: [
      "fully funded",
      "europe",
      "master's",
      "erasmus",
      "daad",
      "স্কলারশিপ",
    ],
    blocks: [
      {
        type: "p",
        text: "Every year, hundreds of Bangladeshi students win fully funded places in Europe — and every year, thousands more assume it is not for them. The gap between those groups is not talent. It is information, timing and positioning.",
      },
      {
        type: "h2",
        text: "How 'fully funded' really works",
        id: "how-it-works",
      },
      {
        type: "p",
        text: "A fully funded scholarship usually covers tuition plus a monthly living allowance. But every program pays differently: Erasmus Mundus pays a scholarship per month, DAAD covers monthly stipends and travel, Chevening pays tuition plus living costs and flights. 'Fully funded' is not one thing — read the funding table of each program before you fall in love with it.",
      },
      {
        type: "callout",
        variant: "key",
        text: "Three numbers decide most applications: the application window, the number of awards per year, and the acceptance pattern for South Asian applicants. Learn these before writing a word.",
      },
      {
        type: "h2",
        text: "The programs that matter most",
        id: "programs-that-matter",
      },
      {
        type: "list",
        items: [
          "Erasmus Mundus — joint master's across 2–3 countries; strong for social sciences, sustainability, tech.",
          "DAAD EPOS — development-related programs in Germany; generous stipend; work experience often required.",
          "Chevening — leadership-focused master's in the UK; no age limit, but leadership evidence matters.",
          "Nordic scholarships — Norway, Sweden, Finland; program-specific, less centralised, fewer applicants.",
        ],
      },
      {
        type: "quote",
        text: "The most competitive programs are not the hardest to enter — they are the ones applicants understand least. Clarity is a competitive advantage.",
      },
      {
        type: "h2",
        text: "What winners actually do differently",
        id: "what-winners-do",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "They start 8–10 months early and reverse-engineer the deadline.",
          "They pick 4–6 programs with different difficulty profiles — not 20 similar ones.",
          "They build the application around evidence: projects, grades, responsibilities.",
          "They write the SOP from their own story, then edit it cold.",
          "They prepare documents — transcripts, references, language tests — before the window opens.",
        ],
      },
      {
        type: "callout",
        variant: "note",
        text: "Recommendation letters fail more applications than interviews do. Ask early, brief your referee clearly, and give them your CV plus a one-page summary of the program.",
      },
      {
        type: "h2",
        text: "Positioning: be specific, be local",
        id: "positioning",
      },
      {
        type: "p",
        text: "Selection committees read thousands of generic essays about 'passion for development'. The applications they remember are specific about a place and a problem — a district, a sector, a community they know. Your Bangladeshi context is not a disadvantage. It is your evidence base.",
      },
      {
        type: "callout",
        variant: "important",
        text: "If your SOP could be written by a student from any country, rewrite it. Anchor it in a problem you have actually seen.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia Scholarship Application Essentials (2026)",
          "Erasmus Mundus Programme Guide (2026)",
          "DAAD Scholarship Database — country page for Bangladesh",
        ],
      },
    ],
    relatedResources: [
      "fully-funded-scholarships-map-2026",
      "scholarship-application-essentials",
      "sop-writer-bangla",
    ],
  },
  {
    slug: "research-question-that-matters",
    title: "Write a Research Question That Actually Works",
    titleBn: "এমন একটি গবেষণা প্রশ্ন লিখুন যা সত্যিই কাজ করে",
    category: "research",
    categoryLabel: "Research",
    author: "Dr. Farhana Noor",
    authorRole: "Senior Research Fellow, Edueyedia Research Desk",
    date: "January 15, 2026",
    readingTime: "8 min read",
    excerpt:
      "Your research question is the engine of your thesis. Vague questions produce vague chapters — here is how to sharpen yours.",
    cover: { tone: "teal", pattern: "quote", glyph: "?" },
    keywords: ["research question", "গবেষণা প্রশ্ন", "proposal", "thesis"],
    blocks: [
      {
        type: "p",
        text: "A research question is the sentence your entire project is trying to answer. If that sentence is vague, every chapter will inherit the vagueness. Sharpening the question is the highest-leverage editing you will ever do.",
      },
      {
        type: "h2",
        text: "Descriptive, relational, or causal?",
        id: "three-types",
      },
      {
        type: "p",
        text: "Almost every research question is one of three types. Know which type you are asking before you design anything: descriptive questions map a situation ('What are the barriers?'), relational questions test connections ('Does X relate to Y?'), and causal questions test influence ('Does X cause Y?').",
      },
      {
        type: "callout",
        variant: "example",
        text: "Weak: 'How does social media affect students?' Strong: 'Does daily Reels usage predict self-reported attention difficulty among first-year university students in Dhaka?'",
      },
      {
        type: "h2",
        text: "The test of a good question",
        id: "test-of-good-question",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Can it be answered with evidence you can actually collect?",
          "Is it specific about population, setting and variables?",
          "Would the answer be useful to someone other than you?",
          "Can you complete it in your timeframe?",
        ],
      },
      {
        type: "callout",
        variant: "important",
        text: "If your question contains 'and' twice, it is two questions. Split it, and give each one its own chapter.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia Research Proposal Master Guide",
          "White, P. — Developing Research Questions",
        ],
      },
    ],
    relatedResources: [
      "research-proposal-master-guide",
      "research-topic-brainstormer",
      "methodology-matrix",
    ],
  },
  {
    slug: "apa-vs-mla-bangla-students",
    title: "APA vs MLA: What Bangladeshi Students Must Know",
    titleBn: "এপিএ বনাম এমএলএ: বাংলাদেশি শিক্ষার্থীদের যা জানতে হবে",
    category: "academic-writing",
    categoryLabel: "Academic Writing",
    author: "Tahmina Karim",
    authorRole: "Academic Editor, Edueyedia",
    date: "December 20, 2025",
    readingTime: "7 min read",
    excerpt:
      "Two citation systems, two sets of rules — and one mistake that costs marks in every department. Here is the difference, explained simply.",
    cover: { tone: "graphite", pattern: "lines", glyph: "¶" },
    keywords: ["apa", "mla", "citation", "সাইটেশন", "reference"],
    blocks: [
      {
        type: "p",
        text: "Your department chose a citation style for a reason — usually because that's what journals in your field use. But most students never learn why, so they mix styles and lose marks on formatting they could have fixed in an afternoon.",
      },
      {
        type: "h2",
        text: "APA: the social sciences default",
        id: "apa-default",
      },
      {
        type: "p",
        text: "APA (American Psychological Association) is used across psychology, education, business and most social sciences. Its signature is the author–date citation: (Noor, 2026). The date is emphasised because social science findings age — recency matters.",
      },
      {
        type: "h2",
        text: "MLA: the humanities default",
        id: "mla-default",
      },
      {
        type: "p",
        text: "MLA (Modern Language Association) dominates literature, languages and cultural studies. Its signature is the author–page citation: (Noor 12). The page number matters because humanities readers trace ideas to exact passages in primary texts.",
      },
      {
        type: "callout",
        variant: "key",
        text: "Quick memory aid: APA = who wrote it and when (recency). MLA = who wrote it and where (page). Choose what your department requires and stay consistent.",
      },
      {
        type: "h2",
        text: "The three mistakes that cost marks",
        id: "three-mistakes",
      },
      {
        type: "list",
        items: [
          "Mixing styles in one reference list — pick one and audit every entry.",
          "Missing page numbers for direct quotes in APA — always required.",
          "Formatting titles wrong: APA italics for standalone works; MLA quotes for articles and italics for books.",
        ],
      },
      {
        type: "callout",
        variant: "note",
        text: "When citing Bangla sources, keep the original title, add a transliteration in brackets, and follow the same punctuation as your chosen style. Our Citation Style Guide has 200+ worked examples.",
      },
      {
        type: "reference",
        items: [
          "APA Publication Manual (7th ed.)",
          "MLA Handbook (9th ed.)",
          "Edueyedia Citation Style Guide — Bangla edition",
        ],
      },
    ],
    relatedResources: [
      "citation-style-guide-bangla",
      "apa-quick-reference",
      "academic-writing-phrases-bangla",
    ],
  },
  {
    slug: "sop-mistakes-that-cost-scholarships",
    title: "7 SOP Mistakes That Cost Scholarships",
    titleBn: "৭টি এসওপি ভুল যা স্কলারশিপ খোয়ায়",
    category: "scholarships",
    categoryLabel: "Scholarships",
    author: "Edueyedia Scholarship Desk",
    authorRole: "Research & Applications Team",
    date: "December 8, 2025",
    readingTime: "9 min read",
    excerpt:
      "After reading hundreds of statements, our editors see the same seven errors again and again. Each one is fixable — here is how.",
    cover: { tone: "navy", pattern: "paper", glyph: "S" },
    keywords: ["sop", "statement of purpose", "এসওপি", "scholarship"],
    blocks: [
      {
        type: "p",
        text: "A statement of purpose is not a biography, a cover letter, or an essay about your childhood dream. It is an argument: here is what I have done, here is what I want to study, and here is exactly why your program fits. These seven mistakes break that argument.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Opening with your life story — committees want the field, not the cradle.",
          "Listing achievements instead of interpreting them.",
          "Copying phrases from templates (committees have read them all).",
          "Forgetting the 'why this program' section — the easiest marks to win.",
          "Apologising for grades or gaps instead of contextualising them.",
          "Writing in your second language without an edit pass in your first.",
          "Ending weakly — no forward vision, no tie-back to home.",
        ],
      },
      {
        type: "callout",
        variant: "key",
        text: "The strongest SOPs spend more space on the future than the past. Committees fund potential — show them what you will do with the degree.",
      },
      {
        type: "h2",
        text: "Fix it in three passes",
        id: "fix-in-three-passes",
      },
      {
        type: "p",
        text: "First pass: structure — does every paragraph serve the argument? Second pass: evidence — replace claims with specifics. Third pass: voice — read it aloud; if it doesn't sound like you, rewrite. Our SOP Masterclass walks through each pass with annotated real examples.",
      },
      {
        type: "callout",
        variant: "important",
        text: "Never use the same SOP for two programs without rewriting the 'why this program' section. Committees do compare.",
      },
      {
        type: "reference",
        items: [
          "Edueyedia SOP Writing Masterclass",
          "Commonwealth Scholarship Commission guidance (2026)",
        ],
      },
    ],
    relatedResources: [
      "sop-writer-bangla",
      "sop-outline-template",
      "scholarship-application-essentials",
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/* ---------------------------- scholarships --------------------------- */

export const scholarships: Scholarship[] = [
  {
    slug: "erasmus-mundus",
    country: "Europe (multiple)",
    region: "Europe",
    name: "Erasmus Mundus Joint Master's",
    degree: "Masters",
    funding: "Full tuition + monthly stipend",
    deadline: "Oct – Jan 2026",
    fullyFunded: true,
  },
  {
    slug: "daad-epos",
    country: "Germany",
    region: "Europe",
    name: "DAAD EPOS Development Scholarships",
    degree: "Masters",
    funding: "Full tuition + stipend + travel",
    deadline: "Jun – Aug 2026",
    fullyFunded: true,
  },
  {
    slug: "chevening",
    country: "United Kingdom",
    region: "Europe",
    name: "Chevening Scholarships",
    degree: "Masters",
    funding: "Full tuition + living + flights",
    deadline: "Nov 2026",
    fullyFunded: true,
  },
  {
    slug: "fulbright",
    country: "USA",
    region: "USA",
    name: "Fulbright Foreign Student Program",
    degree: "Masters",
    funding: "Full tuition + stipend + flights",
    deadline: "May – Oct 2026",
    fullyFunded: true,
  },
  {
    slug: "australia-awards",
    country: "Australia",
    region: "Australia",
    name: "Australia Awards Scholarships",
    degree: "Both",
    funding: "Full tuition + living + travel",
    deadline: "Apr 2026",
    fullyFunded: true,
  },
  {
    slug: "mext",
    country: "Japan",
    region: "Asia",
    name: "MEXT Scholarships",
    degree: "Both",
    funding: "Tuition + monthly allowance",
    deadline: "May – Jun 2026",
    fullyFunded: true,
  },
  {
    slug: "csc",
    country: "China",
    region: "Asia",
    name: "Chinese Government Scholarships",
    degree: "Both",
    funding: "Tuition + stipend + accommodation",
    deadline: "Dec 2025 – Mar 2026",
    fullyFunded: true,
  },
  {
    slug: "gates-cambridge",
    country: "United Kingdom",
    region: "Europe",
    name: "Gates Cambridge Scholarships",
    degree: "PhD",
    funding: "Full tuition + stipend + travel",
    deadline: "Oct 2026",
    fullyFunded: true,
  },
];

export const scholarshipRegions: Scholarship["region"][] = [
  "Europe",
  "Asia",
  "USA",
  "Australia",
];

export const scholarshipDegrees: Scholarship["degree"][] = [
  "Masters",
  "PhD",
  "Both",
];

/* --------------------------- resource finder ------------------------- */

export interface FinderOption {
  id: string;
  label: string;
  resourceSlugs: string[];
  articleSlugs: string[];
}

export const finderOptions: FinderOption[] = [
  {
    id: "research",
    label: "আমি গবেষণা শুরু করছি",
    resourceSlugs: [
      "research-topic-brainstormer",
      "research-proposal-master-guide",
      "literature-review-toolkit",
    ],
    articleSlugs: ["how-to-choose-a-research-topic", "literature-review-in-7-days"],
  },
  {
    id: "thesis",
    label: "আমি থিসিস লিখছি",
    resourceSlugs: [
      "thesis-planning-checklist",
      "thesis-writing-blueprint",
      "methodology-matrix",
    ],
    articleSlugs: ["literature-review-in-7-days", "research-question-that-matters"],
  },
  {
    id: "scholarship",
    label: "আমি স্কলারশিপ খুঁজছি",
    resourceSlugs: [
      "scholarship-deadline-tracker",
      "fully-funded-scholarships-map-2026",
      "scholarship-application-essentials",
    ],
    articleSlugs: ["fully-funded-masters-europe-guide", "sop-mistakes-that-cost-scholarships"],
  },
  {
    id: "abroad",
    label: "আমি বিদেশে পড়তে চাই",
    resourceSlugs: [
      "study-abroad-budget-planner",
      "study-abroad-starter-pack",
      "ielts-toefl-roadmap",
    ],
    articleSlugs: ["fully-funded-masters-europe-guide"],
  },
  {
    id: "sop",
    label: "আমি SOP/CV তৈরি করছি",
    resourceSlugs: ["sop-outline-template", "sop-writer-bangla", "cv-academic-bangla"],
    articleSlugs: ["sop-mistakes-that-cost-scholarships"],
  },
  {
    id: "career",
    label: "আমি ক্যারিয়ার উন্নত করতে চাই",
    resourceSlugs: ["career-transition-guide", "cv-academic-bangla"],
    articleSlugs: [],
  },
];

/* ------------------------- free library filters ---------------------- */

export const libraryFilters = [
  "Templates",
  "Checklists",
  "Research",
  "Scholarships",
  "Academic Writing",
] as const;

export const freeLibraryFilterFor = (slug: string): (typeof libraryFilters)[number] => {
  const r = getResource(slug);
  if (!r) return "Templates";
  if (r.slug.includes("checklist")) return "Checklists";
  if (r.category === "research") return "Research";
  if (r.category === "scholarships") return "Scholarships";
  return "Academic Writing";
};

/* ------------------------------ testimonials ------------------------- */

export const testimonials: Testimonial[] = [
  {
    name: "Nusrat Jahan",
    role: "MSc Student, University of Dhaka",
    resource: "Research Proposal Master Guide",
    text: "My supervisor approved my proposal on the second review. The annotated examples in Bangla made everything click — I finally understood what a research gap actually is.",
    verified: true,
  },
  {
    name: "Israt Zaman",
    role: "Chevening Scholar 2025",
    resource: "Scholarship Application Essentials",
    text: "The interview module is gold. I used the story framework in my panel interview and walked out calm. This was the only structured preparation I did.",
    verified: true,
  },
  {
    name: "Mehjabin Chowdhury",
    role: "MSc Student, KUET",
    resource: "Literature Review Toolkit",
    text: "I wrote my entire literature review in three weeks using the screening system. My supervisor thought I'd hired help.",
    verified: true,
  },
  {
    name: "Arif Hossain",
    role: "Admitted, TU Delft 2025",
    resource: "SOP Writing Masterclass",
    text: "The Bangla-to-English drafting method is genius. My SOP finally sounded like me — not a translated template.",
    verified: true,
  },
];

/* ------------------------------- trust ------------------------------- */

export const trustPoints = [
  {
    title: "বাংলায় তৈরি",
    en: "Made in Bangla",
    text: "Every guide is written in clear Bangla with English technical terms — built for how Bangladeshi students actually learn.",
  },
  {
    title: "Research-focused",
    en: "Research-focused",
    text: "Content is reviewed by researchers and educators, not generated from search results.",
  },
  {
    title: "Practical Resources",
    en: "Practical Resources",
    text: "Templates, checklists and matrices you can use the same day — not theory for theory's sake.",
  },
  {
    title: "Secure Digital Delivery",
    en: "Secure Digital Delivery",
    text: "Instant access from your library after purchase, on any device, forever.",
  },
  {
    title: "Regularly Updated",
    en: "Regularly Updated",
    text: "Scholarship deadlines and citation rules change — our resources are reviewed every cycle.",
  },
];

export const SECTION_NUMS = ["01", "02", "03", "04"] as const;
