"""Definition of SQLAlchemy table-backed object mapping entity for todo list items."""

from datetime import datetime
from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .entity_base import EntityBase
from typing import Self
from ..models.todo_item import TodoItem
from ..models import User

__authors__ = ["Ajay Gandecha"]
__copyright__ = "Copyright 2024"
__license__ = "MIT"


class TodoEntity(EntityBase):
    """Serves as the database model schema defining the shape of the `Todo` table"""

    # Name for the todo item table in the PostgreSQL database
    __tablename__ = "todo"

    # Todo item properties (columns in the database table)

    # Unique ID for the todo item
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # Contains the title of the to-do item.
    title: Mapped[str] = mapped_column(String, nullable=False)
    # Determines whether or not the item has been completed
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False)
    # The user associated with the application
    # NOTE: This field establishes a one-to-many relationship between the user and todo tables.
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["UserEntity"] = relationship(back_populates="todo_items")

    @classmethod
    def from_model(cls, model: TodoItem, subject: User) -> Self:
        return cls(
            id=model.id,
            title=model.title,
            completed=model.completed,
            user_id=subject.id,
        )

    def to_model(self) -> TodoItem:
        return TodoItem(id=self.id, title=self.title, completed=self.completed)
