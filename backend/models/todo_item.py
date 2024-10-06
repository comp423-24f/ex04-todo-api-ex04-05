"""Model for storing a todo item."""

from pydantic import BaseModel


__authors__ = ["Ajay Gandecha"]
__copyright__ = "Copyright 2024"
__license__ = "MIT"


class TodoItem(BaseModel):
    id: int | None
    title: str
    completed: bool
