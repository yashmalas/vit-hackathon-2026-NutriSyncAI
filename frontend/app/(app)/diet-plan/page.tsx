"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { MealCard, Meal } from "@/components/ui/MealCard";
import { Button } from "@/components/ui/Button";
import { Flame, Sunrise, Sun, Sunset, Moon, Sparkles, RefreshCw, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const FILTERS = ["All", "Veg Only", "High Protein", "Low Carb"];

interface DietPlan {
    daily_calories: number;
    macros: { protein: number; carbs: number; fat: number };
    meals: Record<string, Meal[]>;
    advice: string;
}

export default function DietPlanPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [plan, setPlan] = useState<DietPlan | null>(null);

    const fetchPlan = async () => {
        setIsRegenerating(true);
        try {
            // In a real app, we'd get these from the user's profile state
            const res = await api.post("/generate-diet-plan", {
                age: 25,
                weight: 70,
                height: 175,
                goal: "Muscle Gain",
                activity_level: "Moderate"
            });
            setPlan(res.data);
        } catch (error) {
            console.error("Failed to generate plan", error);
        } finally {
            setIsRegenerating(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, []);

    const categories = plan ? [
        { id: "Breakfast", icon: Sunrise, time: "7:00–9:00 AM", data: plan.meals.Breakfast || [] },
        { id: "Lunch", icon: Sun, time: "1:00–2:30 PM", data: plan.meals.Lunch || [] },
        { id: "Dinner", icon: Sunset, time: "7:30–9:00 PM", data: plan.meals.Dinner || [] },
        { id: "Snacks", icon: Moon, time: "Anytime", data: plan.meals.Snacks || [] },
    ] : [];

    return (
        <div className="space-y-8 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-glow/30 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                        <Flame className="w-8 h-8 text-accent-warm drop-shadow-[0_0_8px_rgba(255,145,0,0.5)]" />
                        Bio-Adaptive Diet Protocol
                    </h1>
                    <p className="text-sm text-muted mt-2 max-w-lg">
                        {plan?.advice || "Generating your personalized neural diet plan based on real-time bio-data..."}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                    <Button
                        variant="secondary"
                        onClick={fetchPlan}
                        disabled={isRegenerating}
                        className="w-full md:w-auto"
                    >
                        {isRegenerating ? (
                            <span className="flex items-center gap-2">
                                <Spinner /> Recalculating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-accent-primary" />
                                Regenerate Node Plan
                            </span>
                        )}
                    </Button>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors",
                                    activeFilter === f
                                        ? "bg-accent-primary text-base shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                                        : "bg-surface border border-border-glow/50 text-muted hover:text-primary hover:border-accent-primary/50"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isRegenerating ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-4">
                            <div className="h-8 w-48 bg-surface rounded-md" />
                            <div className="h-40 bg-surface rounded-xl border border-border-glow/20" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-8">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3 border-b border-border-glow/20 pb-2 px-1">
                                <div className="p-1.5 rounded-md bg-surface border border-border-glow/40">
                                    <cat.icon className="w-5 h-5 text-accent-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-semibold tracking-wide">{cat.id}</h3>
                                    <p className="text-xs text-muted font-mono">{cat.time}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {cat.data.length > 0 ? cat.data.map((meal, mealIdx) => (
                                    <MealCard
                                        key={mealIdx}
                                        meal={meal}
                                        type={cat.id}
                                        index={mealIdx}
                                        onReplace={(newMeal) => {
                                            if (!plan) return;
                                            const newMeals = { ...plan.meals };
                                            newMeals[cat.id][mealIdx] = newMeal;
                                            setPlan({ ...plan, meals: newMeals });
                                        }}
                                    />
                                )) : (
                                    <div className="p-8 border border-dashed border-border-glow/30 rounded-2xl flex flex-col items-center gap-2 text-muted">
                                        <p className="text-sm font-mono tracking-wider">No protocol segments found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Spinner() {
    return <div className="w-4 h-4 border-2 border-primary/20 border-t-accent-primary rounded-full animate-spin" />;
}
