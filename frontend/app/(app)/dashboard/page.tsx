"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { MacroRing } from "@/components/ui/MacroRing";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart";
import { MacroDoughnutChart } from "@/components/charts/MacroDoughnutChart";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Activity, Heart, Droplets, Wind, Flame, Bell, AlertTriangle, X, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MealCard, Meal } from "@/components/ui/MealCard";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function DashboardPage() {
    const [showAlert, setShowAlert] = useState(true);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [nutrition, setNutrition] = useState<any>({
        calories: 1240,
        target_calories: 2100,
        protein: 82,
        target_protein: 120,
        carbs: 145,
        target_carbs: 200,
        fat: 34,
        target_fat: 60
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const profileRes = await api.get("/profile/me");
                setProfile(profileRes.data);

                // Fetch today's logs if any
                const today = new Date().toISOString().split('T')[0];
                const nutritionRes = await api.get(`/tracker/daily-nutrition?user_id=default&date=${today}`);
                if (nutritionRes.data && nutritionRes.data.calories > 0) {
                    // Blend with default targets for now
                    setNutrition((prev: any) => ({
                        ...prev,
                        calories: nutritionRes.data.calories,
                        protein: nutritionRes.data.protein,
                        carbs: nutritionRes.data.carbs,
                        fat: nutritionRes.data.fat
                    }));
                }
            } catch (error) {
                console.error("Dashboard sync error", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const TODAY_MEALS: Meal[] = [
        {
            name: "Oatmeal Bowl",
            calories: 320,
            protein: 15,
            carbs: 45,
            fat: 8,
            ingredients: ["Oats", " Almond Milk", "Berries", "Chia Seeds"],
            instructions: "Mix oats with milk, top with berries and seeds."
        },
        {
            name: "Grilled Chicken Salad",
            calories: 450,
            protein: 40,
            carbs: 25,
            fat: 18,
            ingredients: ["Chicken Breast", "Mixed Greens", " Olive Oil", "Tomatoes"],
            instructions: "Grill chicken, toss with fresh greens and dressing."
        }
    ];

    if (loading) return <div className="p-8 animate-pulse text-muted font-mono uppercase tracking-[0.3em]">CALIBRATING BIO-METRIC DASHBOARD...</div>;

    return (
        <div className="space-y-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold">Good morning, {profile?.name?.split(' ')[0] || 'Citizen'} 👋</h1>
                    <div className="flex items-center gap-2 text-sm text-muted mt-1 font-mono">
                        <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse shadow-[0_0_8px_rgba(118,255,3,0.8)]" />
                        Neural Node: {profile?.bio_id || 'OFFLINE'}
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="relative p-2 rounded-full bg-surface border border-border-glow hover:bg-card transition-colors">
                        <Bell className="w-5 h-5 text-primary" />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-accent-danger shadow-[0_0_5px_rgba(255,23,68,0.5)] border-2 border-surface" />
                    </button>
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface border border-border-glow text-xs font-mono">
                        <ShieldCheck className="w-4 h-4 text-accent-secondary" />
                        SYNCED
                    </div>
                </div>
            </div>

            {/* Alert Banner */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, scale: 0.95, height: 0 }}
                        className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-accent-warm/10 border border-accent-warm shadow-[0_0_15px_rgba(255,145,0,0.1)] text-accent-warm backdrop-blur-md"
                    >
                        <div className="flex items-start sm:items-center gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
                            <p className="text-sm font-medium">
                                Bio-link recommendation: Your protein intake is {((nutrition.protein / nutrition.target_protein) * 100).toFixed(0)}% of quota. Increase intake via the recommended snacks.
                            </p>
                        </div>
                        <button onClick={() => setShowAlert(false)} className="shrink-0 p-1 hover:bg-accent-warm/20 rounded-md transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vital Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <GlowCard className="p-4" glow>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider block mb-1">Heart Rate</span>
                    <div className="font-display text-2xl font-bold text-primary flex items-baseline gap-2">
                        <AnimatedCounter end={profile?.heart_rate || 77} /> <span className="text-xs text-muted font-sans font-normal">BPM</span>
                    </div>
                </GlowCard>

                <GlowCard className="p-4" glow>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider block mb-1">Blood Pressure</span>
                    <div className="font-display text-2xl font-bold text-primary tracking-wide">
                        120<span className="text-muted text-xl">/80</span>
                    </div>
                </GlowCard>

                <GlowCard className="p-4" glow>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider block mb-1">SpO2</span>
                    <div className="font-display text-2xl font-bold text-primary">
                        <AnimatedCounter end={98} suffix="%" />
                    </div>
                </GlowCard>

                <GlowCard className="p-4 relative overflow-hidden" glow>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider block mb-1">Day Energy</span>
                    <div className="font-display text-2xl font-bold text-accent-warm relative z-10 flex items-end gap-1">
                        <AnimatedCounter end={nutrition.calories} />
                        <span className="text-xs text-muted font-sans font-normal mb-1">/ {nutrition.target_calories} kcal</span>
                    </div>
                    <div className="w-full h-1 bg-surface mt-3 rounded-full overflow-hidden relative z-10">
                        <motion.div
                            className="h-full bg-accent-warm shadow-[0_0_5px_currentColor]"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((nutrition.calories / nutrition.target_calories) * 100, 100)}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    </div>
                </GlowCard>
            </div>

            {/* Row 2: Macro Synthesis */}
            <GlowCard className="py-6 border-border-glow/40">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-primary/80 mb-6 px-6">Daily Macro Synthesis</h2>
                <div className="flex flex-wrap sm:flex-nowrap justify-around items-center gap-6 px-4">
                    <MacroRing label="Protein" current={nutrition.protein} target={nutrition.target_protein} colorHex="#00e5ff" />
                    <div className="hidden sm:block w-px h-16 bg-border-glow/30" />
                    <MacroRing label="Carbs" current={nutrition.carbs} target={nutrition.target_carbs} colorHex="#76ff03" />
                    <div className="hidden sm:block w-px h-16 bg-border-glow/30" />
                    <MacroRing label="Fat" current={nutrition.fat} target={nutrition.target_fat} colorHex="#ff9100" />
                </div>
            </GlowCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlowCard className="lg:col-span-2 p-5 flex flex-col h-[350px]">
                    <h2 className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 flex items-center justify-between">
                        Energy Intake Trend
                        <span className="text-[10px] text-accent-primary bg-accent-primary/10 px-2 py-1 rounded-sm">7-DAY RANGE</span>
                    </h2>
                    <div className="flex-1 relative w-full">
                        <WeeklyTrendChart />
                    </div>
                </GlowCard>

                <GlowCard className="p-5 flex flex-col h-[350px]">
                    <h2 className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4">Macro Distribution</h2>
                    <div className="flex-1 relative flex items-center justify-center p-4">
                        <MacroDoughnutChart />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-muted font-mono uppercase tracking-widest">Synthesis</span>
                            <span className="font-display font-bold text-xl text-primary drop-shadow-md">{nutrition.protein + nutrition.carbs + nutrition.fat}g</span>
                        </div>
                    </div>
                </GlowCard>
            </div>

            {/* Meals Preview */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-display font-bold">Today's Protocol</h2>
                    <button className="text-sm text-accent-primary hover:text-accent-secondary transition-colors font-medium">
                        View Full Plan &rarr;
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TODAY_MEALS.map((meal, i) => (
                        <MealCard
                            key={meal.name}
                            meal={meal}
                            type={i === 0 ? "Breakfast" : "Lunch"}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
