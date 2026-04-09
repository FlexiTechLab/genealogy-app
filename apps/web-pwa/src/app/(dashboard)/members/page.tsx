"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFamilyMembers } from '@/services/family';
import { FamilyMember } from '@/types/genealogy';
import {
    Search, Filter, ChevronRight, User, Calendar,
    Heart, Users, Baby, Leaf, X, ArrowUpRight
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getAge(dob?: string | null, dod?: string | null, isAlive?: boolean): string {
    if (!dob) return '—';
    const birth = new Date(dob).getFullYear();
    const end = (!isAlive && dod) ? new Date(dod).getFullYear() : new Date().getFullYear();
    return `${end - birth} tuổi`;
}

function formatYear(date?: string | null): string {
    return date ? String(new Date(date).getFullYear()) : '?';
}

function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return parts[parts.length - 1]?.[0]?.toUpperCase() ?? '?';
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({ member, size = 'md' }: { member: FamilyMember; size?: 'sm' | 'md' | 'lg' }) {
    const isMale = member.gender === 1;
    const dims = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };
    const bg = isMale
        ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-200'
        : 'bg-rose-100 text-rose-500 ring-1 ring-rose-200';
    return (
        <div className={`${dims[size]} ${bg} rounded-full flex items-center justify-center font-semibold shrink-0`}>
            {member.avatar_url
                ? <img src={member.avatar_url} className="w-full h-full rounded-full object-cover" alt={member.full_name} />
                : getInitials(member.full_name)
            }
        </div>
    );
}

// ─── Generation badge ────────────────────────────────────────────────────────

function GenBadge({ gen }: { gen: number }) {
    return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">
            <Leaf size={9} /> Đời {gen}
        </span>
    );
}

// ─── Member Row (left panel) ─────────────────────────────────────────────────

