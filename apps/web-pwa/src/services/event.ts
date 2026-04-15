import axiosClient from '@/lib/axios';
import { ApiResponse, PaginatedData } from '@/types/api';
import { EventFilterParams, FamilyEvent } from '@/types/event';

export const eventService = {
	/**
	 * Lấy danh sách sự kiện của một gia phả (có hỗ trợ filter và phân trang)
	 */
	getEvents: (
		treeId: string,
		params?: EventFilterParams
	): Promise<ApiResponse<PaginatedData<FamilyEvent>>> => {
		return axiosClient.get(`/trees/${treeId}/events`, { params });
	},

	/**
	 * Lấy chi tiết một sự kiện cụ thể
	 */
	getEventDetail: (
		treeId: string,
		eventId: string
	): Promise<ApiResponse<FamilyEvent>> => {
		return axiosClient.get(`/trees/${treeId}/events/${eventId}`);
	}
};