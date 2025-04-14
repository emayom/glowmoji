import { useEffect } from "react";
import {
  MotionStyle,
  AnimatePresence,
  useAnimate,
  useTransform,
} from "framer-motion";

import {
  EmojiFace,
  FixedOverlay,
  ParallaxTilt,
  PerspectiveGrid,
  Sparkles,
  Sphere,
} from "~/components";

import { useDistance, useParallex, usePointerPosition } from "~/hooks";

/**
 * ==============   Constants   ================
 */
const META = {
  foreground: { key: "front-layer", perspective: 800 },
  background: {
    key: "back-layer",
    perspective: 1000,
    sparkles: {
      speed: 1,
      minSize: 0.2,
      maxSize: 1.4,
      particleDensity: 100,
    },
  },
  grid: {
    rows: 40,
    columns: 40,
  },
};

/**
 * ==============   Styles   ================
 */
const sphereRotator = {
  position: "fixed",
  width: "max-content",
  height: "max-content",
  inset: 0,
  margin: "auto",
  zIndex: 9,
} satisfies MotionStyle;

function App() {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  // Parallax Scrolling
  const { rotateX: cardRX, rotateY: cardRY } = useParallex(scope, 15, 100);
  const { rotateX: gridRX, rotateY: gridRY } = useParallex(scope, 50);

  const distance = useDistance(scope);

  const { mouseX, mouseY } = usePointerPosition(
    ({ clientX, clientY, pageX, pageY }) => {
      if (scope.current) {
        const { scrollX, scrollY } = window;
        const { left, top } = scope.current.getBoundingClientRect();

        const elementPositionX = left + scrollX;
        const elementPositionY = top + scrollY;
        const elementX = pageX - elementPositionX;
        const elementY = pageY - elementPositionY;

        return {
          x: elementX,
          y: elementY,
        };
      }

      return { x: clientX, y: clientY };
    }
  );

  const centerX = useTransform(mouseX, [0, 300], [0, 300]);
  const centerY = useTransform(mouseY, [0, 300], [0, 300]);

  // 얼굴 표정 컴포넌트 X/Y 포지션
  const positionX = useTransform(mouseX, [0, 150, 300], [-20, 0, 10]);
  const positionY = useTransform(mouseY, [0, 150, 300], [-20, 0, 30]);

  useEffect(() => {
    const enterAnimation = async () => {
      await animate(
        scope.current,
        {
          opacity: [0, 1],
          width: [0, 300],
          height: [0, 300],
          x: ["100%", 0],
        },
        {
          type: "spring",
          ease: "circInOut",
          duration: 2,
        }
      );
    };

    enterAnimation();
  });

  return (
    <>
      <div className="container">
        <FixedOverlay />
        <AnimatePresence>
          {/**
           * ==============   Background   ================
           */}
          <ParallaxTilt
            id={META.background.key}
            key={META.background.key}
            perspective={META.background.perspective}
            rotateX={gridRX}
            rotateY={gridRY}
          >
            <Sparkles {...META.background.sparkles} />
            <PerspectiveGrid {...META.grid} />
          </ParallaxTilt>
          {/**
           * ==============   Foreground   ================
           */}
          <ParallaxTilt
            id="front-layer"
            key={META.foreground.key}
            perspective={META.foreground.perspective}
            rotateX={cardRX}
            rotateY={cardRY}
            style={{
              ...sphereRotator,
            }}
          >
            <Sphere key="emoji-sphere" ref={scope} {...{ centerX, centerY }}>
              <EmojiFace {...{ distance, positionX, positionY }} />
            </Sphere>
          </ParallaxTilt>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
