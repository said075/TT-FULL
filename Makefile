# Start Postgres container
db-start:
	docker-compose up -d

# Stop Postgres container (keep volume)
db-stop:
	docker-compose down

# Open psql shell in Postgres container
db-shell:
	docker exec -it tuzla-transport-db psql -U admin -d transport

# View logs
db-logs:
	docker-compose logs -f

# Rebuild container (if you change docker-compose)
db-rebuild:
	docker-compose up -d --build
