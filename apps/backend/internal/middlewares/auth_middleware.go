package middlewares

import (
	"net/http"
	"strings"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/config"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks if the request contains a valid token.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		// Expected format: "Bearer <token>"
		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization format must be Bearer {token}"})
			return
		}

		// Use global RedisClient to check blacklist during verification
		claims, err := utils.VerifyJWT(c.Request.Context(), parts[1], config.RedisClient)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// Inject claims into context for downstream handlers
		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		c.Set("claims", claims)

		c.Next()
	}
}