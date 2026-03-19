package handlers

import (
	"net/http"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/repository"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type PersonHandler struct {
	repo *repository.PersonRepository
}

func NewPersonHandler(repo *repository.PersonRepository) *PersonHandler {
	return &PersonHandler{repo: repo}
}

// GetPersonDetail handles GET /persons/:id
func (h *PersonHandler) GetPersonDetail(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	person, err := h.repo.GetTree(id)
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Person not found or has been soft-deleted")
		return
	}

	utils.Success(c, person, "Fetched person details successfully")
}

// RestorePerson handles POST /persons/:id/restore
func (h *PersonHandler) RestorePerson(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid UUID")
		return
	}

	if err := h.repo.RestorePerson(id); err != nil {
		utils.Error(c, http.StatusInternalServerError, "Failed to restore person")
		return
	}

	utils.Success(c, nil, "Person restored successfully")
}