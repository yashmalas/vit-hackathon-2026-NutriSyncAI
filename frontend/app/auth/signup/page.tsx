"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Incomplete profile data detected. Please fill all fields.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                localStorage.setItem("ns_user_id", data.user.id);
                // Also create user in backend 'users' table if needed, 
                // but our backend service 'update_user_metadata' can do it on first sync.
                router.push("/onboarding");
            }
        } catch (err: any) {
            setError("Neural uplink failed. Check your connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md my-auto"
        >
            <GlowCard className="bg-card w-full p-8 shadow-2xl relative" glow>
                <div className="text-center mb-6">
                    <div className="inline-flex w-12 h-12 bg-accent-secondary/10 items-center justify-center rounded-xl mb-4 text-accent-secondary shadow-[0_0_15px_rgba(118,255,3,0.2)]">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h1 className="font-display text-2xl font-bold mb-1 text-primary">New Citizen Uplink</h1>
                    <p className="text-sm text-muted">Initialize your NutriSync biometrics profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-mono mb-1 text-primary/80 uppercase tracking-wider" htmlFor="name">
                                Designation (Name)
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Subject designation"
                                className="w-full bg-base/50 border border-border-glow/50 rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-muted/50 input-glow transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono mb-1 text-primary/80 uppercase tracking-wider" htmlFor="email">
                                Ident Node (Email)
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="node@nutrisync.ai"
                                className="w-full bg-base/50 border border-border-glow/50 rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-muted/50 input-glow transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono mb-1 text-primary/80 uppercase tracking-wider" htmlFor="password">
                                Security Hash (Password)
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-base/50 border border-border-glow/50 rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-muted/50 input-glow transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{ opacity: error ? 1 : 0, height: error ? "auto" : 0 }}
                        className="overflow-hidden"
                    >
                        <p className="text-xs text-accent-danger font-medium text-center">{error}</p>
                    </motion.div>

                    <Button type="submit" className="w-full group mt-4 h-11 text-sm bg-accent-secondary text-base hover:shadow-[0_0_20px_rgba(118,255,3,0.4)] shadow-[0_0_15px_rgba(118,255,3,0.2)]" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 border-2 border-base/20 border-t-base rounded-full animate-spin" />
                                Registering Node...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 font-bold tracking-wide">
                                Commence Uplink
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>

                    <p className="text-center text-xs text-muted mt-4">
                        Node verified?{" "}
                        <Link href="/auth/login" className="text-accent-secondary font-medium hover:text-accent-primary transition-colors underline-offset-4 hover:underline">
                            Access Matrix
                        </Link>
                    </p>
                </form>
            </GlowCard>
        </motion.div>
    );
}
