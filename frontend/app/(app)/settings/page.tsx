"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import {
    Watch,
    Bluetooth,
    Smartphone,
    Bell,
    ShieldCheck,
    User,
    CreditCard,
    Wifi,
    MoreVertical,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const WEARABLES = [
    { id: "apple", name: "Apple Health", icon: Smartphone, color: "text-rose-500", connected: true },
    { id: "garmin", name: "Garmin Connect", icon: Watch, color: "text-blue-500", connected: false },
    { id: "fitbit", name: "Fitbit", icon: Watch, color: "text-teal-500", connected: false },
    { id: "bluetooth", name: "Direct Bluetooth", icon: Bluetooth, color: "text-accent-primary", connected: false, isScanning: false },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("wearables");
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState(WEARABLES);

    const toggleConnection = (id: string) => {
        setDevices(prev => prev.map(dev => {
            if (dev.id === id) {
                if (id === "bluetooth" && !dev.connected) {
                    handleBluetoothScan();
                    return dev;
                }
                return { ...dev, connected: !dev.connected };
            }
            return dev;
        }));
    };

    const handleBluetoothScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setDevices(prev => prev.map(dev =>
                dev.id === "bluetooth" ? { ...dev, connected: true } : dev
            ));
        }, 3000);
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="border-b border-border-glow/30 pb-6">
                <h1 className="text-3xl font-display font-bold">System Configuration</h1>
                <p className="text-sm text-muted mt-2">Manage your bio-sync nodes, security protocols, and account data.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="space-y-2">
                    {[
                        { id: "profile", label: "Profile Info", icon: User },
                        { id: "wearables", label: "Bio-Wearables", icon: Watch },
                        { id: "notifications", label: "Neural Alerts", icon: Bell },
                        { id: "privacy", label: "Privacy & Encryption", icon: ShieldCheck },
                        { id: "billing", label: "Data Subscriptions", icon: CreditCard },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                activeTab === tab.id
                                    ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                                    : "text-muted hover:text-primary hover:bg-surface border border-transparent"
                            )}
                        >
                            <tab.icon className={cn("w-5 h-5 transition-colors", activeTab === tab.id ? "text-accent-primary" : "text-muted group-hover:text-primary")} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === "wearables" && (
                            <motion.div
                                key="wearables"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-display font-bold">Wearable Integration</h2>
                                        <p className="text-xs text-muted font-mono uppercase tracking-wider mt-1">Direct Neural Syncing & Smartwatch Hooks</p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleBluetoothScan}
                                        disabled={scanning}
                                        className="gap-2"
                                    >
                                        <RefreshCw className={cn("w-4 h-4", scanning && "animate-spin")} />
                                        Refresh Node Map
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {devices.map((dev) => (
                                        <GlowCard key={dev.id} className="p-5 flex items-center justify-between group overflow-hidden relative">
                                            {dev.connected && (
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-accent-secondary/5 blur-2xl pointer-events-none" />
                                            )}

                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-3 rounded-2xl bg-base border border-border-glow/30 transition-shadow",
                                                    dev.connected ? "shadow-[0_0_15px_currentColor]" : "opacity-50",
                                                    dev.color
                                                )}>
                                                    <dev.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-display font-bold text-primary">{dev.name}</h3>
                                                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted mt-0.5">
                                                        {dev.connected ? "Node Active" : "Disconnected"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {dev.connected && <CheckCircle2 className="w-5 h-5 text-accent-secondary" />}
                                                <button
                                                    onClick={() => toggleConnection(dev.id)}
                                                    className={cn(
                                                        "px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all",
                                                        dev.connected
                                                            ? "bg-accent-danger/10 text-accent-danger border border-accent-danger/20 hover:bg-accent-danger hover:text-base"
                                                            : "bg-accent-primary text-base shadow-[0_0_10px_rgba(0,229,255,0.3)] hover:scale-105"
                                                    )}
                                                >
                                                    {dev.connected ? "Purge" : "Sync"}
                                                </button>
                                            </div>
                                        </GlowCard>
                                    ))}
                                </div>

                                <GlowCard className="p-6 bg-accent-primary/5 border-accent-primary/20">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-accent-primary/20 rounded-full h-fit">
                                            <Wifi className="w-6 h-6 text-accent-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-primary">Biometric Auto-Upload</h4>
                                            <p className="text-sm text-muted mt-1 leading-relaxed">
                                                When active, NutriSync AI will automatically pull Heart Rate (BPM), VO2 Max, and Resting Metabolic Rate (RMR) from connected nodes every 15 minutes. This data dynamically adjusts your real-time diet constraints.
                                            </p>
                                            <div className="flex items-center gap-2 mt-4">
                                                <div className="w-12 h-6 bg-accent-primary rounded-full p-1 relative cursor-pointer shadow-[insent_0_2px_4px_rgba(0,0,0,0.3)] border border-accent-primary/50">
                                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-md" />
                                                </div>
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-accent-primary">Neural Stream Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlowCard>
                            </motion.div>
                        )}

                        {activeTab !== "wearables" && (
                            <motion.div
                                key="other"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center space-y-4 glass-panel rounded-2xl border border-border-glow/20"
                            >
                                <div className="p-4 bg-surface rounded-full">
                                    <RefreshCw className="w-8 h-8 text-muted animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-bold">Protocol Under Construction</h3>
                                    <p className="text-sm text-muted max-w-xs mt-2 font-mono">
                                        This neural configuration interface is currently being optimized for HACKARENA deployment.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
