---
description: 'Python-specific documentation standards and docstring patterns'
applyTo: '**/*.py'
language: 'python'
---

# Python Documentation Standards

## Repeated Python Documentation Tasks and Checklist Templates

For any recurring documentation process specific to Python projects (such as package release documentation, Sphinx documentation updates, docstring reviews, or similar workflows), always use a dedicated checklist template to ensure all necessary steps are followed and nothing is missed.

- **Python Documentation Checklist Template Principle:**
  - Maintain a template checklist file for each repeated Python documentation process (e.g., `python-package-release-docs-checklist.md`, `sphinx-docs-update-checklist.md`, `docstring-review-checklist.md`).
  - For each new instance (e.g., each PyPI release or major documentation update), copy the template checklist and tag it with the relevant version or context, preserving the original template for future use.
  - Systematically work through the checklist for every instance of the repeated documentation task, marking each step as completed.
  - Proactively identify any Python documentation process that would benefit from a checklist and prompt the user to use or create one if it does not exist.
  - If, during execution, you or the user identify missing or unclear documentation steps, update the template checklist to improve future reliability.

**Examples of repeated Python documentation tasks requiring checklists:**

- PyPI package release documentation (README updates, CHANGELOG maintenance, setup.py/pyproject.toml synchronization, docstring updates)
- Sphinx documentation updates (API documentation generation, docstring compilation, cross-references)
- Docstring reviews and standardization (Google/NumPy style compliance, type annotation consistency, example verification)
- Django application documentation updates (model documentation, API endpoint documentation, admin interface docs)
- FastAPI documentation updates (automatic API documentation, Pydantic model documentation, endpoint descriptions)
- Python library documentation (usage examples, installation guides, compatibility matrices)
- Virtual environment and dependency documentation (requirements.txt, poetry, pipenv setup)
- Python version compatibility documentation
- Testing documentation (pytest configuration, test coverage, testing patterns)
- Any other Python documentation process with multiple required steps or risk of omission

**Agent Guidance for Python Documentation Tasks:**

- Always check for the existence of a Python documentation checklist template before starting a repeated documentation task.
- If a template does not exist, prompt the user to create one and assist in drafting it with Python-specific considerations.
- When using a documentation checklist, copy it for the specific instance (e.g., `pypi-release-docs-v1.2.0.md`), and work through each step systematically.
- If new Python documentation steps are discovered or improvements are needed, update the template and inform the user.
- Consider Python-specific requirements like docstring standards, Sphinx integration, type annotations, and PyPI packaging when creating or using checklists.

## Docstring Conventions

### Google Style Docstrings

Python projects should use Google-style docstrings for consistency and compatibility with documentation generation tools.

#### Function Documentation

```python
def get_user_by_id(user_id: str, include_inactive: bool = False) -> Optional[User]:
    """Retrieve a user by their unique identifier.

    This function queries the database for a user with the specified ID.
    By default, only active users are returned unless explicitly requested.

    Args:
        user_id: The unique identifier for the user (UUID format).
        include_inactive: Whether to include inactive users in the search.
            Defaults to False.

    Returns:
        User object if found, None otherwise. The user object contains
        all standard user fields including id, name, email, and status.

    Raises:
        ValueError: If user_id is not a valid UUID format.
        DatabaseConnectionError: If database connection fails.
        PermissionError: If caller lacks permission to access user data.

    Example:
        Basic usage:

        >>> user = get_user_by_id("123e4567-e89b-12d3-a456-426614174000")
        >>> print(user.name)
        "John Doe"

        Including inactive users:

        >>> inactive_user = get_user_by_id("456e7890-e89b-12d3-a456-426614174000",
        ...                                include_inactive=True)
        >>> print(inactive_user.status)
        "inactive"

    Note:
        This function implements caching for frequently accessed users.
        Cache invalidation occurs automatically when user data is modified.

    See Also:
        get_users_by_email: For searching users by email address.
        create_user: For creating new user records.
    """
    # Implementation here
    pass
```

