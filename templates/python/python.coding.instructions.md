---
description: 'Python-specific coding standards and best practices'
applyTo: '**/*.py'
---

# Python Coding Standards and Best Practices

## Language and Framework Preferences

- **Primary Language:** Python 3.9+ for all Python projects
- **Code Style:** Follow PEP 8 with Black formatter for consistent formatting
- **Type Hints:** Use type hints for all function signatures and complex variables
- **Target Compatibility:** Python 3.9+ (use modern Python features appropriately)

## Code Quality Guidelines

- **Readability:** Follow "The Zen of Python" - explicit is better than implicit
- **Functions:** Keep functions focused, ideally under 30 lines for better readability
- **Magic Numbers:** Use named constants or configuration files instead of magic numbers
- **Error Handling:** Use specific exception types, avoid bare `except:` clauses
- **Memory Management:** Be mindful of memory usage, use generators for large datasets
- **Async Patterns:** Use `asyncio` for I/O-bound operations, avoid blocking operations

## Naming Conventions

- **Files:** Use snake_case for file names (e.g., `user_service.py`)
- **Classes:** PascalCase (e.g., `UserService`, `DatabaseConnection`)
- **Functions/Methods:** snake_case (e.g., `get_user_by_id`, `validate_input`)
- **Variables:** snake_case (e.g., `user_id`, `is_valid`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`, `DEFAULT_TIMEOUT`)
- **Private Attributes:** Single underscore prefix (e.g., `_internal_method`)
- **Name Mangling:** Double underscore prefix only when necessary (e.g., `__private_attr`)

## Code Organization

- **Single Responsibility:** One class per file for complex classes, related utilities can be grouped
- **Imports:** Follow PEP 8 import order (standard library, third-party, local imports)
- **Module Structure:** Use `__init__.py` files for package initialization and clean imports
- **Entry Points:** Use `if __name__ == "__main__":` for script entry points

## Python-Specific Best Practices

### Type Hints and Documentation

```python
from typing import List, Dict, Optional, Union
from dataclasses import dataclass

def process_user_data(
    users: List[Dict[str, Union[str, int]]],
    active_only: bool = True
) -> List[str]:
    """Process user data and return list of usernames.

    Args:
        users: List of user dictionaries containing user information
        active_only: If True, only include active users

    Returns:
        List of usernames matching the criteria

    Raises:
        ValueError: If user data format is invalid
    """
    pass
```

### Error Handling Patterns

```python
# Good: Specific exception handling
try:
    user = get_user_by_id(user_id)
except UserNotFoundError as e:
    logger.warning(f"User {user_id} not found: {e}")
    return None
except DatabaseConnectionError as e:
    logger.error(f"Database connection failed: {e}")
    raise

# Good: Use custom exceptions
class ValidationError(Exception):
    """Raised when data validation fails."""
    pass

class UserNotFoundError(Exception):
    """Raised when requested user cannot be found."""
    pass
```

### Resource Management

```python
# Good: Use context managers
with open('data.json', 'r') as file:
    data = json.load(file)

# Good: Create custom context managers when needed
from contextlib import contextmanager

@contextmanager
def database_transaction():
    conn = get_connection()
    trans = conn.begin()
    try:
        yield conn
        trans.commit()
    except Exception:
        trans.rollback()
        raise
    finally:
        conn.close()
```

### Performance Considerations

```python
# Good: Use generators for large datasets
def process_large_file(filename: str):
    with open(filename, 'r') as file:
        for line in file:
            yield process_line(line)

# Good: Use list comprehensions for simple transformations
active_users = [user for user in users if user.is_active]

# Good: Use appropriate data structures
from collections import defaultdict, deque
user_groups = defaultdict(list)
```

## Testing Standards

### Test Framework Preferences

- **Primary Framework:** pytest for all testing
- **Fixtures:** Use pytest fixtures for test data and setup
- **Parametrized Tests:** Use `pytest.mark.parametrize` for multiple test cases
- **Mocking:** Use `unittest.mock` or `pytest-mock` for mocking dependencies

### Test File Organization

```python
# tests/test_user_service.py
import pytest
from unittest.mock import Mock, patch
from src.services.user_service import UserService
from src.exceptions import UserNotFoundError

class TestUserService:
    @pytest.fixture
    def user_service(self):
        return UserService(db_connection=Mock())

    @pytest.mark.parametrize("user_id,expected", [
        (1, True),
        (999, False),
    ])
    def test_user_exists(self, user_service, user_id, expected):
        # Test implementation
        pass

    def test_get_user_not_found_raises_exception(self, user_service):
        with pytest.raises(UserNotFoundError):
            user_service.get_user_by_id(999)
```

## Dependency Management

### Package Management

- **Primary Tool:** Poetry for dependency management and packaging
- **Requirements:** Maintain both `pyproject.toml` and `requirements.txt`
- **Development Dependencies:** Separate dev dependencies (testing, linting, formatting)
- **Version Pinning:** Pin exact versions for applications, use ranges for libraries

### Virtual Environment Management

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Or use Poetry
poetry install
poetry shell
```

## Code Quality Tools

### Linting and Formatting

- **Black:** Code formatting with line length 88
- **isort:** Import sorting and organization
- **flake8:** Linting and style checking
- **mypy:** Static type checking
- **pylint:** Additional code analysis

### Configuration Examples

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py39']

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.mypy]
python_version = "3.9"
strict = true
ignore_missing_imports = true
```

## Documentation Standards

### Docstring Format

Use Google-style docstrings:

```python
def calculate_user_score(
    user_data: Dict[str, Any],
    weights: Optional[Dict[str, float]] = None
) -> float:
    """Calculate a user's composite score based on various metrics.

    This function computes a weighted score based on user activity,
    engagement, and other factors.

    Args:
        user_data: Dictionary containing user metrics and information
        weights: Optional custom weights for score calculation.
                Defaults to standard weights if not provided.

    Returns:
        Calculated score as a float between 0.0 and 100.0

    Raises:
        ValueError: If user_data is missing required fields
        TypeError: If weights contain non-numeric values

    Example:
        >>> user = {"activity": 85, "engagement": 92}
        >>> calculate_user_score(user)
        88.5
    """
    pass
