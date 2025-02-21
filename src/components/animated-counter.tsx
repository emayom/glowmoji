import { ComponentProps } from "react";
import {
  useInView,
  useAnimate,
  useReducedMotion,
  useIsomorphicLayoutEffect,
  KeyframeOptions,
} from "framer-motion";

/**
 * ==============   Types   ================
 */

type AnimatedCounterProps = ComponentProps<"span"> & {
  from: number;
  to: number;
  animationOptions?: KeyframeOptions;
};

const AnimatedCounter = ({
  from,
  to,
  animationOptions,
  ...props
}: AnimatedCounterProps) => {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true });
  const shouldReduceMotion = useReducedMotion();

  // Client-side에서는 useLayoutEffect 방식을 쓰고, Server-side에서는 useEffect 방식을 쓰도록
  useIsomorphicLayoutEffect(() => {
    const element = scope.current;

    if (!element) return;
    if (!inView) return;

    element.textContent = String(from);

    if (shouldReduceMotion) {
      element.textContent = String(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 0.5,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = value.toFixed(0);
      },
    });

    return () => controls.stop();
  }, [scope, inView, from, to]);

  return <span ref={scope} {...props} />;
};

export default AnimatedCounter;