#### Class Documentation

```python
class UserService:
    """Service for managing user data with validation and caching.

    The UserService provides a high-level interface for user operations,
    abstracting database interactions and implementing business logic.
    It includes automatic validation, caching for performance, and
    comprehensive error handling.

    Attributes:
        repository: The user repository for database operations.
        cache: Cache service for storing frequently accessed data.
        validator: User data validation service.

    Example:
        Basic initialization and usage:

        >>> from src.repositories import UserRepository
        >>> from src.services import CacheService, ValidationService
        >>>
        >>> service = UserService(
        ...     repository=UserRepository(database),
        ...     cache=CacheService(),
        ...     validator=ValidationService()
        ... )
        >>>
        >>> user = service.create_user({
        ...     'name': 'John Doe',
        ...     'email': 'john@example.com'
        ... })
        >>> print(user.id)
        "123e4567-e89b-12d3-a456-426614174000"
    """

    def __init__(
        self,
        repository: UserRepository,
        cache: Optional[CacheService] = None,
        validator: Optional[ValidationService] = None
    ) -> None:
        """Initialize the UserService.

        Args:
            repository: Repository for user data persistence.
            cache: Optional cache service for performance optimization.
                If not provided, no caching will be used.
            validator: Optional validation service for user data.
                If not provided, default validation rules will be applied.

        Raises:
            TypeError: If repository is not an instance of UserRepository.
            ValueError: If repository is not properly configured.
        """
        if not isinstance(repository, UserRepository):
            raise TypeError("repository must be an instance of UserRepository")

        self.repository = repository
        self.cache = cache or NoOpCache()
        self.validator = validator or DefaultValidator()

    def create_user(self, user_data: Dict[str, Any]) -> User:
        """Create a new user with validation and duplicate checking.

        This method validates the provided user data, checks for existing
        users with the same email, and creates a new user record in the
        database. The created user is automatically cached for future access.

        Args:
            user_data: Dictionary containing user information. Must include
                'name' and 'email' fields. Optional fields include 'age',
                'preferences', and custom metadata.

        Returns:
            Newly created User object with generated ID and timestamps.

        Raises:
            ValidationError: If user data fails validation rules.
            DuplicateEmailError: If a user with the email already exists.
            DatabaseError: If database operation fails.

        Example:
            Creating a basic user:

            >>> user_data = {
            ...     'name': 'Jane Doe',
            ...     'email': 'jane@example.com',
            ...     'age': 30
            ... }
            >>> user = service.create_user(user_data)
            >>> print(f"Created user: {user.name} ({user.id})")
            "Created user: Jane Doe (456e7890-e89b-12d3-a456-426614174000)"

            Creating a user with preferences:

            >>> user_data = {
            ...     'name': 'Bob Smith',
            ...     'email': 'bob@example.com',
            ...     'preferences': {
            ...         'theme': 'dark',
            ...         'notifications': True
            ...     }
            ... }
            >>> user = service.create_user(user_data)
        """
        # Implementation here
        pass
```

#### Exception Class Documentation

