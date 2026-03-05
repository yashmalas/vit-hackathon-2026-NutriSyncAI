"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ActivitySquare, LayoutDashboard, Flame, Camera, FileClock, ShieldAlert, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/diet-plan", label: "Diet Plan", Icon: Flame },
    { href: "/food-scan", label: "Food Scan", Icon: Camera },
    { href: "/tracker", label: "Meal Tracker", Icon: FileClock },
    { href: "/insights", label: "Insights", Icon: ShieldAlert },
    { href: "/profile", label: "Profile", Icon: User },
    { href: "/settings", label: "Settings", Icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-surface border-r border-border-glow/30 flex flex-col z-40 hidden md:flex shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-border-glow/20">
                <Link href="/" className="flex items-center gap-2">
                    <ActivitySquare className="w-8 h-8 text-accent-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                    <span className="font-display font-bold text-xl tracking-tight text-primary">NUTRISYNC<span className="text-accent-primary"> AI</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
                {NAV_ITEMS.map(({ href, label, Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <Link key={href} href={href} className="relative group rounded-md outline-none">
                            {isActive && (
                                <motion.div
                                    layoutId="active-sidebar-nav"
                                    className="absolute inset-0 bg-accent-primary/5 rounded-md border-l-2 border-accent-primary"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div
                                className={cn(
                                    "relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors z-10",
                                    isActive ? "text-primary shadow-[inset_4px_0_0_0_rgba(0,229,255,1)]" : "text-muted hover:text-primary hover:bg-surface/50 rounded-md"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-accent-primary" : "text-muted group-hover:text-primary")} />
                                {label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Profile */}
            <div className="p-4 border-t border-border-glow/20">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border-glow/30 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                    <div className="w-10 h-10 rounded-full bg-base border-2 border-accent-primary flex items-center justify-center font-bold text-sm">
                        UD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold truncate">User Designation</h4>
                        <span className="text-[10px] text-accent-secondary uppercase font-mono tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>

                <button className="flex items-center gap-2 w-full mt-4 p-2 text-sm text-muted hover:text-accent-danger transition-colors justify-start pl-4 font-mono uppercase tracking-wider">
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                </button>
            </div>
        </div>
    );
}
