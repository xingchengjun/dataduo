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
    refillHearts,
    getLevelProgress,
  } = useGameStore();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    checkDailyLogin();
    refillHearts();
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
    <div className="min-h-screen bg-white px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6 md:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-lg md:text-2xl font-extrabold text-duo-green">DataDuo</h1>
          <p className="text-sm md:text-base text-duo-text-secondary">{greeting}</p>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge streak={streak} />
          <Hearts hearts={hearts} maxHearts={maxHearts} />
        </div>
      </motion.div>

      {/* Main Progress Card */}
      <motion.div
        className="bg-duo-surface rounded-3xl p-6 md:p-8 mb-4 md:mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-duo-text">等级 {level}</h2>
          <span className="text-sm md:text-base font-bold text-duo-green">{xp} XP</span>
        </div>
        <XPBar xp={xp} level={level} progress={progress} />

        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-duo-blue">{totalDone}</div>
            <div className="text-xs md:text-sm text-duo-text-secondary">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-duo-orange">{streak}</div>
            <div className="text-xs md:text-sm text-duo-text-secondary">连胜天数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-duo-purple">{level}</div>
            <div className="text-xs md:text-sm text-duo-text-secondary">当前等级</div>
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
            w-full bg-duo-green text-white font-extrabold text-lg md:text-xl
            py-4 md:py-5 rounded-2xl shadow-[0_6px_0_#46A302]
            btn-press hover:bg-duo-green-hover transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {hearts <= 0 ? '❤️‍🩹 心已用尽，稍后再来' : totalDone === 0 ? '🚀 开始闯关' : '📚 继续学习'}
        </button>
      </motion.div>

      {/* Heart recovery info */}
      {hearts < maxHearts && (
        <motion.div
          className="mt-4 p-4 bg-duo-orange-light rounded-2xl border border-duo-orange/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>❤️</span>
              <span className="text-sm md:text-base font-semibold text-duo-text">
                {hearts === 0 ? '心形已用尽' : `剩余 ${hearts}/${maxHearts} 心`}
              </span>
            </div>
            <span className="text-xs md:text-sm text-duo-text-secondary">
              {hearts < maxHearts ? '答对题目可恢复 ❤️' : ''}
            </span>
          </div>
        </motion.div>
      )}

      {/* Quick Actions - 桌面端两列 */}
      <motion.div
        className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate('/skill-tree')}
          className="flex items-center gap-3 bg-white border-2 border-duo-surface-dark rounded-2xl p-4 md:p-5 hover:bg-duo-surface transition-colors cursor-pointer"
        >
          <span className="text-2xl md:text-3xl">🌳</span>
          <div className="text-left">
            <div className="font-bold text-duo-text md:text-lg">技能树</div>
            <div className="text-xs md:text-sm text-duo-text-secondary">查看学习路径和进度</div>
          </div>
          <span className="ml-auto text-duo-text-secondary">→</span>
        </button>
        <button
          onClick={() => navigate('/skill-tree')}
          className="flex items-center gap-3 bg-white border-2 border-duo-surface-dark rounded-2xl p-4 md:p-5 hover:bg-duo-surface transition-colors cursor-pointer"
        >
          <span className="text-2xl md:text-3xl">📝</span>
          <div className="text-left">
            <div className="font-bold text-duo-text md:text-lg">快速刷题</div>
            <div className="text-xs md:text-sm text-duo-text-secondary">选择关卡开始练习</div>
          </div>
          <span className="ml-auto text-duo-text-secondary">→</span>
        </button>
      </motion.div>

      {/* Streak motivation */}
      {streak > 0 && (
        <motion.div
          className="mt-6 md:mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm md:text-base text-duo-text-secondary">
            {streak >= 7
              ? '🔥 你已经连续打卡一周了！保持住！'
              : streak >= 3
              ? `💪 连续打卡 ${streak} 天，习惯正在形成！`
              : '🌟 好的开始是成功的一半！'}
          </p>
        </motion.div>
      )}

      {/* Quest Info - 桌面端横向 */}
      <motion.div
        className="mt-6 md:mt-8 p-4 md:p-5 bg-duo-surface rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0">
          <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-1 text-sm">
            <span className="text-duo-text-secondary">📚 题库总量</span>
            <span className="font-bold text-duo-text md:text-lg">{totalQuestions} 道 SQL 题</span>
          </div>
          <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-1 text-sm md:border-x md:border-duo-surface-dark md:px-4">
            <span className="text-duo-text-secondary">🏆 已掌握</span>
            <span className="font-bold text-duo-green md:text-lg">{totalDone} 道</span>
          </div>
          <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-1 text-sm">
            <span className="text-duo-text-secondary">🎯 覆盖单元</span>
            <span className="font-bold text-duo-text md:text-lg">4 大主题</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