```python
class ValidationError(Exception):
    """Exception raised when user data validation fails.

    This exception is raised when user input data does not meet the
    required validation criteria. It includes detailed information
    about which specific validation rules failed.

    Attributes:
        message: A human-readable error message.
        field_errors: Dictionary mapping field names to specific error messages.
        error_code: Machine-readable error code for programmatic handling.

    Example:
        Catching and handling validation errors:

        >>> try:
        ...     user = service.create_user({'name': '', 'email': 'invalid'})
        ... except ValidationError as e:
        ...     print(f"Validation failed: {e.message}")
        ...     for field, error in e.field_errors.items():
        ...         print(f"  {field}: {error}")
        "Validation failed: User data is invalid"
        "  name: Name cannot be empty"
        "  email: Invalid email format"
    """

    def __init__(
        self,
        message: str,
        field_errors: Optional[Dict[str, str]] = None,
        error_code: str = "VALIDATION_ERROR"
    ) -> None:
        """Initialize ValidationError.

        Args:
            message: High-level description of the validation failure.
            field_errors: Optional dictionary mapping field names to
                specific error messages. Defaults to empty dict.
            error_code: Machine-readable error code. Defaults to
                "VALIDATION_ERROR".
        """
        super().__init__(message)
        self.message = message
        self.field_errors = field_errors or {}
        self.error_code = error_code

    def get_field_error(self, field_name: str) -> Optional[str]:
        """Get error message for a specific field.

        Args:
            field_name: Name of the field to get error for.

        Returns:
            Error message for the field, or None if no error exists.

        Example:
            >>> error = ValidationError("Invalid data", {"email": "Invalid format"})
            >>> email_error = error.get_field_error("email")
            >>> print(email_error)
            "Invalid format"
        """
        return self.field_errors.get(field_name)
```

### Module and Package Documentation

```python
"""User management module for handling user data and operations.

This module provides comprehensive user management functionality including
user creation, retrieval, updating, and deletion. It implements proper
validation, caching, and error handling for all user operations.

The module follows the repository pattern for data access and provides
both synchronous and asynchronous interfaces for different use cases.

Typical usage example:

    from src.user_module import UserService, UserRepository
    from src.database import get_database_connection

    # Initialize dependencies
    db = get_database_connection()
    repository = UserRepository(db)
    service = UserService(repository)

    # Create a new user
    user_data = {
        'name': 'John Doe',
        'email': 'john@example.com'
    }
    user = service.create_user(user_data)

    # Retrieve user by ID
    found_user = service.get_user_by_id(user.id)

Classes:
    UserService: High-level service for user operations.
    UserRepository: Database access layer for user data.
    User: Data model representing a user.
    ValidationError: Exception for validation failures.

Functions:
    validate_email: Utility function for email validation.
    generate_user_id: Utility function for generating unique user IDs.

Constants:
    MAX_NAME_LENGTH: Maximum allowed length for user names.
    MIN_AGE: Minimum allowed age for users.
    RESERVED_EMAILS: List of email addresses that cannot be used.
"""

from typing import Optional, Dict, List, Any
from .models import User
from .services import UserService
from .repositories import UserRepository
from .exceptions import ValidationError, UserNotFoundError

# Module version
__version__ = "2.1.0"

# Public API
__all__ = [
    "User",
    "UserService",
    "UserRepository",
    "ValidationError",
    "UserNotFoundError",
    "validate_email",
    "generate_user_id"
]

# Module constants
MAX_NAME_LENGTH: int = 100
MIN_AGE: int = 13
RESERVED_EMAILS: List[str] = ["admin@example.com", "noreply@example.com"]
```

### Data Class and Model Documentation

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any

