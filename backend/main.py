from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import applications, resumes, companies, files

app = FastAPI(
    title="Job Command Center API",
    description="Backend API for Job Command Center application",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(files.router, prefix="/api/files", tags=["Files"])

@app.get("/")
async def root():
    return {"message": "Job Command Center API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
