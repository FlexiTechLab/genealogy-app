'use client';

import { EventCard } from '@/components/event/EventCard';
import { FamilyEvent } from '@/types/event';
import { cn, formatRelativeTime } from '@/utils';
import { History, CalendarOff, ChevronRight } from 'lucide-react';

const PAST_EVENTS_LIMIT = 5;

function isPastEvent(event: FamilyEvent, todayISO: string, todayMMDD: string): boolean {
	if (event.event_type === 'death_anniversary') {
		return event.event_date.slice(5, 10) < todayMMDD;
	}
	return event.event_date.slice(0, 10) < todayISO;
}

function sortKey(event: FamilyEvent, currentYear: string): string {
	if (event.event_type === 'death_anniversary') {
		return `${currentYear}-${event.event_date.slice(5, 10)}`;
	}
	return event.event_date.slice(0, 10);
}

export const RecentEvents = ({ events }: { events: FamilyEvent[] }) => {
	const now = new Date();
	const currentYear = now.getFullYear().toString();
	const todayISO = now.toLocaleDateString('sv-SE');
	const todayMMDD = todayISO.slice(5, 10);

	const allPastEvents = events
		.filter(e => isPastEvent(e, todayISO, todayMMDD))
		.sort((a, b) => sortKey(b, currentYear).localeCompare(sortKey(a, currentYear)));

	const recentPastEvents = allPastEvents.slice(0, PAST_EVENTS_LIMIT);

	return (
		<div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
			{/* Header */}
			<div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-slate-100 rounded-xl">
						<History size={20} className="text-slate-600" />
					</div>
					<div>
						<h2 className="text-slate-900 font-bold text-base">Sự kiện gần đây</h2>
					</div>
				</div>

				{allPastEvents.length > PAST_EVENTS_LIMIT && (
					<div className="flex -space-x-2">
						<span className="flex items-center justify-center h-7 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border-2 border-white">
							+{allPastEvents.length - PAST_EVENTS_LIMIT}
						</span>
					</div>
				)}
			</div>

			<div className="p-4">
				{recentPastEvents.length > 0 ? (
					<div className="space-y-1">
						{recentPastEvents.map((event) => {
							// Tính toán thời gian tương đối
							const timeAgo = formatRelativeTime(sortKey(event, currentYear));

							return (
								<div key={event.id} className="group relative">
									{/* Line nối giữa các sự kiện (Timeline style) */}
									<div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-100 last:hidden" />

									<div className="flex gap-4 p-3 rounded-2xl transition-all duration-200 hover:bg-slate-50">
										{/* Icon/Dot đại diện */}
										<div className={cn(
											"mt-1 w-2 h-2 rounded-full ring-4 ring-white shrink-0 z-10",
											event.event_type === 'death_anniversary' ? "bg-amber-400" : "bg-blue-400"
										)} />

										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start mb-1">
												<h3 className="text-sm font-semibold text-slate-800 truncate pr-4">
													{event.title}
												</h3>
												<span className="text-[10px] font-medium text-slate-400 whitespace-nowrap italic">
													{timeAgo}
												</span>
											</div>

											<div className="scale-[0.98] origin-left opacity-90 group-hover:opacity-100 transition-opacity">
												<EventCard event={event} variant='condensed'/>
											</div>
										</div>
									</div>
								</div>
							);
						})}

						{allPastEvents.length > PAST_EVENTS_LIMIT && (
							<button className="w-full mt-4 group flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50 transition-all text-sm font-semibold">
								Xem tất cả hoạt động
								<ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
							</button>
						)}
					</div>
				) : (
					<div className="py-12 flex flex-col items-center justify-center text-center">
						<div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
							<CalendarOff size={40} strokeWidth={1.5} />
						</div>
						<h4 className="text-slate-900 font-semibold text-sm">Giai đoạn bình lặng</h4>
						<p className="text-xs text-slate-400 max-w-[200px] mt-1">
							Chưa có sự kiện nào được ghi nhận đã diễn ra trong năm nay.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};