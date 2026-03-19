package repository

import (
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PersonRepository struct {
	db *gorm.DB
}

func NewPersonRepository(db *gorm.DB) *PersonRepository {
	return &PersonRepository{db: db}
}

// GetTree fetches a person and their 3-generation ancestors using UUID
func (r *PersonRepository) GetTree(id uuid.UUID) (*models.Person, error) {
	var person models.Person
	
	err := r.db.
		// Preload ancestors (GORM handles nested preloading automatically)
		Preload("Father.Father"). 
		Preload("Mother").       
		Preload("Branch").       
		// Find person by UUID primary key
		First(&person, "id = ?", id).Error

	return &person, err
}

// RestorePerson recovers a soft-deleted person by setting deleted_at to NULL
func (r *PersonRepository) RestorePerson(id uuid.UUID) error {
	return r.db.Unscoped().
		Model(&models.Person{}).
		Where("id = ?", id).
		Update("deleted_at", nil).Error
}