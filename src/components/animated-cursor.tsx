import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, useSpring } from "framer-motion";

import { usePointerPosition } from "~/hooks";

import type { WithMotionProps } from "~/types/motion";

import clsx from "clsx";
import styles from "./animated-cursor.module.css";

/**
 * ==============   Types   ================
 */

type AnimatedCursorTypes = "default" | "text" | "button";

type AnimatedCursorProps = WithMotionProps<"div"> & {
  initial?: AnimatedCursorTypes;
  cursorSize?: number;
};

function hasButtonOrAnchorAncestor(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  if (element.tagName === "BUTTON" || element.tagName === "A") {
    return true;
  }

  if (element.ariaLabel) {
    return true;
  }

  return hasButtonOrAnchorAncestor(element.parentElement);
}

const spring = { damping: 20, stiffness: 300, mass: 0.5 };

const AnimatedCursor = ({
  className,
  cursorSize = 8,
  ...props
}: AnimatedCursorProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const { mouseX, mouseY } = usePointerPosition((pos) => {
    const isHovered =
      pos.target instanceof HTMLElement &&
      (pos.target.tagName === "BUTTON" ||
        pos.target.tagName === "A" ||
        (pos.target.ariaLabel && pos.target.ariaLabel.length > 0) ||
        hasButtonOrAnchorAncestor(pos.target.parentElement));

    setIsHovering(isHovered);
    smoothMouse.size.set(isHovered ? 60 : cursorSize);

    return {
      x: pos.clientX - (isHovered ? 60 : cursorSize) / 2,
      y: pos.clientY - (isHovered ? 60 : cursorSize) / 2,
    };
  });

  const smoothMouse = {
    x: useSpring(mouseX, spring),
    y: useSpring(mouseY, spring),
    size: useSpring(0, spring),
  };

  return createPortal(
    <div>
      <motion.div
        className={clsx(className, styles.cursor)}
        style={{
          width: smoothMouse.size,
          height: smoothMouse.size,
          top: smoothMouse.y,
          left: smoothMouse.x,
          mixBlendMode: isHovering ? "difference" : "unset",
        }}
        {...props}
      />
    </div>,
    document.body
  );
};

/**
 * ==============   Styles   ================
 */

export default AnimatedCursor;
