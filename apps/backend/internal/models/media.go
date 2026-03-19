package models

import (
	"github.com/google/uuid"
)

type Media struct {
	BaseUUID
	TreeID   uuid.UUID  `gorm:"type:uuid;not null;index" json:"tree_id"`
	PersonID *uuid.UUID `gorm:"type:uuid;index" json:"person_id"`
	FileName string     `gorm:"size:255;not null" json:"file_name"`
	FilePath string     `gorm:"type:text;not null" json:"file_path"`
	FileType string     `gorm:"size:50" json:"file_type"`
	MimeType string     `gorm:"size:100" json:"mime_type"`
	FileSize int64      `json:"file_size"`
	IsAvatar bool       `gorm:"default:false" json:"is_avatar"`
}

func (Media) TableName() string { return "media" }