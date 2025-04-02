from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, materials, filaments, spools, auth
import psycopg2
import time
import os
from alembic.config import Config
from alembic import command
from contextlib import asynccontextmanager

def wait_for_db():
    """Wait for the database to be ready"""
    for i in range(30):  # Try for 30 seconds
        try:
            conn = psycopg2.connect(
                dbname='openfilament',
                user='postgres',
                password='postgres',
                host='db',
                port='5432'
            )
            conn.close()
            return True
        except psycopg2.OperationalError:
            time.sleep(1)
    return False

def run_migrations():
    """Run database migrations"""
    try:
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")
        print("Database migrations completed successfully")
    except Exception as e:
        print(f"Error running migrations: {str(e)}")
        raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    print("Waiting for database to be ready...")
    if not wait_for_db():
        raise Exception("Could not connect to database after 30 seconds")
    
    print("Running database migrations...")
    run_migrations()
    
    yield
    
    # Shutdown
    print("Shutting down...")

app = FastAPI(
    title="OpenFilament API",
    description="API for managing 3D printing materials and filaments",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(materials.router, prefix="/api", tags=["materials"])
app.include_router(filaments.router, prefix="/api", tags=["filaments"])
app.include_router(spools.router, prefix="/api", tags=["spools"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to OpenFilament API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
