export function getAge(
	dob?: string | null,
	dod?: string | null,
	isAlive?: boolean
): string {
	if (!dob) return '—';
	const birth = new Date(dob).getFullYear();
	const end = (!isAlive && dod) ? new Date(dod).getFullYear() : new Date().getFullYear();
	return `${end - birth} tuổi`;
}

export function formatYear(date?: string | null): string {
	return date ? String(new Date(date).getFullYear()) : '?';
}

export function getInitials(name: string): string {
	const parts = name.trim().split(' ');
	return parts[parts.length - 1]?.[0]?.toUpperCase() ?? '?';
}