"use client";

import { useState, useRef } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { NutritionPills } from "@/components/ui/NutritionPills";
import { Camera, Upload, Sparkles, PlusCircle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function FoodScanPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<{
        food_name: string;
        confidence: number;
        nutrition: { calories: number; protein: number; carbs: number; fat: number; fiber?: number };
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const processFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setPreviewURL(URL.createObjectURL(selectedFile));
        setResult(null);
        setScanning(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            // Use axios directly for multipart form data
            const res = await api.post("/food/analyze-food", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResult(res.data);
        } catch (error) {
            console.error("Analysis failed", error);
            // Fallback for demo if backend fails
            setResult({
                food_name: "Analysis Link Failed",
                confidence: 0,
                nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
            });
        } finally {
            setScanning(false);
        }
    };

    const resetScanner = () => {
        setFile(null);
        setPreviewURL(null);
        setResult(null);
        setScanning(false);
    };

    const logMeal = () => {
        alert("Neural Protocol Updated: Meal Logged.");
        resetScanner();
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-bold flex items-center justify-center gap-3">
                    <Camera className="w-8 h-8 text-accent-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                    Neural Food Recognition
                </h1>
                <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
                    Upload a biological sample (meal photo). Our AI will decode the molecular nutrition matrix using Gemini Vision & USDA records.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!previewURL ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div
                            className={cn(
                                "relative flex flex-col items-center justify-center p-12 h-80 rounded-2xl border-2 border-dashed transition-all cursor-pointer group glass-panel",
                                isDragging
                                    ? "border-accent-primary bg-accent-primary/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                                    : "border-border-glow hover:border-accent-primary hover:bg-surface"
                            )}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative border border-border-glow shadow-md">
                                <Upload className="w-8 h-8 text-accent-primary" />
                                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent-secondary animate-pulse" />
                            </div>

                            <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-accent-primary transition-colors">
                                Drop your food photo here or click
                            </h3>
                            <p className="text-sm text-muted font-mono uppercase tracking-wider">
                                JPG, PNG • Max 5MB
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-8 w-full"
                    >
                        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden glass-panel flex items-center justify-center bg-black/50 border border-border-glow">
                            <img
                                src={previewURL}
                                alt="Food preview"
                                className="w-full h-full object-contain absolute opacity-60"
                            />

                            <button
                                onClick={resetScanner}
                                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-primary border border-white/10 transition-all backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {scanning && (
                                <>
                                    <div className="absolute inset-0 z-10 box-border border-4 border-accent-primary/50 m-4 rounded-xl" />
                                    <motion.div
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute z-10 w-full h-1 bg-accent-primary shadow-[0_0_20px_4px_rgba(0,229,255,0.7)]"
                                    />
                                    <div className="absolute bottom-6 bg-black/70 backdrop-blur-md px-6 py-2 rounded-full border border-accent-primary/50 text-accent-primary font-mono text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg z-20">
                                        <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
                                        Decoding Bio-Matrix...
                                    </div>
                                </>
                            )}
                        </div>

                        {result && !scanning && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full max-w-lg"
                            >
                                <GlowCard className="p-6 relative overflow-hidden" glow>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 blur-[50px] rounded-full pointer-events-none" />

                                    <div className="flex justify-between items-start mb-6 border-b border-border-glow/30 pb-4">
                                        <div>
                                            <h2 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
                                                {result.food_name}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-2">
                                                <CheckCircle className="w-4 h-4 text-accent-secondary" />
                                                <span className="text-xs font-mono uppercase text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded-sm">
                                                    {(result.confidence * 100).toFixed(0)}% Match Confidence
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                        <div className="p-3 bg-surface rounded-xl border border-border-glow/40 text-center">
                                            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Calories</div>
                                            <div className="text-xl font-bold text-accent-warm">{result.nutrition.calories} <span className="text-xs font-normal">kcal</span></div>
                                        </div>
                                        <div className="p-3 bg-surface rounded-xl border border-border-glow/40 text-center">
                                            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Protein</div>
                                            <div className="text-xl font-bold text-accent-primary">{result.nutrition.protein} <span className="text-xs font-normal">g</span></div>
                                        </div>
                                        <div className="p-3 bg-surface rounded-xl border border-border-glow/40 text-center">
                                            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Carbs</div>
                                            <div className="text-xl font-bold text-accent-secondary">{result.nutrition.carbs} <span className="text-xs font-normal">g</span></div>
                                        </div>
                                        <div className="p-3 bg-surface rounded-xl border border-border-glow/40 text-center">
                                            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Fat</div>
                                            <div className="text-xl font-bold text-accent-danger">{result.nutrition.fat} <span className="text-xs font-normal">g</span></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button onClick={logMeal} className="flex-1 group">
                                            <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                                            Log This Meal
                                        </Button>
                                        <Button variant="secondary" onClick={resetScanner} className="flex-1">
                                            <Camera className="w-5 h-5 mr-2" />
                                            Scan Another
                                        </Button>
                                    </div>
                                </GlowCard>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
