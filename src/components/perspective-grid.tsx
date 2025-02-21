import { ComponentProps } from "react";
import {
  ElementOrSelector,
  motion,
  useAnimate,
  useReducedMotion,
} from "framer-motion";

import clsx from "clsx";
import styles from "./perspective-grid.module.css";

import type { WithMotionProps } from "~/types/motion";

/**
 * ==============   Types   ================
 */

type PerspectiveGridProps = ComponentProps<"div"> & {
  readonly rows: number;
  readonly columns: number;
};

type GridCellProps = WithMotionProps<"div"> & {
  lineOpacity: number;
  rowEnd?: boolean;
  colEnd?: boolean;
};

const duration = 0.5;

const GridCell = ({
  className,
  lineOpacity,
  rowEnd,
  colEnd,
  ...props
}: GridCellProps) => {
  const [scope, animate] = useAnimate();
  const shouldReduceMotion = useReducedMotion();

  const pulse = (el: ElementOrSelector) => {
    if (shouldReduceMotion) return;
    if (el instanceof HTMLElement && el?.dataset.gridTile) {
      animate(
        el,
        {
          opacity: 1,
        },
        {
          duration,
          onComplete() {
            animate(el, { opacity: 0 }, { duration });
          },
        }
      );
    }
  };

  const handlePointerMove = () => pulse(scope.current);

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.touches.length; i++) {
      const { pageX, pageY } = e.touches[i];
      const element = document.elementFromPoint(pageX, pageY);

      if (element) pulse(element);
    }
  };

  return (
    <motion.div
      className={clsx(
        className,
        styles["grid-col"],
        rowEnd && styles["grid-row-end"],
        colEnd && styles["grid-col-end"]
      )}
      style={{
        opacity: lineOpacity,
      }}
      {...props}
    >
      <motion.div
        data-grid-tile
        ref={scope}
        className={styles.tile}
        onPointerMove={handlePointerMove}
        onTouchMove={handleTouchMove}
      />
    </motion.div>
  );
};

const PerspectiveGrid = ({
  className,
  children,
  rows,
  columns,
  ...props
}: PerspectiveGridProps) => {
  return (
    <div
      className={clsx(className, styles.grid)}
      style={{
        gridTemplate: `repeat(${columns}, 1fr) / repeat(${rows}, 1fr)`,
      }}
      {...props}
    >
      {Array.from({ length: rows * columns }, (_, index) => {
        const _1BasedIndex = index + 1;
        const row = Math.ceil(_1BasedIndex / rows);
        const col = _1BasedIndex % columns;
        const opacity = row / (rows + 1);

        return (
          <GridCell
            key={`grid-cell-${row}/${col}`}
            lineOpacity={opacity}
            rowEnd={row === rows}
            colEnd={_1BasedIndex % columns === 0}
          />
        );
      })}
      {children}
    </div>
  );
};

export default PerspectiveGrid;
