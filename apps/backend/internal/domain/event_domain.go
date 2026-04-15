package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// ─── Request DTOs ─────────────────────────────────────────────────────────────

type EventFilterRequest struct {
	EventType    string `form:"event_type"`            // "birthday", "anniversary", "death", ...
	IsLunar      *bool  `form:"is_lunar"`              // nil = all, true = lunar only
	FromDate     string `form:"from_date"`             // YYYY-MM-DD
	ToDate       string `form:"to_date"`               // YYYY-MM-DD
	Upcoming     *bool  `form:"upcoming"`              // true = only upcoming events (overrides from_date)
	UpcomingDays int    `form:"upcoming_days"`         // window size in days (default=30, 0=no upper limit)
	Page         int    `form:"page,default=1"`
	PageSize     int    `form:"page_size,default=20"`
}

type CreateEventRequest struct {
	Title        string    `json:"title"      binding:"required,max=255"`
	Description  string    `json:"description"`
	EventDate    time.Time `json:"event_date" binding:"required"`
	IsLunar      bool      `json:"is_lunar"`
	EventType    string    `json:"event_type" binding:"required,max=50"`
	ReminderDays int       `json:"reminder_days"`
}

type UpdateEventRequest struct {
	Title        *string    `json:"title"      binding:"omitempty,max=255"`
	Description  *string    `json:"description"`
	EventDate    *time.Time `json:"event_date"`
	IsLunar      *bool      `json:"is_lunar"`
	EventType    *string    `json:"event_type" binding:"omitempty,max=50"`
	ReminderDays *int       `json:"reminder_days"`
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

type EventResponse struct {
	ID           uuid.UUID `json:"id"`
	TreeID       uuid.UUID `json:"tree_id"`
	Title        string    `json:"title"`
	Description  string    `json:"description,omitempty"`
	EventDate    time.Time `json:"event_date"`
	IsLunar      bool      `json:"is_lunar"`
	EventType    string    `json:"event_type"`
	ReminderDays int       `json:"reminder_days"`
	// Computed fields — populated by mapper, not stored in DB
	DaysUntil     int       `json:"days_until"`     // days until next annual recurrence (always >= 0)
	IsUpcoming    bool      `json:"is_upcoming"`    // true if within [today, today+reminder_days]
	NeedsReminder bool      `json:"needs_reminder"` // true if today == event_date - reminder_days
	CreatedAt     time.Time `json:"created_at"`
}

type PaginatedEvents struct {
	Items      []EventResponse `json:"items"`
	TotalCount int64           `json:"total_count"`
	Page       int             `json:"page"`
	PageSize   int             `json:"page_size"`
	TotalPages int             `json:"total_pages"`
}

// ==================================================
// INTERFACE
// ==================================================

type EventRepository interface {
	// List events of a tree with optional filters and pagination
	GetByTreeID(ctx context.Context, treeID uuid.UUID, filter EventFilterRequest) ([]EventResponse, int64, error)

	// Get a single event by its ID (scoped to tree for security)
	GetByID(ctx context.Context, treeID, eventID uuid.UUID) (*EventResponse, error)

	// Create a new event under a tree
	Create(ctx context.Context, treeID uuid.UUID, req CreateEventRequest) (*EventResponse, error)

	// Partially update an event — only non-nil fields are applied
	Update(ctx context.Context, treeID, eventID uuid.UUID, req UpdateEventRequest) (*EventResponse, error)

	// Permanently delete an event (scoped to tree for security)
	Delete(ctx context.Context, treeID, eventID uuid.UUID) error
}