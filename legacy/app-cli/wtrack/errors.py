from __future__ import annotations


class AppError(Exception):
    """Base class for all application exceptions."""

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class ConfigError(AppError):
    pass


class ApiError(AppError):
    pass
