#!/bin/bash

# Usage: 
# ./scripts/genealogy_setup.sh dev   (Run Local/Development environment)
# ./scripts/genealogy_setup.sh prod  (Run Production environment)

# Set the exit on error flag
set -e

# 1. Determine environment (default to 'prod' if no argument is provided)
ENV=${1:-prod}

# 2. Define the corresponding .env file
if [ "$ENV" == "prod" ]; then
	ENV_FILE=".env.prod"
	echo "🚀 Starting in PRODUCTION mode..."
else
	ENV_FILE=".env"
	echo "🛠️ Starting in DEVELOPMENT mode..."
fi

# 3. Check if the .env file exists
if [ ! -f "$ENV_FILE" ]; then
	echo "❌ Error: $ENV_FILE not found!"
	exit 1
fi

# 4. Check if Docker is running
if ! docker info >/dev/null 2>&1; then
	echo "❌ Error: Docker is not running. Please start Docker and try again."
	exit 1
fi

# docker compose -f deployments/docker/docker-compose.yml --env-file .env down -v

# 5. Execute Docker Compose
# -f: Path to your compose file
# --env-file: Load specific environment variables
echo "📦 Building and starting containers..."
docker compose -f deployments/docker/docker-compose.yml --env-file "$ENV_FILE" up -d --build
# 6. Final Status Report
echo "-------------------------------------------------------"
echo "✅ Environment [$ENV] deployed successfully!"

echo ""
echo "📱 Frontend:    http://localhost:3000/"
echo "🔌 Backend API:  http://localhost:8080/api/v1/welcome/"
echo "🛂 SeaweedFS Filer:  http://localhost:8888/"
echo "🛂 Adminer:  http://localhost:8085/"
echo "-------------------------------------------------------"
