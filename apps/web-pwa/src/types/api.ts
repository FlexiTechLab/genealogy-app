export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface PaginatedData<T> {
	items: T[];
	total_count: number;
	page: number;
	page_size: number;
	total_pages: number;
}