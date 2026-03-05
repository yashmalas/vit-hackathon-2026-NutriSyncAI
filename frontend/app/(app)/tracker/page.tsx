"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { NutritionPills } from "@/components/ui/NutritionPills";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart"; // reusing for now
import { FileClock, Plus, Trash2, Camera, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function TrackerPage() {
    const [activeType, setActiveType] = useState("Breakfast");
    const [foodQuery, setFoodQuery] = useState("");
    const [qty, setQty] = useState(1);
    const [unit, setUnit] = useState("Serving");

    const [logs, setLogs] = useState([
        { id: 1, type: "Breakfast", name: "Oatmeal Bowl", cal: 320, pro: 15, carb: 45, fat: 8, time: "08:30 AM" },
        { id: 2, type: "Snack", name: "Apple", cal: 95, pro: 0.5, carb: 25, fat: 0.3, time: "11:15 AM" }
    ]);

    const removeLog = (id: number) => {
        setLogs(logs.filter(l => l.id !== id));
    };

    const addLog = (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodQuery) return;

        // Mock addition
        setLogs([...logs, {
            id: Date.now(),
            type: activeType,
            name: foodQuery,
            cal: Math.floor(Math.random() * 400 + 100),
            pro: Math.floor(Math.random() * 30),
            carb: Math.floor(Math.random() * 50),
            fat: Math.floor(Math.random() * 20),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setFoodQuery("");
    };

    const totals = logs.reduce((acc, log) => ({
        cal: acc.cal + log.cal,
        pro: acc.pro + log.pro,
        carb: acc.carb + log.carb,
        fat: acc.fat + log.fat,
    }), { cal: 0, pro: 0, carb: 0, fat: 0 });

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-glow/30 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                        <FileClock className="w-8 h-8 text-accent-secondary drop-shadow-[0_0_8px_rgba(118,255,3,0.5)]" />
                        Nutritional Tracker
                    </h1>
                    <p className="text-sm text-muted mt-2">Log and analyze your daily macronutrient intake.</p>
                </div>

                <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border-glow/50">
                    <button className="p-1 hover:bg-card rounded-md text-muted hover:text-primary transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-mono text-sm uppercase tracking-wider font-bold">Today</span>
                    <button className="p-1 hover:bg-card rounded-md text-muted hover:text-primary transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COMPONENT: Add Meal Form */}
                <div className="lg:col-span-5 space-y-6">
                    <GlowCard className="p-6">
                        <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-accent-primary" /> Log Entry
                        </h2>

                        <form onSubmit={addLog} className="space-y-5">
                            {/* Type Selector */}
                            <div className="flex bg-surface rounded-lg p-1 border border-border-glow/50 mb-4">
                                {TYPES.map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setActiveType(t)}
                                        className={cn(
                                            "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all uppercase tracking-wider font-mono",
                                            activeType === t
                                                ? "bg-accent-primary text-base shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                                                : "text-muted hover:text-primary"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* Autocomplete Input */}
                            <div className="relative">
                                <label className="block text-xs font-mono mb-1.5 text-primary/80 uppercase tracking-wider">Search Database</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted" />
                                    <input
                                        type="text"
                                        value={foodQuery}
                                        onChange={(e) => setFoodQuery(e.target.value)}
                                        placeholder="e.g., Apple, Chicken Breast"
                                        className="w-full bg-base/50 border border-border-glow/50 rounded-lg pl-10 pr-4 py-3 text-sm text-primary placeholder:text-muted/50 input-glow transition-all"
                                    />
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono mb-1.5 text-primary/80 uppercase tracking-wider">Quantity</label>
                                    <input
                                        type="number" min="1" step="0.5"
                                        value={qty} onChange={(e) => setQty(Number(e.target.value))}
                                        className="w-full bg-base/50 border border-border-glow/50 rounded-lg px-4 py-3 text-sm input-glow transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono mb-1.5 text-primary/80 uppercase tracking-wider">Unit</label>
                                    <select
                                        value={unit} onChange={(e) => setUnit(e.target.value)}
                                        className="w-full bg-base/50 border border-border-glow/50 rounded-lg px-4 py-3 text-sm input-glow transition-all text-primary"
                                    >
                                        <option value="Serving">Serving</option>
                                        <option value="g">Grams (g)</option>
                                        <option value="ml">Milliliters (ml)</option>
                                        <option value="cup">Cup</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={!foodQuery} className="flex-1">Add to Log</Button>
                                <Link href="/food-scan" className="flex-1">
                                    <Button variant="secondary" type="button" className="w-full gap-2">
                                        <Camera className="w-4 h-4" /> Scan Photo
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </GlowCard>
                </div>

                {/* RIGHT COMPONENT: Today's Log */}
                <div className="lg:col-span-7 space-y-6">
                    <GlowCard className="p-6 h-full flex flex-col">
                        <h2 className="text-lg font-display font-bold mb-4 border-b border-border-glow/30 pb-3">Daily Ledger</h2>

                        {/* Running Totals */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            <div className="bg-surface border border-border-glow/50 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-muted font-mono uppercase tracking-widest mb-1">Calories</div>
                                <div className="text-lg font-bold text-accent-warm">{totals.cal}</div>
                                <div className="w-full h-1 bg-base mt-2 rounded-full"><div className="h-full bg-accent-warm w-[60%]" /></div>
                            </div>
                            <div className="bg-surface border border-border-glow/50 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-muted font-mono uppercase tracking-widest mb-1">Protein</div>
                                <div className="text-lg font-bold text-accent-primary">{totals.pro}g</div>
                                <div className="w-full h-1 bg-base mt-2 rounded-full"><div className="h-full bg-accent-primary w-[70%]" /></div>
                            </div>
                            <div className="bg-surface border border-border-glow/50 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-muted font-mono uppercase tracking-widest mb-1">Carbs</div>
                                <div className="text-lg font-bold text-accent-secondary">{totals.carb}g</div>
                                <div className="w-full h-1 bg-base mt-2 rounded-full"><div className="h-full bg-accent-secondary w-[45%]" /></div>
                            </div>
                            <div className="bg-surface border border-border-glow/50 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-muted font-mono uppercase tracking-widest mb-1">Fat</div>
                                <div className="text-lg font-bold text-accent-danger">{totals.fat}g</div>
                                <div className="w-full h-1 bg-base mt-2 rounded-full"><div className="h-full bg-accent-danger w-[30%]" /></div>
                            </div>
                        </div>

                        {/* Log entries */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            <AnimatePresence>
                                {logs.length === 0 ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted py-10 font-mono text-xs uppercase tracking-wider">
                                        No entries logged today.
                                    </motion.div>
                                ) : (
                                    logs.map((log) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                            className="p-4 rounded-xl border border-border-glow/30 bg-surface/50 hover:bg-surface group flex items-start justify-between transition-colors"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn(
                                                        "text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider border",
                                                        log.type === "Breakfast" ? "bg-accent-primary/10 text-accent-primary border-accent-primary/20" :
                                                            log.type === "Lunch" ? "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20" :
                                                                log.type === "Dinner" ? "bg-accent-warm/10 text-accent-warm border-accent-warm/20" :
                                                                    "bg-accent-danger/10 text-accent-danger border-accent-danger/20"
                                                    )}>
                                                        {log.type}
                                                    </span>
                                                    <span className="text-[10px] text-muted font-mono">{log.time}</span>
                                                </div>
                                                <h4 className="font-display font-medium text-primary text-base">{log.name}</h4>
                                                <NutritionPills calories={log.cal} protein={log.pro} carbs={log.carb} fat={log.fat} className="mt-2 scale-90 origin-left" />
                                            </div>

                                            <button
                                                onClick={() => removeLog(log.id)}
                                                className="p-2 text-muted hover:text-accent-danger hover:bg-accent-danger/10 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </GlowCard>
                </div>
            </div>
        </div>
    );
}
