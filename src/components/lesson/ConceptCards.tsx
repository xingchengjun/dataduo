import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConceptCard as ConceptCardType } from '../../types';
import Button from '../ui/Button';

interface ConceptCardsProps {
  cards: ConceptCardType[];
  onComplete: () => void;
}

export default function ConceptCards({ cards, onComplete }: ConceptCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);

  const card = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((i) => i + 1);
      setShowExample(false);
    }
  };

  return (
    <div className="px-4 pt-2 pb-6">
      {/* Progress */}
      <div className="w-full h-1.5 bg-duo-surface-dark rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full bg-duo-blue rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          {/* Card */}
          <div className="bg-white rounded-3xl border-2 border-duo-blue/20 p-6 mb-4 shadow-sm">
            {/* Icon */}
            <div className="w-12 h-12 bg-duo-blue-light rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">📖</span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-extrabold text-duo-text mb-3">{card.title}</h2>

            {/* Content */}
            <div className="text-sm text-duo-text leading-relaxed whitespace-pre-line mb-4">
              {card.content}
            </div>

            {/* Example (toggle) */}
            {card.example && (
              <div className="mb-2">
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="flex items-center gap-1.5 text-sm font-bold text-duo-blue cursor-pointer mb-2"
                >
                  <span>{showExample ? '▼' : '▶'}</span>
                  <span>{showExample ? '收起示例' : '查看示例'}</span>
                </button>
                <AnimatePresence>
                  {showExample && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-4 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto">
                        {card.example}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Highlight / Tip */}
          {card.highlight && (
            <div className="bg-duo-orange-light rounded-2xl p-4 mb-4 border border-duo-orange/20">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">💡</span>
                <p className="text-sm text-duo-text font-medium">{card.highlight}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex-1 text-xs text-duo-text-secondary font-medium">
          {currentIndex + 1} / {cards.length}
        </div>
        <Button variant="secondary" size="md" onClick={handleNext}>
          {isLast ? '开始做题 →' : '继续学习 →'}
        </Button>
      </div>
    </div>
  );
}
