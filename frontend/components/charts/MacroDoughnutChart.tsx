"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function MacroDoughnutChart() {
    const data = {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
            {
                data: [120, 200, 60],
                backgroundColor: [
                    "#00e5ff", // Protein (Cyan)
                    "#76ff03", // Carbs (Green)
                    "#ff9100", // Fat (Orange)
                ],
                borderColor: [
                    "#0a1929", // Border matches surface bg for spacing
                    "#0a1929",
                    "#0a1929",
                ],
                borderWidth: 4,
                hoverOffset: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
            legend: {
                display: false, // We'll manage a custom legend externally
            },
            tooltip: {
                backgroundColor: "rgba(15, 33, 55, 0.9)",
                titleColor: "#e8f4f8",
                bodyColor: "#e8f4f8",
                borderColor: "rgba(0, 229, 255, 0.3)",
                borderWidth: 1,
                callbacks: {
                    label: function (context: any) {
                        return ` ${context.label}: ${context.parsed}g`;
                    }
                }
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1500,
            easing: "easeInOutQuart" as const,
        }
    };

    return <Doughnut data={data} options={options} />;
}
