import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatCommas?: boolean;
  prefix?: string;
  suffix?: string;
  allowSubtleFluctuation?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  formatCommas = true,
  prefix = '',
  suffix = '',
  allowSubtleFluctuation = false,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const targetValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (targetValue - startValue) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
        setHasAnimated(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  // Subtle live simulation fluctuation once animated
  useEffect(() => {
    if (!allowSubtleFluctuation || !hasAnimated) return;

    const interval = setInterval(() => {
      // 50% chance of small delta (-1, 0, or +1)
      const delta = Math.floor(Math.random() * 3) - 1;
      setDisplayValue((prev) => Math.max(0, value + delta));
    }, 4000);

    return () => clearInterval(interval);
  }, [allowSubtleFluctuation, hasAnimated, value]);

  const formatted = formatCommas ? displayValue.toLocaleString() : displayValue.toString();

  return (
    <span ref={elementRef} className="tabular-nums font-mono">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
