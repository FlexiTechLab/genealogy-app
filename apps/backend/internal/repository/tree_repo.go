package repository

import (
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TreeRepository struct {
	db *gorm.DB
}

func NewTreeRepository(db *gorm.DB) *TreeRepository {
	return &TreeRepository{db: db}
}

// GetTrashBin retrieves only soft-deleted persons for the "Recycle Bin" feature
func (r *PersonRepository) GetTrashBin(treeID uuid.UUID) ([]models.Person, error) {
	var persons []models.Person
	
	// Use Unscoped to bypass the default "deleted_at IS NULL" filter
	err := r.db.Unscoped().
		Where("tree_id = ? AND deleted_at IS NOT NULL", treeID).
		Find(&persons).Error
		
	return persons, err
}

// CreateTree handles new family tree creation
func (r *TreeRepository) CreateTree(tree *models.Tree) error {
	return r.db.Create(tree).Error
}