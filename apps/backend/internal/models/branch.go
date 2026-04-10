package models

import (
	"github.com/google/uuid"
)

type Branch struct {
	BaseUUID
	TreeID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"tree_id"`
	ParentID    *uuid.UUID `gorm:"type:uuid" json:"parent_id"`
	Name        string     `gorm:"size:255;not null" json:"name"`
	Description string     `gorm:"type:text" json:"description"`

	// Recursive relationship
	SubBranches []Branch `gorm:"foreignKey:ParentID" json:"sub_branches,omitempty"`
}

func (Branch) TableName() string { return "branches" }
