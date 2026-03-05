"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-base flex flex-col md:flex-row relative">
            <Sidebar />
            {/* Mobile nav spacing */}
            <div className="flex-1 md:ml-64 flex flex-col relative min-w-0 pb-20 md:pb-0 h-screen overflow-y-auto custom-scrollbar">
                {/* Animated Background Gradients specific to App area */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed opacity-50">
                    <div className="absolute top-[0%] left-[0%] w-[30%] h-[30%] rounded-full bg-accent-primary/5 blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-accent-secondary/5 blur-[120px]" />
                </div>

                <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
            </div>
            <MobileNav />
        </div>
    );
}
