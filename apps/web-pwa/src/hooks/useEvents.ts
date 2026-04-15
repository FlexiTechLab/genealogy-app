import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/event'; // Giả định tên file service của bạn
import { EventFilterParams } from '@/types/event';

/**
 * Hook retrieves the list of events for a specific family tree
 */
export const useEvents = (treeId: string, params?: EventFilterParams) => {
	return useQuery({
		queryKey: ['events', treeId, params],
		queryFn: () => eventService.getEvents(treeId, params),
		enabled: !!treeId,
		staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút
		select: (response) => {
			const allEvents = response.data?.items || [];

			// Tính toán upcomingEvents ngay trong select để tối ưu hiệu năng (memoized)
			const upcomingEvents = [...allEvents]
				.filter(e => e.is_upcoming || e.days_until <= 30)
				.sort((a, b) => a.days_until - b.days_until);

			return {
				allEvents,
				upcomingEvents,
				totalCount: response.data?.total_count || 0
			};
		}
	});
};

/**
 * Hook retrieves details of a specific event
 */
export const useEventDetail = (treeId: string, eventId: string) => {
	return useQuery({
		queryKey: ['events', treeId, eventId],
		queryFn: () => eventService.getEventDetail(treeId, eventId),
		enabled: !!treeId && !!eventId,
		select: (response) => response.data,
	});
};