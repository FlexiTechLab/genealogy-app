package handlers

import (
	"net/http"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService domain.AuthService
}

func NewAuthHandler(as domain.AuthService) *AuthHandler {
	return &AuthHandler{authService: as}
}

// Register processes new account registrations
func (h *AuthHandler) Register(c *gin.Context) {
	var req domain.UserRegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Dữ liệu không hợp lệ",
			"details": err.Error(),
		})
		return
	}

	user, err := h.authService.Register(req)
	// Handle business logic errors (e.g., email address already exists)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Đăng ký tài khoản thành công",
		"data":    user,
	})
}

// Login processing
func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.UserLoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thông tin đăng nhập không hợp lệ"})
		return
	}

	res, err := h.authService.Login(req)
	if err != nil {
		// Returns a 401 Unauthorized error when information is incorrect
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}
