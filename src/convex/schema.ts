import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// ─── Roles ──────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  EDITOR: "editor",
  INSTRUCTOR: "instructor",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.STUDENT),
  v.literal(ROLES.EDITOR),
  v.literal(ROLES.INSTRUCTOR),
);
export type Role = Infer<typeof roleValidator>;

/** Shared content lifecycle status. */
export const contentStatusValidator = v.union(
  v.literal("draft"),
  v.literal("review"),
  v.literal("approved"),
  v.literal("published"),
  v.literal("archived"),
);

/** Education levels */
export const educationLevelValidator = v.union(
  v.literal("SSC"),
  v.literal("HSC"),
);
export type EducationLevel = Infer<typeof educationLevelValidator>;

/** Activity block type constants (used in code, not in schema). */
export const ACTIVITY_BLOCK_TYPES = [
  "warmup",
  "context",
  "reading",
  "vocabulary",
  "notice-language",
  "grammar",
  "examples",
  "guided-practice",
  "independent-practice",
  "reading-practice",
  "listening",
  "speaking",
  "writing",
  "exercise",
  "board-practice",
  "tutor",
  "quiz",
  "feedback",
  "mistake-review",
  "summary",
] as const;

/** Question type constants (used in code, not in schema). */
export const QUESTION_TYPES = [
  "mcq",
  "fill-blank",
  "short-text",
  "error-correction",
  "true-false",
] as const;

