import { cn } from "@/lib/utils";
import { Flame, Beef, Wheat, Droplet } from "lucide-react";

interface NutritionPillsProps {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    className?: string;
    compact?: boolean;
}

export function NutritionPills({ calories, protein, carbs, fat, className, compact }: NutritionPillsProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-2", !compact && "mt-2", className)}>
            <span className={cn(
                "inline-flex items-center gap-1.5 font-mono font-medium rounded-full",
                compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                "bg-accent-warm/10 text-accent-warm border border-accent-warm/20"
            )}>
                {!compact && <Flame className="w-3.5 h-3.5" />}
                {calories}{compact ? "k" : " kcal"}
            </span>
            <span className={cn(
                "inline-flex items-center gap-1.5 font-mono font-medium rounded-full",
                compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                "bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20"
            )}>
                {!compact && <Beef className="w-3.5 h-3.5" />}
                {protein}g
            </span>
            <span className={cn(
                "inline-flex items-center gap-1.5 font-mono font-medium rounded-full",
                compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                "bg-sky-400/10 text-sky-400 border border-sky-400/20"
            )}>
                {!compact && <Wheat className="w-3.5 h-3.5" />}
                {carbs}g
            </span>
            <span className={cn(
                "inline-flex items-center gap-1.5 font-mono font-medium rounded-full",
                compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                "bg-accent-danger/10 text-accent-danger border border-accent-danger/20"
            )}>
                {!compact && <Droplet className="w-3.5 h-3.5" />}
                {fat}g
            </span>
        </div>
    );
}
