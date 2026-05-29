// ========== 用户游戏状态 ==========

export interface LessonScore {
  correct: number;
  total: number;
  xp: number;
  completedAt: string;
}

export interface GameState {
  hearts: number;
  maxHearts: number;
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  lastLessonDate: string;       // 最后一次完成课程的日期 (YYYY-MM-DD)
  completedLessons: string[];
  lessonScores: Record<string, LessonScore>;
  lastHeartsRefill: string;
  heartsRefillStart: string | null;
}

// ========== SQL 题目 ==========

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SQLQuestion {
  id: string;
  unitId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  setupSQL: string;
  expectedSQL: string;
  expectedResult?: any[];
  tableSchema: string;
  hints: string[];
  explanation: string;
}

// ========== 教学内容 ==========

export interface ConceptCard {
  title: string;
  content: string;
  example?: string;
  highlight?: string;
}

// ========== 技能树 ==========

export interface SkillUnit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  nodes: SkillNode[];
}

export interface SkillNode {
  id: string;
  unitId: string;
  title: string;
  description: string;
  icon: string;
  prerequisites: string[];
  lessonIds: string[];
  status: 'locked' | 'unlocked' | 'completed';
  progress: number;
  teaching?: ConceptCard[];    // 教学卡片，先学后练
}

// ========== SQL 判题 ==========

export interface JudgeResult {
  pass: boolean;
  error?: string;
  userResult?: Record<string, any>[];
  expectedResult?: Record<string, any>[];
  userColumns?: string[];
  expectedColumns?: string[];
  detail: string;
  userTime?: number;
  expectedTime?: number;
}

// ========== 课程会话 ==========

export interface LessonSession {
  unitId: string;
  nodeId: string;
  questions: SQLQuestion[];
  currentIndex: number;
  correctCount: number;
  totalCount: number;
  earnedXP: number;
  status: 'in_progress' | 'completed';
  startTime: string;
  phase: 'learn' | 'quiz' | 'review';  // 教学阶段
}

// ========== 等级配置 ==========

export interface LevelConfig {
  level: number;
  xpRequired: number;
  title: string;
}

// ========== 游戏事件 ==========

export type GameEvent = {
  type: 'correct' | 'wrong' | 'level_up' | 'streak' | 'heart_lost' | 'heart_empty';
  message: string;
  xp?: number;
  timestamp: number;
};
