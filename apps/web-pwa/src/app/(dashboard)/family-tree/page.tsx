"use client";

import dynamic from 'next/dynamic';

// Turn off SSR completely for the chart section
const FamilyTreeCanvas = dynamic(
    () => import('./_components/family-tree-client'),
    {
        ssr: false,
        loading: () => (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 animate-pulse">Loading Genealogy System...</p>
            </div>
        )
    }
);

export default function FamilyTreePage() {
    return <FamilyTreeCanvas />;
}