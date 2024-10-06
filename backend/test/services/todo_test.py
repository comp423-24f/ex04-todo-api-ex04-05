"""Tests for Todo Service."""

from unittest.mock import create_autospec
import pytest
from backend.services.exceptions import (
    ResourceNotFoundException,
    UserPermissionException,
)
from backend.services.permission import PermissionService
from ...services import TodoService
from ...models.todo_item import TodoItem

# Imported fixtures provide dependencies injected for the tests as parameters.
from .fixtures import todo_svc

# Import the setup_teardown fixture explicitly to load entities in database
from .role_data import fake_data_fixture as fake_role_data_fixture
from .user_data import fake_data_fixture as fake_user_data_fixture
from .room_data import fake_data_fixture as fake_room_data_fixture

from .user_data import student

__authors__ = ["Ajay Gandecha"]
__copyright__ = "Copyright 2024"
__license__ = "MIT"


def test_list(todo_svc: TodoService):
    items = todo_svc.all(student)
    assert len(items) == 0


def test_create(todo_svc: TodoService):
    new_item = TodoItem(id=None, title="test", completed=False)
    result = todo_svc.create(student, new_item)
    assert result.id == 1
    items = todo_svc.all(student)
    assert len(items) == 1


def test_toggle_checkmark(todo_svc: TodoService):
    new_item = TodoItem(id=1, title="test", completed=False)
    result = todo_svc.create(student, new_item)
    edited = todo_svc.toggle_checkmark(student, result)
    assert edited.completed


def test_delete(todo_svc: TodoService):
    new_item = TodoItem(id=1, title="test", completed=False)
    result = todo_svc.create(student, new_item)
    todo_svc.delete(student, result)
    items = todo_svc.all(student)
    assert len(items) == 0
