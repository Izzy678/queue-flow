"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  childClassName?: string;
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
  childClassName,
}: StaggerChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
                },
              }}
              className={cn(childClassName)}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
