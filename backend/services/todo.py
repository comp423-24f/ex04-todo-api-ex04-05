"""
The Todo Service allows the API to manipulate todo data in the database.
"""

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import db_session
from ..models.todo_item import TodoItem
from ..entities.todo_entity import TodoEntity
from ..models import User
from .permission import PermissionService

from .exceptions import ResourceNotFoundException, UserPermissionException


__authors__ = ["Ajay Gandecha"]
__copyright__ = "Copyright 2024"
__license__ = "MIT"


class TodoService:
    """Service that performs all of the actions on the `Todo` table"""

    def __init__(
        self,
        session: Session = Depends(db_session),
        permission: PermissionService = Depends(),
    ):
        self._session = session
        self._permission = permission

    def all(self, subject: User) -> list[TodoItem]:
        """Loads all of the todo items for a user."""
        query = select(TodoEntity).where(TodoEntity.user_id == subject.id)
        entities = self._session.scalars(query).all()
        return [entity.to_model() for entity in entities]

    def create(self, subject: User, item: TodoItem) -> TodoItem:
        """Creates a new todo item for the user."""
        entity = TodoEntity.from_model(item, subject)
        self._session.add(entity)
        self._session.commit()
        return entity.to_model()

    def toggle_checkmark(self, subject: User, item: TodoItem) -> TodoItem:
        """Toggles the checkmark of a todo item."""
        query = select(TodoEntity).where(TodoEntity.id == item.id)
        entity = self._session.scalars(query).one_or_none()
        if entity is None:
            raise ResourceNotFoundException(f"No todo item found with id: {item.id}")
        if entity.user_id != subject.id:
            raise UserPermissionException(f"Cannot edit the todo items of others.", "foo")
        entity.completed = not entity.completed
        self._session.commit()
        return entity.to_model()

    def delete(self, subject: User, id: int):
        """Deletes a to-do item."""
        query = select(TodoEntity).where(TodoEntity.id == id)
        entity = self._session.scalars(query).one_or_none()
        if entity is None:
            raise ResourceNotFoundException(f"No todo item found with id: {id}")
        if entity.user_id != subject.id:
            raise UserPermissionException(f"Cannot edit the todo items of others.", "foo")
        self._session.delete(entity)
        self._session.commit()
