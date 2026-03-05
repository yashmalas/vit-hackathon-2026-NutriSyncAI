"use client";

import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { api } from "@/lib/api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export function WeeklyTrendChart() {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/tracker/weekly-stats?user_id=default");
                const weekly = res.data.weekly;

                const labels = weekly.map((d: any) => {
                    const date = new Date(d.date);
                    return date.toLocaleDateString('en-US', { weekday: 'short' });
                });

                const calories = weekly.map((d: any) => d.calories);

                setChartData({
                    labels,
                    datasets: [
                        {
                            fill: true,
                            label: "Calories",
                            data: calories,
                            borderColor: "#00e5ff",
                            backgroundColor: "rgba(0, 229, 255, 0.1)",
                            borderWidth: 2,
                            pointBackgroundColor: "#0f2137",
                            pointBorderColor: "#00e5ff",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to fetch weekly stats", error);
            }
        };
        fetchStats();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(15, 33, 55, 0.9)",
                borderColor: "rgba(0, 229, 255, 0.3)",
                borderWidth: 1,
                callbacks: {
                    label: (context: any) => `${context.parsed.y} kcal`
                }
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#5a8a9f", font: { family: "JetBrains Mono" } } },
            y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#5a8a9f", font: { family: "JetBrains Mono" } } },
        },
        elements: { line: { tension: 0.4 } }
    };

    if (!chartData) return <div className="h-full flex items-center justify-center text-xs font-mono text-muted">SYNCING DATA...</div>;

    return <Line options={options} data={chartData} />;
}
