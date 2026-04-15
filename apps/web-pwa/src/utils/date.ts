import { format, formatDistanceToNow, isValid } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format ngày mặc định cho toàn hệ thống
 * Ví dụ: 15 Tháng Tư, 2024
 */
export function formatDate(date: Date | string | number, formatStr = "dd MMMM, yyyy") {
	const d = new Date(date);
	if (!isValid(d)) return "N/A";
	return format(d, formatStr, { locale: vi });
}

/**
 * Hiển thị thời gian tương đối (ví dụ: "5 phút trước", "2 ngày trước")
 */
export function formatRelativeTime(date: Date | string | number) {
	const d = new Date(date);
	if (!isValid(d)) return "N/A";
	return formatDistanceToNow(d, { addSuffix: true, locale: vi });
}

/**
 * Format riêng cho các sự kiện (ví dụ: "12/04")
 */
export function formatShortDate(date: Date | string | number) {
	const d = new Date(date);
	if (!isValid(d)) return "N/A";
	return format(d, "dd/MM");
}