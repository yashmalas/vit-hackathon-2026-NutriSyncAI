"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "nav";
    size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:opacity-50 disabled:pointer-events-none",
                    {
                        // Variants
                        "bg-accent-primary text-base rounded-full shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]": variant === "primary",
                        "bg-card border border-border-glow text-primary rounded-lg hover:border-accent-primary hover:bg-surface": variant === "secondary",
                        "bg-transparent hover:bg-surface text-primary rounded-lg border border-transparent": variant === "ghost",
                        "bg-accent-danger/10 text-accent-danger rounded-lg border border-accent-danger/20 hover:bg-accent-danger/20": variant === "danger",
                        "bg-transparent text-muted hover:text-primary rounded-lg hover:border-l-2 border-accent-primary": variant === "nav",
                        // Sizes
                        "h-9 px-4 text-sm": size === "sm",
                        "h-10 px-6 py-2": size === "md",
                        "h-12 px-8 text-lg rounded-full": size === "lg",
                        "h-10 w-10 p-2": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
