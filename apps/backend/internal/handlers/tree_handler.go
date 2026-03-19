package handlers

import (
	"net/http"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetTrashBin handles GET /trees/:tree_id/trash
func (h *PersonHandler) GetTrashBin(c *gin.Context) {
	treeID, err := uuid.Parse(c.Param("tree_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid Tree ID")
		return
	}

	persons, err := h.repo.GetTrashBin(treeID)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Could not fetch trash bin")
		return
	}

	utils.Success(c, persons, "Fetched trash bin successfully")
}