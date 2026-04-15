
import { FamilyEvent } from '@/types/event';
import { formatDate } from '@/utils';
import { Calendar, Bell, Moon, CheckCircle2, Church, PartyPopper } from 'lucide-react';

export const EventCard = ({
	event,
	variant = 'default'
}: {
	event: FamilyEvent,
	variant?: 'default' | 'condensed'
}) => {
	const isDeathAnniversary = event.event_type === 'death_anniversary';

	const isPast = event.days_until < 0;

	if (variant === 'condensed') {
		return (
			<div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/50 border border-transparent group-hover:border-slate-100 transition-all">
				{/* Icon thu nhỏ đại diện cho loại sự kiện */}
				<div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
					{event.event_type === 'death_anniversary' ? <Church size={16} /> : <PartyPopper size={16} />}
				</div>

				<div className="flex-1 min-w-0">
					<p className="text-[13px] font-medium text-slate-700 truncate">
						{event.description || event.title}
					</p>
					<div className="flex items-center gap-2 mt-0.5">
						<span className="text-[10px] text-slate-400">
							{formatDate(event.event_date)}
						</span>
						{event.is_lunar && (
							<span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md font-bold">
								ÂM LỊCH
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`p-4 rounded-xl border-l-4 shadow-sm transition-all bg-white 
            ${isPast ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}
            ${isDeathAnniversary ? 'border-l-gray-600' : 'border-l-blue-500'}
        `}>
			<div className="flex justify-between items-start">
				<div>
					<div className="flex items-center gap-2">
						<h3 className={`font-bold text-lg ${isPast ? 'text-gray-500 line-through decoration-gray-400' : 'text-gray-800'}`}>
							{event.title}
						</h3>
						{isPast && <CheckCircle2 size={16} className="text-green-500" aria-label="Đã diễn ra" />}
					</div>

					<p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
						<Calendar size={14} />
						{new Date(event.event_date).toLocaleDateString('vi-VN')}
						{event.is_lunar && (
							<span title="Âm lịch" className="flex items-center">
								<Moon size={14} className="text-amber-500" />
							</span>
						)}
					</p>
				</div>

				{/* Status Badge */}
				{!isPast && event.days_until <= 30 && (
					<span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
						Còn {event.days_until} ngày
					</span>
				)}
				{isPast && (
					<span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
						Đã qua
					</span>
				)}
			</div>

			<p className={`mt-3 text-sm line-clamp-2 ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
				{event.description}
			</p>

			{/* Chỉ hiện nhắc nhở cho sự kiện chưa tới */}
			{!isPast && event.needs_reminder && (
				<div className="mt-4 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
					<Bell size={12} /> Nhắc nhở trước {event.reminder_days} ngày
				</div>
			)}
		</div>
	);
};