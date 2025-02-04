"""SeatDetails extends information about a Seat, including its Room, to the Seat model."""

from pydantic import BaseModel

from backend.models.room import Room

from .seat import Seat


__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


class SeatDetails(Seat, BaseModel):
    room: Room
