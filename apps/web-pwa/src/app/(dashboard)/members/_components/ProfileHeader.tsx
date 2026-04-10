import { Loader2 } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { GenBadge } from '@/components/shared/GenBadge';
import { getAge } from '../utils/format';
import { PersonDetail } from '@/types/person-detail';

export function ProfileHeader({ detail, isLoading }: { detail: PersonDetail, isLoading: boolean }) {
	const isMale = detail.gender === 1;
	const accentColor = isMale ? 'blue' : 'rose';

	return (
		<div className={`px-6 py-5 border-b border-slate-100 bg-${accentColor}-50/40`}>
			<div className="flex items-start gap-4">
				<Avatar member={detail} size="lg" />
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h2 className="text-lg font-bold text-slate-800 leading-tight">
							{detail.full_name}
						</h2>
						{isLoading && (
							<Loader2 size={14} className="text-slate-300 animate-spin" />
						)}
						{!detail.is_alive && (
							<span className="text-[10px] font-semibold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
								Đã mất
							</span>
						)}
						{detail.child_type === 'adopted' && (
							<span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
								Con nuôi
							</span>
						)}
					</div>
					{detail.nick_name && (
						<p className="text-sm italic text-slate-500 mt-0.5">"{detail.nick_name}"</p>
					)}
					<div className="flex items-center gap-2 mt-2 flex-wrap">
						<GenBadge gen={detail.generation_number} />
						<span className="text-[11px] text-slate-400">{isMale ? '♂ Nam' : '♀ Nữ'}</span>
						<span className="text-[11px] text-slate-400">
							{getAge(detail.date_of_birth, detail.date_of_death, detail.is_alive)}
						</span>
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center gap-3">
				<div className={`flex-1 bg-white rounded-lg px-3 py-2 border border-${accentColor}-100`}>
					<p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Sinh</p>
					<p className="text-sm font-semibold text-slate-700 mt-0.5">
						{detail.date_of_birth
							? new Date(detail.date_of_birth).toLocaleDateString('vi-VN')
							: 'Không rõ'}
					</p>
				</div>
				{!detail.is_alive && (
					<div className="flex-1 bg-white rounded-lg px-3 py-2 border border-slate-200">
						<p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Mất</p>
						<p className="text-sm font-semibold text-slate-500 mt-0.5">
							{detail.date_of_death
								? new Date(detail.date_of_death).toLocaleDateString('vi-VN')
								: 'Không rõ'}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}