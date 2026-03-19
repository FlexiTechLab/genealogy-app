# 🌳 Genealogy Management System

A modern, full-stack solution for managing family lineages, historical records, and ancestral trees. This project is built with a Monorepo architecture, supporting high-performance Go backends, Next.js PWAs, and React Native mobile applications.

**⚠️ Project Status: Under Development**

> [!WARNING]
> Production Environment (PROD) is currently INCOMPLETE. While the system is functional and can be deployed in production mode, you may encounter unexpected bugs, performance issues, or missing features. Use in production at your own risk. Development (DEV) mode is the recommended stable environment for testing.

# 🏗️ Project Architecture

This repository uses a Monorepo strategy to share logic, types, and UI components across different platforms while maintaining a clean separation of concerns.

```bash
genealogy-app/
├── apps/                # Entry-point Applications
│   ├── backend/         # Golang (Gin Gonic) - RESTful API & Business Logic
│   ├── web-pwa/         # React (Next.js 16+) - Desktop & PWA Client
│   └── mobile/          # React Native - Android & iOS Mobile Client
├── packages/            # Shared Internal Packages
│   ├── db-config/       # WatermelonDB schemas for offline-first sync
│   ├── ui-library/      # Shared Tailwind/React UI components
│   └── types/           # Global TypeScript interfaces for FE/Mobile
├── deployments/         # Infrastructure & DevOps
│   ├── docker/          # Dockerfiles, SQL Init scripts, and configs
│   └── docker-compose.yml
├── api-tests/           # Bruno/Postman Collections for API testing
├── scripts/             # Automation Bash scripts (Setup, Deploy)
├── Makefile             # Project Control Center (Task Runner) - (coming soon)
└── .env.example         # Environment variables template
```

# 🚀 Technical Stack

|Component|Technology|
|-|-|
|Backend|"Go (Golang) 1.26+, Gin Gonic, GORM"|
|Frontend|"Next.js 16, TypeScript, TailwindCSS"|
|Mobile|"React Native, WatermelonDB (Offline-first)"|
|Database|"PostgreSQL 18+, SeaweedFS (Distributed Object Storage)"|
|DevOps|"Docker, Docker Compose, Air (Live Reloading)"|

# 🚦 Getting Started

## 1. Prerequisites - Installation

Ensure you have the following installed:

* Install Docker Desktop (Docker & Docker Compose) on [Mac](https://docs.docker.com/desktop/setup/install/mac-install/), [Windows](https://docs.docker.com/desktop/setup/install/windows-install/), or [Linux](https://docs.docker.com/desktop/setup/install/linux/)

* Clone the project (HTTPS or SSH)

```bash
// HTTPS
git clone https://github.com/FlexiTechLab/genealogy-app.git
```

or

```bash
// SSH
git clone git@github.com:FlexiTechLab/genealogy-app.git
```

Go to the project directory

```bash
cd genealogy-app
```
## 2. Environment Setup

To run this project, you will need to add the following environment variables to your `.env` file. 

Copy the `example.env` file and update the secrets

**Development Mode:**

```bash
cp .env.example .env
```

or

**Production Mode:**

```bash
cp .env.example .env.prod
```

## 3. Launching the Project

**Development Mode:**

```bash
chmod +x deployments/docker/db-init/01-init-db.sh
chmod +x scripts/genealogy_setup.sh
./scripts/genealogy_setup.sh dev
```

or

**Production Mode:**

```bash
chmod +x deployments/docker/db-init/01-init-db.sh
chmod +x scripts/genealogy_setup.sh
./scripts/genealogy_setup.sh prod
```

## 🔗 Service Ports

Once the system is up, you can access the following services:

|Service|URL|Description|
|-|-|-|
|Frontend|http://localhost:3000|Next.js Web Interface|
|Backend API|http://localhost:8080/api/v1/welcome/|Go REST API Entry-point|
|Adminer|http://localhost:8085|Database Management UI|
|SeaweedFS|http://localhost:8888|Distributed File Storage UI|
