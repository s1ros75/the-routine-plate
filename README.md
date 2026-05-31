# The Routine Plate

Food planning and nutrition management web app.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Rails 7.2 API
- Database: PostgreSQL 16
- Infrastructure: Docker

## Setup

```
docker-compose up -d
docker-compose exec backend bundle exec rails db:create db:migrate db:seed
```

Frontend: http://localhost:5173
Backend: http://localhost:3000
