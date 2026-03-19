package main

import (
	"log"
	"net/http"
	"time"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/config"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/handlers"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/middlewares"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

func main() {
	// Init DB & Auto-Migration
	dbInstance, err := config.ConnectDatabase()
	if err != nil {
		log.Fatalf("❌ Database Connection Error: %v", err)
	}
	db := dbInstance.Db

	// Init Layers
	personRepo := repository.NewPersonRepository(db)
	personHandler := handlers.NewPersonHandler(personRepo)

	// Initialize the router to default settings.
	r := gin.Default()

	// --- Group Route Configuration ---
	// Group for API Version 1
	v1 := r.Group("/api/v1")
	{
		// The full path: /api/v1/public/welcome
		v1.GET("/welcome", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Welcome!",
				"status":  "Backend (API - version 1) is running...",
				"time":    time.Now().Format("2006-01-02 15:04:05"),
			})
		})
		// The full path: /api/v1/public/health
		v1.GET("/health", func(c *gin.Context) {
			// Check the database connection by pinging
			sqlDB, err := db.DB()
			status := "Connected"
			dbError := ""

			if err != nil {
				status = "Disconnected"
				dbError = err.Error()
			} else {
				// Try a real-world ping to PostgreSQL
				if err := sqlDB.Ping(); err != nil {
					status = "Disconnected"
					dbError = err.Error()
				}
			}

			if status == "Connected" {
				c.JSON(http.StatusOK, gin.H{
					"server":   "UP",
					"database": status,
					"time":     time.Now().Format(time.RFC3339),
				})
			} else {
				// Returns a 503 error if there is a problem with the database
				c.JSON(http.StatusServiceUnavailable, gin.H{
					"server":   "UP",
					"database": status,
					"error":    dbError,
				})
			}
		})

		admin := v1.Group("/admin")
		admin.Use(middlewares.AuthMiddleware())
		{
			// --- PERSONS RESOURCE ---
			personGroup := admin.Group("/persons")
			{
				personGroup.GET("/", func(c *gin.Context) {})
				// Get details for one person (ancestors for 3 generations)
				personGroup.GET("/:id", personHandler.GetPersonDetail)

				// Recover a person who has been soft-deleted.
				personGroup.POST("/:id/restore", personHandler.RestorePerson)

				// personGroup.POST("/", personHandler.CreatePerson)
				// personGroup.PUT("/:id", personHandler.UpdatePerson)
				// personGroup.DELETE("/:id", personHandler.SoftDeletePerson)
			}

			// --- TREES RESOURCE ---
			treeGroup := v1.Group("/trees")
			{
				// Get a list of people who have been deleted from a family tree (Trash).
				treeGroup.GET("/:tree_id/trash", personHandler.GetTrashBin)
			}
		}
	}

	// Start the server on port 8080
	log.Println("🌐 Server starting on :8080")
	r.Run(":8080")
}
