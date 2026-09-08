from fastapi import APIRouter
from data import PORTFOLIO_CATEGORIES

router = APIRouter(
     prefix= ("/portfolioimage"),
     tags=["Portfolioimage"]
)


