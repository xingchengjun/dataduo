import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonStore } from '../store/lessonStore';
import { useGameStore } from '../store/gameStore';
import { getQuestionsByNodeId } from '../data/questions';
import { getNodeById } from '../data/skillTree';
import { judgeSQL } from '../engine/sqlJudge';
import Hearts from '../components/game/Hearts';
import SQLEditor from '../components/lesson/SQLEditor';
import SQLResult from '../components/lesson/SQLResult';
import Hint from '../components/lesson/Hint';
import ConceptCards from '../components/lesson/ConceptCards';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { SQLQuestion } from '../types';

export default function Lesson() {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const {
    session, result, startLesson, startQuiz, setResult, addCorrect, addXP,
    completeSession, reset, teachingCards
  } = useLessonStore();
  const { hearts, maxHearts, loseHeart, awardXP } = useGameStore();

  const [userSQL, setUserSQL] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<SQLQuestion | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [initDone, setInitDone] = useState(false);

  // Initialize lesson
  useEffect(() => {
    if (!nodeId || initDone) return;

    if (!session || session.nodeId !== nodeId) {
      const questions = getQuestionsByNodeId(nodeId);
      if (questions.length === 0) {
        navigate('/skill-tree');
        return;
      }

      const nodeInfo = getNodeById(nodeId);
      const teaching = nodeInfo?.node.teaching || [];

      startLesson(
        nodeInfo?.unit.id || '',
        nodeId,
        questions,
        teaching,
        hearts
      );
      setInitDone(true);
    } else {
      setInitDone(true);
      if (session.phase === 'quiz' && session.currentIndex < session.questions.length) {
        setCurrentQuestion(session.questions[session.currentIndex]);
      } else if (session.phase === 'quiz' && session.currentIndex >= session.questions.length) {
        completeSession();
        navigate(`/result/${nodeId}`);
      }
    }
  }, [nodeId]);

  // When transitioning from learn to quiz, set first question
  useEffect(() => {
    if (session?.phase === 'quiz' && !currentQuestion && session.questions.length > 0) {
      setCurrentQuestion(session.questions[0]);
    }
  }, [session?.phase]);

  const handleRunSQL = useCallback(async () => {
    if (!currentQuestion || isRunning || hearts <= 0) return;

    setIsRunning(true);
    setShowFeedback(false);

    try {
      const judgeResult = await judgeSQL(
        currentQuestion.setupSQL,
        userSQL,
        currentQuestion.expectedSQL
      );

      setResult(judgeResult);

      if (judgeResult.pass) {
        setIsCorrect(true);
        setAnswered(true);

        const baseXP = { easy: 10, medium: 20, hard: 35 }[currentQuestion.difficulty] || 10;
        const streakBonus = useGameStore.getState().streak >= 3 ? Math.floor(baseXP * 0.3) : 0;
        const totalXP = baseXP + streakBonus;

        addXP(totalXP);
        setShowFeedback(true);

        // Delay before advancing so user sees the celebration
        setTimeout(() => {
          addCorrect();
        }, 1500);
      } else {
        setIsCorrect(false);
        setAnswered(true);
        setShowFeedback(true);

        const hasHearts = loseHeart();
        if (!hasHearts || useGameStore.getState().hearts <= 0) {
          setTimeout(() => setShowGameOver(true), 1000);
        }
      }
    } catch (err) {
      console.error('SQL judge error:', err);
    } finally {
      setIsRunning(false);
    }
  }, [currentQuestion, userSQL, isRunning, hearts]);

  // Auto-advance when correct
  useEffect(() => {
    if (isCorrect && !showFeedback) {
      const idx = session?.currentIndex ?? 0;
      const questions = session?.questions ?? [];
      if (idx < questions.length) {
        setCurrentQuestion(questions[idx]);
        setUserSQL('');
        setResult(null);
        setAnswered(false);
        setIsCorrect(false);
      } else {
        completeSession();
        navigate(`/result/${nodeId}`);
      }
    }
  }, [isCorrect, showFeedback]);

  const handleNext = () => {
    if (!session) return;
    const idx = session.currentIndex;
    if (idx >= session.questions.length) {
      completeSession();
      navigate(`/result/${nodeId}`);
    } else {
      setCurrentQuestion(session.questions[idx]);
      setUserSQL('');
      setResult(null);
      setAnswered(false);
      setIsCorrect(false);
      setShowFeedback(false);
    }
  };

  const handleLearnComplete = () => {
    startQuiz();
  };

  // Auto-advance to quiz if no teaching cards (MUST be before any conditional return)
  useEffect(() => {
    if (session?.phase === 'learn' && teachingCards.length === 0) {
      startQuiz();
    }
  }, [session?.phase, teachingCards.length]);

  // ---------- Loading state ----------
  if (!initDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-duo-text-secondary">加载课程中...</p>
        </div>
      </div>
    );
  }

  // ---------- Game over ----------
  if (showGameOver) {
    return (
      <div className="min-h-screen bg-white px-4 py-6 flex flex-col items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-extrabold text-duo-red mb-2">心已用尽</h2>
          <p className="text-duo-text-secondary mb-2">休息一下，心形会慢慢恢复的。</p>
          <p className="text-sm text-duo-text-secondary mb-6">30 分钟后恢复 1 颗心</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/skill-tree')}>
            返回技能树
          </Button>
        </motion.div>
      </div>
    );
  }

  // ========================================
  // PHASE 1: LEARN — 教学阶段
  // ========================================
  if (session?.phase === 'learn' && teachingCards.length > 0) {
    const nodeInfo = getNodeById(nodeId || '');
    return (
      <div className="min-h-screen bg-white pb-8">
        {/* Top Bar */}
        <div className="sticky top-0 bg-white z-10 border-b border-duo-surface-dark">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => navigate('/skill-tree')} className="text-2xl cursor-pointer">✕</button>
            <div className="text-center">
              <p className="font-bold text-sm text-duo-text">{nodeInfo?.node.title}</p>
              <p className="text-xs text-duo-text-secondary">先学习知识点，再做题巩固</p>
            </div>
            <Hearts hearts={hearts} maxHearts={maxHearts} size="sm" />
          </div>
        </div>

        <div className="pt-2">
          <ConceptCards cards={teachingCards} onComplete={handleLearnComplete} />
        </div>
      </div>
    );
  }

  // ---------- Loading state for quiz ----------
  if (!currentQuestion && session?.phase === 'quiz') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-duo-text-secondary">准备题目中...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-duo-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // PHASE 2: QUIZ — 答题阶段
  // ========================================
  const totalQuestions = session?.questions.length || 0;
  const answeredCount = session?.currentIndex || 0;
  const questionNumber = answeredCount + 1;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white z-10 border-b border-duo-surface-dark">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate('/skill-tree')} className="text-2xl cursor-pointer">✕</button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-duo-text-secondary font-medium bg-duo-surface px-2 py-1 rounded-lg">
                📝 答题
              </span>
              <Hearts hearts={hearts} maxHearts={maxHearts} />
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-duo-surface-dark rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-duo-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-duo-text-secondary">
              {currentQuestion.difficulty === 'easy' ? '🟢 简单' : currentQuestion.difficulty === 'medium' ? '🟡 中等' : '🔴 困难'}
            </span>
            <span className="text-xs font-bold text-duo-text-secondary">
              {questionNumber} / {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="px-4 pt-4">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Question Card */}
          <Card padding="lg" className="mb-4">
            <h2 className="text-lg font-extrabold text-duo-text mb-2">
              {currentQuestion.title}
            </h2>
            <p className="text-sm text-duo-text leading-relaxed mb-3">
              {currentQuestion.description}
            </p>
            {currentQuestion.tableSchema && (
              <div className="bg-duo-surface rounded-xl p-3 font-mono text-xs text-duo-text-secondary">
                <span className="font-bold text-duo-blue">表结构：</span>
                {currentQuestion.tableSchema}
              </div>
            )}
          </Card>

          {/* SQL Editor */}
          <div className="mb-4">
            <SQLEditor
              value={userSQL}
              onChange={setUserSQL}
              onSubmit={handleRunSQL}
              disabled={answered || hearts <= 0}
              loading={isRunning}
            />
          </div>

          {/* Hint */}
          {!answered && <Hint hints={currentQuestion.hints} />}

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4"
              >
                <SQLResult result={result} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Correct Answer Reveal */}
          {answered && !isCorrect && (
            <motion.div
              className="bg-duo-surface rounded-2xl p-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-bold text-sm text-duo-text mb-2">💡 参考答案</h4>
              <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-3 rounded-xl text-sm font-mono overflow-x-auto">
                {currentQuestion.expectedSQL}
              </pre>
              <p className="text-xs text-duo-text-secondary mt-2 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}

          {/* Next button */}
          {answered && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant={isCorrect ? 'primary' : 'ghost'}
                size="lg"
                fullWidth
                onClick={handleNext}
              >
                {session && session.currentIndex >= session.questions.length
                  ? '🎉 查看结果'
                  : isCorrect
                  ? '✅ 下一题 →'
                  : '跳过 →'}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
