"use client";

import { useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FamilyMember } from '@/types';

export function MemberNode({ data }: { data: FamilyMember }) {
    const [isMounted, setIsMounted] = useState(false);
    const isMale = data.gender === 1;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className={`px-4 py-2 shadow-md rounded-md border-2 bg-white ${isMale ? 'border-blue-500' : 'border-pink-500'}`}>
            <Handle type="target" position={Position.Top} className="w-2 h-2" />

            <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-gray-400">Đời {data.generation_number}</div>
                <div className="font-bold text-sm">{data.full_name}</div>
                {data.nick_name && <div className="text-[10px] italic text-gray-500">({data.nick_name})</div>}

                {data.spouses && data.spouses.length > 0 && (
                    <div className="mt-1 pt-1 border-t w-full text-center">
                        <div className="text-[9px] text-gray-400 uppercase">Vợ/Chồng</div>
                        {data.spouses.map(s => (
                            <div key={s.id} className="text-[11px] text-purple-600 font-medium">
                                {s.full_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        </div>
    );
}