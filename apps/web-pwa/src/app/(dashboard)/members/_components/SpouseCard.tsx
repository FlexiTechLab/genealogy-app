import { SpouseDetail } from '@/types/person-detail';
import { Avatar } from '@/components/shared/Avatar';
import { formatYear } from '../utils/format';

interface SpouseCardProps {
    spouse: SpouseDetail;
    isMaleOwner: boolean;
    onNavigate: (id: string) => void;
}

export function SpouseCard({ spouse, isMaleOwner, onNavigate }: SpouseCardProps) {
    const { person, marriage_date, divorce_date, note, marriage_order } = spouse;
    const isMale = person.gender === 1;

    return (
        <div className={`rounded-lg border overflow-hidden ${isMale ? 'border-blue-100' : 'border-rose-100'}`}>
            <button
                onClick={() => onNavigate(person.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all
                    ${isMale ? 'bg-blue-50/60 hover:bg-blue-100/60' : 'bg-rose-50/60 hover:bg-rose-100/60'}
                    ${!person.is_alive ? 'opacity-60' : ''}`}
            >
                <Avatar member={person} size="sm" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{person.full_name}</p>
                    <p className="text-[10px] text-slate-400">
                        {isMaleOwner ? 'Vợ' : 'Chồng'}
                        {marriage_order > 1 && ` thứ ${marriage_order}`}
                        {' · '}{formatYear(person.date_of_birth)}
                        {!person.is_alive && ` – ${formatYear(person.date_of_death)}`}
                    </p>
                </div>
            </button>

            {(marriage_date || divorce_date || note) && (
				<div className="px-3 py-1.5 bg-white border-t border-slate-100 space-y-0.5">
					{marriage_date && (
						<p className="text-[10px] text-slate-500">
							<span className="font-semibold text-slate-400">Kết hôn</span>{' '}
							{new Date(marriage_date).toLocaleDateString('vi-VN')}
						</p>
					)}
					{divorce_date && (
						<p className="text-[10px] text-slate-500">
							<span className="font-semibold text-slate-400">Ly hôn</span>{' '}
							{new Date(divorce_date).toLocaleDateString('vi-VN')}
						</p>
					)}
					{note && (
						<p className="text-[10px] text-slate-400 italic">{note}</p>
					)}
				</div>
			)}
        </div>
    );
}