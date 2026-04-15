"use client";

import { Users, Crown, CalendarDays, MapPin } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentEvents } from "@/components/dashboard/RecentEvents";
import { useEvents } from "@/hooks/useEvents";
import { formatShortDate } from "@/utils";
import { Card } from "@/components/ui/card";

const TREE_ID = "019d2848-5228-7551-934d-934dae4131fa";

export default function DashboardPage() {
	const { data, isLoading } = useEvents(TREE_ID);

	const allEvents = data?.allEvents || [];
	const upcomingEvents = data?.upcomingEvents || [];

	const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

	const nextEventDateDisplay = nextEvent
		? `${formatShortDate(nextEvent.event_date)} (còn ${nextEvent.days_until} ngày)`
		: "--/--";

	const nextEventStatus = nextEvent
		? `Sắp diễn ra: ${nextEvent.title}`
		: "Không có sự kiện sắp tới";

	return (
		<div className="max-w-[1400px] mx-auto space-y-8 p-6 md:p-8">
			{/* Header Section */}
			<header>
				<h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
					Tổng quan dòng họ
				</h2>
				<p className="text-slate-500 mt-1">
					Hệ thống quản lý dữ liệu gia phả trực tuyến.
				</p>
			</header>

			{/* Stats Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Thành viên"
					value="142"
					icon={<Users className="w-5 h-5" />}
				/>
				<StatCard
					title="Trưởng tộc"
					value="Cụ Nguyễn Văn A"
					icon={<Crown className="w-5 h-5" />}
				/>
				<StatCard
					title="Sự kiện sắp tới"
					value={nextEventDateDisplay}
					icon={<CalendarDays className="w-5 h-5" />}
					description={nextEventStatus}
				/>
				<StatCard
					title="Địa điểm"
					value="Hà Nội"
					icon={<MapPin className="w-5 h-5" />}
				/>
			</div>

			{/* Main Content Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				<div className="lg:col-span-4">
					<RecentEvents events={allEvents} />
				</div>

				<aside className="lg:col-span-3 space-y-6">
					<Card className="p-6">
						<h3 className="font-bold mb-4">Thông báo mới</h3>
						<p className="text-sm text-muted-foreground italic">
							Chưa có thông báo nào từ ban quản trị tộc.
						</p>
					</Card>
				</aside>
			</div>
		</div>
	);
}