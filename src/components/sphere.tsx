import { forwardRef } from "react";
import { motion, MotionValue, useMotionTemplate } from "framer-motion";

import clsx from "clsx";
import styles from "./sphere.module.css";

import { Shimmer } from "~/components";
import type { WithMotionProps } from "~/types/motion";

/**
 * ==============   Types   ================
 */

type SphereProps = WithMotionProps<"div"> & {
  centerX: MotionValue<number>;
  centerY: MotionValue<number>;
};

const Sphere = forwardRef<HTMLDivElement, SphereProps>(
  ({ children, className, style, centerX, centerY, ...props }, ref) => {
    const sphereBg = useMotionTemplate`radial-gradient(circle at ${centerX}px ${centerY}px, 
    rgb(255, 255, 180) 20%, 
    rgba(255, 255, 150, 0.8) 40%, 
    rgba(255, 230, 120, 0.6) 60%, 
    rgba(255, 200, 80, 0.4) 75%, 
    rgba(200, 140, 50, 0.2) 90%, 
    rgba(150, 100, 30, 0) 100%),

  radial-gradient(circle at 40% 40%, 
    rgba(255, 255, 220, 0.7) 15%, 
    rgba(255, 255, 180, 0.5) 45%, 
    rgba(255, 220, 120, 0.3) 75%, 
    rgba(255, 200, 100, 0) 100%),

  radial-gradient(circle at 60% 70%, 
    rgba(120, 100, 60, 0.3) 15%, 
    rgba(100, 80, 40, 0.2) 50%, 
    rgba(80, 60, 30, 0.1) 80%, 
    rgba(60, 40, 20, 0) 100%)
  `;

    return (
      <motion.div
        ref={ref}
        className={clsx(className, styles.sphere)}
        style={{
          background: sphereBg,
          ...style,
        }}
        {...props}
      >
        <Shimmer {...{ centerX, centerY }} />
        {children}
      </motion.div>
    );
  }
);

export default Sphere;
