import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLessonStore } from '../store/lessonStore';
import { useGameStore } from '../store/gameStore';
import { getNodeById } from '../data/skillTree';
import { getQuestionsByNodeId } from '../data/questions';
import Hearts from '../components/game/Hearts';
import XPBar from '../components/game/XPBar';
import LevelUpModal from '../components/game/LevelUpModal';
import Button from '../components/ui/Button';
import type { ConceptCard } from '../types';

export default function Result() {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const { session, reset, teachingCards } = useLessonStore();
  const { hearts, maxHearts, xp, level, completeLesson, getLevelProgress } = useGameStore();

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);
  const [showReview, setShowReview] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const nodeInfo = nodeId ? getNodeById(nodeId) : null;
  const questions = nodeId ? getQuestionsByNodeId(nodeId) : [];

  const correctCount = session?.correctCount || 0;
  const totalCount = session?.totalCount || questions.length;
  const earnedXP = session?.earnedXP || 0;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const progress = getLevelProgress();

  // Check for level up
  useEffect(() => {
    if (level > prevLevel) {
      setShowLevelUp(true);
    }
    setPrevLevel(level);
  }, [level]);

  // Save lesson progress
  useEffect(() => {
    if (session?.status === 'completed' && nodeId) {
      const allQuestionIds = questions.map((q) => q.id);
      allQuestionIds.forEach((id) => {
        completeLesson(id, correctCount, totalCount, earnedXP);
      });
    }
  }, []);

  // Performance rating
  const getRating = () => {
    if (accuracy === 100) return { emoji: '🌟', text: '完美通关！', color: 'text-duo-gold' };
    if (accuracy >= 80) return { emoji: '💪', text: '表现优秀！', color: 'text-duo-green' };
    if (accuracy >= 60) return { emoji: '👍', text: '还不错，继续加油！', color: 'text-duo-blue' };
    return { emoji: '📚', text: '需要更多练习！', color: 'text-duo-orange' };
  };

  const rating = getRating();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <p className="text-duo-text-secondary mb-4">没有进行中的课程</p>
          <Button onClick={() => navigate('/skill-tree')}>返回技能树</Button>
        </div>
      </div>
    );
  }

  // Calculate progress per question difficulty
  const diffCounts = { easy: 0, medium: 0, hard: 0 };
  questions.forEach((q) => { diffCounts[q.difficulty]++; });

  // Review mode - show teaching cards
  if (showReview && teachingCards.length > 0) {
    const card = teachingCards[reviewIndex];
    return (
      <div className="min-h-screen bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setShowReview(false)} className="text-2xl cursor-pointer">← 返回</button>
          <span className="text-xs text-duo-text-secondary">{reviewIndex + 1} / {teachingCards.length}</span>
        </div>
        <div className="bg-white rounded-3xl border-2 border-duo-blue/20 p-5 mb-4">
          <div className="text-xs font-bold text-duo-blue mb-2 uppercase tracking-wider">知识点回顾</div>
          <h3 className="text-lg font-extrabold text-duo-text mb-3">{card.title}</h3>
          <p className="text-sm text-duo-text leading-relaxed whitespace-pre-line mb-4">{card.content}</p>
          {card.example && (
            <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-3 rounded-xl text-xs font-mono overflow-x-auto mb-3">{card.example}</pre>
          )}
          {card.highlight && (
            <div className="bg-duo-orange-light rounded-xl p-3 border border-duo-orange/20">
              <p className="text-sm font-medium">💡 {card.highlight}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {reviewIndex > 0 && (
            <Button variant="ghost" size="md" onClick={() => setReviewIndex(i => i - 1)}>← 上一个</Button>
          )}
          {reviewIndex < teachingCards.length - 1 ? (
            <Button variant="secondary" size="md" onClick={() => setReviewIndex(i => i + 1)}>下一个 →</Button>
          ) : (
            <Button variant="primary" size="md" onClick={() => setShowReview(false)}>完成回顾</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <LevelUpModal show={showLevelUp} level={level} onClose={() => setShowLevelUp(false)} />

      {/* Result Card */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="text-7xl mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
        </motion.div>
        <h1 className={`text-3xl font-extrabold mb-1 ${rating.color}`}>{rating.text}</h1>
        <p className="text-duo-text-secondary text-sm">
          {nodeInfo?.unit.title} — {nodeInfo?.node.title}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          className="bg-duo-surface rounded-2xl p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`text-3xl font-extrabold ${accuracy >= 80 ? 'text-duo-green' : accuracy >= 60 ? 'text-duo-blue' : 'text-duo-orange'}`}>
            {correctCount}/{totalCount}
          </div>
          <div className="text-xs text-duo-text-secondary mt-1">
            正确率 {accuracy}%
            {accuracy === 100 ? ' 🏆' : accuracy >= 80 ? ' ✅' : accuracy >= 60 ? ' 👍' : ' 📚'}
          </div>
        </motion.div>
        <motion.div
          className="bg-duo-surface rounded-2xl p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-3xl font-extrabold text-duo-blue">+{earnedXP}</div>
          <div className="text-xs text-duo-text-secondary mt-1">
            获得 XP
            {useGameStore.getState().streak >= 7 && ' 🔥 连击加成'}
          </div>
        </motion.div>
      </div>

      {/* Heart status */}
      <motion.div
        className="bg-duo-surface rounded-2xl p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm text-duo-text">剩余心形</span>
          <Hearts hearts={hearts} maxHearts={maxHearts} />
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <XPBar xp={xp} level={level} progress={progress} animated />
      </motion.div>

      {/* Difficulty breakdown */}
      <motion.div
        className="bg-duo-surface rounded-2xl p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="font-bold text-sm text-duo-text mb-3">题目难度分布</h3>
        <div className="space-y-2">
          {(['easy', 'medium', 'hard'] as const).map((diff) => {
            if (diffCounts[diff] === 0) return null;
            const labels = { easy: '🟢 简单', medium: '🟡 中等', hard: '🔴 困难' };
            return (
              <div key={diff} className="flex items-center justify-between text-sm">
                <span className="text-duo-text-secondary">{labels[diff]}</span>
                <span className="font-bold text-duo-text">{diffCounts[diff]} 题</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Teaching review button */}
      {teachingCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="mb-4"
        >
          <button
            onClick={() => setShowReview(true)}
            className="w-full flex items-center gap-3 bg-duo-blue-light border-2 border-duo-blue/20 rounded-2xl p-4 cursor-pointer hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">📖</span>
            <div className="text-left">
              <div className="font-bold text-sm text-duo-text">回顾知识点</div>
              <div className="text-xs text-duo-text-secondary">再看一遍教学卡片，巩固记忆</div>
            </div>
            <span className="ml-auto text-duo-blue">→</span>
          </button>
        </motion.div>
      )}

      {/* Level info */}
      <motion.div
        className="bg-gradient-to-r from-duo-green-light to-duo-green/5 rounded-2xl p-4 mb-6 border border-duo-green/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">⭐</span>
          <span className="font-bold text-sm text-duo-text">等级 {level} · 总经验 {xp} XP</span>
        </div>
        <p className="text-xs text-duo-text-secondary ml-7">
          每 200 XP 升一级，解锁更多挑战！
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Button variant="primary" size="lg" fullWidth onClick={() => { reset(); navigate('/skill-tree'); }}>
          🚀 继续闯关
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={() => navigate('/')}>
          返回首页
        </Button>
      </motion.div>
    </div>
  );
}
