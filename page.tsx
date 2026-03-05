"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/ui/PageTransition";
import {
    Activity,
    ChevronRight,
    ChevronLeft,
    Flame,
    Dumbbell,
    Scale,
    Leaf,
    Beef,
    WheatOff,
    Milk,
    Nut,
    Droplet,
    Home,
    Building
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

    // --- State for Step 1: Personal Info ---
    const [age, setAge] = useState<number | "">(25);
    const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("Male");
    const [height, setHeight] = useState<number>(175);
    const [weight, setWeight] = useState<number>(70);

    // --- State for Step 2: Fitness Goal ---
    const [goal, setGoal] = useState<"Weight Loss" | "Muscle Gain" | "Balanced Diet" | "">("Balanced Diet");

    // --- State for Step 3: Lifestyle ---
    const [activityLevel, setActivityLevel] = useState<string>("Moderately Active");
    const [dietType, setDietType] = useState<string>("Non-Veg");
    const [allergies, setAllergies] = useState<string[]>([]);

    // --- State for Step 4: Budget & Environment ---
    const [budget, setBudget] = useState<number>(300);
    const [envMode, setEnvMode] = useState<"Hosteller" | "Home Cook">("Hosteller");
    const [ingredients, setIngredients] = useState<string>("");

    const bmi = height ? weight / Math.pow(height / 100, 2) : 0;

    const getBmiCategory = (bmiVal: number) => {
        if (bmiVal === 0) return { label: "N/A", color: "text-muted" };
        if (bmiVal < 18.5) return { label: "Underweight", color: "text-accent-secondary" };
        if (bmiVal >= 18.5 && bmiVal < 25) return { label: "Normal", color: "text-accent-primary" };
        if (bmiVal >= 25 && bmiVal < 30) return { label: "Overweight", color: "text-accent-warm" };
        return { label: "Obese", color: "text-accent-danger" };
    };

    const bmiCat = getBmiCategory(bmi);

    const nextStep = () => {
        if (step < TOTAL_STEPS) {
            setDirection(1);
            setStep(step + 1);
        } else {
            submitProfile();
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(step - 1);
        }
    };

    const submitProfile = async () => {
        setLoading(true);
        try {
            // Get user ID from local storage (set during signup/login)
            const userId = localStorage.getItem("ns_user_id") || "00000000-0000-0000-0000-000000000000";

            await api.put("/profile/update", {
                user_id: userId,
                full_name: "Citizen X", // For hackathon, we can fetch name from localStorage if saved
                age: Number(age),
                weight: Number(weight),
                height: Number(height),
                goal: goal,
                activity_level: activityLevel,
                bio_id: `NS-${userId.substring(0, 8).toUpperCase()}`
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to sync profile", error);
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const toggleAllergy = (a: string) => {
        if (allergies.includes(a)) {
            setAllergies(allergies.filter((item) => item !== a));
        } else {
            setAllergies([...allergies, a]);
        }
    };

    // Animation variants
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            zIndex: 0,
            x: dir < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col items-center pt-20 pb-12 px-4 bg-base relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-accent-primary/10 blur-[150px] mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-accent-secondary/10 blur-[150px] mix-blend-screen pointer-events-none" />

                <div className="w-full max-w-2xl z-10">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
                            <Activity className="text-accent-primary w-8 h-8" />
                            Bio-Profile Setup
                        </h1>
                        <div className="text-sm font-mono text-muted">
                            STEP {step} OF {TOTAL_STEPS}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-surface rounded-full mb-10 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                            initial={{ width: `${((step - 1) / TOTAL_STEPS) * 100}%` }}
                            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <GlowCard className="bg-card w-full p-8 shadow-2xl min-h-[450px] flex flex-col">
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={step}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex-grow flex flex-col"
                            >
                                {/* STEP 1: Personal Info */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-display font-semibold border-b border-border-glow/30 pb-3">Personal Metrics</h2>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-mono mb-2 text-primary/80 uppercase tracking-wider">Age</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-surface border border-border-glow/50 rounded-lg px-4 py-3 text-sm input-glow"
                                                    value={age}
                                                    onChange={(e) => setAge(Number(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-mono mb-2 text-primary/80 uppercase tracking-wider">Gender</label>
                                                <div className="flex bg-surface rounded-lg p-1 border border-border-glow/50">
                                                    {["Male", "Female", "Other"].map((g) => (
                                                        <button
                                                            key={g}
                                                            className={cn(
                                                                "flex-1 py-2 text-xs font-semibold rounded-md transition-all",
                                                                gender === g ? "bg-accent-primary text-base shadow-[0_0_10px_rgba(0,229,255,0.3)]" : "text-primary/70 hover:text-primary"
                                                            )}
                                                            onClick={() => setGender(g as any)}
                                                        >
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-xs font-mono text-primary/80 uppercase tracking-wider">Height (cm)</label>
                                                <span className="text-sm font-mono text-accent-primary">{height} cm</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="120" max="220"
                                                className="w-full accent-accent-primary cursor-pointer"
                                                value={height}
                                                onChange={(e) => setHeight(Number(e.target.value))}
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-xs font-mono text-primary/80 uppercase tracking-wider">Weight (kg)</label>
                                                <span className="text-sm font-mono text-accent-primary">{weight} kg</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="30" max="150"
                                                className="w-full accent-accent-primary cursor-pointer"
                                                value={weight}
                                                onChange={(e) => setWeight(Number(e.target.value))}
                                            />
                                        </div>

                                        <div className="mt-6 p-4 rounded-xl bg-surface/50 border border-border-glow/20 flex justify-between items-center">
                                            <span className="text-sm">Calculated BMI</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-xl">{bmi ? bmi.toFixed(1) : "0.0"}</span>
                                                <span className={cn("px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-opacity-10 border", bmiCat.color, bmiCat.color.replace("text-", "border-").replace("text-", "bg-"))}>
                                                    {bmiCat.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: Fitness Goal */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-display font-semibold border-b border-border-glow/30 pb-3">Primary Objective</h2>

                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: "Weight Loss", icon: Flame, color: "text-accent-warm", border: "border-accent-warm", bg: "bg-accent-warm/10" },
                                                { id: "Muscle Gain", icon: Dumbbell, color: "text-accent-primary", border: "border-accent-primary", bg: "bg-accent-primary/10" },
                                                { id: "Balanced Diet", icon: Scale, color: "text-accent-secondary", border: "border-accent-secondary", bg: "bg-accent-secondary/10" },
                                            ].map((item) => {
                                                const isSelected = goal === item.id;
                                                return (
                                                    <motion.button
                                                        key={item.id}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setGoal(item.id as any)}
                                                        className={cn(
                                                            "w-full p-5 rounded-xl border flex items-center gap-5 transition-all",
                                                            isSelected
                                                                ? `${item.border} ${item.bg} shadow-[0_0_15px_currentColor] ${item.color.replace('text-', 'shadow-')}`
                                                                : "border-border-glow/30 bg-surface hover:border-border-glow"
                                                        )}
                                                    >
                                                        <div className={cn("p-3 rounded-lg bg-base", isSelected ? item.color : "text-muted")}>
                                                            <item.icon className="w-8 h-8" />
                                                        </div>
                                                        <div className="text-left">
                                                            <h3 className={cn("font-display text-lg font-bold", isSelected ? item.color : "text-primary")}>{item.id}</h3>
                                                            <p className="text-xs text-muted mt-1">AI will optimize your macro split for this specific goal.</p>
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: Lifestyle */}
                                {step === 3 && (
                                    <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-2">
                                        <h2 className="text-xl font-display font-semibold border-b border-border-glow/30 pb-3">Lifestyle & Diet</h2>

                                        <div>
                                            <label className="block text-xs font-mono mb-3 text-primary/80 uppercase tracking-wider">Activity Level</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                {["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Athlete"].map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setActivityLevel(level)}
                                                        className={cn(
                                                            "p-3 rounded-lg border text-left transition-all",
                                                            activityLevel === level
                                                                ? "border-accent-primary bg-accent-primary/10 text-accent-primary shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                                                                : "border-border-glow/30 bg-surface hover:border-border-glow"
                                                        )}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono mb-3 text-primary/80 uppercase tracking-wider">Dietary Preference</label>
                                            <div className="flex bg-surface rounded-lg p-1 border border-border-glow/50">
                                                {[
                                                    { id: "Veg", icon: Leaf, color: "text-accent-secondary" },
                                                    { id: "Non-Veg", icon: Beef, color: "text-accent-warm" },
                                                    { id: "Vegan", icon: Leaf, color: "text-accent-primary" },
                                                ].map((d) => (
                                                    <button
                                                        key={d.id}
                                                        className={cn(
                                                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-all",
                                                            dietType === d.id ? "bg-card shadow-sm border border-border-glow/50 " + d.color : "text-primary/50 hover:text-primary"
                                                        )}
                                                        onClick={() => setDietType(d.id)}
                                                    >
                                                        <d.icon className="w-4 h-4" />
                                                        {d.id}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono mb-3 text-primary/80 uppercase tracking-wider">Allergies / Restrictions</label>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { id: "Nuts", icon: Nut },
                                                    { id: "Dairy", icon: Milk },
                                                    { id: "Gluten", icon: WheatOff },
                                                    { id: "Shellfish", icon: Droplet },
                                                    { id: "Eggs", icon: Beef },
                                                    { id: "Soy", icon: Leaf },
                                                ].map((item) => {
                                                    const isSelected = allergies.includes(item.id);
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => toggleAllergy(item.id)}
                                                            className={cn(
                                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all",
                                                                isSelected
                                                                    ? "border-accent-danger bg-accent-danger/20 text-accent-danger shadow-[0_0_10px_rgba(255,23,68,0.3)]"
                                                                    : "border-border-glow/40 bg-surface text-muted hover:border-primary/50"
                                                            )}
                                                        >
                                                            <item.icon className="w-3 h-3" />
                                                            {item.id}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: Budget & Environment */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-display font-semibold border-b border-border-glow/30 pb-3">Environment</h2>

                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-xs font-mono text-primary/80 uppercase tracking-wider">Daily Food Budget</label>
                                                <span className="text-sm font-mono text-accent-warm">₹{budget}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="50" max="1000" step="10"
                                                className="w-full accent-accent-warm cursor-pointer"
                                                value={budget}
                                                onChange={(e) => setBudget(Number(e.target.value))}
                                            />
                                            <div className="flex justify-between text-[10px] text-muted font-mono mt-1">
                                                <span>₹50</span>
                                                <span>₹1000+</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono mb-3 text-primary/80 uppercase tracking-wider">Setup Limitations</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: "Hosteller", icon: Building, desc: "Limited kitchen/tools" },
                                                    { id: "Home Cook", icon: Home, desc: "Full kitchen access" },
                                                ].map((env) => (
                                                    <button
                                                        key={env.id}
                                                        onClick={() => setEnvMode(env.id as any)}
                                                        className={cn(
                                                            "p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all",
                                                            envMode === env.id
                                                                ? "border-accent-primary bg-accent-primary/10 text-accent-primary shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                                                                : "border-border-glow/30 bg-surface text-muted hover:border-border-glow hover:text-primary"
                                                        )}
                                                    >
                                                        <env.icon className="w-6 h-6 mb-1" />
                                                        <span className="font-bold text-sm tracking-wide">{env.id}</span>
                                                        <span className="text-[10px] opacity-80">{env.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono mb-2 text-primary/80 uppercase tracking-wider">Available Ingredients (Optional)</label>
                                            <textarea
                                                rows={3}
                                                placeholder="e.g., rice, daal, eggs, spinach... We'll prioritize these in your plan."
                                                className="w-full bg-surface border border-border-glow/50 rounded-lg p-3 text-sm text-primary placeholder:text-muted/50 input-glow transition-all resize-none"
                                                value={ingredients}
                                                onChange={(e) => setIngredients(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-border-glow/20 shrink-0">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1 || loading}
                                className={step === 1 ? "opacity-0 pointer-events-none" : undefined}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Back
                            </Button>

                            <Button
                                variant="primary"
                                onClick={nextStep}
                                disabled={loading}
                                className={step === TOTAL_STEPS ? "bg-accent-secondary shadow-[0_0_15px_rgba(118,255,3,0.4)] text-base" : ""}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        Generating Protocol...
                                    </span>
                                ) : step === TOTAL_STEPS ? (
                                    <span className="flex items-center gap-2 text-base font-bold text-base">
                                        Generate My Plan
                                        <Flame className="w-4 h-4 ml-1" />
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Proceed
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </GlowCard>
                </div>
            </div>
        </PageTransition>
    );
}
