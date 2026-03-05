"use client";

import { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { User, Mail, Calendar, Weight, Ruler, Target, Activity, Save, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        age: 25,
        weight: 70,
        height: 175,
        goal: "Maintenance",
        activity_level: "Moderate",
        bio_id: "NS-X99-ALPHA"
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/profile/me");
                setProfile(res.data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/profile/update", profile);
            // Show success toast or feedback
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 animate-pulse text-muted">Synchronizing neural profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="flex justify-between items-end border-b border-border-glow/30 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-accent-secondary" />
                        Neural Profile
                    </h1>
                    <p className="text-sm text-muted mt-2">
                        Configure your biological baseline for the NutriSync ecosystem.
                    </p>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-[0.2em]">Node ID</span>
                    <p className="text-primary font-mono font-bold">{profile.bio_id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <GlowCard className="p-6 space-y-4">
                    <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-accent-primary mb-4 flex items-center gap-2">
                        <User className="w-4 h-4" /> Identification
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-mono text-muted block mb-1.5 uppercase">Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                className="w-full bg-base border border-border-glow/40 rounded-lg px-4 py-2 text-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-muted block mb-1.5 uppercase">Neural Link (Email)</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                className="w-full bg-base border border-border-glow/40 rounded-lg px-4 py-2 text-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </GlowCard>

                {/* Biometrics */}
                <GlowCard className="p-6 space-y-4">
                    <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-accent-primary mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Biometric Data
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-mono text-muted block mb-1.5 uppercase">Age</label>
                            <input
                                type="number"
                                value={profile.age}
                                onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) })}
                                className="w-full bg-base border border-border-glow/40 rounded-lg px-4 py-2 text-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-muted block mb-1.5 uppercase">Weight (kg)</label>
                            <input
                                type="number"
                                value={profile.weight}
                                onChange={e => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
                                className="w-full bg-base border border-border-glow/40 rounded-lg px-4 py-2 text-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-muted block mb-1.5 uppercase">Height (cm)</label>
                            <input
                                type="number"
                                value={profile.height}
                                onChange={e => setProfile({ ...profile, height: parseFloat(e.target.value) })}
                                className="w-full bg-base border border-border-glow/40 rounded-lg px-4 py-2 text-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-muted block mb-1.5 uppercase">Target Goal</label>
                            <select
                                value={profile.goal}
                                onChange={e => setProfile({ ...profile, goal: e.target.value })}
                                className="w-full bg-base border border-border-glow/40 rounded-lg px-4 py-2 text-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all appearance-none"
                            >
                                <option>Fat Loss</option>
                                <option>Maintenance</option>
                                <option>Muscle Gain</option>
                                <option>Performance</option>
                            </select>
                        </div>
                    </div>
                </GlowCard>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    variant="secondary"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 flex items-center gap-2"
                >
                    {saving ? "SYNCING..." : <><Save className="w-4 h-4" /> SAVE PROTOCOL</>}
                </Button>
            </div>
        </div>
    );
}