@dataclass
class User:
    """Data model representing a user in the system.

    This class represents a user with all necessary fields for user
    management operations. It includes automatic timestamp generation
    and validation for core fields.

    Attributes:
        id: Unique identifier for the user (UUID format).
        name: Full name of the user.
        email: Email address (must be unique across all users).
        age: User's age in years (must be >= 13).
        is_active: Whether the user account is active.
        created_at: Timestamp when the user was created.
        updated_at: Timestamp when the user was last modified.
        preferences: Optional user preferences dictionary.
        metadata: Optional additional metadata dictionary.

    Example:
        Creating a user instance:

        >>> from datetime import datetime
        >>> user = User(
        ...     id="123e4567-e89b-12d3-a456-426614174000",
        ...     name="John Doe",
        ...     email="john@example.com",
        ...     age=30
        ... )
        >>> print(f"{user.name} ({user.email})")
        "John Doe (john@example.com)"

        User with preferences:

        >>> user_with_prefs = User(
        ...     id="456e7890-e89b-12d3-a456-426614174000",
        ...     name="Jane Doe",
        ...     email="jane@example.com",
        ...     age=25,
        ...     preferences={"theme": "dark", "notifications": True}
        ... )
    """

    id: str
    name: str
    email: str
    age: int
    is_active: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    preferences: Optional[Dict[str, Any]] = field(default_factory=dict)
    metadata: Optional[Dict[str, Any]] = field(default_factory=dict)

    def __post_init__(self) -> None:
        """Validate user data after initialization.

        Raises:
            ValueError: If any field contains invalid data.
        """
        if not self.name.strip():
            raise ValueError("Name cannot be empty")
        if self.age < 13:
            raise ValueError("Age must be at least 13")
        if "@" not in self.email:
            raise ValueError("Invalid email format")

    def get_display_name(self) -> str:
        """Get formatted display name for the user.

        Returns:
            Formatted display name, typically the full name.
            Falls back to email username if name is not available.

        Example:
            >>> user = User(id="123", name="John Doe", email="john@example.com", age=30)
            >>> print(user.get_display_name())
            "John Doe"

            >>> user_no_name = User(id="456", name="", email="jane@example.com", age=25)
            >>> print(user_no_name.get_display_name())
            "jane"
        """
        if self.name.strip():
            return self.name
        return self.email.split("@")[0]

    def is_adult(self) -> bool:
        """Check if user is an adult (18 or older).

        Returns:
            True if user is 18 or older, False otherwise.

        Example:
            >>> adult_user = User(id="123", name="Adult", email="adult@example.com", age=25)
            >>> minor_user = User(id="456", name="Minor", email="minor@example.com", age=16)
            >>> print(adult_user.is_adult())
            True
            >>> print(minor_user.is_adult())
            False
        """
        return self.age >= 18

    def update_preferences(self, preferences: Dict[str, Any]) -> None:
        """Update user preferences with new values.

        This method merges new preferences with existing ones,
        preserving existing values unless explicitly overridden.

        Args:
            preferences: Dictionary of preference keys and values to update.

        Example:
            >>> user = User(id="123", name="John", email="john@example.com", age=30)
            >>> user.update_preferences({"theme": "dark", "language": "en"})
            >>> user.update_preferences({"theme": "light"})  # Only updates theme
            >>> print(user.preferences)
            {"theme": "light", "language": "en"}
        """
        if self.preferences is None:
            self.preferences = {}
        self.preferences.update(preferences)
        self.updated_at = datetime.utcnow()
