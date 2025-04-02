#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Get current username
CURRENT_USER=$(whoami)

# Create database if it doesn't exist
psql -lqt | cut -d \| -f 1 | grep -qw openfilament || createdb openfilament

# Create alembic.ini if it doesn't exist
if [ ! -f alembic.ini ]; then
    alembic init alembic
fi

# Update alembic.ini with database URL using current username
sed -i '' "s|sqlalchemy.url = driver://user:pass@localhost/dbname|sqlalchemy.url = postgresql://${CURRENT_USER}@localhost:5432/openfilament|" alembic.ini

# Update .env file with database URL using current username
sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=postgresql://${CURRENT_USER}@localhost:5432/openfilament|" .env

# Create initial migration if no migrations exist
if [ ! -f alembic/versions/*.py ]; then
    alembic revision --autogenerate -m "Initial migration"
fi

# Apply migration
alembic upgrade head

echo "Database setup complete!" 