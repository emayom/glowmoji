import {
  motion,
  MotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";

import clsx from "clsx";
import styles from "./shimmer.module.css";

import type { WithMotionProps } from "~/types/motion";

/**
 * ==============   Types   ================
 */

type ShimmerProps = WithMotionProps<"div"> & {
  centerX: MotionValue<number>;
  centerY: MotionValue<number>;
  radius?: number;
  constraints?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
};

/**
 * ==============   Motion   ================
 */

const Shimmer = ({
  className,
  centerX,
  centerY,
  radius = 100,
}: ShimmerProps) => {
  const source = 0;
  const config = { damping: 20, stiffness: 100 };

  const smoothRadius = useSpring(source, config);
  const backgroundImage = useMotionTemplate`radial-gradient(
         ${smoothRadius}px at ${centerX}px ${centerY}px,
        var(--blue-1),
        transparent
    )`;

  return (
    <>
      <motion.div
        className={clsx(className, styles.shimmer)}
        style={{
          backgroundImage,
        }}
        onMouseEnter={() => {
          smoothRadius.set(radius);
        }}
      ></motion.div>
    </>
  );
};

export default Shimmer;
