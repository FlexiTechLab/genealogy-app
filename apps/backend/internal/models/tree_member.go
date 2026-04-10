package models

import (
	"time"

	"github.com/google/uuid"
)

type TreeMember struct {
	TreeID   uuid.UUID `gorm:"type:uuid;primaryKey" json:"tree_id"`
	UserID   uuid.UUID `gorm:"type:uuid;primaryKey" json:"user_id"`
	Role     string    `gorm:"size:50;default:'viewer'" json:"role"`
	JoinedAt time.Time `gorm:"autoCreateTime" json:"joined_at"`
}

func (TreeMember) TableName() string { return "tree_members" }
