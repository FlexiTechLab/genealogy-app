package models

import (
	"github.com/google/uuid"
	"time"
)

type ClanRule struct {
	BaseUUID
	
	TreeID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"tree_id"`
	BranchID    *uuid.UUID `gorm:"type:uuid;index" json:"branch_id"`
	RuleContent string     `gorm:"type:text;not null" json:"rule_content"`
	EffectiveDate *time.Time `json:"effective_date"`
	IsActive    bool       `gorm:"default:true" json:"is_active"`
	
	// Relations
	Tree   *Tree   `gorm:"foreignKey:TreeID" json:"tree,omitempty"`
	Branch *Branch `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
}

func (ClanRule) TableName() string { return "clan_rules" }