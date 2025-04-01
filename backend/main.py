from fastapi import FastAPI
from routers import users

app = FastAPI(
    title="OpenFilament API",
    description="API for managing 3D printing materials and filaments",
    version="1.0.0"
)

app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Welcome to OpenFilament API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
