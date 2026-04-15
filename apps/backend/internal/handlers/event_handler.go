package handlers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/domain"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/utils"
)

type EventHandler struct {
	repo domain.EventRepository
}

// NewEventHandler constructs an EventHandler.
// main.go: handlers.NewEventHandler(repository.NewEventRepository(db))
func NewEventHandler(repo domain.EventRepository) *EventHandler {
	return &EventHandler{repo: repo}
}

// ListEvents handles GET /api/v1/trees/:tree_id/events
// Query: event_type, is_lunar, from_date, to_date,
//
//	upcoming (bool), upcoming_days (int, default=30), page, page_size
func (h *EventHandler) ListEvents(c *gin.Context) {
	treeID, ok := parseTreeID(c)
	if !ok {
		return
	}

	var filter domain.EventFilterRequest
	if err := c.ShouldBindQuery(&filter); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	items, total, err := h.repo.GetByTreeID(c.Request.Context(), treeID, filter)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	pageSize := filter.PageSize
	if pageSize <= 0 {
		pageSize = 20
	}

	utils.Success(c, domain.PaginatedEvents{
		Items:      items,
		TotalCount: total,
		Page:       filter.Page,
		PageSize:   pageSize,
		TotalPages: int(math.Ceil(float64(total) / float64(pageSize))),
	}, "Lấy danh sách sự kiện thành công")
}

// GetEvent handles GET /api/v1/trees/:tree_id/events/:event_id
func (h *EventHandler) GetEvent(c *gin.Context) {
	treeID, ok := parseTreeID(c)
	if !ok {
		return
	}
	eventID, ok := parseEventID(c)
	if !ok {
		return
	}

	event, err := h.repo.GetByID(c.Request.Context(), treeID, eventID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Sự kiện không tồn tại")
		return
	}

	utils.Success(c, event, "Lấy thông tin sự kiện thành công")
}

// CreateEvent handles POST /api/v1/trees/:tree_id/events
// Body: title (required), description, event_date (required), is_lunar,
//
//	event_type (required), reminder_days (default=3)
func (h *EventHandler) CreateEvent(c *gin.Context) {
	treeID, ok := parseTreeID(c)
	if !ok {
		return
	}

	var req domain.CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	event, err := h.repo.Create(c.Request.Context(), treeID, req)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, utils.Response{
		Success: true,
		Message: "Tạo sự kiện thành công",
		Data:    event,
	})
}

// UpdateEvent handles PATCH /api/v1/trees/:tree_id/events/:event_id
// Partial update — only provided fields are applied.
func (h *EventHandler) UpdateEvent(c *gin.Context) {
	treeID, ok := parseTreeID(c)
	if !ok {
		return
	}
	eventID, ok := parseEventID(c)
	if !ok {
		return
	}

	var req domain.UpdateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	event, err := h.repo.Update(c.Request.Context(), treeID, eventID, req)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, event, "Cập nhật sự kiện thành công")
}

// DeleteEvent handles DELETE /api/v1/trees/:tree_id/events/:event_id
func (h *EventHandler) DeleteEvent(c *gin.Context) {
	treeID, ok := parseTreeID(c)
	if !ok {
		return
	}
	eventID, ok := parseEventID(c)
	if !ok {
		return
	}

	if err := h.repo.Delete(c.Request.Context(), treeID, eventID); err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, nil, "Xóa sự kiện thành công")
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

func parseTreeID(c *gin.Context) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param("tree_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "tree_id không hợp lệ")
		return uuid.Nil, false
	}
	return id, true
}

func parseEventID(c *gin.Context) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param("event_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "event_id không hợp lệ")
		return uuid.Nil, false
	}
	return id, true
}
