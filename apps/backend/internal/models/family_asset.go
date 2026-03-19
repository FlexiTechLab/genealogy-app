package models

import (
	"github.com/google/uuid"
)

type FamilyAsset struct {
	BaseUUID
	
	TreeID    uuid.UUID `gorm:"type:uuid;not null;index" json:"tree_id"`
	BranchID  *uuid.UUID `gorm:"type:uuid;index" json:"branch_id"`
	AssetType string    `gorm:"size:100" json:"asset_type"`
	Title     string    `gorm:"size:255;not null" json:"title"`
	Content   string    `gorm:"type:text" json:"content"`

	// Relations
	Tree   *Tree   `gorm:"foreignKey:TreeID" json:"tree,omitempty"`
	Branch *Branch `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
}

func (FamilyAsset) TableName() string { return "family_assets" }