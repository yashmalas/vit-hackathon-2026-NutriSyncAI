"use client";

import { motion } from "framer-motion";

interface MacroRingProps {
    label: string;
    current: number;
    target: number;
    colorHex: string;
}

export function MacroRing({ label, current, target, colorHex }: MacroRingProps) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min((current / target) * 100, 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative flex items-center justify-center w-24 h-24">
                {/* Background Track */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke="var(--color-bg-card)"
                        strokeWidth="6"
                        className="opacity-50"
                    />
                    {/* Animated Foreground Ring */}
                    <motion.circle
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke={colorHex}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                            filter: `drop-shadow(0 0 4px ${colorHex}50)`,
                        }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-mono font-bold">{current}g</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider">{label}</span>
                </div>
            </div>
            <span className="text-xs text-muted font-mono">{current} / {target}g</span>
        </div>
    );
}
