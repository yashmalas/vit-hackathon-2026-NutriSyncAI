"use client";

import { useState } from "react";
import {
    Flame,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    CheckCircle2,
    Clock,
    Users,
    Globe,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowCard } from "@/components/ui/GlowCard";
import { NutritionPills } from "@/components/ui/NutritionPills";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export interface Meal {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    instructions: string;
    time?: string;
}

interface MealCardProps {
    meal: Meal;
    type: string;
    index: number;
    onReplace?: (newMeal: Meal) => void;
}

export function MealCard({ meal, type, index, onReplace }: MealCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const [alternatives, setAlternatives] = useState<Meal[]>([]);

    const handleSwapClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSwapping(true);
        setAlternatives([]);

        try {
            const res = await api.post("/swap-meal", {
                meal_name: meal.name,
                target_calories: meal.calories,
                diet_type: "balanced"
            });
            setAlternatives(res.data.alternatives);
        } catch (error) {
            console.error("Failed to fetch alternatives", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <GlowCard className={cn(
                "group transition-all duration-300",
                isExpanded ? "ring-1 ring-accent-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]" : ""
            )}>
                <div
                    className="p-5 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">
                                    {type}
                                </span>
                            </div>
                            <h3 className="text-lg font-display font-bold text-primary group-hover:text-accent-primary transition-colors">
                                {meal.name}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full hover:bg-accent-primary/20 hover:text-accent-primary"
                                onClick={handleSwapClick}
                            >
                                <RefreshCw className={cn("w-4 h-4", isSwapping && !alternatives.length && "animate-spin")} />
                            </Button>
                            <div className="p-2 bg-surface rounded-full text-muted group-hover:text-primary transition-colors">
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-4 flex flex-wrap gap-4 items-center border-t border-border-glow/20 pt-4">
                        <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-accent-danger" />
                            <span className="text-sm font-mono font-bold text-primary">{meal.calories}</span>
                            <span className="text-[10px] text-muted uppercase font-mono tracking-tighter">kcal</span>
                        </div>
                        <NutritionPills
                            calories={meal.calories}
                            protein={meal.protein}
                            carbs={meal.carbs}
                            fat={meal.fat}
                            compact
                        />
                    </div>
                </div>

                {/* Alternatives Modal Overlay (Internal to card for simple logic) */}
                <AnimatePresence>
                    {isSwapping && alternatives.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 bg-base/95 p-4 flex flex-col justify-center gap-3 backdrop-blur-sm"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-sm font-display font-bold text-accent-primary flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> RE-ROUTE OPTIONS
                                </h4>
                                <Button variant="ghost" size="sm" onClick={() => setIsSwapping(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            {alternatives.map((alt, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        onReplace?.(alt);
                                        setIsSwapping(false);
                                    }}
                                    className="p-3 bg-surface border border-border-glow/30 rounded-xl text-left hover:border-accent-primary/50 transition-all flex justify-between items-center group/btn"
                                >
                                    <div>
                                        <div className="text-sm font-bold">{alt.name}</div>
                                        <div className="text-[10px] font-mono text-muted">{alt.calories} kcal · P: {alt.protein}g · C: {alt.carbs}g</div>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-accent-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Expanded Recipe */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-5 pt-0 border-t border-border-glow/20 space-y-6">
                                <div className="pt-5 grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted mb-3">Ingredients</h4>
                                        <ul className="space-y-2">
                                            {meal.ingredients.map((ing, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-primary/80">
                                                    <CheckCircle2 className="w-4 h-4 text-accent-secondary shrink-0 mt-0.5" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted mb-3">Preparation</h4>
                                        <p className="text-sm text-primary/70 leading-relaxed italic">
                                            "{meal.instructions}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-center border-t border-border-glow/10 pt-4 text-muted">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-mono">{meal.time || "15-20m"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs font-mono">1 Serving</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-xs font-mono">Planet Friendly</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlowCard>
        </motion.div>
    );
}

// Add simple X icon since I missed it
function X({ className, onClick }: { className?: string, onClick?: () => void }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            onClick={onClick}
        >
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    );
}
