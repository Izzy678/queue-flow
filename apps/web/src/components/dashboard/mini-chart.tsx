"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MiniChartProps {
  type?: "bar" | "line" | "area";
  className?: string;
  data?: number[];
  color?: string;
}

const defaultData = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];

export function MiniChart({
  type = "bar",
  className,
  data = defaultData,
  color = "#6366f1",
}: MiniChartProps) {
  const max = Math.max(...data);
  const width = 200;
  const height = 60;
  const barWidth = width / data.length - 2;

  if (type === "bar") {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={cn("w-full h-full", className)}
        preserveAspectRatio="none"
      >
        {data.map((value, i) => {
          const barHeight = (value / max) * height;
          return (
            <motion.rect
              key={i}
              x={i * (barWidth + 2)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={2}
              fill={color}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              style={{ transformOrigin: `${i * (barWidth + 2) + barWidth / 2}px ${height}px` }}
              opacity={0.6 + (value / max) * 0.4}
            />
          );
        })}
      </svg>
    );
  }

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full h-full", className)}
      preserveAspectRatio="none"
    >
      {type === "area" && (
        <motion.polygon
          points={areaPoints}
          fill={color}
          fillOpacity={0.15}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}
