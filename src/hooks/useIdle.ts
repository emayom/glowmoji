import { useEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";
import { throttle } from "lodash";

const useIdle = (ms = 1000 * 5) => {
  const isIdle = useMotionValue(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleTimeout = () => {
      isIdle.set(true);
    };

    const exitIdleState = () => {
      if (isIdle.get()) {
        isIdle.set(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(handleTimeout, ms);
      }
    };

    const handleEvents = throttle(exitIdleState, 3000, { trailing: true });

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvents();
      }
    };

    window.addEventListener("mousemove", handleEvents);
    window.addEventListener("mousedown", handleEvents);
    window.addEventListener("touchmove", handleEvents);
    window.addEventListener("resize", handleEvents);
    // window.addEventListener("keydown", handleEvents);
    window.addEventListener("touchstart", handleEvents);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    timeoutRef.current = setTimeout(handleTimeout, ms);

    return () => {
      window.removeEventListener("mousemove", handleEvents);
      window.removeEventListener("mousedown", handleEvents);
      window.addEventListener("touchmove", handleEvents);
      window.removeEventListener("resize", handleEvents);
      //   window.removeEventListener("keydown", handleEvents);
      window.removeEventListener("touchstart", handleEvents);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ms]);

  return isIdle;
};

export default useIdle;
