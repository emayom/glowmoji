import { ComponentProps, ElementType } from "react";
import { MotionProps } from "framer-motion";

export type WithMotionProps<T extends ElementType> = ComponentProps<T> &
  MotionProps;
