import { ArrowUpRight } from 'lucide-react';
import { FamilyMember } from '@/types/genealogy';
import { Avatar } from '@/components/shared/Avatar';
import { formatYear } from '../utils/format';

// ─── Section wrapper ─────────────────────────────────────────────────────────

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export function Section({ title, icon, children }: SectionProps) {
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

interface RelationCardProps {
    member: FamilyMember;
    label: string;
    onNavigate: (id: string) => void;
}

export function RelationCard({ member, label, onNavigate }: RelationCardProps) {
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