"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    let baseClass = "px-6 py-2 rounded-lg font-medium tracking-wide transition-colors flex items-center justify-center ";
    if (variant === "primary") {
      baseClass += "bg-[#C9BFFF] text-[#040F0F] hover:bg-[#C2FCF7] hover:shadow-[0_0_15px_#C2FCF7] ";
    } else if (variant === "secondary") {
      baseClass += "border border-[#C2FCF7] text-[#0f172a] dark:text-[#C2FCF7] hover:bg-[#C2FCF7]/10 hover:shadow-[0_0_15px_rgba(194,252,247,0.3)] ";
    } else if (variant === "ghost") {
      baseClass += "bg-transparent text-[#475569] dark:text-[#85BDBF] hover:text-[#0f172a] dark:text-[#C2FCF7] hover:drop-shadow-[0_0_8px_#C2FCF7] ";
    } else if (variant === "danger") {
      baseClass += "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] ";
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400 } }}
        whileTap={{ scale: 0.95 }}
        className={baseClass + (className || "")}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
