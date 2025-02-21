import type { RefObject } from "react";
import { useTransform } from "framer-motion";

import { useElementRect, usePointerPosition } from "~/hooks";

const useDistance = <T extends HTMLElement>(ref: RefObject<T>) => {
  const elementRect = useElementRect(ref);

  const { mouseX, mouseY } = usePointerPosition();

  const distance = useTransform<number, number>(
    [mouseX, mouseY],
    ([newMouseX, newMouseY]) => {
      if (ref.current) {
        const rect = elementRect.get();

        if (rect) {
          const dx = newMouseX - (rect.left + rect.width / 2);
          const dy = newMouseY - (rect.top + rect.height / 2);
          const diagonal = Math.sqrt(dx * dx + dy * dy);
          const radius = Math.sqrt(
            (rect.width / 2) ** 2 + (rect.height / 2) ** 2
          );

          return 1 - diagonal / radius;
        }
      }
      return 0;
    }
  );

  return distance;
};

export default useDistance;
