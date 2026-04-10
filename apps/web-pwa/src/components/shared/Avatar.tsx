import { FamilyMember } from '@/types/genealogy';
import { getInitials } from '@/app/(dashboard)/members/utils/format';

interface AvatarProps {
    member: FamilyMember;
    size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASS = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
} as const;

export function Avatar({ member, size = 'md' }: AvatarProps) {
    const isMale = member.gender === 1;
    const bg = isMale
        ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-200'
        : 'bg-rose-100 text-rose-500 ring-1 ring-rose-200';

    return (
        <div className={`${SIZE_CLASS[size]} ${bg} rounded-full flex items-center justify-center font-semibold shrink-0`}>
            {member.avatar_url
                ? <img src={member.avatar_url} className="w-full h-full rounded-full object-cover" alt={member.full_name} />
                : getInitials(member.full_name)
            }
        </div>
    );
}