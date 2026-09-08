# backend/routers/projects.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from data import PORTFOLIO_PROJECTS, PORTFOLIO_CATEGORIES

router = APIRouter(prefix="/api", tags=["projects"])

@router.get("/categories")
def get_categories():
    return PORTFOLIO_CATEGORIES

@router.get("/projects")
def get_projects(category: Optional[str] = Query(None, description="Category filter ID")):
    if not category or category == "all":
        return PORTFOLIO_PROJECTS
    
    filtered = [p for p in PORTFOLIO_PROJECTS if p["category"] == category]
    return filtered

@router.get("/projects/{slug}")
def get_project_by_slug(slug: str):
    for project in PORTFOLIO_PROJECTS:
        if project["slug"] == slug or project["id"] == slug:
            return project
    raise HTTPException(status_code=404, detail="Project not found")
