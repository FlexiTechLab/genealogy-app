package utils

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

// Role defines a custom type for user authorization levels
type Role string

const (
	RoleAdmin Role = "admin"
	RoleUser  Role = "user"

	// TokenDuration defines how long the JWT remains valid
	TokenDuration = 24 * time.Hour
	// BlacklistPrefix is used for Redis keys to avoid collisions
	BlacklistPrefix = "jwt_blacklist:"
)

// Custom errors for clearer API responses
var (
	ErrInvalidToken     = errors.New("invalid token")
	ErrExpiredToken     = errors.New("token has expired")
	ErrRevokedToken     = errors.New("token has been revoked")
	ErrUnexpectedMethod = errors.New("unexpected signing method")
)

// CustomClaims represents the payload structure of the JWT
type CustomClaims struct {
	UserID uuid.UUID `json:"user_id"`
	Role   Role      `json:"role"`
	jwt.RegisteredClaims
}

// GetSecret fetches the secret key from environment variables with a fallback check
func GetSecret() []byte {
	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		// In production, you should handle this as a fatal error
		return []byte("default_fallback_secret_do_not_use_in_prod")
	}
	return []byte(secret)
}

// GenerateJWT creates a new HS256 signed token for a specific user.
func GenerateJWT(userID uuid.UUID, role Role) (string, error) {
	now := time.Now()
	jwtSecret := GetSecret()

	claims := &CustomClaims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(TokenDuration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Subject:   userID.String(),
			ID:        uuid.NewString(), // Unique JTI for revocation tracking
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// VerifyJWT validates the token string and checks the Redis blacklist for revoked JTIs.
func VerifyJWT(ctx context.Context, tokenStr string, rdb *redis.Client) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &CustomClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrUnexpectedMethod
		}
		return GetSecret(), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	// Check if token's JTI exists in the server-side Redis blacklist
	if rdb != nil {
		exists, _ := rdb.Exists(ctx, BlacklistPrefix+claims.ID).Result()
		if exists > 0 {
			return nil, ErrRevokedToken
		}
	}

	return claims, nil
}

// RevokeJWT blacklists the token's JTI in Redis until its natural expiration.
func RevokeJWT(ctx context.Context, claims *CustomClaims, rdb *redis.Client) error {
	if rdb == nil || claims.ID == "" {
		return errors.New("missing redis client or JTI")
	}

	remaining := time.Until(claims.ExpiresAt.Time)
	if remaining <= 0 {
		return nil
	}

	// Persist the revoked JTI on the Redis server
	return rdb.Set(ctx, BlacklistPrefix+claims.ID, "revoked", remaining).Err()
}
