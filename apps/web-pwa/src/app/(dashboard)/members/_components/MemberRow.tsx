import { ChevronRight } from 'lucide-react';
import { FamilyMember } from '@/types/genealogy';
import { formatYear } from '../utils/format';
import { Avatar } from '@/components/shared/Avatar';
import { GenBadge } from '@/components/shared/GenBadge';

interface MemberRowProps {
    member: FamilyMember;
    isSelected: boolean;
    onClick: () => void;
    memberMap: Map<string, FamilyMember>;
}

export function MemberRow({ member, isSelected, onClick, memberMap }: MemberRowProps) {
    const isMale = member.gender === 1;
    const isDead = !member.is_alive;
    const father = member.father_id ? memberMap.get(member.father_id) : null;

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all
                ${isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'}
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
                <ChevronRight
                    size={12}
                    className={`transition-opacity ${isSelected ? 'opacity-100 text-blue-400' : 'opacity-0'}`}
                />
            </div>
        </button>
    );
}