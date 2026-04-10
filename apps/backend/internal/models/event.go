package models

import (
	"time"

	"github.com/google/uuid"
)

type Event struct {
	BaseUUID
	TreeID       uuid.UUID `gorm:"type:uuid;not null;index" json:"tree_id"`
	Title        string    `gorm:"size:255;not null" json:"title"`
	Description  string    `gorm:"type:text" json:"description"`
	EventDate    time.Time `gorm:"type:date;not null" json:"event_date"`
	IsLunar      bool      `gorm:"default:true" json:"is_lunar"`
	EventType    string    `gorm:"size:50" json:"event_type"`
	ReminderDays int       `gorm:"default:3" json:"reminder_days"`
}

func (Event) TableName() string { return "events" }
