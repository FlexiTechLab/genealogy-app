package models

import (
	"github.com/google/uuid"
)

type Tree struct {
	BaseUUID
	Name        string    `gorm:"size:255;not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	OwnerID     uuid.UUID `gorm:"type:uuid;not null;index" json:"owner_id"`
	IsPublic    bool      `gorm:"default:false" json:"is_public"`

	// Relationships
	Branches []Branch     `gorm:"foreignKey:TreeID" json:"branches,omitempty"`
	Members  []TreeMember `gorm:"foreignKey:TreeID" json:"members,omitempty"`
}

func (Tree) TableName() string { return "trees" }