```

### Django Model Documentation

```python
from django.db import models
from django.core.validators import MinValueValidator, EmailValidator
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Extended user model with additional fields and functionality.

    This model extends Django's built-in User model to include additional
    fields required for the application. It maintains compatibility with
    Django's authentication system while adding business-specific data.

    Attributes:
        age: User's age in years (minimum 13).
        phone_number: Optional phone number for the user.
        date_of_birth: User's date of birth.
        is_verified: Whether the user's email has been verified.
        preferences: JSON field storing user preferences.
        created_at: Timestamp when the user was created (auto-generated).
        updated_at: Timestamp when the user was last modified (auto-updated).

    Example:
        Creating a user through Django ORM:

        >>> user = User.objects.create_user(
        ...     username='johndoe',
        ...     email='john@example.com',
        ...     password='secure_password',
        ...     age=30,
        ...     first_name='John',
        ...     last_name='Doe'
        ... )
        >>> print(f"Created user: {user.get_full_name()}")
        "Created user: John Doe"

        Querying users:

        >>> adult_users = User.objects.filter(age__gte=18)
        >>> verified_users = User.objects.filter(is_verified=True)
    """

    age = models.PositiveIntegerField(
        validators=[MinValueValidator(13)],
        help_text="User's age in years (minimum 13)"
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="User's phone number in international format"
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True,
        help_text="User's date of birth"
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Whether the user's email address has been verified"
    )

    preferences = models.JSONField(
        default=dict,
        blank=True,
        help_text="User preferences stored as JSON"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the user was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the user was last modified"
    )

    class Meta:
        """Meta configuration for the User model."""
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self) -> str:
        """Return string representation of the user.

        Returns:
            User's full name if available, otherwise username.

        Example:
            >>> user = User(first_name="John", last_name="Doe", username="johndoe")
            >>> print(str(user))
            "John Doe"

            >>> user_no_name = User(username="janedoe")
            >>> print(str(user_no_name))
            "janedoe"
        """
        full_name = self.get_full_name()
        return full_name if full_name else self.username

    def is_adult(self) -> bool:
        """Check if user is an adult based on age.

        Returns:
            True if user is 18 or older, False otherwise.

        Example:
            >>> adult_user = User(age=25)
            >>> minor_user = User(age=16)
            >>> print(adult_user.is_adult())
            True
            >>> print(minor_user.is_adult())
            False
        """
        return self.age >= 18

    def get_preference(self, key: str, default: Any = None) -> Any:
        """Get a specific preference value.

        Args:
            key: The preference key to retrieve.
            default: Default value to return if key is not found.

        Returns:
            The preference value if found, otherwise the default value.

        Example:
            >>> user = User(preferences={"theme": "dark", "language": "en"})
            >>> theme = user.get_preference("theme")
            >>> print(theme)
            "dark"
            >>> missing = user.get_preference("missing_key", "default_value")
            >>> print(missing)
            "default_value"
        """
        return self.preferences.get(key, default)

    def set_preference(self, key: str, value: Any) -> None:
        """Set a preference value and save the model.

        Args:
            key: The preference key to set.
            value: The value to set for the preference.

        Example:
            >>> user = User.objects.get(id=1)
            >>> user.set_preference("theme", "light")
            >>> user.set_preference("notifications", True)
            >>> print(user.preferences)
            {"theme": "light", "notifications": True}
        """
        self.preferences[key] = value
        self.save(update_fields=['preferences', 'updated_at'])
```

### FastAPI Model Documentation

```python
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """Enumeration of possible user roles.

    Attributes:
        ADMIN: Administrator with full system access.
        MEMBER: Regular member with standard permissions.
        GUEST: Guest user with limited access.
    """
    ADMIN = "admin"
    MEMBER = "member"
    GUEST = "guest"

class UserBase(BaseModel):
    """Base user model with common fields.

    This base model contains fields that are common across different
    user-related models (create, update, response). It provides consistent
    validation and documentation for user data.

    Attributes:
        name: Full name of the user (2-100 characters).
        email: Valid email address.
        age: User's age (must be at least 13).
        role: User's role in the system.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="User's full name",
        example="John Doe"
    )

    email: EmailStr = Field(
        ...,
        description="User's email address",
        example="john@example.com"
    )

    age: int = Field(
        ...,
        ge=13,
        le=120,
        description="User's age in years",
        example=30
    )

    role: UserRole = Field(
        default=UserRole.MEMBER,
        description="User's role in the system",
        example=UserRole.MEMBER
    )

    @validator('name')
    def validate_name(cls, v: str) -> str:
        """Validate that name contains only allowed characters.

        Args:
            v: The name value to validate.

        Returns:
            The validated name.

        Raises:
            ValueError: If name contains invalid characters.
        """
        if not v.replace(' ', '').replace('-', '').replace("'", '').isalpha():
            raise ValueError('Name must contain only letters, spaces, hyphens, and apostrophes')
        return v.strip()

