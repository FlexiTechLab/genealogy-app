package utils

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// Response defines the standard JSON structure for the entire project
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Warning string      `json:"warning,omitempty"`
}

// Success returns a success response (200 OK)
func Success(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// Warning returned successfully but included a warning (200 OK)
func Warn(c *gin.Context, data interface{}, message string, warnMessage string) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Message: message,
		Data:    data,
		Warning: warnMessage,
	})
}

// Error returns an error response with an optional HTTP code
func Error(c *gin.Context, statusCode int, errMessage string) {
	c.JSON(statusCode, Response{
		Success: false,
		Error:   errMessage,
	})
}