'use client'

import { useEvents } from '../../../hooks/useEvents';
import { EventCard } from '../../../components/event/EventCard';
import { EventFilter } from '../../../components/event/EventFilter';
import { UpcomingSection } from '../../../components/event/UpcomingSection';
import { useState } from 'react';

const TREE_ID = "019d2848-5228-7551-934d-934dae4131fa";

export default function EventPage() {
	const [filterType, setFilterType] = useState('');

	const { data, isLoading } = useEvents(TREE_ID);

	const allEvents = data?.allEvents || [];
	const upcomingEvents = data?.upcomingEvents || [];

	const filteredEvents = filterType
		? allEvents.filter(e => e.event_type === filterType)
		: allEvents;

	if (isLoading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

	return (
		<div className="max-w-7xl mx-auto p-8">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				<div className="lg:col-span-8 space-y-8">
					<header>
						<h1 className="text-3xl font-extrabold text-gray-900">Sự kiện Gia tộc</h1>
						<p className="text-gray-500 mt-2">Theo dõi các ngày lễ, ngày giỗ và họp mặt trong dòng họ.</p>
					</header>

					<EventFilter selectedType={filterType} onTypeChange={setFilterType} />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredEvents.map(event => (
							<EventCard key={event.id} event={event} />
						))}

						{filteredEvents.length === 0 && (
							<p className="text-gray-500 italic">Không có sự kiện nào phù hợp.</p>
						)}
					</div>
				</div>

				<div className="lg:col-span-4">
					<UpcomingSection events={upcomingEvents} />
				</div>
			</div>
		</div>
	);
};