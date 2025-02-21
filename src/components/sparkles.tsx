import { useId } from "react";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import clsx from "clsx";
import styles from "./sparkles.module.css";

/**
 * ==============   Types   ================
 */

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

const Sparkles = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
  ...props
}: ParticlesProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const controls = useAnimation();

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      });
    }
  };

  const generatedId = useId();

  return (
    <motion.div animate={controls} className={clsx(styles.sparkles, className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className={styles.particles}
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background || "transparent",
              },
            },
            fullScreen: {
              enable: false,
              zIndex: 1,
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: false,
                  mode: "repulse",
                },
              },
              modes: {
                // 마우스를 따라 파티클을 밀어내는 효과
                repulse: {
                  distance: 50,
                  duration: 0.2,
                },
              },
            },
            particles: {
              color: {
                value: particleColor || "#ffffff",
                animation: {
                  h: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0,
                  },
                  s: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0,
                  },
                  l: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0,
                  },
                },
              },
              groups: {},
              move: {
                enable: true,
                angle: {
                  offset: 0,
                  value: 360,
                },
                decay: 0,
                distance: {},
                direction: "none",
                center: {
                  x: window.innerWidth / 2, // 화면의 가로 중심
                  y: window.innerHeight / 2, // 화면의 세로 중심
                  mode: "precise",
                },
                gravity: {
                  enable: false,
                  acceleration: 9.81, // 중력 가속도 (기본 물리값과 동일)
                },
                outModes: {
                  default: "destroy",
                },
                random: true,
                size: false,
                speed: {
                  min: 0.01,
                  max: 0.1,
                },
                spin: {
                  enable: true,
                  acceleration: 0.05,
                },
              },
              zIndex: {
                value: { min: 0, max: 10 },
                opacityRate: 5,
                velocityRate: 5,
              },
              number: {
                density: {
                  enable: true,
                  width: 400,
                  height: 400,
                },
                limit: {
                  mode: "wait",
                  value: 0,
                },
                value: particleDensity || 120,
              },
              opacity: {
                value: {
                  min: 0.1,
                  max: 1,
                },
                animation: {
                  count: 0,
                  enable: true,
                  speed: speed || 4,
                  decay: 0,
                  delay: 0,
                  sync: false,
                  mode: "auto",
                  startValue: "random",
                  destroy: "none",
                },
              },
              reduceDuplicates: false,
              shadow: {
                enable: true,
                blur: 12,
                color: {
                  value: ["#ffffff66", "#00b9ff", "#fff5de"],
                },
                offset: {},
              },
              shape: {
                fill: true,
                close: true,
                type: ["square"],
                options: {},
              },
              size: {
                value: {
                  min: minSize || 1,
                  max: maxSize || 3,
                },
                animation: {
                  count: 0,
                  enable: true,
                  speed: 1,
                  decay: 0,
                  delay: 0,
                  sync: false,
                  mode: "auto",
                  startValue: "random",
                  destroy: "none",
                },
              },
            },
            detectRetina: true,
          }}
          {...props}
        />
      )}
    </motion.div>
  );
};

export default Sparkles;
