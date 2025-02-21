import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

/**
 * ==============   Types   ================
 */
interface TransformFunction<T> {
  (pos: MouseEvent): { x: T; y: T };
  (pos: Touch): { x: T; y: T };
}

const usePointerPosition = (transformFunction?: TransformFunction<number>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const { x: newX, y: newY } = transformFunction?.(e) ?? {
        x: e.clientX,
        y: e.clientY,
      };

      mouseX.set(newX);
      mouseY.set(newY);
    };

    const updateTouchPosition = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const { x: newX, y: newY } = transformFunction?.(e.touches[0]) ?? {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };

        mouseX.set(newX);
        mouseY.set(newY);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("touchmove", updateTouchPosition, {
      passive: true, // 기본 동작(스크롤 등)을 막을 필요가 없음.
    });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("touchmove", updateTouchPosition);
    };
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
};

export default usePointerPosition;
