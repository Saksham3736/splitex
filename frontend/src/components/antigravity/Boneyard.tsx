"use client";
import { motion, HTMLMotionProps } from "framer-motion";

export const BoneyardHover = ({ children, className, ...props }: HTMLMotionProps<"div">) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2, transition: { type: "spring", stiffness: 400, damping: 25 } }}
    whileTap={{ scale: 0.98 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const BoneyardTransition = ({ children, className, ...props }: HTMLMotionProps<"div">) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);
