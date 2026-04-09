package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─────────────────────────────────────────────
// REQUEST DTOs
// ─────────────────────────────────────────────

type PersonFilterRequest struct {
	TreeID           string `form:"tree_id"`
	BranchID         string `form:"branch_id"`
	Gender           *int8  `form:"gender"` // 0: Female, 1: Male
	IsAlive          *bool  `form:"is_alive"`
	GenerationNumber *int   `form:"generation_number"`
	FullName         string `form:"full_name"` // partial match
	Page             int    `form:"page,default=1"`
	PageSize         int    `form:"page_size,default=20"`
}

type RelationshipQueryRequest struct {
	PersonAID string `form:"person_a_id" binding:"required"`
	PersonBID string `form:"person_b_id" binding:"required"`
}

// ─────────────────────────────────────────────
// RESPONSE DTOs
// ─────────────────────────────────────────────

type PersonSummary struct {
	ID               uuid.UUID         `json:"id"`
	FullName         string            `json:"full_name"`
	FatherID         *uuid.UUID        `json:"father_id,omitempty"`
	MotherID         *uuid.UUID        `json:"mother_id,omitempty"`
	Spouses          []SpouseShortInfo `json:"spouses,omitempty"`
	NickName         string            `json:"nick_name,omitempty"`
	Gender           int8              `json:"gender"`
	GenerationNumber int               `json:"generation_number"`
	BirthOrder       int               `json:"birth_order"`
	DateOfBirth      *time.Time        `json:"date_of_birth,omitempty"`
	DateOfDeath      *time.Time        `json:"date_of_death,omitempty"`
	IsAlive          bool              `json:"is_alive"`
	AvatarURL        string            `json:"avatar_url,omitempty"`
}

type SpouseShortInfo struct {
	ID       uuid.UUID `json:"id"`
	FullName string    `json:"full_name"`
	Gender   int8      `json:"gender"`
}

type PersonDetail struct {
	PersonSummary
	BranchID      *uuid.UUID      `json:"branch_id,omitempty"`
	ChildType     string          `json:"child_type"`
	LongevityInfo string          `json:"longevity_info,omitempty"`
	Father        *PersonSummary  `json:"father,omitempty"`
	Mother        *PersonSummary  `json:"mother,omitempty"`
	Spouses       []SpouseInfo    `json:"spouses,omitempty"`
	Children      []PersonSummary `json:"children,omitempty"`
	Siblings      []PersonSummary `json:"siblings,omitempty"`
}

type SpouseInfo struct {
	Person        PersonSummary `json:"person"`
	MarriageOrder int           `json:"marriage_order"`
	MarriageDate  *time.Time    `json:"marriage_date,omitempty"`
	DivorceDate   *time.Time    `json:"divorce_date,omitempty"`
	Note          string        `json:"note,omitempty"`
}

// AncestorNode - Represents an upward lineage tree from a specific person
type AncestorNode struct {
	Person   PersonSummary  `json:"person"`
	Relation string         `json:"relation"` // "father", "mother"
	Parents  []AncestorNode `json:"parents,omitempty"`
}

// DescendantNode - Represents a downward lineage tree from a specific person
type DescendantNode struct {
	Person   PersonSummary    `json:"person"`
	Spouse   *PersonSummary   `json:"spouse,omitempty"`
	Children []DescendantNode `json:"children,omitempty"`
}

// LineageResult - Complete family lineage from a specific person (both upward and downward)
type LineageResult struct {
	Root        PersonDetail    `json:"root"`
	Ancestors   *AncestorNode   `json:"ancestors,omitempty"`   // Upward to ancestors
	Descendants *DescendantNode `json:"descendants,omitempty"` // Downward to descendants
}

// RelationshipPath - Represents the directional path between two individuals
type RelationshipPath struct {
	PersonA      PersonSummary `json:"person_a"`
	PersonB      PersonSummary `json:"person_b"`
	Relationship string        `json:"relationship"` // e.g., "Siblings", "Uncle/Nephew", "Grandparent/Grandchild"
	Path         []PathStep    `json:"path"`         // Sequential steps in the lineage path
	Distance     int           `json:"distance"`     // Generational distance
}

type PathStep struct {
	Person   PersonSummary `json:"person"`
	Gender   int8          `json:"gender"`   // 1: Male, 0: Female
	Relation string        `json:"relation"` // e.g., "father of", "mother of", "child of"
}

// PaginatedPersons - Standard pagination wrapper for person summaries
type PaginatedPersons struct {
	Items      []PersonSummary `json:"items"`
	TotalCount int64           `json:"total_count"`
	Page       int             `json:"page"`
	PageSize   int             `json:"page_size"`
	TotalPages int             `json:"total_pages"`
}
