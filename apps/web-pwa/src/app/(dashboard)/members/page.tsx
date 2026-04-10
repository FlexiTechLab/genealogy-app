"use client";

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { getFamilyMembers } from '@/services/family';
import { MemberListPanel } from './_components/MemberListPanel';
import { ProfileDetail } from './_components/ProfileDetail ';

const TREE_ID = "019d2848-5228-7551-934d-934dae4131fa";

export default function MembersPage() {
    const { data: rawData = [], isLoading, isError } = useQuery({
        queryKey: ['members', TREE_ID],
        queryFn: () => getFamilyMembers(TREE_ID),
        enabled: true,
        retry: 1,
    });

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const memberMap = useMemo(
        () => new Map(rawData.map(m => [m.id, m])),
        [rawData]
    );

    const selectedMember = selectedId ? memberMap.get(selectedId) : null;

    const handleNavigate = useCallback((id: string) => setSelectedId(id), []);

    if (isLoading) return (
        <div className="flex h-full items-center justify-center text-slate-400 text-sm">
            Đang tải danh sách thành viên...
        </div>
    );
    if (isError) return (
        <div className="flex h-full items-center justify-center text-red-400 text-sm">
            Lỗi khi tải dữ liệu.
        </div>
    );

    return (
        <div className="flex h-full bg-white overflow-hidden">
            <MemberListPanel
                rawData={rawData}
                memberMap={memberMap}
                selectedId={selectedId}
                onSelect={setSelectedId}
            />

            <div className="flex-1 overflow-hidden">
                {selectedMember ? (
                    <ProfileDetail
                        key={selectedMember.id}
                        member={selectedMember}
                        memberMap={memberMap}
                        onNavigate={handleNavigate}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                        <User size={40} strokeWidth={1} />
                        <p className="text-sm">Chọn một thành viên để xem hồ sơ</p>
                    </div>
                )}
            </div>
        </div>
    );
}