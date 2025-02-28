'use client';

import { cn } from '@/lib/utils';
import { motion, stagger, useAnimate, useInView } from 'framer-motion';
import { useEffect, useCallback } from 'react';

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // Split text into array of characters, preserving spaces
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(''),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  // Memoizing the animation function to prevent unnecessary re-renders
  const runAnimation = useCallback(() => {
    if (isInView) {
      animate(
        'span',
        {
          display: 'inline-block',
          opacity: 1,
          width: 'fit-content',
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: 'easeInOut',
        },
      );
    }
  }, [animate, isInView]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]); // Now the dependency array includes a stable function reference

  const renderWords = () => (
    <motion.div ref={scope} className="inline">
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          {word.text.map((char, index) => (
            <motion.span
              initial={{}}
              key={`char-${index}`}
              className={cn(
                'inline-block text-black opacity-0 dark:text-white',
                word.className,
              )}
            >
              {/* Render non-breaking space for spaces */}
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div
      className={cn(
        'text-center text-lg font-bold sm:text-2xl md:text-4xl lg:text-5xl',
        className,
      )}
    >
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className={cn(
          'inline-block h-4 w-[4px] rounded-sm bg-blue-500 md:h-6 lg:h-10',
          cursorClassName,
        )}
      ></motion.span>
    </div>
  );
};
