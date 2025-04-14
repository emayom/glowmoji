import { RefObject, useEffect, useState } from "react";

type Target = RefObject<HTMLElement> | Window | null;
type VoidFunc = () => void;

const isWindow = (ref: Target): ref is Window =>
  ref === window || ref === undefined;

const isNull = (ref: Target): ref is null => ref === null;

const handleElement = <T extends HTMLElement>(cb: VoidFunc, el: T) => {
  const update = () => cb();
  const observer = new ResizeObserver(update);
  observer.observe(el);
  return () => observer.disconnect();
};

const handleWindow = (cb: VoidFunc) => {
  const update = () => cb();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
};

const getSize = (ref: Target) => {
  if (isWindow(ref)) return [ref.innerWidth, ref.innerHeight];
  if (isNull(ref)) return [0, 0];
  if (ref.current) {
    const { width = 0, height = 0 } = ref.current.getBoundingClientRect();
    return [width, height];
  }
  return [0, 0];
};

const useSize = (ref: Target = window) => {
  const [initialWidth, initialHeight] = getSize(ref);

  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
    prevWidth: 0,
    prevHeight: 0,
  });

  useEffect(() => {
    if (!ref) return;

    const update = () => {
      const [newWidth, newHeight] = getSize(ref);

      setSize((prev) => ({
        width: newWidth,
        height: newHeight,
        prevWidth: prev.width,
        prevHeight: prev.height,
      }));
    };

    if (isWindow(ref)) return handleWindow(update);
    if (ref.current) return handleElement(update, ref.current);
  }, [ref]);

  return size;
};

export default useSize;
