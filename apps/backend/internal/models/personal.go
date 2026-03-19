package models

import (
	"github.com/google/uuid"
	"time"
)

type Person struct {
	BaseUUID
	TreeID           uuid.UUID  `gorm:"type:uuid;not null;index" json:"tree_id"`
	BranchID         *uuid.UUID `gorm:"type:uuid;index" json:"branch_id"`
	FullName         string     `gorm:"size:255;not null;index" json:"full_name"`
	NickName         string     `gorm:"size:255" json:"nick_name"`
	Gender           int8       `gorm:"type:smallint;check:gender IN (0, 1)" json:"gender"` // 0: Female, 1: Male
	GenerationNumber int        `gorm:"not null;index" json:"generation_number"`
	BirthOrder       int        `json:"birth_order"`

	// Life info
	DateOfBirth  *time.Time `json:"date_of_birth"`
	DateOfDeath  *time.Time `json:"date_of_death"`
	IsAlive      bool       `gorm:"default:true" json:"is_alive"`
	LongevityInfo string     `gorm:"type:text" json:"longevity_info"`

	// Relationships (Self-referencing)
	FatherID     *uuid.UUID `gorm:"type:uuid" json:"father_id"`
	MotherID     *uuid.UUID `gorm:"type:uuid" json:"mother_id"`
	Father       *Person    `gorm:"foreignKey:FatherID" json:"father,omitempty"`
	Mother       *Person    `gorm:"foreignKey:MotherID" json:"mother,omitempty"`

	ChildType    string     `gorm:"size:50;default:'biological'" json:"child_type"`
	SyncHash     string     `gorm:"size:64" json:"-"`
	Metadata     JSONB      `gorm:"type:jsonb" json:"metadata"`
}

func (Person) TableName() string { return "persons" }