"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Flame, Camera, FileClock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/diet-plan", label: "Diet Plan", Icon: Flame },
    { href: "/food-scan", label: "Scan Food", Icon: Camera, isCenter: true },
    { href: "/tracker", label: "Tracker", Icon: FileClock },
    { href: "/insights", label: "Insights", Icon: ShieldAlert },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-surface/90 backdrop-blur-lg border-t border-border-glow/30 z-50 flex items-center justify-around px-2 pb-safe">
            {NAV_ITEMS.map(({ href, label, Icon, isCenter }) => {
                const isActive = pathname === href;

                if (isCenter) {
                    return (
                        <Link key={href} href={href} className="flex flex-col items-center justify-center -mt-8 relative group">
                            <div
                                className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-transform group-hover:scale-105",
                                    isActive ? "bg-accent-primary text-base" : "bg-surface border-2 border-accent-primary text-accent-primary"
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-center"
                                        className="absolute inset-[-4px] rounded-full border border-accent-primary/50"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                )}
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium mt-1 text-primary">{label}</span>
                        </Link>
                    );
                }

                return (
                    <Link key={href} href={href} className="relative flex flex-col items-center justify-center w-16 h-12 flex-shrink-0">
                        {isActive && (
                            <motion.div
                                layoutId="active-nav"
                                className="absolute inset-[-4px] rounded-lg bg-surface/80"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Icon className={cn("w-5 h-5 z-10 transition-colors", isActive ? "text-accent-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-muted hover:text-primary")} />
                        <span className={cn("text-[10px] mt-1 z-10 font-medium", isActive ? "text-primary" : "text-muted")}>{label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
