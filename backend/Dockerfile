# Build stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .

# Create a non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app

USER appuser

# Set the command to run the application
CMD ["python", "main.py"] 