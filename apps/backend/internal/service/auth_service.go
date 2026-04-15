package service

import (
	"errors"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/domain"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/models"
	"gorm.io/gorm"
)

type authService struct {
	userRepo domain.UserRepository
}

func NewAuthService(ur domain.UserRepository) domain.AuthService {
	return &authService{userRepo: ur}
}

func (s *authService) Register(req domain.UserRegisterRequest) (*models.User, error) {
	if req.Password != req.ConfirmPassword {
		return nil, errors.New("mật khẩu xác nhận không khớp")
	}

	existing, err := s.userRepo.GetByEmail(req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("email đã được sử dụng")
	}

	user := &models.User{
		Email:    req.Email,
		Role:     "member",
		IsActive: true,
	}

	if err := user.HashPassword(req.Password); err != nil {
		return nil, err
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *authService) Login(req domain.UserLoginRequest) (*domain.UserLoginResponse, error) {
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, errors.New("sai thông tin đăng nhập")
	}

	if !user.CheckPassword(req.Password) {
		return nil, errors.New("sai thông tin đăng nhập")
	}

	return &domain.UserLoginResponse{
		User:        *user,
		AccessToken: "generate-your-jwt-here",
	}, nil
}
