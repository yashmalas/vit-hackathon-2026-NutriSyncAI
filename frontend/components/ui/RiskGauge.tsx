"use client";

import { motion } from "framer-motion";

interface RiskGaugeProps {
    label: string;
    percentage: number; // 0 to 100
    riskLevel: "Low" | "Moderate" | "High";
}

export function RiskGauge({ label, percentage, riskLevel }: RiskGaugeProps) {
    // Arc math (semi-circle)
    const radius = 60;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * Math.PI; // Half circle
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let color = "text-accent-secondary"; // Low
    let strokeColor = "#76ff03";
    if (riskLevel === "Moderate") {
        color = "text-accent-warm";
        strokeColor = "#ff9100";
    } else if (riskLevel === "High") {
        color = "text-accent-danger";
        strokeColor = "#ff1744";
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-40 h-24 overflow-hidden flex flex-col items-center justify-end pb-2">
                {/* Background Arc */}
                <svg className="absolute top-0 w-full h-full" viewBox="0 0 160 80">
                    <path
                        d={`M 10,80 A ${normalizedRadius},${normalizedRadius} 0 0,1 150,80`}
                        fill="transparent"
                        stroke="var(--color-bg-card)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Animated Foreground Arc */}
                    <motion.path
                        d={`M 10,80 A ${normalizedRadius},${normalizedRadius} 0 0,1 150,80`}
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0 0 5px ${strokeColor}50)` }}
                    />
                </svg>
                <span className={`text-2xl font-display font-bold ${color}`}>
                    {percentage}%
                </span>
            </div>

            <div className="text-center mt-2">
                <h4 className="font-display font-semibold text-primary mb-1">{label}</h4>
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm border ${color.replace('text-', 'border-')} ${color.replace('text-', 'bg-')}/10 ${color}`}>
                    {riskLevel} Risk
                </span>
            </div>
        </div>
    );
}
