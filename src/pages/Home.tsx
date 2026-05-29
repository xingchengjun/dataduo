import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import Hearts from '../components/game/Hearts';
import StreakBadge from '../components/game/StreakBadge';
import XPBar from '../components/game/XPBar';
import { getInitialNode } from '../data/skillTree';
import { SQL_QUESTIONS } from '../data/questions';

export default function Home() {
  const navigate = useNavigate();
  const {
    hearts,
    maxHearts,
    xp,
    level,
    streak,
    completedLessons,
    checkDailyLogin,
    getLevelProgress,
  } = useGameStore();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const isNewDay = checkDailyLogin();
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('夜深了，还在刷题吗？');
    else if (hour < 9) setGreeting('早上好！☀️');
    else if (hour < 12) setGreeting('上午好！开始今天的打卡吧');
    else if (hour < 14) setGreeting('中午好！');
    else if (hour < 18) setGreeting('下午好！继续加油 💪');
    else if (hour < 22) setGreeting('晚上好！弯道超车的时候到了');
    else setGreeting('还在刷题，真卷！🔥');
  }, []);

  const handleContinue = () => {
    const initial = getInitialNode();
    if (initial) {
      navigate(`/skill-tree`);
    }
  };

  const progress = getLevelProgress();
  const totalDone = completedLessons.length;
  const totalQuestions = SQL_QUESTIONS.length;

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-lg font-extrabold text-duo-green">DataDuo</h1>
          <p className="text-sm text-duo-text-secondary">{greeting}</p>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge streak={streak} />
          <Hearts hearts={hearts} maxHearts={maxHearts} />
        </div>
      </motion.div>

      {/* Main Progress Card */}
      <motion.div
        className="bg-duo-surface rounded-3xl p-6 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-duo-text">等级 {level}</h2>
          <span className="text-sm font-bold text-duo-green">{xp} XP</span>
        </div>
        <XPBar xp={xp} level={level} progress={progress} />

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-duo-blue">{totalDone}</div>
            <div className="text-xs text-duo-text-secondary">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-duo-orange">{streak}</div>
            <div className="text-xs text-duo-text-secondary">连胜天数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-duo-purple">{level}</div>
            <div className="text-xs text-duo-text-secondary">当前等级</div>
          </div>
        </div>
      </motion.div>

      {/* Start / Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={handleContinue}
          disabled={hearts <= 0}
          className="
            w-full bg-duo-green text-white font-extrabold text-lg
            py-4 rounded-2xl shadow-[0_6px_0_#46A302]
            btn-press hover:bg-duo-green-hover transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {hearts <= 0 ? '❤️‍🩹 心已用尽，稍后再来' : totalDone === 0 ? '🚀 开始闯关' : '📚 继续学习'}
        </button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="mt-4 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate('/skill-tree')}
          className="w-full flex items-center gap-3 bg-white border-2 border-duo-surface-dark rounded-2xl p-4 hover:bg-duo-surface transition-colors cursor-pointer"
        >
          <span className="text-2xl">🌳</span>
          <div className="text-left">
            <div className="font-bold text-duo-text">技能树</div>
            <div className="text-xs text-duo-text-secondary">查看学习路径和进度</div>
          </div>
          <span className="ml-auto text-duo-text-secondary">→</span>
        </button>
      </motion.div>

      {/* Streak motivation */}
      {streak > 0 && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-duo-text-secondary">
            {streak >= 7
              ? '🔥 你已经连续打卡一周了！保持住！'
              : streak >= 3
              ? `💪 连续打卡 ${streak} 天，习惯正在形成！`
              : '🌟 好的开始是成功的一半！'}
          </p>
        </motion.div>
      )}

      {/* Quest Info */}
      <motion.div
        className="mt-6 p-4 bg-duo-surface rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-duo-text-secondary">📚 题库总量</span>
          <span className="font-bold text-duo-text">{totalQuestions} 道 SQL 题</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-duo-text-secondary">🏆 已掌握</span>
          <span className="font-bold text-duo-green">{totalDone} 道</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-duo-text-secondary">🎯 覆盖单元</span>
          <span className="font-bold text-duo-text">4 大主题</span>
        </div>
      </motion.div>
    </div>
  );
}