class UserCreate(UserBase):
    """Model for creating a new user.

    This model extends UserBase with fields specific to user creation,
    including password and optional preferences.

    Example:
        Creating a user creation request:

        >>> user_data = UserCreate(
        ...     name="Jane Doe",
        ...     email="jane@example.com",
        ...     age=25,
        ...     password="secure_password123",
        ...     preferences={"theme": "dark"}
        ... )
    """

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="User's password (minimum 8 characters)",
        example="secure_password123"
    )

    preferences: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="User preferences as key-value pairs",
        example={"theme": "dark", "notifications": True}
    )

    @validator('password')
    def validate_password(cls, v: str) -> str:
        """Validate password complexity.

        Args:
            v: The password to validate.

        Returns:
            The validated password.

        Raises:
            ValueError: If password doesn't meet complexity requirements.
        """
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserResponse(UserBase):
    """Model for user data in API responses.

    This model extends UserBase with additional fields that are included
    in API responses but not in creation requests, such as ID and timestamps.

    Attributes:
        id: Unique identifier for the user.
        is_active: Whether the user account is active.
        created_at: Timestamp when the user was created.
        updated_at: Timestamp when the user was last modified.
        preferences: User preferences dictionary.

    Example:
        Response model usage:

        >>> user_response = UserResponse(
        ...     id="123e4567-e89b-12d3-a456-426614174000",
        ...     name="John Doe",
        ...     email="john@example.com",
        ...     age=30,
        ...     role=UserRole.MEMBER,
        ...     is_active=True,
        ...     created_at=datetime.utcnow(),
        ...     updated_at=datetime.utcnow(),
        ...     preferences={"theme": "light"}
        ... )
    """

    id: str = Field(
        ...,
        description="Unique identifier for the user",
        example="123e4567-e89b-12d3-a456-426614174000"
    )

    is_active: bool = Field(
        default=True,
        description="Whether the user account is active",
        example=True
    )

    created_at: datetime = Field(
        ...,
        description="Timestamp when the user was created",
        example="2023-01-01T12:00:00Z"
    )

    updated_at: datetime = Field(
        ...,
        description="Timestamp when the user was last modified",
        example="2023-06-01T14:30:00Z"
    )

    preferences: Dict[str, Any] = Field(
        default_factory=dict,
        description="User preferences as key-value pairs",
        example={"theme": "light", "notifications": True}
    )

    class Config:
        """Pydantic model configuration."""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "John Doe",
                "email": "john@example.com",
                "age": 30,
                "role": "member",
                "is_active": True,
                "created_at": "2023-01-01T12:00:00Z",
                "updated_at": "2023-06-01T14:30:00Z",
                "preferences": {
                    "theme": "light",
                    "notifications": True
                }
            }
        }
```

### Utility Function Documentation

```python
import re
import hashlib
from typing import List, Optional, Union
from uuid import uuid4

def validate_email(email: str) -> bool:
    """Validate email address format using RFC 5322 standard.

    This function performs comprehensive email validation including
    format checking, length validation, and basic domain validation.

    Args:
        email: Email address string to validate.

    Returns:
        True if email format is valid, False otherwise.

    Example:
        >>> validate_email("user@example.com")
        True
        >>> validate_email("invalid.email")
        False
        >>> validate_email("user+tag@subdomain.example.com")
        True

    Note:
        This function validates format only and does not check if the
        email address actually exists or is deliverable.
    """
    if not email or len(email) > 254:
        return False

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def generate_user_id() -> str:
    """Generate a unique user identifier.

    Creates a UUID4-based unique identifier suitable for use as
    a primary key in user records.

    Returns:
        String representation of UUID4.

    Example:
        >>> user_id = generate_user_id()
        >>> print(len(user_id))
        36
        >>> print(user_id)
        "123e4567-e89b-12d3-a456-426614174000"

    Note:
        This function uses UUID4 which provides good uniqueness
        guarantees but is not cryptographically secure for
        sensitive applications.
    """
    return str(uuid4())

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """Hash a password using PBKDF2 with SHA-256.

    This function creates a secure hash of the provided password using
    PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256.

    Args:
        password: Plain text password to hash.
        salt: Optional salt value. If not provided, a random salt is generated.

    Returns:
        Tuple containing (hashed_password, salt_used).

    Example:
        Hashing a new password:

        >>> hashed, salt = hash_password("my_secure_password")
        >>> print(len(hashed))
        64

        Verifying a password:

        >>> stored_hash = "existing_hash_from_database"
        >>> stored_salt = "existing_salt_from_database"
        >>> user_input = "user_entered_password"
        >>> new_hash, _ = hash_password(user_input, stored_salt)
        >>> is_valid = new_hash == stored_hash

    Security:
        - Uses PBKDF2 with 100,000 iterations for resistance against
          brute force attacks
        - SHA-256 provides good security for password hashing
        - Random salt prevents rainbow table attacks
    """
    if salt is None:
        salt = hashlib.pbkdf2_hmac('sha256', uuid4().bytes, b'salt', 1000).hex()[:16]

    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()

    return hashed, salt