```

## Security Considerations

### Input Validation

```python
import re
from typing import Any

def validate_email(email: str) -> bool:
    """Validate email format using regex."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def sanitize_user_input(user_input: str) -> str:
    """Sanitize user input to prevent injection attacks."""
    # Remove potentially dangerous characters
    safe_input = re.sub(r'[<>"\';]', '', user_input)
    return safe_input.strip()
```

### Environment Configuration

```python
import os
from dataclasses import dataclass

@dataclass
class Config:
    """Application configuration from environment variables."""
    database_url: str = os.getenv('DATABASE_URL', 'sqlite:///default.db')
    secret_key: str = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    debug: bool = os.getenv('DEBUG', 'False').lower() == 'true'

    def __post_init__(self):
        if self.secret_key == 'dev-key-change-in-production' and not self.debug:
            raise ValueError("SECRET_KEY must be set in production")
```

## Common Anti-Patterns to Avoid

- **Mutable Default Arguments:** Use `None` and check inside function
- **Broad Exception Catching:** Avoid bare `except:` clauses
- **Global Variables:** Minimize global state, use dependency injection
- **String Concatenation in Loops:** Use `join()` for multiple strings
- **Not Using Context Managers:** Always use `with` for file operations
- **Ignoring PEP 8:** Follow Python style guidelines consistently
- **Missing Type Hints:** Add type hints for better code documentation
- **Circular Imports:** Structure modules to avoid circular dependencies

## Performance Optimization

### Memory Efficiency

```python
# Use generators for large datasets
def read_large_file(filename: str):
    with open(filename, 'r') as file:
        for line in file:
            yield line.strip()

# Use __slots__ for classes with many instances
class Point:
    __slots__ = ['x', 'y']

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
```

### Concurrency Patterns

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def process_data_async(data_list: List[str]) -> List[str]:
    """Process data asynchronously for I/O bound operations."""
    tasks = [process_item_async(item) for item in data_list]
    return await asyncio.gather(*tasks)

def process_cpu_intensive_data(data_list: List[str]) -> List[str]:
    """Use thread pool for CPU-intensive operations."""
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(cpu_intensive_process, data_list))
    return results
```