function MemberRow({
    member,
    isSelected,
    onClick,
    memberMap,
}: {
    member: FamilyMember;
    isSelected: boolean;
    onClick: () => void;
    memberMap: Map<string, FamilyMember>;
}) {
    const isMale = member.gender === 1;
    const isDead = !member.is_alive;
    const father = member.father_id ? memberMap.get(member.father_id) : null;

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all
                ${isSelected
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'hover:bg-slate-50'
                }
                ${isDead ? 'opacity-60' : ''}
            `}
        >
            <Avatar member={member} size="sm" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm font-medium truncate ${isMale ? 'text-blue-900' : 'text-rose-900'}`}>
                        {member.full_name}
                    </span>
                    {member.nick_name && (
                        <span className="text-[10px] text-slate-400 italic truncate">"{member.nick_name}"</span>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <GenBadge gen={member.generation_number} />
                    {father && (
                        <span className="text-[10px] text-slate-400 truncate">con {father.full_name}</span>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-slate-400">
                    {formatYear(member.date_of_birth)}
                    {!member.is_alive && ` – ${formatYear(member.date_of_death)}`}
                </span>
                <ChevronRight size={12} className={`transition-opacity ${isSelected ? 'opacity-100 text-blue-400' : 'opacity-0'}`} />
            </div>
        </button>
    );
}

// ─── Profile Detail (right panel) ────────────────────────────────────────────

function ProfileDetail({
    member,
    memberMap,
    onNavigate,
}: {
    member: FamilyMember;
    memberMap: Map<string, FamilyMember>;
    onNavigate: (id: string) => void;
}) {
    const isMale = member.gender === 1;
    const father = member.father_id ? memberMap.get(member.father_id) : null;
    const mother = member.mother_id ? memberMap.get(member.mother_id) : null;

    // Tìm con cái
    const children = useMemo(() => {
        return Array.from(memberMap.values()).filter(
            p => p.father_id === member.id || p.mother_id === member.id
        ).sort((a, b) => a.birth_order - b.birth_order);
    }, [member.id, memberMap]);

    // Tìm anh chị em (cùng cha hoặc cùng mẹ)
    const siblings = useMemo(() => {
        return Array.from(memberMap.values()).filter(p => {
            if (p.id === member.id) return false;
            return (member.father_id && p.father_id === member.father_id) ||
                (member.mother_id && p.mother_id === member.mother_id);
        }).sort((a, b) => a.birth_order - b.birth_order);
    }, [member.id, member.father_id, member.mother_id, memberMap]);

    const accentColor = isMale ? 'blue' : 'rose';

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className={`px-6 py-5 border-b border-slate-100 bg-${accentColor}-50/40`}>
                <div className="flex items-start gap-4">
                    <Avatar member={member} size="lg" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold text-slate-800 leading-tight">
                                {member.full_name}
                            </h2>
                            {!member.is_alive && (
                                <span className="text-[10px] font-semibold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                                    Đã mất
                                </span>
                            )}
                        </div>
                        {member.nick_name && (
                            <p className="text-sm italic text-slate-500 mt-0.5">"{member.nick_name}"</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <GenBadge gen={member.generation_number} />
                            <span className="text-[11px] text-slate-400">
                                {isMale ? '♂ Nam' : '♀ Nữ'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                {getAge(member.date_of_birth, member.date_of_death, member.is_alive)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Timeline sinh – mất */}
                <div className="mt-4 flex items-center gap-3">
                    <div className={`flex-1 bg-white rounded-lg px-3 py-2 border border-${accentColor}-100`}>
                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Sinh</p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">
                            {member.date_of_birth
                                ? new Date(member.date_of_birth).toLocaleDateString('vi-VN')
                                : 'Không rõ'}
                        </p>
                    </div>
                    {!member.is_alive && (
                        <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-slate-200">
                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Mất</p>
                            <p className="text-sm font-semibold text-slate-500 mt-0.5">
                                {member.date_of_death
                                    ? new Date(member.date_of_death).toLocaleDateString('vi-VN')
                                    : 'Không rõ'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 px-6 py-4 space-y-5">

                {/* Cha mẹ */}
                {(father || mother) && (
                    <Section title="Cha mẹ" icon={<Users size={13} />}>
                        <div className="space-y-1.5">
                            {father && (
                                <RelationCard
                                    label="Cha"
                                    member={father}
                                    onNavigate={onNavigate}
                                />
                            )}
                            {mother && (
                                <RelationCard
                                    label="Mẹ"
                                    member={mother}
                                    onNavigate={onNavigate}
                                />
                            )}
                        </div>
                    </Section>
                )}

                {/* Vợ / Chồng */}
                {member.spouses && member.spouses.length > 0 && (
                    <Section title={isMale ? 'Vợ' : 'Chồng'} icon={<Heart size={13} />}>
                        <div className="space-y-1.5">
                            {member.spouses.map(s => {
                                const spouseMember = memberMap.get(s.id);
                                if (!spouseMember) return (
                                    <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
                                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-400">?</div>
                                        <span className="text-sm text-slate-600">{s.full_name}</span>
                                    </div>
                                );
                                return (
                                    <RelationCard
                                        key={s.id}
                                        label={s.gender === 1 ? 'Chồng' : 'Vợ'}
                                        member={spouseMember}
                                        onNavigate={onNavigate}
                                    />
                                );
                            })}
                        </div>
                    </Section>
                )}

                {/* Con cái */}
                {children.length > 0 && (
                    <Section title={`Con cái (${children.length})`} icon={<Baby size={13} />}>
                        <div className="space-y-1.5">
                            {children.map(child => (
                                <RelationCard
                                    key={child.id}
                                    label={`Con thứ ${child.birth_order}`}
                                    member={child}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    </Section>
                )}

                {/* Anh chị em */}
                {siblings.length > 0 && (
                    <Section title={`Anh chị em (${siblings.length})`} icon={<Users size={13} />}>
                        <div className="space-y-1.5">
                            {siblings.map(sib => (
                                <RelationCard
                                    key={sib.id}
                                    label={`Con thứ ${sib.birth_order}`}
                                    member={sib}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    </Section>
                )}
            </div>
        </div>
    );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-1.5 mb-2">
                <span className="text-slate-400">{icon}</span>
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
            </div>
            {children}
        </div>
    );
}

// ─── Relation card ───────────────────────────────────────────────────────────

function RelationCard({
    member,
    label,
    onNavigate,
}: {
    member: FamilyMember;
    label: string;
    onNavigate: (id: string) => void;
}) {
    const isMale = member.gender === 1;
    return (
        <button
            onClick={() => onNavigate(member.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-left
                ${isMale
                    ? 'bg-blue-50/60 border-blue-100 hover:bg-blue-100/60'
                    : 'bg-rose-50/60 border-rose-100 hover:bg-rose-100/60'
                }
                ${!member.is_alive ? 'opacity-60' : ''}
            `}
        >
            <Avatar member={member} size="sm" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{member.full_name}</p>
                <p className="text-[10px] text-slate-400">
                    {label} · {formatYear(member.date_of_birth)}
                    {!member.is_alive && ` – ${formatYear(member.date_of_death)}`}
                </p>
            </div>
            <ArrowUpRight size={12} className="text-slate-300 shrink-0" />
        </button>
    );
}

// Main Page ────────────────────────────────────────────────────────────────

export default function MembersPage() {
    const treeId = "019d2848-5228-7551-934d-934dae4131fa";

    const { data: rawData = [], isLoading, isError } = useQuery({
        queryKey: ['members', treeId],
        queryFn: () => getFamilyMembers(treeId),
        enabled: !!treeId,
        retry: 1,
    });

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterGen, setFilterGen] = useState<number | null>(null);
    const [filterAlive, setFilterAlive] = useState<boolean | null>(null);
    const [filterGender, setFilterGender] = useState<number | null>(null);

    // Build O(1) lookup map
    const memberMap = useMemo(
        () => new Map(rawData.map(m => [m.id, m])),
        [rawData]
    );

    // Unique generations for filter pills
    const generations = useMemo(
        () => [...new Set(rawData.map(m => m.generation_number))].sort((a, b) => a - b),
        [rawData]
    );

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return rawData
            .filter(m => {
                if (q && !m.full_name.toLowerCase().includes(q) &&
                    !(m.nick_name?.toLowerCase().includes(q))) return false;
                if (filterGen !== null && m.generation_number !== filterGen) return false;
                if (filterAlive !== null && m.is_alive !== filterAlive) return false;
                if (filterGender !== null && m.gender !== filterGender) return false;
                return true;
            })
            .sort((a, b) =>
                a.generation_number !== b.generation_number
                    ? a.generation_number - b.generation_number
                    : a.birth_order - b.birth_order
            );
    }, [rawData, search, filterGen, filterAlive, filterGender]);

    const selectedMember = selectedId ? memberMap.get(selectedId) : null;

    const handleNavigate = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    const hasFilters = filterGen !== null || filterAlive !== null || filterGender !== null;

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

            {/* ── Left Panel ── */}
            <div className="w-80 h-screen shrink-0 flex flex-col border-r border-slate-100 bg-slate-50/50 overflow-hidden">

                {/* Search */}
                <div className="p-3 border-b border-slate-100">
                    <div className="relative">
                        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm tên, tên thường gọi..."
                            className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg
                                       outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300
                                       placeholder:text-slate-300"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="px-3 py-2 border-b border-slate-100 space-y-2">
                    {/* Thế hệ */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Filter size={10} className="text-slate-400 shrink-0" />
                        {generations.map(g => (
                            <button
                                key={g}
                                onClick={() => setFilterGen(filterGen === g ? null : g)}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all
                                    ${filterGen === g
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                Đời {g}
                            </button>
                        ))}
                    </div>
                    {/* Giới tính & Còn sống */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                            { label: '♂ Nam', val: 1, key: 'gender' },
                            { label: '♀ Nữ', val: 0, key: 'gender' },
                            { label: '✦ Còn sống', val: true, key: 'alive' },
                            { label: '✝ Đã mất', val: false, key: 'alive' },
                        ].map(f => {
                            const isActive = f.key === 'gender' ? filterGender === f.val : filterAlive === f.val;
                            return (
                                <button
                                    key={f.label}
                                    onClick={() => {
                                        if (f.key === 'gender')
                                            setFilterGender(isActive ? null : f.val as number);
                                        else
                                            setFilterAlive(isActive ? null : f.val as boolean);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all
                                        ${isActive
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                        {hasFilters && (
                            <button
                                onClick={() => { setFilterGen(null); setFilterAlive(null); setFilterGender(null); }}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-400 hover:bg-red-100"
                            >
                                Xoá lọc
                            </button>
                        )}
                    </div>
                </div>

                {/* Count */}
                <div className="px-3 py-1.5 text-[10px] text-slate-400 border-b border-slate-100">
                    {filtered.length} / {rawData.length} thành viên
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center text-slate-400 text-xs py-10">
                            Không tìm thấy thành viên
                        </div>
                    ) : (
                        Object.entries(
                            filtered.reduce<Record<number, FamilyMember[]>>((acc, m) => {
                                (acc[m.generation_number] ??= []).push(m);
                                return acc;
                            }, {})
                        )
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([gen, members]) => (
                            <div key={gen}>
                                <div className="sticky top-0 z-10 px-3 py-1 bg-slate-100/90 backdrop-blur-sm
                                                border-y border-slate-200 flex items-center gap-1.5">
                                    <Leaf size={10} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Đời {gen}
                                    </span>
                                    <span className="ml-auto text-[10px] text-slate-400">
                                        {members.length} người
                                    </span>
                                </div>
                                <div className="p-2 space-y-0.5">
                                    {members.map(m => (
                                        <MemberRow
                                            key={m.id}
                                            member={m}
                                            isSelected={m.id === selectedId}
                                            onClick={() => setSelectedId(m.id === selectedId ? null : m.id)}
                                            memberMap={memberMap}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Right Panel ── */}
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