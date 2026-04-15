export type EventType = 'reunion' | 'ceremony' | 'death_anniversary' | 'wedding';

export interface FamilyEvent {
	id: string;
	tree_id: string;
	title: string;
	description: string;
	event_date: string;
	is_lunar: boolean;
	event_type: EventType;
	reminder_days: number;
	days_until: number;
	is_upcoming: boolean;
	needs_reminder: boolean;
	created_at: string;
}

export interface EventFilterParams {
	page?: number;
	page_size?: number;
	upcoming?: boolean;
	event_type?: string;
	is_lunar?: boolean;
}