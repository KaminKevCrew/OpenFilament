from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, materials, filaments, spools, auth

app = FastAPI(
    title="OpenFilament API",
    description="API for managing 3D printing materials and filaments",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
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
