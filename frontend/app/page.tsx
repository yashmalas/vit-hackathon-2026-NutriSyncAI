"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Activity, Brain, ShieldAlert, Wallet, ArrowRight, ActivitySquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const titleWords = "Your Real-Time Bio-Adaptive Nutrition Ecosystem".split(" ");

  return (
    <PageTransition>
      <main className="min-h-screen relative overflow-hidden bg-base text-primary font-sans flex flex-col">
        {/* Animated Background Gradients & Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/20 blur-[150px] mix-blend-screen" />
          <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-secondary/20 blur-[150px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen" />

          {/* Hex Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path fill="none" stroke="#00e5ff" strokeWidth="1" d="M25,21.7L12.5,28.9L0,21.7L0,7.2L12.5,0L25,7.2Z M25,50.6L12.5,57.8L0,50.6L0,36.1L12.5,28.9L25,36.1Z m25-14.4L37.5,43.4L25,36.1L25,21.7L37.5,14.4L50,21.7Z" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        {/* Navbar */}
        <nav className="relative z-50 w-full p-6 flex justify-between items-center max-w-7xl mx-auto glass-panel border-b-0 border-x-0 border-t-0 bg-transparent rounded-none">
          <div className="flex items-center gap-2">
            <ActivitySquare className="w-8 h-8 text-accent-primary" />
            <span className="font-display font-bold text-xl tracking-tight text-primary">NUTRISYNC<span className="text-accent-primary"> AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted hover:text-primary transition-colors">How it Works</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 md:px-0 text-center max-w-4xl mx-auto pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              NUTRISYNC <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">AI</span>
            </h1>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10 text-lg md:text-2xl text-muted h-16">
            {mounted && titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className={word === "Bio-Adaptive" ? "text-primary font-semibold" : ""}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Strip */}
        <section id="features" className="relative z-10 py-24 bg-surface/50 border-y border-border-glow/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Brain, title: "AI Meal Gen", desc: "Instantly create personalized diets tailored to your unique bio-profile and goals.", color: "text-accent-primary" },
                { icon: Activity, title: "Smartwatch Sync", desc: "Real-time vitals tracking dynamically adjusts your macronutrient needs.", color: "text-accent-secondary" },
                { icon: ShieldAlert, title: "Risk Detection", desc: "Predictive ML models flag potential nutrient deficiencies and health risks early.", color: "text-accent-danger" },
                { icon: Wallet, title: "Budget Mode", desc: "Eat healthy without breaking the bank. Ingredients optimized for your wallet.", color: "text-accent-warm" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <GlowCard className="h-full flex flex-col items-start" glow>
                    <div className={`p-3 rounded-xl bg-card border border-border-glow/50 mb-4 ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted/80 leading-relaxed">{feature.desc}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-10">
            {[
              { end: 50, suffix: "K+", label: "Active Users" },
              { end: 98, suffix: "%", label: "AI Accuracy" },
              { end: 500, suffix: "+", label: "Foods Recognized" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="font-display font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-muted mb-2">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-mono text-muted uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </PageTransition>
  );
}
