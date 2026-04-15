package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/config"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/handlers"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/service"

	// "github.com/FlexiTechLab/genealogy-app/apps/backend/internal/middlewares"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Init DB & Auto-Migration
	dbInstance, err := config.ConnectDatabase()
	if err != nil {
		log.Fatalf("❌ Database Connection Error: %v", err)
	}
	db := dbInstance.Db

	// Init Repositories
	userRepo := repository.NewUserRepository(db)
	personQueryRepo := repository.NewPersonQueryRepository(db)
	eventQueryRepo := repository.NewEventRepository(db)

	// Init Services
	authService := service.NewAuthService(userRepo)

	// Init Handlers
	authHandler := handlers.NewAuthHandler(authService)
	genealogyHandler := handlers.NewGenealogyHandler(personQueryRepo)
	eventHandler := handlers.NewEventHandler(eventQueryRepo)

	// Router
	// Initialize the router to default settings.
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

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

		// Auth Routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// -- Trees & Genealogy (authenticated)
		trees := v1.Group("/trees")
		// trees.Use(middlewares.AuthMiddleware())
		{
			// Filter and search members within a specific family tree
			// GET /api/v1/trees/:tree_id/persons
			// Query: branch_id, gender, is_alive, generation_number, full_name, page, page_size
			trees.GET("/:tree_id/persons/search", genealogyHandler.FilterPersons)

			// GET /api/v1/trees/:tree_id/persons
			// GetAllFamilyMembers handles the HTTP GET request to retrieve the ENTIRE genealogy tree
			trees.GET("/:tree_id/persons", genealogyHandler.GetAllFamilyMembers)

			// Retrieve person details: parents, spouses, children, and siblings
			// GET /api/v1/trees/:tree_id/persons/:person_id
			trees.GET("/:tree_id/persons/:person_id", genealogyHandler.GetPersonDetail)

			// Retrieve comprehensive lineage: ancestors (upward) and descendants (downward).
			// GET /api/v1/trees/:tree_id/persons/:person_id/lineage
			// Query: ancestor_depth (1-10, default=3), descendant_depth (1-10, default=3)
			trees.GET("/:tree_id/persons/:person_id/lineage", genealogyHandler.GetLineage)

			// Retrieve ancestor tree only (moving upward)
			// GET /api/v1/trees/:tree_id/persons/:person_id/ancestors
			// Query: depth (1-10, default=3)
			trees.GET("/:tree_id/persons/:person_id/ancestors", genealogyHandler.GetAncestors)

			// Retrieve descendant tree only (moving downward)
			// GET /api/v1/trees/:tree_id/persons/:person_id/descendants
			// Query: depth (1-10, default=3)
			trees.GET("/:tree_id/persons/:person_id/descendants", genealogyHandler.GetDescendants)

			// Calculate the relationship terminology between two individuals
			// GET /api/v1/trees/:tree_id/relationship
			// Query: person_a_id (required), person_b_id (required)
			trees.GET("/:tree_id/relationship", genealogyHandler.GetRelationship)

			// List all events of a family tree with optional filters
			// GET /api/v1/trees/:tree_id/events
			// Query: event_type, is_lunar, from_date (YYYY-MM-DD), to_date (YYYY-MM-DD),
			//        upcoming (bool), page, page_size
			trees.GET("/:tree_id/events", eventHandler.ListEvents)

			// Create a new event for a family tree
			// POST /api/v1/trees/:tree_id/events
			// Body: title (required), description, event_date (required), is_lunar,
			//       event_type (required), reminder_days (default=3)
			trees.POST("/:tree_id/events", eventHandler.CreateEvent)

			// Retrieve a single event by ID
			// GET /api/v1/trees/:tree_id/events/:event_id
			trees.GET("/:tree_id/events/:event_id", eventHandler.GetEvent)

			// Partially update an event (only provided fields are updated)
			// PATCH /api/v1/trees/:tree_id/events/:event_id
			// Body: title, description, event_date, is_lunar, event_type, reminder_days
			trees.PATCH("/:tree_id/events/:event_id", eventHandler.UpdateEvent)

			// Delete an event permanently
			// DELETE /api/v1/trees/:tree_id/events/:event_id
			trees.DELETE("/:tree_id/events/:event_id", eventHandler.DeleteEvent)
		}
	}

	// Start the server on port 8080
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🌐 Server starting on :%s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
