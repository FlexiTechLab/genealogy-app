'use client';

import { Heart, Users, Baby } from 'lucide-react';
import { Section, RelationCard } from './RelationCard';
import { usePersonDetail } from '@/hooks/useFamily';
import { SpouseCard } from './SpouseCard';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSkeleton } from './ProfileSkeleton';
import { ProfileError } from './ProfileError';

interface ProfileDetailProps {
	treeId: string;
	memberId: string;
	onNavigate: (id: string) => void;
}

export function ProfileDetail({ treeId, memberId, onNavigate }: ProfileDetailProps) {
    const { data: detail, isLoading, isError } = usePersonDetail(treeId, memberId);

    if (isLoading && !detail) return <ProfileSkeleton />;
    if (isError) return <ProfileError />;
    if (!detail) return null;

    const isMale = detail.gender === 1;

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <ProfileHeader detail={detail} isLoading={isLoading} />

            <div className="flex-1 px-6 py-4 space-y-5">
                {(detail.father || detail.mother) && (
                    <Section title="Cha mẹ" icon={<Users size={13} />}>
                        <div className="space-y-1.5">
                            {detail.father && <RelationCard label="Cha" member={detail.father} onNavigate={onNavigate} />}
                            {detail.mother && <RelationCard label="Mẹ" member={detail.mother} onNavigate={onNavigate} />}
                        </div>
                    </Section>
                )}

                {(detail.spouses?.length ?? 0) > 0 && (
                    <Section title={isMale ? 'Vợ' : 'Chồng'} icon={<Heart size={13} />}>
                        <div className="space-y-1.5">
                            {detail.spouses?.map((s) => (
                                <SpouseCard key={s.person.id} spouse={s} isMaleOwner={isMale} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </Section>
                )}

                {(detail.children?.length ?? 0) > 0 && (
                    <Section title={`Con cái (${detail.children.length})`} icon={<Baby size={13} />}>
                        <div className="space-y-1.5">
                            {detail.children?.map((child, i) => (
                                <RelationCard 
                                    key={child.id} 
                                    label={`Con thứ ${child.birth_order ?? i + 1}`} 
                                    member={child} 
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