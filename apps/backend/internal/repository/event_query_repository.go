package repository

import (
	"context"
	"math"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/domain"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/models"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/utils"
)

type eventRepository struct {
	db *gorm.DB
}

// NewEventRepository returns a domain.EventRepository backed by PostgreSQL.
func NewEventRepository(db *gorm.DB) domain.EventRepository {
	return &eventRepository{db: db}
}

// GetByTreeID retrieves a paginated, filtered list of events for a given tree.
func (r *eventRepository) GetByTreeID(
	ctx context.Context,
	treeID uuid.UUID,
	filter domain.EventFilterRequest,
) ([]domain.EventResponse, int64, error) {

	query := r.db.WithContext(ctx).Model(&models.Event{}).Where("tree_id = ?", treeID)

	if filter.EventType != "" {
		query = query.Where("event_type = ?", filter.EventType)
	}
	if filter.IsLunar != nil {
		query = query.Where("is_lunar = ?", *filter.IsLunar)
	}

	if filter.Upcoming != nil && *filter.Upcoming {
		today := time.Now()
		days := filter.UpcomingDays
		if days <= 0 {
			days = 30
		}
		deadline := today.AddDate(0, 0, days)

		tMMDD := today.Format("01-02")
		dMMDD := deadline.Format("01-02")

		if dMMDD < tMMDD {
			// For cases spanning multiple years (e.g., from December 2020 to January 2019)
			// Take from today until the end of the year OR from the beginning of the year until the deadline
			query = query.Where(
				"(TO_CHAR(event_date, 'MM-DD') >= ? OR TO_CHAR(event_date, 'MM-DD') <= ?)",
				tMMDD, dMMDD,
			)
		} else {
			// Cases within the same year
			query = query.Where("TO_CHAR(event_date, 'MM-DD') BETWEEN ? AND ?", tMMDD, dMMDD)
		}
	} else {
		if filter.FromDate != "" {
			query = query.Where("event_date >= ?", filter.FromDate)
		}
		if filter.ToDate != "" {
			query = query.Where("event_date <= ?", filter.ToDate)
		}
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := utils.NormalizePage(filter.Page, filter.PageSize)

	var events []models.Event
	// Sort by MM-DD so that upcoming events appear at the top in chronological order of the year
	if err := query.
		Order("event_date DESC").
		Limit(pageSize).
		Offset((page - 1) * pageSize).
		Find(&events).Error; err != nil {
		return nil, 0, err
	}

	result := make([]domain.EventResponse, len(events))
	for i, e := range events {
		result[i] = toEventResponse(e)
	}

	return result, total, nil
}

// GetByID retrieves a single event scoped to the given tree.
func (r *eventRepository) GetByID(ctx context.Context, treeID, eventID uuid.UUID) (*domain.EventResponse, error) {
	var event models.Event
	if err := r.db.WithContext(ctx).
		Where("id = ? AND tree_id = ?", eventID, treeID).
		First(&event).Error; err != nil {
		return nil, err
	}
	resp := toEventResponse(event)
	return &resp, nil
}

// Create inserts a new event record under the given tree.
func (r *eventRepository) Create(
	ctx context.Context,
	treeID uuid.UUID,
	req domain.CreateEventRequest,
) (*domain.EventResponse, error) {

	reminderDays := req.ReminderDays
	if reminderDays == 0 {
		reminderDays = 3
	}

	event := models.Event{
		TreeID:       treeID,
		Title:        req.Title,
		Description:  req.Description,
		EventDate:    req.EventDate,
		IsLunar:      req.IsLunar,
		EventType:    req.EventType,
		ReminderDays: reminderDays,
	}

	if err := r.db.WithContext(ctx).Create(&event).Error; err != nil {
		return nil, err
	}

	resp := toEventResponse(event)
	return &resp, nil
}

// Update applies a partial update — only non-nil fields in req are written.
func (r *eventRepository) Update(
	ctx context.Context,
	treeID, eventID uuid.UUID,
	req domain.UpdateEventRequest,
) (*domain.EventResponse, error) {

	var event models.Event
	if err := r.db.WithContext(ctx).
		Where("id = ? AND tree_id = ?", eventID, treeID).
		First(&event).Error; err != nil {
		return nil, err
	}

	updates := map[string]any{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.EventDate != nil {
		updates["event_date"] = *req.EventDate
	}
	if req.IsLunar != nil {
		updates["is_lunar"] = *req.IsLunar
	}
	if req.EventType != nil {
		updates["event_type"] = *req.EventType
	}
	if req.ReminderDays != nil {
		updates["reminder_days"] = *req.ReminderDays
	}

	if err := r.db.WithContext(ctx).Model(&event).Updates(updates).Error; err != nil {
		return nil, err
	}

	resp := toEventResponse(event)
	return &resp, nil
}

// Delete permanently removes an event scoped to the given tree.
func (r *eventRepository) Delete(ctx context.Context, treeID, eventID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND tree_id = ?", eventID, treeID).
		Delete(&models.Event{}).Error
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

func toEventResponse(e models.Event) domain.EventResponse {
	daysUntil := daysUntilNext(e.EventDate)
	reminderDays := e.ReminderDays
	if reminderDays == 0 {
		reminderDays = 3
	}

	return domain.EventResponse{
		ID:            e.ID,
		TreeID:        e.TreeID,
		Title:         e.Title,
		Description:   e.Description,
		EventDate:     e.EventDate,
		IsLunar:       e.IsLunar,
		EventType:     e.EventType,
		ReminderDays:  reminderDays,
		DaysUntil:     daysUntil,
		IsUpcoming:    daysUntil <= reminderDays,
		NeedsReminder: daysUntil == reminderDays,
		CreatedAt:     e.CreatedAt,
	}
}

// daysUntilNext returns days until the next annual recurrence (always >= 0).
// If the date has already passed this year, it rolls over to next year.
func daysUntilNext(eventDate time.Time) int {
	now := time.Now().Truncate(24 * time.Hour)
	next := time.Date(now.Year(), eventDate.Month(), eventDate.Day(), 0, 0, 0, 0, now.Location())
	if next.Before(now) {
		next = next.AddDate(1, 0, 0)
	}
	return int(math.Round(next.Sub(now).Hours() / 24))
}
