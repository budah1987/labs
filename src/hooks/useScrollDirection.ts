"use client";

import { useEffect, useState, useRef, type RefObject } from "react";

interface ScrollDirectionResult {
  scrollDirection: "up" | "down" | null;
  isAtTop: boolean;
}

export function useScrollDirection(
  ref?: RefObject<HTMLElement | null>
): ScrollDirectionResult {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const target = ref?.current ?? window;
    const getScrollY = () =>
      ref?.current ? ref.current.scrollTop : window.scrollY;

    const update = () => {
      const currentY = getScrollY();
      const threshold = 10; // ignore tiny movements

      if (Math.abs(currentY - lastScrollY.current) < threshold) {
        ticking.current = false;
        return;
      }

      setScrollDirection(currentY > lastScrollY.current ? "down" : "up");
      setIsAtTop(currentY < threshold);
      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [ref]);

  return { scrollDirection, isAtTop };
}
