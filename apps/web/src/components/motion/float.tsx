"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FloatProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  y?: number;
}

export function Float({
  children,
  className,
  duration = 4,
  delay = 0,
  y = 10,
}: FloatProps) {
  return (
    <motion.div
      animate={{ y: [-y / 2, y / 2, -y / 2] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
