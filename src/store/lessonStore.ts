import { create } from 'zustand';
import type { LessonSession, SQLQuestion, JudgeResult, ConceptCard } from '../types';

interface LessonStore {
  session: LessonSession | null;
  result: JudgeResult | null;
  heartsAtStart: number;
  teachingCards: ConceptCard[];

  startLesson: (unitId: string, nodeId: string, questions: SQLQuestion[], teaching: ConceptCard[], hearts: number) => void;
  startQuiz: () => void;
  nextQuestion: () => SQLQuestion | null;
  setResult: (result: JudgeResult | null) => void;
  addCorrect: () => void;
  addXP: (xp: number) => void;
  completeSession: () => void;
  reset: () => void;
}

export const useLessonStore = create<LessonStore>()((set, get) => ({
  session: null,
  result: null,
  heartsAtStart: 5,
  teachingCards: [],

  startLesson: (unitId, nodeId, questions, teaching, hearts) => {
    set({
      session: {
        unitId,
        nodeId,
        questions,
        currentIndex: 0,
        correctCount: 0,
        totalCount: questions.length,
        earnedXP: 0,
        status: 'in_progress',
        startTime: new Date().toISOString(),
        phase: 'learn',
      },
      teachingCards: teaching,
      result: null,
      heartsAtStart: hearts,
    });
  },

  startQuiz: () => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        phase: 'quiz',
        currentIndex: 0,
        startTime: new Date().toISOString(),
      },
    });
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session) return null;

    if (session.currentIndex >= session.questions.length) {
      return null;
    }

    return session.questions[session.currentIndex];
  },

  setResult: (result) => {
    set({ result });
  },

  addCorrect: () => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        correctCount: session.correctCount + 1,
        currentIndex: session.currentIndex + 1,
      },
    });
  },

  addXP: (xp) => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        earnedXP: session.earnedXP + xp,
      },
    });
  },

  completeSession: () => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        status: 'completed' as const,
        phase: 'review' as const,
      },
    });
  },

  reset: () => {
    set({ session: null, result: null, teachingCards: [] });
  },
}));
