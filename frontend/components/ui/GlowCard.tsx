"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface GlowCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> {
    glow?: boolean;
}

export const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
    ({ className, children, glow = false, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "glass-panel rounded-2xl p-6 transition-all duration-300",
                    glow && "hover:glow-shadow hover:border-accent-primary/50",
                    className
                )}
                whileHover={glow ? { scale: 1.02 } : undefined}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
GlowCard.displayName = "GlowCard";
