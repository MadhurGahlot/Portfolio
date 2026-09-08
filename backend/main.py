# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import projects, contact

app = FastAPI(
    title="Madhur Portfolio",
    description="Madhur Backend Portfolio API",
    version="1.0.0",
    contact={
            "email": "236301126@gkv.ac.in",
            "contactno" : "+91 9084506956"
            }
)

# Configure CORS for local development and Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(contact.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "Madhur Portfolio backend",
         "Date" : "07-09-2026"
    }

@app.get("/developerdetails")
def developerdetails():
    return {"name" : "Madhur Gahlot",
            "college" : "GKV",
            "Role" : "Backend developer"
            }