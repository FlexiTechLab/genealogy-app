"use client";

import { FamilyNodeData } from '@/types/genealogy';
import { Handle, Position } from '@xyflow/react';
import { Church } from 'lucide-react';

export function MemberNode({ data }: { data: FamilyNodeData }) {
    const isMale = data.gender === 1;
    const isBloodline = data.is_bloodline;
    const isDead = !data.is_alive;

    // ── Bảng màu nhất quán ──────────────────────────────────────────────────
    // Bloodline nam  : blue-100 bg  /  blue-400 border  /  blue-400 badge bg  / blue-800 badge text
    // Bloodline nữ  : rose-100 bg  /  rose-400 border  /  rose-400 badge bg  / rose-800 badge text
    // Dâu/Rể nam    : blue-50  bg  /  blue-300 border  /  blue-300 badge bg  / blue-700 badge text
    // Dâu/Rể nữ    : rose-50  bg  /  rose-300 border  /  rose-300 badge bg  / rose-700 badge text
    // Đã mất        : thêm opacity-60 + grayscale-[0.4] lên toàn node

    const cardBg = isBloodline
        ? (isMale ? 'bg-blue-50' : 'bg-rose-50')
        : (isMale ? 'bg-white' : 'bg-white');

    const borderColor = isBloodline
        ? (isMale ? 'border-blue-400' : 'border-rose-400')
        : (isMale ? 'border-blue-200' : 'border-rose-200');

    const borderWidth = isBloodline ? 'border-2' : 'border';

    const badgeBg = isBloodline
        ? (isMale ? 'bg-blue-400' : 'bg-rose-400')
        : (isMale ? 'bg-blue-200' : 'bg-rose-200');

    const badgeText = isBloodline
        ? 'text-white'
        : (isMale ? 'text-blue-700' : 'text-rose-700');

    return (
        <div className={`
            relative px-4 py-3 shadow-sm rounded-lg min-w-[200px]
            ${cardBg} ${borderColor} ${borderWidth}
            ${isDead ? 'grayscale-[0.7]' : ''}
        `}>

            {isBloodline && (
                <>
                    <Handle type="target" position={Position.Top} id="top" />
                    <Handle type="source" position={Position.Bottom} id="bottom" />
                </>
            )}

            <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
            <Handle type="target" position={Position.Left} id="left" className="opacity-0" />

            <div className="flex flex-col items-center gap-0.5">

                <div className={`text-[9px] font-bold px-2 py-0.5 rounded ${badgeBg} ${badgeText}`}>
                    {isBloodline ? `Đời ${data.generation_number}` : 'Dâu / Rể'}
                </div>

                <div className="font-bold text-gray-800 text-sm flex items-center gap-1 mt-0.5">
                    {data.full_name}
                    {isDead && (
                        <span title="Đã mất" className="text-gray-400">
                            <Church size={13} strokeWidth={2.5} />
                        </span>
                    )}
                </div>

                {data.nick_name && (
                    <div className="text-[10px] italic text-gray-400">
                        ({data.nick_name})
                    </div>
                )}

                <div className="text-[9px] text-gray-400 mt-0.5">
                    {data.date_of_birth
                        ? new Date(data.date_of_birth).getFullYear()
                        : '?'}
                    {' - '}
                    {data.is_alive
                        ? 'Nay'
                        : data.date_of_death
                            ? new Date(data.date_of_death).getFullYear()
                            : '?'}
                </div>
            </div>
        </div>
    );
}