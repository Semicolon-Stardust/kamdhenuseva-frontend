'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dot',
        { scale: 0.8, opacity: 0.5 },
        {
          scale: 1.2,
          opacity: 1,
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
          duration: 0.6,
        },
      );
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={loaderRef}
      className="flex min-h-[50vh] items-center justify-center py-10"
    >
      <div className="flex space-x-2">
        <span className="dot bg-primary h-4 w-4 rounded-full"></span>
        <span className="dot bg-secondary h-4 w-4 rounded-full"></span>
        <span className="dot bg-primary h-4 w-4 rounded-full"></span>
      </div>
    </div>
  );
}