def sanitize_user_input(input_string: str, max_length: int = 1000) -> str:
    """Sanitize user input by removing potentially dangerous characters.

    This function removes or escapes characters that could be used in
    injection attacks or cause display issues.

    Args:
        input_string: Raw user input to sanitize.
        max_length: Maximum allowed length for the input.

    Returns:
        Sanitized string safe for storage and display.

    Raises:
        ValueError: If input exceeds maximum length after sanitization.

    Example:
        >>> sanitize_user_input("Hello <script>alert('xss')</script>")
        "Hello alert('xss')"
        >>> sanitize_user_input("Normal text with symbols: @#$%")
        "Normal text with symbols: @#$%"

    Security:
        This function provides basic XSS protection but should not be
        the only security measure. Always use proper templating and
        context-aware escaping in your presentation layer.
    """
    if not input_string:
        return ""

    # Remove HTML tags and dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', '`']
    sanitized = input_string

    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')

    # Limit length
    sanitized = sanitized[:max_length]

    # Remove excessive whitespace
    sanitized = ' '.join(sanitized.split())

    return sanitized.strip()
```

### Configuration and Constants Documentation

```python
"""Configuration settings and constants for the user management system.

This module contains all configuration values, constants, and settings
used throughout the application. Values are loaded from environment
variables with appropriate defaults for development environments.

Environment Variables:
    DATABASE_URL: Database connection URL
    CACHE_TTL: Cache time-to-live in seconds
    MAX_LOGIN_ATTEMPTS: Maximum login attempts before lockout
    PASSWORD_MIN_LENGTH: Minimum required password length
    EMAIL_VERIFICATION_TIMEOUT: Email verification timeout in hours

Example:
    Loading configuration:

    >>> from src.config import settings
    >>> print(settings.DATABASE_URL)
    "postgresql://localhost:5432/myapp"
    >>> print(settings.MAX_LOGIN_ATTEMPTS)
    5
"""

import os
from typing import List, Optional
from dataclasses import dataclass

