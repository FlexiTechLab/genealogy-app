package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseUUID replaces gorm.Model to support UUID v7 and Time-ordered IDs
type BaseUUID struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time      `gorm:"index" json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"` // Soft delete
}

// BeforeCreate hook to generate UUID v7 automatically
func (base *BaseUUID) BeforeCreate(tx *gorm.DB) error {
	id, err := uuid.NewV7()
	if err != nil {
		return err
	}
	base.ID = id
	return nil
}
