import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SKILL_TREE, getNodeById } from '../data/skillTree';
import { useGameStore } from '../store/gameStore';
import { useLessonStore } from '../store/lessonStore';
import { getQuestionsByNodeId } from '../data/questions';
import Hearts from '../components/game/Hearts';
import XPBar from '../components/game/XPBar';
import type { SkillUnit, SkillNode } from '../types';

export default function SkillTree() {
  const navigate = useNavigate();
  const { hearts, maxHearts, xp, level, completedLessons, getLevelProgress } = useGameStore();
  const { startLesson } = useLessonStore();

  const [selectedUnit, setSelectedUnit] = useState(0);

  // All nodes unlocked, track completion status
  const updatedTree = SKILL_TREE.map((unit) => ({
    ...unit,
    nodes: unit.nodes.map((node) => {
      const allLessonsDone = node.lessonIds.every((id) => completedLessons.includes(id));

      return {
        ...node,
        status: allLessonsDone ? ('completed' as const) : ('unlocked' as const),
        progress: node.lessonIds.length > 0
          ? Math.round(
              (node.lessonIds.filter((id) => completedLessons.includes(id)).length /
                node.lessonIds.length) * 100
            )
          : 0,
      };
    }),
  }));

  const currentUnit = updatedTree[selectedUnit];
  const progress = getLevelProgress();

  const handleStartNode = (node: SkillNode) => {
    if (hearts <= 0) return;

    const questions = getQuestionsByNodeId(node.id);
    if (questions.length === 0) return;

    // Find the actual node from SKILL_TREE (with teaching content)
    const actualNode = getNodeById(node.id);
    const teaching = actualNode?.node.teaching || [];

    startLesson(currentUnit.id, node.id, questions, teaching, hearts);
    navigate(`/lesson/${node.id}`);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 sticky top-0 bg-white z-10 border-b border-duo-surface-dark">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/')}
            className="text-2xl cursor-pointer"
          >
            ←
          </button>
          <Hearts hearts={hearts} maxHearts={maxHearts} />
        </div>
        <h1 className="text-2xl font-extrabold text-duo-text">技能树</h1>
        <p className="text-sm text-duo-text-secondary mt-1">
          逐层解锁，从 SQL 基础到数据分析大师
        </p>
        <div className="mt-2">
          <XPBar xp={xp} level={level} progress={progress} />
        </div>
      </div>

      {/* Unit Tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto sticky top-[100px] bg-white z-10 border-b border-duo-surface-dark">
        {updatedTree.map((unit, i) => (
          <button
            key={unit.id}
            onClick={() => setSelectedUnit(i)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all
              ${selectedUnit === i
                ? 'bg-duo-green text-white shadow-[0_3px_0_#46A302]'
                : 'bg-duo-surface text-duo-text-secondary hover:bg-duo-surface-dark'
              }
              cursor-pointer
            `}
          >
            <span>{unit.icon}</span>
            <span className="text-sm">{unit.title}</span>
          </button>
        ))}
      </div>

      {/* Node List */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{currentUnit.icon}</span>
          <div>
            <h2 className="text-lg font-bold text-duo-text">{currentUnit.title}</h2>
            <p className="text-xs text-duo-text-secondary">{currentUnit.description}</p>
          </div>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-duo-surface-dark" />

          <div className="space-y-3 relative">
            {currentUnit.nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative pl-10"
              >
                {/* Node dot */}
                <div
                  className={`
                    absolute left-[10px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full border-2 z-10
                    flex items-center justify-center text-[10px]
                    ${node.status === 'completed'
                      ? 'bg-duo-green border-duo-green'
                      : node.status === 'unlocked'
                      ? 'bg-white border-duo-blue'
                      : 'bg-duo-surface-dark border-gray-300'
                    }
                  `}
                >
                  {node.status === 'completed' ? '✓' : ''}
                </div>

                {/* Node Card */}
                <button
                  onClick={() => handleStartNode(node)}
                  disabled={hearts <= 0}
                  className={`
                    w-full flex items-center gap-3 rounded-2xl p-4 text-left
                    border-2 transition-all cursor-pointer
                    ${node.status === 'completed'
                      ? 'bg-duo-green-light border-duo-green/30 opacity-80'
                      : 'bg-white border-duo-blue/30 hover:border-duo-blue hover:shadow-md'
                    }
                    ${hearts <= 0 ? 'cursor-not-allowed opacity-60' : ''}
                  `}
                >
                  <span className="text-2xl">{node.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-duo-text truncate">
                        {node.title}
                      </span>
                      {node.status === 'completed' && (
                        <span className="text-xs bg-duo-green text-white px-2 py-0.5 rounded-full">
                          已完成
                        </span>
                      )}](src/pages/SkillTree.tsx)
                    </div>
                    <p className="text-xs text-duo-text-secondary mt-0.5 truncate">
                      {node.description}
                    </p>
                    {node.status !== 'completed' && node.progress > 0 && (
                      <div className="mt-1.5 w-full h-1.5 bg-duo-surface-dark rounded-full overflow-hidden">
                        <div
                          className="h-full bg-duo-blue rounded-full transition-all"
                          style={{ width: `${node.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {node.status !== 'completed' && (
                    <span className="text-duo-blue font-bold text-sm">
                      {node.progress > 0 ? '继续 →' : '开始 →'}
                    </span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
