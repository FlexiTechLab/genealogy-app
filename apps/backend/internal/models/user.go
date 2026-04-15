package models

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// User represents the login account in the system
type User struct {
	ID    uuid.UUID `json:"id" db:"id"`
	Email string    `json:"email" db:"email"`
	// PasswordHash is never returned in JSON
	PasswordHash string `json:"-" db:"password_hash"`
	IsActive     bool   `json:"is_active" db:"is_active"`
	Role         string `json:"role" db:"role"`

	// PersonID can be null if the account is not linked to a genealogical record
	PersonID *uuid.UUID `json:"person_id,omitempty" db:"person_id"`

	// Detailed information about the person in the family tree
	Person *Person `json:"person,omitempty"`

	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
	LastLoginAt *time.Time `json:"last_login_at,omitempty" db:"last_login_at"`
}

// HashPassword takes the plain text password as input and assigns the hash to the User struct.
func (u *User) HashPassword(password string) error {
	// A cost of 12 is a good balance currently
	// It's slow enough to resist brute-force attacks but doesn't cause the server to crash during login
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}
	u.PasswordHash = string(hashedBytes)
	return nil
}

// CheckPassword compares the plaintext password entered by the user with the hash in the database.
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}
