"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type PasswordStrength = {
    score: number;
    label: string;
    color: string;
};

function calculatePasswordStrength(password: string): PasswordStrength {
    if (!password) {
        return { score: 0, label: "", color: "" };
    }

    let score = 0;

    // Length checks
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Normalize score to 0-4 range
    const normalizedScore = Math.min(Math.floor(score / 2), 4);

    const strengthMap: Record<number, { label: string; color: string }> = {
        0: { label: "Very Weak", color: "bg-destructive" },
        1: { label: "Weak", color: "bg-orange-500" },
        2: { label: "Fair", color: "bg-yellow-500" },
        3: { label: "Strong", color: "bg-lime-500" },
        4: { label: "Very Strong", color: "bg-green-500" },
    };

    return {
        score: normalizedScore,
        ...strengthMap[normalizedScore],
    };
}

type PasswordStrengthMeterProps = {
    password: string;
    className?: string;
};

export function PasswordStrengthMeter({
    password,
    className,
}: PasswordStrengthMeterProps) {
    const strength = calculatePasswordStrength(password);

    if (!password) {
        return null;
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors duration-200",
                            index < strength.score ? strength.color : "bg-muted"
                        )}
                    />
                ))}
            </div>
            <p
                className={cn(
                    "text-xs transition-colors duration-200",
                    strength.score === 0 && "text-destructive",
                    strength.score === 1 && "text-orange-500",
                    strength.score === 2 && "text-yellow-600",
                    strength.score === 3 && "text-lime-600",
                    strength.score === 4 && "text-green-600"
                )}
            >
                Password strength: {strength.label}
            </p>
        </div>
    );
}