@dataclass
class Settings:
    """Application settings loaded from environment variables.

    This class centralizes all configuration settings and provides
    type safety and validation for configuration values.

    Attributes:
        DATABASE_URL: Database connection string.
        DEBUG: Whether debug mode is enabled.
        SECRET_KEY: Secret key for cryptographic operations.
        CACHE_TTL: Default cache time-to-live in seconds.
        MAX_LOGIN_ATTEMPTS: Maximum login attempts before account lockout.
        PASSWORD_MIN_LENGTH: Minimum required password length.
        EMAIL_VERIFICATION_TIMEOUT: Email verification timeout in hours.
        ALLOWED_EMAIL_DOMAINS: List of allowed email domains (empty = all allowed).

    Example:
        Accessing settings:

        >>> settings = Settings()
        >>> if settings.DEBUG:
        ...     print("Debug mode is enabled")
        >>> db_url = settings.DATABASE_URL
    """

    DATABASE_URL: str = os.getenv(
        'DATABASE_URL',
        'postgresql://localhost:5432/myapp_dev'
    )

    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'

    SECRET_KEY: str = os.getenv(
        'SECRET_KEY',
        'dev-secret-key-change-in-production'
    )

    CACHE_TTL: int = int(os.getenv('CACHE_TTL', '3600'))  # 1 hour

    MAX_LOGIN_ATTEMPTS: int = int(os.getenv('MAX_LOGIN_ATTEMPTS', '5'))

    PASSWORD_MIN_LENGTH: int = int(os.getenv('PASSWORD_MIN_LENGTH', '8'))

    EMAIL_VERIFICATION_TIMEOUT: int = int(os.getenv('EMAIL_VERIFICATION_TIMEOUT', '24'))

    ALLOWED_EMAIL_DOMAINS: List[str] = os.getenv(
        'ALLOWED_EMAIL_DOMAINS', ''
    ).split(',') if os.getenv('ALLOWED_EMAIL_DOMAINS') else []

    def __post_init__(self) -> None:
        """Validate configuration after initialization.

        Raises:
            ValueError: If any configuration value is invalid.
        """
        if self.SECRET_KEY == 'dev-secret-key-change-in-production' and not self.DEBUG:
            raise ValueError("SECRET_KEY must be set in production environment")

        if self.PASSWORD_MIN_LENGTH < 6:
            raise ValueError("PASSWORD_MIN_LENGTH must be at least 6")

        if self.MAX_LOGIN_ATTEMPTS < 1:
            raise ValueError("MAX_LOGIN_ATTEMPTS must be at least 1")

# Global settings instance
settings = Settings()

# User validation constants
class UserConstants:
    """Constants for user validation and constraints.

    This class contains all constants related to user data validation,
    business rules, and system limits.
    """

    # Name validation
    NAME_MIN_LENGTH: int = 2
    NAME_MAX_LENGTH: int = 100

    # Age validation
    MIN_AGE: int = 13
    MAX_AGE: int = 120

    # Email validation
    EMAIL_MAX_LENGTH: int = 254
    EMAIL_PATTERN: str = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # Reserved usernames that cannot be used
    RESERVED_USERNAMES: List[str] = [
        'admin', 'administrator', 'root', 'system', 'api', 'www',
        'mail', 'email', 'support', 'help', 'info', 'noreply'
    ]

    # Default user preferences
    DEFAULT_PREFERENCES: dict = {
        'theme': 'light',
        'language': 'en',
        'notifications': True,
        'email_notifications': True
    }

    # Cache keys
    CACHE_KEY_USER_BY_ID: str = "user:id:{user_id}"
    CACHE_KEY_USER_BY_EMAIL: str = "user:email:{email}"
    CACHE_KEY_USER_PREFERENCES: str = "user:preferences:{user_id}"

# Error messages
class ErrorMessages:
    """Standardized error messages for user operations.

    This class provides consistent error messages throughout the
    application for better user experience and easier maintenance.
    """

    # Validation errors
    INVALID_EMAIL_FORMAT: str = "Invalid email address format"
    EMAIL_ALREADY_EXISTS: str = "A user with this email address already exists"
    USERNAME_ALREADY_EXISTS: str = "This username is already taken"
    RESERVED_USERNAME: str = "This username is reserved and cannot be used"

    # Password errors
    PASSWORD_TOO_SHORT: str = f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters"
    PASSWORD_TOO_WEAK: str = "Password must contain uppercase, lowercase, and numeric characters"

    # User not found errors
    USER_NOT_FOUND: str = "User not found"
    USER_NOT_FOUND_BY_EMAIL: str = "No user found with this email address"
    USER_NOT_FOUND_BY_ID: str = "No user found with this ID"

    # Authentication errors
    INVALID_CREDENTIALS: str = "Invalid email or password"
    ACCOUNT_LOCKED: str = f"Account locked due to {settings.MAX_LOGIN_ATTEMPTS} failed login attempts"
    ACCOUNT_INACTIVE: str = "This account has been deactivated"

    # Authorization errors
    INSUFFICIENT_PERMISSIONS: str = "You do not have permission to perform this action"
    ACCESS_DENIED: str = "Access denied"
```
