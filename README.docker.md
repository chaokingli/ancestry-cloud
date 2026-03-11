# Docker Deployment Guide for Ancestry Cloud

This document describes how to deploy the Ancestry Cloud application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- 2GB+ RAM available for Docker

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd ancestry-cloud
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your values:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `DATABASE_URL` - Keep as `file:/data/db/dev.db` for default setup

### 3. Build and Start

```bash
# Build the Docker image
docker compose build

# Start the application
docker compose up -d
```

The application will be available at `http://localhost:3000`

### 4. View Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f nextjs-app
```

### 5. Stop the Application

```bash
# Stop and remove containers
docker compose down

# Stop and remove volumes (DATABASE DATA WILL BE LOST!)
docker compose down -v
```

## Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start in detached mode |
| `docker compose down` | Stop and remove containers |
| `docker compose down -v` | Stop and remove volumes |
| `docker compose ps` | List running containers |
| `docker compose logs [-f]` | View logs |
| `docker compose exec nextjs-app bash` | Exec into container |
| `docker compose build` | Rebuild image |
| `docker compose pull` | Pull latest image |

## Production Deployment

### 1. Security Checklist

- [ ] Generate a new `AUTH_SECRET` (minimum 32 bytes random)
- [ ] Never commit `.env` to version control
- [ ] Use environment variables for all secrets
- [ ] Consider using Docker Secrets for production

### 2. Building for Production

```bash
# Build with production optimizations
docker compose build --no-cache

# Verify the build
docker compose up -d
```

### 3. Port Configuration

The default configuration maps port 3000. To change:

1. Edit `docker-compose.yml`
2. Update the ports mapping:

```yaml
ports:
  - "YOUR_PORT:3000"
```

### 4. Custom Domain

To use a custom domain, update `.env`:

```env
NEXTAUTH_URL=https://yourdomain.com
```

## SQLite Database Persistence

The application uses SQLite for data storage. The database is stored in a Docker volume to persist data across container restarts.

### Database Location

- **Container path**: `/data/db/dev.db`
- **Docker volume**: `sqlite-data` (named volume)

### Backup

To backup the database:

```bash
# Copy database from container
docker compose exec nextjs-app cp /data/db/dev.db /tmp/dev.db.backup

# Copy from host to local
docker compose cp nextjs-app:/data/db/dev.db ./dev.db.backup
```

### Restore

```bash
# Copy backup to container
docker compose cp ./dev.db.backup nextjs-app:/data/db/dev.db

# Verify the database
docker compose exec nextjs-app sqlite3 /data/db/dev.db "SELECT COUNT(*) FROM User;"
```

### Reset Database

⚠️ **Warning**: This will delete all data!

```bash
# Stop the application
docker compose down -v

# Start fresh
docker compose up -d
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Edit docker-compose.yml and change the port mapping
ports:
  - "3001:3000"  # Map to port 3001 instead
```

### Build Failed

```bash
# Clean build cache
docker compose build --no-cache

# Or remove all dangling images
docker image prune -a
docker compose build
```

### Container Won't Start

```bash
# Check logs
docker compose logs nextjs-app

# Check container status
docker compose ps -a
```

### Permission Denied

```bash
# Ensure correct permissions on mounted volumes
docker compose down -v
docker compose up -d
```

## Advanced Configuration

### Dockerfile Customization

The Dockerfile is optimized for production with:

- **Multi-stage build**: Reduces final image size
- **Non-root user**: Security best practice
- **Slim base image**: Optimized for compatibility
- **Standalone output**: Only required files are included

To customize:

1. Edit the `Dockerfile`
2. Rebuild: `docker compose build`
3. Restart: `docker compose up -d`

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | NextAuth.js secret (32+ bytes) |
| `DATABASE_URL` | Yes | SQLite database path |
| `NODE_ENV` | No | Node environment (default: production) |
| `PORT` | No | Application port (default: 3000) |
| `HOSTNAME` | No | Host bind address (default: 0.0.0.0) |
| `NEXT_TELEMETRY_DISABLED` | No | Disable Next.js telemetry (default: 1) |
| `NEXTAUTH_URL` | No | Full URL for production |

## Deployment to Cloud Providers

### Google Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT/ancestry-cloud

# Deploy to Cloud Run
gcloud run deploy ancestry-cloud \
  --image gcr.io/YOUR_PROJECT/ancestry-cloud \
  --platform managed \
  --allow-unauthenticated \
  --region YOUR_REGION

# Set environment variables
gcloud run services update ancestry-cloud \
  --update-env-vars=AUTH_SECRET=YOUR_SECRET,DATABASE_URL=file:/data(db
```

### AWS ECS/Fargate

1. Build and push to ECR
2. Create ECS task definition
3. Configure Fargate service
4. Set up load balancer

### DigitalOcean App Platform

1. Connect repository to DigitalOcean
2. Configure build command: `bun install && bun run build`
3. Set environment variables
4. Deploy

## Performance Optimization

### Build Cache

The Dockerfile uses build cache mounts for faster rebuilds. To clear cache:

```bash
docker buildx build --no-cache .
```

### Image Size

The production image is optimized to ~150-200MB by:
- Using multi-stage builds
- Removing dev dependencies
- Using slim base images
- Enabling standalone output mode

## Support

For issues:
1. Check logs: `docker compose logs -f`
2. Verify environment variables: `docker compose config`
3. Review this documentation

## License

MIT
