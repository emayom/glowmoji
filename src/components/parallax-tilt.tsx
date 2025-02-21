import { motion, MotionValue } from "framer-motion";

import clsx from "clsx";
import styles from "./parallex-tilt.module.css";

import type { WithMotionProps } from "~/types/motion";

/**
 * ==============   Types   ================
 */

type ParallaxTiltProps = WithMotionProps<"div"> & {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  perspective?: number;
};

const ParallaxTilt = ({
  className,
  children,
  rotateX,
  rotateY,
  perspective = 1000,
  style,
  ...props
}: ParallaxTiltProps) => {
  return (
    <motion.div
      className={clsx(className, styles.parallex)}
      style={{
        rotateX,
        rotateY,
        ...style,
      }}
      transformTemplate={({ rotateX, rotateY }) => {
        return `perspective(${perspective}px) rotateX(${rotateX}) rotateY(${rotateY})`;
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxTilt;
