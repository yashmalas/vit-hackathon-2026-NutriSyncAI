"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill all fields to continue.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                localStorage.setItem("ns_user_id", data.user.id);
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError("Sequence failed. Check neural connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
        >
            <GlowCard className="bg-card w-full p-8 md:p-10 shadow-2xl relative" glow>
                <div className="text-center mb-8">
                    <div className="inline-flex w-12 h-12 bg-accent-primary/10 items-center justify-center rounded-xl mb-4 text-accent-primary shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h1 className="font-display text-2xl font-bold mb-2 text-primary">Access Neural Link</h1>
                    <p className="text-sm text-muted">Initialize your personalized bio-profile session</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-primary/80" htmlFor="email">
                                Ident Matrix (Email)
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="citizen@nutrisync.ai"
                                className="w-full bg-base/50 border border-border-glow/50 rounded-lg px-4 py-3 text-sm text-primary placeholder:text-muted/50 input-glow transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-primary/80" htmlFor="password">
                                    Security Hash
                                </label>
                                <Link href="#" className="flex text-xs text-accent-primary hover:text-accent-secondary transition-colors">
                                    Forgot Hash?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-base/50 border border-border-glow/50 rounded-lg px-4 py-3 text-sm text-primary placeholder:text-muted/50 input-glow transition-all"
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
                        <p className="text-sm text-accent-danger font-medium text-center">{error}</p>
                    </motion.div>

                    <Button type="submit" className="w-full group !h-12 text-base" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                Authenticating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Initialize Sequence
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-glow/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-card px-3 text-muted">OR</span>
                        </div>
                    </div>

                    <Button variant="secondary" type="button" className="w-full gap-2 !h-12 !border-border-glow/30" onClick={() => router.push("/dashboard")}>
                        {/* Minimal Google G logo mock */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google Protocol
                    </Button>

                    <p className="text-center text-sm text-muted mt-6">
                        Protocol unestablished?{" "}
                        <Link href="/auth/signup" className="text-accent-primary font-medium hover:text-accent-secondary transition-colors underline-offset-4 hover:underline">
                            Create User Profile
                        </Link>
                    </p>
                </form>
            </GlowCard>
        </motion.div>
    );
}
