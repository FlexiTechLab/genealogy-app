import { useMemo } from 'react';
import { Heart, Users, Baby } from 'lucide-react';
import { FamilyMember } from '@/types/genealogy';
import { Section, RelationCard } from './RelationCard';
import { getAge } from '../utils/format';
import { Avatar } from '@/components/shared/Avatar';
import { GenBadge } from '@/components/shared/GenBadge';

interface ProfileDetailProps {
    member: FamilyMember;
    memberMap: Map<string, FamilyMember>;
    onNavigate: (id: string) => void;
}

export function ProfileDetail({ member, memberMap, onNavigate }: ProfileDetailProps) {
    const isMale = member.gender === 1;
    const father = member.father_id ? memberMap.get(member.father_id) : null;
    const mother = member.mother_id ? memberMap.get(member.mother_id) : null;

    const children = useMemo(() =>
        Array.from(memberMap.values())
            .filter(p => p.father_id === member.id || p.mother_id === member.id)
            .sort((a, b) => a.birth_order - b.birth_order),
        [member.id, memberMap]
    );

    const siblings = useMemo(() =>
        Array.from(memberMap.values())
            .filter(p => {
                if (p.id === member.id) return false;
                return (member.father_id && p.father_id === member.father_id) ||
                    (member.mother_id && p.mother_id === member.mother_id);
            })
            .sort((a, b) => a.birth_order - b.birth_order),
        [member.id, member.father_id, member.mother_id, memberMap]
    );

    const accentColor = isMale ? 'blue' : 'rose';

    return (
        <div className="flex flex-col h-full overflow-y-auto">

            {/* ── Header ── */}
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
                            <span className="text-[11px] text-slate-400">{isMale ? '♂ Nam' : '♀ Nữ'}</span>
                            <span className="text-[11px] text-slate-400">
                                {getAge(member.date_of_birth, member.date_of_death, member.is_alive)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sinh / Mất */}
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

            {/* ── Body ── */}
            <div className="flex-1 px-6 py-4 space-y-5">

                {(father || mother) && (
                    <Section title="Cha mẹ" icon={<Users size={13} />}>
                        <div className="space-y-1.5">
                            {father && <RelationCard label="Cha" member={father} onNavigate={onNavigate} />}
                            {mother && <RelationCard label="Mẹ" member={mother} onNavigate={onNavigate} />}
                        </div>
                    </Section>
                )}

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