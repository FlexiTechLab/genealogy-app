package domain

import (
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/models"
)

// DTOs (Data Transfer Objects)
type UserRegisterRequest struct {
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password"`
}

type UserLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserLoginResponse struct {
	User        models.User `json:"user"`
	AccessToken string      `json:"access_token"`
}

// Interfaces
type AuthService interface {
	Register(req UserRegisterRequest) (*models.User, error)
	Login(req UserLoginRequest) (*UserLoginResponse, error)
}

type UserRepository interface {
	Create(user *models.User) error
	GetByEmail(email string) (*models.User, error)
	GetByID(id string) (*models.User, error)
}
