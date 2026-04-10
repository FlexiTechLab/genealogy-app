import { Leaf } from 'lucide-react';

export function GenBadge({ gen }: { gen: number }) {
    return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">
            <Leaf size={9} /> Đời {gen}
        </span>
    );
}