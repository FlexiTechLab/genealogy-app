"use client";

import { MoveLeft } from 'lucide-react';

interface BackButtonProps {
    className?: string;
    label: string;
}

export function BackButton({ className, label }: BackButtonProps) {
    return (
        <button
            onClick={() => window.history.back()}
            className={className}
        >
            <MoveLeft className="h-4 w-4" />
            {label}
        </button>
    );
}