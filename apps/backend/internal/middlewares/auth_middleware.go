package middlewares

import (
	"net/http"
	"strings"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks if the request contains a valid token.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Header "Authorization: Bearer <token>"
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.Error(c, http.StatusUnauthorized, "Authorization header is required")
			c.Abort() // Stop further processing immediately
			return
		}

		// Check Bearer format
		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			utils.Error(c, http.StatusUnauthorized, "Authorization header format must be Bearer {token}")
			c.Abort()
			return
		}

		tokenString := parts[1]

		// Token Authentication Logic
		claims, err := utils.VerifyJWT(tokenString)
		if err != nil {
			utils.Error(c, http.StatusUnauthorized, "Login session has expired or is invalid")
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("userRole", claims.Role)

		c.Next()
	}
}