package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"database/sql"

	"github.com/golang-migrate/migrate/v4"
	pg_migrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Database struct encapsulates the gorm.DB instance
// This makes it easy to extend if you later use multiple databases (Read/Write Replicas)
type Database struct {
	Db *gorm.DB
}

// ConnectDatabase now returns an instance instead of assigning it to a global variable.
func ConnectDatabase() (*Database, error) {
	dsn := os.Getenv("DB_DSN")

	// Intelligent logger configuration based on the environment.
	logLevel := logger.Silent
	if os.Getenv("APP_ENV") == "development" {
		logLevel = logger.Info
	}

	// Connect DB
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
		// Performance optimization: Disable default statement preparation if not needed
		PrepareStmt: true,
	})

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Connection Pool Configuration (Optimized for Production)
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Run Migration using this shared sqlDB.
	if err := RunMigrationsWithDB(sqlDB); err != nil {
		return nil, err
	}

	log.Println("✅ Database & Migrations are ready!")
	return &Database{Db: db}, nil
}

func RunMigrationsWithDB(sqlDB *sql.DB) error {

	driver, err := pg_migrate.WithInstance(sqlDB, &pg_migrate.Config{})
	if err != nil {
		return fmt.Errorf("could not create migrate driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"postgres",
		driver,
	)
	if err != nil {
		return fmt.Errorf("migrate instance error: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migration failed: %w", err)
	}

	if err == migrate.ErrNoChange {
		log.Println("ℹ️ No new migrations.")
	} else {
		log.Println("🚀 Migrated successfully!")
	}
	return nil
}