const schema = defineSchema(
  {
    // ── Auth ──────────────────────────────────────────────────────────
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),

      // Student profile fields
      educationLevel: v.optional(educationLevelValidator),
      className: v.optional(v.string()),
      session: v.optional(v.string()),
      preferredLanguage: v.optional(
        v.union(v.literal("en"), v.literal("bn"), v.literal("both")),
      ),
      selectedSubjects: v.optional(v.array(v.string())),
      targetExam: v.optional(v.string()),
      onboardingComplete: v.optional(v.boolean()),
    }).index("email", ["email"]),

    // ── Curriculum hierarchy ──────────────────────────────────────────

    subjects: defineTable({
      slug: v.string(),
      name: v.string(),
      nameBn: v.optional(v.string()),
      description: v.optional(v.string()),
      icon: v.optional(v.string()),
      position: v.number(),
      status: contentStatusValidator,
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("slug", ["slug"]),

    books: defineTable({
      slug: v.string(),
      subjectId: v.id("subjects"),
      educationLevel: educationLevelValidator,
      className: v.string(),
      title: v.string(),
      titleBn: v.optional(v.string()),
      description: v.optional(v.string()),
      position: v.number(),
      status: contentStatusValidator,
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("by_subject", ["subjectId", "educationLevel"]),

    units: defineTable({
      slug: v.string(),
      bookId: v.id("books"),
      title: v.string(),
      titleBn: v.optional(v.string()),
      description: v.optional(v.string()),
      position: v.number(),
      status: contentStatusValidator,
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("by_book", ["bookId", "position"]),

    lessons: defineTable({
      slug: v.string(),
      unitId: v.id("units"),
      bookId: v.id("books"),
      title: v.string(),
      titleBn: v.optional(v.string()),
      description: v.optional(v.string()),
      learningObjectives: v.array(v.string()),
      position: v.number(),
      isFree: v.boolean(),
      estimatedMinutes: v.optional(v.number()),
      status: contentStatusValidator,
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("by_unit", ["unitId", "position"])
      .index("by_book", ["bookId", "position"]),

    // ── Activity blocks within a lesson ───────────────────────────────

    lessonActivities: defineTable({
      lessonId: v.id("lessons"),
      blockType: v.string(),
      title: v.string(),
      titleBn: v.optional(v.string()),
      content: v.string(),
      position: v.number(),
      status: contentStatusValidator,
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("by_lesson", ["lessonId", "position"]),

    // ── Concepts & Learning Outcomes ──────────────────────────────────

    concepts: defineTable({
      slug: v.string(),
      name: v.string(),
      nameBn: v.optional(v.string()),
      description: v.optional(v.string()),
      subjectId: v.id("subjects"),
      parentId: v.optional(v.id("concepts")),
      status: contentStatusValidator,
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("by_subject", ["subjectId"]),

    learningOutcomes: defineTable({
      lessonId: v.id("lessons"),
      conceptId: v.id("concepts"),
      description: v.string(),
      descriptionBn: v.optional(v.string()),
      position: v.number(),
    }).index("by_lesson", ["lessonId"]),

    // ── Questions & Practice ──────────────────────────────────────────

    questions: defineTable({
      lessonId: v.optional(v.id("lessons")),
      conceptId: v.id("concepts"),
      activityBlockId: v.optional(v.id("lessonActivities")),
      questionType: v.string(),
      difficulty: v.number(),
      questionText: v.string(),
      questionTextBn: v.optional(v.string()),
      options: v.optional(v.array(v.string())),
      optionsBn: v.optional(v.array(v.string())),
      correctAnswer: v.string(),
      explanation: v.string(),
      explanationBn: v.optional(v.string()),
      hints: v.array(v.string()),
      hintsBn: v.optional(v.array(v.string())),
      sourceType: v.union(
        v.literal("nctb"),
        v.literal("board-question"),
        v.literal("ai-generated"),
        v.literal("editorial"),
      ),
      verificationStatus: v.union(
        v.literal("unverified"),
        v.literal("verified"),
        v.literal("rejected"),
      ),
      status: contentStatusValidator,
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_lesson", ["lessonId"])
      .index("by_concept", ["conceptId"])
      .index("by_source", ["sourceType", "verificationStatus"]),

    // ── Student Attempts ──────────────────────────────────────────────

    attempts: defineTable({
      studentId: v.id("users"),
      questionId: v.id("questions"),
      lessonId: v.id("lessons"),
      conceptId: v.id("concepts"),
      answer: v.string(),
      isCorrect: v.boolean(),
      hintsUsed: v.number(),
      attemptNumber: v.number(),
      timeSpentSeconds: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_student_lesson", ["studentId", "lessonId"])
      .index("by_student_concept", ["studentId", "conceptId"])
      .index("by_student_question", ["studentId", "questionId"]),

    // ── Progress & Mastery ────────────────────────────────────────────

    progress: defineTable({
      studentId: v.id("users"),
      lessonId: v.id("lessons"),
      completedActivities: v.array(v.id("lessonActivities")),
      totalActivities: v.number(),
      percentComplete: v.number(),
      lastAccessedAt: v.number(),
      completedAt: v.optional(v.number()),
    })
      .index("by_student_lesson", ["studentId", "lessonId"])
      .index("by_student", ["studentId", "lastAccessedAt"]),

    mastery: defineTable({
      studentId: v.id("users"),
      conceptId: v.id("concepts"),
      score: v.number(),
      totalAttempts: v.number(),
      correctAttempts: v.number(),
      lastAttemptAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_student_concept", ["studentId", "conceptId"])
      .index("by_student", ["studentId", "score"]),

    // ── Mistakes & Revision ───────────────────────────────────────────

    mistakes: defineTable({
      studentId: v.id("users"),
      questionId: v.id("questions"),
      conceptId: v.id("concepts"),
      lessonId: v.id("lessons"),
      lastWrongAnswer: v.string(),
      timesWrong: v.number(),
      timesCorrect: v.number(),
      mastered: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_student_lesson", ["studentId", "lessonId", "mastered"])
      .index("by_student_unmastered", ["studentId", "mastered"]),

    reviewSchedule: defineTable({
      studentId: v.id("users"),
      conceptId: v.id("concepts"),
      questionId: v.optional(v.id("questions")),
      nextReviewAt: v.number(),
      intervalDays: v.number(),
      easeFactor: v.number(),
      reviewCount: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_student_due", ["studentId", "nextReviewAt"])
      .index("by_student_concept", ["studentId", "conceptId"]),

    // ── Vocabulary ────────────────────────────────────────────────────

    vocabulary: defineTable({
      word: v.string(),
      definition: v.string(),
      definitionBn: v.optional(v.string()),
      exampleSentence: v.optional(v.string()),
      lessonId: v.optional(v.id("lessons")),
      subjectId: v.id("subjects"),
      partOfSpeech: v.optional(v.string()),
      audioUrl: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("by_lesson", ["lessonId"])
      .index("by_subject", ["subjectId"])
      .index("by_word", ["word"]),

    vocabularyMastery: defineTable({
      studentId: v.id("users"),
      vocabularyId: v.id("vocabulary"),
      timesCorrect: v.number(),
      timesWrong: v.number(),
      mastered: v.boolean(),
      lastReviewedAt: v.number(),
    })
      .index("by_student", ["studentId", "mastered"])
      .index("by_student_word", ["studentId", "vocabularyId"]),

    // ── Board Questions ───────────────────────────────────────────────

    boardExams: defineTable({
      educationLevel: educationLevelValidator,
      board: v.string(),
      year: v.number(),
      subject: v.string(),
      paper: v.optional(v.string()),
      status: contentStatusValidator,
      createdAt: v.number(),
    })
      .index("by_level_year", ["educationLevel", "year"])
      .index("by_subject", ["subject"]),

    boardQuestions: defineTable({
      examId: v.id("boardExams"),
      questionNumber: v.optional(v.string()),
      marks: v.optional(v.number()),
      questionType: v.string(),
      topic: v.optional(v.string()),
      conceptId: v.optional(v.id("concepts")),
      lessonId: v.optional(v.id("lessons")),
      questionText: v.string(),
      questionTextBn: v.optional(v.string()),
      options: v.optional(v.array(v.string())),
      verifiedAnswer: v.string(),
      verifiedAnswerBn: v.optional(v.string()),
      explanation: v.string(),
      explanationBn: v.optional(v.string()),
      sourceReference: v.optional(v.string()),
      verificationStatus: v.union(
        v.literal("unverified"),
        v.literal("verified"),
        v.literal("rejected"),
      ),
      status: contentStatusValidator,
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_exam", ["examId"])
      .index("by_concept", ["conceptId"])
      .index("by_lesson", ["lessonId"])
      .index("by_verification", ["verificationStatus"]),

    // ── Entitlements & Access ─────────────────────────────────────────

    entitlements: defineTable({
      studentId: v.id("users"),
      entityType: v.union(
        v.literal("lesson"),
        v.literal("book"),
        v.literal("subject"),
        v.literal("subscription"),
      ),
      entityId: v.string(),
      source: v.union(
        v.literal("free"),
        v.literal("purchase"),
        v.literal("subscription"),
        v.literal("admin-grant"),
      ),
      expiresAt: v.optional(v.number()),
      grantedBy: v.optional(v.id("users")),
      createdAt: v.number(),
    })
      .index("by_student", ["studentId", "entityType"])
      .index("by_student_entity", ["studentId", "entityType", "entityId"]),

    // ── AI Usage & Conversations ──────────────────────────────────────

    aiUsage: defineTable({
      studentId: v.id("users"),
      action: v.string(),
      lessonId: v.optional(v.id("lessons")),
      conceptId: v.optional(v.id("concepts")),
      tokensUsed: v.number(),
      createdAt: v.number(),
    }).index("by_student", ["studentId", "createdAt"]),

    aiConversations: defineTable({
      studentId: v.id("users"),
      lessonId: v.id("lessons"),
      messages: v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
          timestamp: v.number(),
        }),
      ),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("by_student_lesson", ["studentId", "lessonId"]),

    // ── Platform ──────────────────────────────────────────────────────

    auditLogs: defineTable({
      actorId: v.optional(v.id("users")),
      action: v.string(),
      entityType: v.string(),
      entityId: v.string(),
      details: v.optional(v.any()),
      createdAt: v.number(),
    }).index("by_created", ["createdAt"]),
  },
  {
    schemaValidation: true,
  },
);

export default schema;
