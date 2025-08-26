from dataclasses import dataclass
from typing import Annotated
from fastapi import Depends, Query
from pydantic import BaseModel, Field

PAGE_SIZE = 40

@dataclass
class Page():
    "A pagination object. Contains the page and the size of each page"
    page: int
    size: int

async def page(page: Annotated[int, Query()] = 0, size: Annotated[int, Query(le=PAGE_SIZE)] = 20) -> Page:
    "A pagination dependency"
    return Page(page, size)

PageDependency = Annotated[Page, Depends(page)]
