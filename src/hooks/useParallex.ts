import type { RefObject } from "react";
import { useTransform, useSpring } from "framer-motion";

import { useElementRect, usePointerPosition } from "~/hooks";

const useParallex = <T extends HTMLElement>(
  ref: RefObject<T>,
  damping: number,
  offset = 50
) => {
  const elementRect = useElementRect(ref);

  const { mouseX, mouseY } = usePointerPosition((pos) => {
    const rect = elementRect.get();

    if (rect) {
      const elementPositionX = rect.left + window.scrollX;
      const elementPositionY = rect.top + window.scrollY;
      const elementX = pos.pageX - elementPositionX;
      const elementY = pos.pageY - elementPositionY;

      return {
        x: elementX - rect.width / 2,
        y: elementY - rect.height / 2,
      };
    }

    return {
      x: pos.clientX,
      y: pos.clientY,
    };
  });

  const rotateX = useTransform(mouseY, (value) => {
    const rect = elementRect.get();
    const absMouseY = Math.abs(value);

    if (rect && absMouseY < rect.height / 2 + offset) {
      return -value / damping;
    }

    return 0;
  });

  const rotateY = useTransform(mouseX, (value) => {
    const rect = elementRect.get();
    const absMouseX = Math.abs(value);

    if (rect && absMouseX < rect.width / 2 + offset) {
      return value / damping;
    }

    return 0;
  });

  const smoothOptions = { damping: 20, stiffness: 100 };
  const smoothRotateX = useSpring(rotateX, smoothOptions);
  const smoothRotateY = useSpring(rotateY, smoothOptions);

  return {
    rotateX: smoothRotateX,
    rotateY: smoothRotateY,
  };
};

export default useParallex;
