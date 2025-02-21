import { useEffect, useRef } from "react";

const useElementRect = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const elementRect = useRef(new WeakMap<Element, DOMRect>());

  useEffect(() => {
    if (!ref.current) return;

    const handleWindowResize = () => {
      if (ref.current) {
        elementRect.current.set(
          ref.current,
          ref.current.getBoundingClientRect()
        );
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        elementRect.current.set(
          entry.target,
          entry.target.getBoundingClientRect()
        );
      }

      // "ResizeObserver loop limit exceeded" 방지
      // 콜백 함수의 실행을 다음 애니메이션 프레임까지 연기
      requestAnimationFrame(() => {
        if (ref.current) resizeObserver.observe(ref.current);
      });
    });

    resizeObserver.observe(ref.current);

    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [ref]);

  return {
    get: () => {
      if (ref.current) return elementRect.current.get(ref.current);
    },
  };
};

export default useElementRect;
