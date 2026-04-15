import { FamilyEvent } from '@/types/event';
import { Clock, CalendarOff } from 'lucide-react'; // Thêm icon thông báo trống

export const UpcomingSection = ({ events }: { events: FamilyEvent[] }) => {
	return (
		<div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit">
			<h2 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
				<Clock size={18} className="text-blue-500" />
				Sự kiện sắp tới
			</h2>

			{events.length > 0 ? (
				<div className="space-y-6 relative before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-gray-100">
					{events.map((event) => (
						<div key={event.id} className="relative pl-8 group">
							{/* Timeline Dot */}
							<div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110 ${event.days_until <= 7 ? 'bg-red-500' : 'bg-blue-400'
								}`} />

							<div className="flex flex-col">
								<span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
									Còn {event.days_until} ngày
								</span>
								<h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
									{event.title}
								</h4>
								<p className="text-xs text-gray-500 mt-0.5">
									{new Date(event.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })}
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				/* Empty State Section */
				<div className="py-8 flex flex-col items-center justify-center text-center">
					<div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
						<CalendarOff size={20} className="text-gray-300" />
					</div>
					<p className="text-sm text-gray-500 font-medium">Không có sự kiện nào</p>
					<p className="text-[11px] text-gray-400 mt-1">
						Các sự kiện diễn ra trong 30 ngày tới sẽ xuất hiện tại đây.
					</p>
				</div>
			)}
		</div>
	);
};