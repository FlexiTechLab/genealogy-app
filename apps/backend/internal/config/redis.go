package config

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

// RedisClient is a global singleton for database operations
var RedisClient *redis.Client

// InitRedis initializes the Redis connection pool with production-ready settings.
func InitRedis() error {
	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		addr = "genealogy_redis:6379"
	}

	password := os.Getenv("REDIS_PASSWORD")

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0, // Default DB

		// Connection Pool Settings
		PoolSize:     10,              // Maximum number of socket connections
		MinIdleConns: 5,               // Minimum number of idle connections to keep
		MaxRetries:   3,               // Retry 3 times before returning an error
		DialTimeout:  5 * time.Second, // Timeout for establishing new connections
		ReadTimeout:  3 * time.Second, // Timeout for socket reads
		WriteTimeout: 3 * time.Second, // Timeout for socket writes
		PoolTimeout:  4 * time.Second, // Amount of time client waits for connection if all are busy
	})

	// Verify connection immediately on startup
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if _, err := RedisClient.Ping(ctx).Result(); err != nil {
		return fmt.Errorf("redis connection failed: %w", err)
	}

	return nil
}
