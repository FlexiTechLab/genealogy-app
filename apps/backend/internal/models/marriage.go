package models

import (
	"github.com/google/uuid"
	"time"
)

type Marriage struct {
	BaseUUID
	TreeID        uuid.UUID  `gorm:"type:uuid;not null;index" json:"tree_id"`
	HusbandID     uuid.UUID  `gorm:"type:uuid;not null;index" json:"husband_id"`
	WifeID        uuid.UUID  `gorm:"type:uuid;not null;index" json:"wife_id"`
	MarriageOrder int        `gorm:"default:1" json:"marriage_order"`
	MarriageDate  *time.Time `json:"marriage_date"`
	DivorceDate   *time.Time `json:"divorce_date"`
	Note          string     `gorm:"type:text" json:"note"`
}

func (Marriage) TableName() string { return "marriages" }