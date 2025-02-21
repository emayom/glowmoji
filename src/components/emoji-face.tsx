import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useTransform, Variant } from "framer-motion";

import clsx from "clsx";
import styles from "./emoji-face.module.css";

import { useElementRect, usePointerPosition } from "~/hooks";
import type { WithMotionProps } from "~/types/motion";

/**
 * ==============   Types   ================
 */

type Faces = "default" | "astonished" | "hmm";

type EmojiFaceProps = WithMotionProps<"div"> & {
  distance: MotionValue<number>;
  positionX: MotionValue<number>;
  positionY: MotionValue<number>;
};

type FaceVariants = Partial<Record<Faces, Variant>>;

/**
 * ==============   Variants   ================
 */

const pupilSize = {
  default: 40,
  astonished: 48,
  hmm: 38,
};

const pupilVariants: FaceVariants = {
  default: {
    width: pupilSize.default,
    height: pupilSize.default,
    top: `calc((var(--white-size) / 2) - ${pupilSize.default}px)`,
    left: `calc((var(--white-size) / 2) - ${pupilSize.default}px / 2)`,
  },
  astonished: {
    width: pupilSize.astonished,
    height: pupilSize.astonished,
    top: `calc((var(--white-size) / 2) - ${pupilSize.astonished}px)`,
    left: `calc((var(--white-size) / 2) - ${pupilSize.astonished}px / 2)`,
  },
  hmm: {
    width: pupilSize.hmm,
    height: pupilSize.hmm,
    top: `calc((var(--white-size) / 2) - ${pupilSize.hmm}px)`,
    left: `calc((var(--white-size) / 2) - ${pupilSize.hmm}px / 2)`,
  },
};

const mouseVariants: FaceVariants = {
  default: {
    borderRadius: "60% / 5% 5% 100% 100%",
  },
  astonished: {
    height: 20,
  },
  hmm: {
    width: 40,
    height: 4,
    transform: "translateX(10px)",
  },
};

const transition = {
  duration: 0.5,
  delay: 0.2,
  ease: "easeOut",
  once: true,
};

const EmojiFace = ({
  className,
  distance,
  positionX,
  positionY,
  ...props
}: EmojiFaceProps) => {
  const lEyeRef = useRef<HTMLDivElement>(null);
  const rEyeRef = useRef<HTMLDivElement>(null);

  const lEyeRect = useElementRect(lEyeRef);
  const rEyeRect = useElementRect(rEyeRef);

  const [face, setFace] = useState<Faces>("default");

  const { mouseX, mouseY } = usePointerPosition();

  const calcAngle = (
    { x, y, width, height }: DOMRect,
    [mouseX, mouseY]: number[]
  ) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const deltaX = mouseX - centerX; // 마우스와 기준점 사이의 X 차이
    const deltaY = mouseY - centerY; // 마우스와 기준점 사이의 Y 차이

    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = ((angleRad * 180) / Math.PI + 90) % 360;

    return angleDeg;
  };

  const leftEyeAngle = useTransform<number, number>([mouseX, mouseY], (pos) => {
    const rect = lEyeRect.get();

    if (rect && mouseX && mouseY) {
      return calcAngle(rect, pos);
    }
    return 45;
  });

  const rightEyeAngle = useTransform<number, number>(
    [mouseX, mouseY],
    (pos) => {
      const rect = rEyeRect.get();

      if (rect && mouseX && mouseY) {
        return calcAngle(rect, pos);
      }
      return 45;
    }
  );

  const handleMouseMove = (crossVal: number) => {
    if (crossVal > 0) setFace("astonished");
    else {
      if (crossVal < -1) {
        setFace("hmm");
      } else {
        setFace("default");
      }
    }
  };

  useEffect(() => {
    distance.on("change", handleMouseMove);

    return () => {
      distance.destroy();
    };
  }, []);

  return (
    <motion.div
      data-face={face}
      className={clsx(className, styles.container)}
      style={{
        top: positionY,
        left: positionX,
      }}
      {...props}
    >
      {/* <div className={styles.eyelid} style={styleEyelid} /> */}
      <div className={styles.eyes}>
        {/**
         * ==============   Left Eye   ================
         */}
        <div className={styles.eye}>
          <div className={styles.eyelid} />
          <motion.div
            ref={lEyeRef}
            className={styles.white}
            style={{
              rotate: leftEyeAngle,
            }}
          >
            <motion.div
              className={styles.pupil}
              variants={pupilVariants}
              animate={face}
              transition={transition}
            />
          </motion.div>
        </div>

        {/**
         * ==============   Right Eye   ================
         */}
        <div className={styles.eye}>
          <div className={styles.eyelid} />
          <motion.div
            ref={rEyeRef}
            className={styles.white}
            style={{
              rotate: rightEyeAngle,
            }}
          >
            <motion.div
              className={styles.pupil}
              variants={pupilVariants}
              animate={face}
              transition={transition}
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        className={styles.mouth}
        variants={mouseVariants}
        animate={face}
        transition={transition}
      />
    </motion.div>
  );
};

export default EmojiFace;
