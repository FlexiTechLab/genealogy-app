package handlers

import (
	"net/http"
	"strconv"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/domain"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/repository"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type GenealogyHandler struct {
	repo repository.PersonQueryRepository
}

func NewGenealogyHandler(repo repository.PersonQueryRepository) *GenealogyHandler {
	return &GenealogyHandler{repo: repo}
}

// ==================================================
// GET /api/v1/trees/:tree_id/persons
// Filter and search members within a specific family tree
// Query: branch_id, gender, is_alive, generation_number, full_name, page, page_size
// ==================================================
func (h *GenealogyHandler) FilterPersons(c *gin.Context) {
	treeIDStr := c.Param("tree_id")
	if _, err := uuid.Parse(treeIDStr); err != nil {
		utils.Error(c, http.StatusBadRequest, "tree_id không hợp lệ")
		return
	}

	var req domain.PersonFilterRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "Tham số truy vấn không hợp lệ: "+err.Error())
		return
	}
	req.TreeID = treeIDStr

	result, err := h.repo.FilterPersons(c.Request.Context(), req)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, result, "Lấy danh sách thành viên thành công")
}

// ==================================================
// GET /api/v1/trees/:tree_id/persons/:person_id
// Retrieve person details: parents, spouses, children, and siblings
// ==================================================
func (h *GenealogyHandler) GetPersonDetail(c *gin.Context) {
	treeID, personID, ok := parseTreeAndPersonID(c)
	if !ok {
		return
	}

	detail, err := h.repo.GetPersonDetail(c.Request.Context(), treeID, personID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, err.Error())
		return
	}

	utils.Success(c, detail, "Lấy thông tin chi tiết thành công")
}

// ==================================================
// GET /api/v1/trees/:tree_id/persons/:person_id/lineage
// Retrieve comprehensive lineage: ancestors (upward) and descendants (downward)
// Query: ancestor_depth (default=3), descendant_depth (default=3)
// ==================================================
func (h *GenealogyHandler) GetLineage(c *gin.Context) {
	treeID, personID, ok := parseTreeAndPersonID(c)
	if !ok {
		return
	}

	ancestorDepth := queryIntDefault(c, "ancestor_depth", 3, 1, 10)
	descendantDepth := queryIntDefault(c, "descendant_depth", 3, 1, 10)

	result, err := h.repo.GetLineageFromPerson(c.Request.Context(), treeID, personID, ancestorDepth, descendantDepth)
	if err != nil {
		utils.Error(c, http.StatusNotFound, err.Error())
		return
	}

	utils.Success(c, result, "Lấy dòng họ thành công")
}

// ==================================================
// GET /api/v1/trees/:tree_id/persons/:person_id/ancestors
// Retrieve ancestor tree only (moving upward)
// Query: depth (default=3)
// ==================================================
func (h *GenealogyHandler) GetAncestors(c *gin.Context) {
	treeID, personID, ok := parseTreeAndPersonID(c)
	if !ok {
		return
	}

	depth := queryIntDefault(c, "depth", 3, 1, 10)

	result, err := h.repo.GetLineageFromPerson(c.Request.Context(), treeID, personID, depth, 0)
    if err != nil {
        utils.Error(c, http.StatusNotFound, err.Error())
        return
    }

	utils.Success(c, gin.H{
		"root":      result.Root,
		"ancestors": result.Ancestors,
	}, "Lấy cây tổ tiên thành công")
}

// ==================================================
// GET /api/v1/trees/:tree_id/persons/:person_id/descendants
// Retrieve descendant tree only (moving downward)
// Query: depth (default=3)
// ==================================================
func (h *GenealogyHandler) GetDescendants(c *gin.Context) {
	treeID, personID, ok := parseTreeAndPersonID(c)
	if !ok {
		return
	}

	depth := queryIntDefault(c, "depth", 3, 1, 10)

	result, err := h.repo.GetLineageFromPerson(c.Request.Context(), treeID, personID, 0, depth)
	if err != nil {
		utils.Error(c, http.StatusNotFound, err.Error())
		return
	}

	utils.Success(c, gin.H{
		"root":        result.Root.PersonSummary,
		"descendants": result.Descendants,
	}, "Lấy cây con cháu thành công")
}

// ==================================================
// GET /api/v1/trees/:tree_id/relationship
// Calculate the relationship terminology between two individuals (person_b -> person_a)
// Query: person_a_id, person_b_id (required)
// ==================================================
func (h *GenealogyHandler) GetRelationship(c *gin.Context) {
	treeIDStr := c.Param("tree_id")
	treeID, err := uuid.Parse(treeIDStr)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "tree_id không hợp lệ")
		return
	}

	var req domain.RelationshipQueryRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "Thiếu tham số: person_a_id và person_b_id là bắt buộc")
		return
	}

	personAID, err := uuid.Parse(req.PersonAID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "person_a_id không hợp lệ")
		return
	}
	personBID, err := uuid.Parse(req.PersonBID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "person_b_id không hợp lệ")
		return
	}

	if personAID == personBID {
		utils.Error(c, http.StatusBadRequest, "person_a_id và person_b_id không được trùng nhau")
		return
	}

	result, err := h.repo.GetRelationship(c.Request.Context(), treeID, personAID, personBID)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	if result.Distance == -1 {
		utils.Warn(c, result, "Tính toán quan hệ hoàn tất", "Không tìm thấy mối quan hệ huyết thống trực tiếp giữa 2 người này")
		return
	}

	utils.Success(c, result, "Tính toán quan hệ thành công")
}

// ==================================================
// HELPERS
// Utility functions for data mapping and internal logic
// ==================================================

func parseTreeAndPersonID(c *gin.Context) (uuid.UUID, uuid.UUID, bool) {
	treeID, err := uuid.Parse(c.Param("tree_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "tree_id không hợp lệ")
		return uuid.Nil, uuid.Nil, false
	}
	personID, err := uuid.Parse(c.Param("person_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "person_id không hợp lệ")
		return uuid.Nil, uuid.Nil, false
	}
	return treeID, personID, true
}

func queryIntDefault(c *gin.Context, key string, defaultVal, min, max int) int {
	raw := c.Query(key)
	if raw == "" {
		return defaultVal
	}
	v, err := strconv.Atoi(raw)
	if err != nil || v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}