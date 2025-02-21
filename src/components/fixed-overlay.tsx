import clsx from "clsx";
import styles from "./fixed-overlay.module.css";

import { AnimatedCounter, TextDisperse } from "~/components";
import { useSize } from "~/hooks";

const meta = {
  logo: {
    classNames: clsx(styles.overlay, styles.lt, styles.kitz),
    value: "@kitz craft",
  },
  framer: {
    classNames: clsx(styles.overlay, styles.rt, styles.framer),
    url: "https://www.framer.com/",
    label: "Link to Framer",
  },
  screenSize: {
    classNames: clsx(styles.overlay, styles.lb, styles.pixels),
    lable: "Screen size in pixels",
  },
  copyright: {
    classNames: clsx(styles.overlay, styles.rb, styles.copyright),
    value: "© 2025 Ayoung Lim",
    label: "Copyright 2025 Ayoung Lim",
  },
} as const;

const FixedOverlay = () => {
  const { width, height, prevWidth = 0, prevHeight = 0 } = useSize(window);

  return (
    <>
      <TextDisperse className={meta.logo.classNames} spaceReplacer="*">
        {meta.logo.value}
      </TextDisperse>
      <a
        className={meta.framer.classNames}
        target="_blank"
        rel="noreferrer noopener"
        href={meta.framer.url}
        aria-label={meta.framer.label}
      />
      <div
        className={meta.screenSize.classNames}
        aria-label={meta.screenSize.lable}
      >
        <AnimatedCounter from={prevWidth} to={width} />
        x
        <AnimatedCounter from={prevHeight} to={height} />
      </div>
      <div
        className={meta.copyright.classNames}
        aria-label={meta.copyright.label}
      >
        {meta.copyright.value}
      </div>
    </>
  );
};

export default FixedOverlay;
