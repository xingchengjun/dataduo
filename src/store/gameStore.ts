import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, LessonScore } from '../types';

const XP_PER_LEVEL = 200;
const MAX_HEARTS = 5;
const HEART_REFILL_INTERVAL = 30 * 60 * 1000; // 30 minutes per heart
const STREAK_BONUS_MULTIPLIER = 1.5;

function getTodayKey(): string {
  const d = new Date();
  return getDateKey(d);
}

function getDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface GameStore extends GameState {
  // Actions
  checkDailyLogin: () => boolean;
  awardXP: (baseXP: number) => { totalXP: number; leveledUp: boolean; newLevel: number };
  loseHeart: () => boolean;
  earnHeart: () => void;
  refillHearts: () => void;
  completeLesson: (lessonId: string, correct: number, total: number, xp: number) => void;
  getLevelProgress: () => number;
  getCurrentLevelXP: () => number;
  getXPForLevel: (level: number) => number;
  reset: () => void;
}

const initialState: GameState = {
  hearts: MAX_HEARTS,
  maxHearts: MAX_HEARTS,
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: '',
  lastLessonDate: '',
  completedLessons: [],
  lessonScores: {},
  lastHeartsRefill: new Date().toISOString(),
  heartsRefillStart: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      checkDailyLogin: () => {
        const today = getTodayKey();
        const { lastLoginDate } = get();

        if (lastLoginDate === today) {
          return false; // Already checked in today
        }

        set({
          lastLoginDate: today,
        });

        return true;
      },

      awardXP: (baseXP: number) => {
        const state = get();
        const streakMultiplier = state.streak >= 7 ? STREAK_BONUS_MULTIPLIER : 1;
        const streakBonus = state.streak >= 7 ? Math.floor(baseXP * 0.5) : 0;
        const totalXP = baseXP + streakBonus;

        const newXP = state.xp + totalXP;
        const xpForCurrentLevel = (state.level - 1) * XP_PER_LEVEL;
        const leveledUp = newXP >= state.level * XP_PER_LEVEL;
        const newLevel = leveledUp ? Math.floor(newXP / XP_PER_LEVEL) + 1 : state.level;

        set({
          xp: newXP,
          level: newLevel,
        });

        return {
          totalXP,
          leveledUp,
          newLevel,
        };
      },

      loseHeart: () => {
        const state = get();
        if (state.hearts <= 0) {
          return false;
        }

        const newHearts = state.hearts - 1;
        const updates: Partial<GameState> = { hearts: newHearts };

        if (newHearts === 0) {
          updates.heartsRefillStart = new Date().toISOString();
        }

        set(updates as GameState);
        return newHearts > 0;
      },

      earnHeart: () => {
        const state = get();
        if (state.hearts >= state.maxHearts) return;
        set({
          hearts: Math.min(state.hearts + 1, state.maxHearts),
          heartsRefillStart: state.hearts + 1 >= state.maxHearts ? null : state.heartsRefillStart,
        });
      },

      refillHearts: () => {
        const state = get();
        if (state.hearts >= state.maxHearts) return;

        if (state.hearts === 0 && state.heartsRefillStart) {
          const elapsed = Date.now() - new Date(state.heartsRefillStart).getTime();
          const refilled = Math.floor(elapsed / HEART_REFILL_INTERVAL);

          if (refilled >= state.maxHearts) {
            set({
              hearts: state.maxHearts,
              heartsRefillStart: null,
              lastHeartsRefill: new Date().toISOString(),
            });
          } else if (refilled > 0) {
            set({
              hearts: Math.min(state.hearts + refilled, state.maxHearts),
              heartsRefillStart: refilled >= state.maxHearts ? null : new Date(Date.now() - (elapsed % HEART_REFILL_INTERVAL)).toISOString(),
            });
          }
        } else {
          // Regular refill (shouldn't normally need this as we check on heartbeat)
          set({ hearts: state.maxHearts });
        }
      },

      completeLesson: (lessonId, correct, total, xp) => {
        const state = get();
        const existing = state.lessonScores[lessonId];

        const score: LessonScore = {
          correct: Math.max(existing?.correct ?? 0, correct),
          total: Math.max(existing?.total ?? 0, total),
          xp: Math.max(existing?.xp ?? 0, xp),
          completedAt: new Date().toISOString(),
        };

        // 连胜：只有在完成至少一题时才计算
        const today = getTodayKey();
        let newStreak = state.streak;

        if (state.lastLessonDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayKey = getDateKey(yesterday);

          if (state.lastLessonDate === yesterdayKey) {
            newStreak = state.streak + 1;
          } else {
            newStreak = 1;
          }
        }

        set({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
          lessonScores: { ...state.lessonScores, [lessonId]: score },
          streak: newStreak,
          lastLessonDate: today,
        });

        // Weekly streak milestone bonus
        if (newStreak > 0 && newStreak % 7 === 0) {
          get().awardXP(100);
        }

        get().awardXP(xp);
      },

      getLevelProgress: () => {
        const state = get();
        const xpInCurrentLevel = state.xp - (state.level - 1) * XP_PER_LEVEL;
        return xpInCurrentLevel / XP_PER_LEVEL;
      },

      getCurrentLevelXP: () => {
        const state = get();
        return state.xp - (state.level - 1) * XP_PER_LEVEL;
      },

      getXPForLevel: (level: number) => {
        return (level - 1) * XP_PER_LEVEL;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'dataduo-game-storage',
      version: 1,
    }
  )
);
