import { useState } from "react";
import { motion } from "framer-motion";

import clsx from "clsx";
import styles from "./text-disperse.module.css";

import type { WithMotionProps } from "~/types/motion";

/**
 * ==============   Constants   ================
 */

const transforms = [
  {
    x: -0.8,
    y: -0.6,
    rotationZ: -29,
  },
  {
    x: -0.2,
    y: -0.4,
    rotationZ: -6,
  },
  {
    x: -0.05,
    y: 0.1,
    rotationZ: 12,
  },
  {
    x: -0.05,
    y: -0.1,
    rotationZ: -9,
  },
  {
    x: -0.1,
    y: 0.55,
    rotationZ: 3,
  },
  {
    x: 0,
    y: -0.1,
    rotationZ: 9,
  },
  {
    x: 0,
    y: 0.15,
    rotationZ: -12,
  },
  {
    x: 0,
    y: 0.15,
    rotationZ: -17,
  },
  {
    x: 0,
    y: -0.65,
    rotationZ: 9,
  },
  {
    x: 0.1,
    y: 0.4,
    rotationZ: 12,
  },
  {
    x: 0,
    y: -0.15,
    rotationZ: -9,
  },
  {
    x: 0.2,
    y: 0.15,
    rotationZ: 12,
  },
  {
    x: 0.8,
    y: 0.6,
    rotationZ: 20,
  },
] as const;

export const variants = {
  default: {
    x: 0,
    y: 0,
    rotateZ: 0,
    zIndex: 0,
    transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
  },
  disperse: (i: number) => {
    const { x, y, rotationZ } = transforms[i % transforms.length];
    return {
      x: x + "rem",
      y: y + "rem",
      rotateZ: rotationZ,
      zIndex: 1,
      transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
    };
  },
};

/**
 * ==============   Types   ================
 */

type TextDisperseProps = Omit<WithMotionProps<"div">, "children"> & {
  children: string;
  uppercase?: boolean;
  spaceReplacer?: string;
};

const TextDisperse = ({
  className,
  children,
  uppercase = false,
  spaceReplacer,
  ...props
}: TextDisperseProps) => {
  const [isAnimated, setIsAnimated] = useState(false);

  const handleMouseEnter = () => {
    setIsAnimated(true);
  };

  const handleMouseLeave = () => {
    setIsAnimated(false);
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        className,
        styles.container,
        uppercase && styles.uppercase
      )}
      aria-label={children}
      {...props}
    >
      {Array.from(children).map((char, i) => {
        const str = char === " " && spaceReplacer ? spaceReplacer : char;

        return (
          <motion.span
            key={char + i}
            custom={i}
            variants={variants}
            animate={isAnimated ? "disperse" : "default"}
            className={styles.dipserse}
            data-content={str}
            aria-label={char}
          >
            {str}
          </motion.span>
        );
      })}
    </motion.div>
  );
};
export default TextDisperse;
