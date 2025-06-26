---
description: 'Python-specific testing patterns and frameworks (pytest, Django, FastAPI)'
applyTo: 'test/**/*.py,tests/**/*.py,**/test_*.py'
---

# Python Testing Standards

## Test Case Naming Conventions

### Test Case ID Format: `[AREA]-[TYPE]-[NUMBER]`

**Python/Django/FastAPI Area Prefixes:**

- `VIEW` - Django views/FastAPI endpoints tests
- `MODEL` - Django models/SQLAlchemy tests
- `FORM` - Django forms/Pydantic validators tests
- `API` - REST API endpoint tests
- `SRV` - Service layer tests
- `DB` - Database/ORM tests
- `AUTH` - Authentication/Authorization tests
- `UTIL` - Backend utility function tests
- `SERIALIZER` - DRF serializers/Pydantic schemas tests
- `MIDDLEWARE` - Django middleware tests

**Type Suffixes:**

- `UNIT` - Unit tests (isolated component testing)
- `INT` - Integration tests (component interaction testing)
- `E2E` - End-to-end tests (full API workflow testing)

**Examples:**

- `VIEW-UNIT-001` - First unit test for Django view
- `MODEL-UNIT-001` - First unit test for Django model
- `FORM-INT-001` - First integration test for Django form
- `API-E2E-001` - First end-to-end API test

## Testing Framework and Setup

### Primary Testing Framework: pytest

```python
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
addopts =
    --strict-markers
    --strict-config
    --cov=src
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow running tests
    api: API endpoint tests
```

```python
# conftest.py
import pytest
from unittest.mock import Mock
from src.database import Database
from src.services.user_service import UserService

@pytest.fixture
def mock_database():
    """Mock database connection for testing."""
    return Mock(spec=Database)

@pytest.fixture
def user_service(mock_database):
    """User service with mocked dependencies."""
    return UserService(database=mock_database)

@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        'name': 'John Doe',
        'email': 'john@example.com',
        'age': 30
    }

@pytest.fixture(scope="session")
def test_database():
    """Session-scoped test database."""
    db = Database(DATABASE_TEST_URL)
    db.create_tables()
    yield db
    db.drop_tables()
    db.close()
```

### Test Case Naming Conventions

**Area Prefixes for Python/Django:**

- `VIEW` - View/Controller tests
- `MODEL` - Model/ORM tests
- `FORM` - Form validation tests
- `CMD` - Management command tests
- `API` - API endpoint tests
- `SRV` - Service layer tests
- `UTIL` - Utility function tests
- `DB` - Database operation tests
- `AUTH` - Authentication/Authorization tests
- `INT` - Integration tests
- `E2E` - End-to-end tests

**Examples:**

- `VIEW-UNIT-001` - First unit test for View layer
- `MODEL-UNIT-001` - First unit test for Model layer
- `API-INT-001` - First integration test for API
- `E2E-FLOW-001` - First end-to-end workflow test

## Unit Testing Patterns

### Service Layer Testing

```python
# tests/unit/test_user_service.py
import pytest
from unittest.mock import Mock, patch, call
from src.services.user_service import UserService, UserNotFoundError
from src.models.user import User

class TestUserService:
    """Test suite for UserService class."""

    @pytest.fixture
    def mock_repository(self):
        """Mock user repository."""
        return Mock()

    @pytest.fixture
    def user_service(self, mock_repository):
        """UserService instance with mocked dependencies."""
        return UserService(repository=mock_repository)

    def test_get_user_by_id_success(self, user_service, mock_repository):
        """Test successful user retrieval by ID."""
        # Arrange
        user_id = "123"
        expected_user = User(id=user_id, name="John Doe", email="john@example.com")
        mock_repository.find_by_id.return_value = expected_user

        # Act
        result = user_service.get_user_by_id(user_id)

        # Assert
        assert result == expected_user
        mock_repository.find_by_id.assert_called_once_with(user_id)

    def test_get_user_by_id_not_found(self, user_service, mock_repository):
        """Test user retrieval when user doesn't exist."""
        # Arrange
        user_id = "999"
        mock_repository.find_by_id.return_value = None

        # Act & Assert
        with pytest.raises(UserNotFoundError, match=f"User {user_id} not found"):
            user_service.get_user_by_id(user_id)

        mock_repository.find_by_id.assert_called_once_with(user_id)

    @pytest.mark.parametrize("user_id,expected_calls", [
        ("valid_id", 1),
        ("another_id", 1),
    ])
    def test_get_user_by_id_repository_calls(
        self, user_service, mock_repository, user_id, expected_calls
    ):
        """Test repository is called correct number of times."""
        # Arrange
        mock_repository.find_by_id.return_value = Mock()

        # Act
        user_service.get_user_by_id(user_id)

        # Assert
        assert mock_repository.find_by_id.call_count == expected_calls

    def test_create_user_success(self, user_service, mock_repository):
        """Test successful user creation."""
        # Arrange
        user_data = {
            'name': 'Jane Doe',
            'email': 'jane@example.com'
        }
        created_user = User(id="456", **user_data)
        mock_repository.create.return_value = created_user

        # Act
        result = user_service.create_user(user_data)

        # Assert
        assert result == created_user
        mock_repository.create.assert_called_once_with(user_data)

    def test_create_user_validation_error(self, user_service):
        """Test user creation with invalid data."""
        # Arrange
        invalid_data = {'name': ''}  # Missing email

        # Act & Assert
        with pytest.raises(ValueError, match="Invalid user data"):
            user_service.create_user(invalid_data)
```

### Model Testing (Django)

```python
# tests/unit/test_user_model.py
import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from src.models.user import User

class TestUserModel(TestCase):
    """Test suite for User model."""

    def setUp(self):
        """Set up test data."""
        self.valid_user_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'age': 30
        }

    def test_create_user_success(self):
        """Test successful user creation."""
        # Act
        user = User.objects.create(**self.valid_user_data)

        # Assert
        assert user.pk is not None
        assert user.name == self.valid_user_data['name']
        assert user.email == self.valid_user_data['email']
        assert user.age == self.valid_user_data['age']
        assert user.is_active is True  # Default value

    def test_user_str_representation(self):
        """Test string representation of user."""
        # Arrange
        user = User(**self.valid_user_data)

        # Act
        result = str(user)

        # Assert
        expected = f"{self.valid_user_data['name']} ({self.valid_user_data['email']})"
        assert result == expected

    def test_email_uniqueness_constraint(self):
        """Test email uniqueness is enforced."""
        # Arrange
        User.objects.create(**self.valid_user_data)

        # Act & Assert
        with pytest.raises(IntegrityError):
            User.objects.create(**self.valid_user_data)

    def test_email_validation(self):
        """Test email format validation."""
        # Arrange
        invalid_data = self.valid_user_data.copy()
        invalid_data['email'] = 'invalid-email'

        # Act & Assert
        user = User(**invalid_data)
        with pytest.raises(ValidationError):
            user.full_clean()

    @pytest.mark.parametrize("age,is_valid", [
        (0, False),   # Too young
        (13, True),   # Minimum valid age
        (120, True),  # Maximum reasonable age
        (150, False), # Too old
        (-1, False),  # Negative age
    ])
    def test_age_validation(self, age, is_valid):
        """Test age validation with various values."""
        # Arrange
        user_data = self.valid_user_data.copy()
        user_data['age'] = age
        user = User(**user_data)

        # Act & Assert
        if is_valid:
            user.full_clean()  # Should not raise
        else:
            with pytest.raises(ValidationError):
                user.full_clean()

    def test_get_full_name_method(self):
        """Test custom method for getting full name."""
        # Arrange
        user = User(name="John Doe", email="john@example.com")

        # Act
        result = user.get_full_name()

        # Assert
        assert result == "John Doe"

    def test_is_adult_property(self):
        """Test custom property for checking if user is adult."""
        # Arrange
        adult_user = User(age=25, name="Adult", email="adult@example.com")
        minor_user = User(age=16, name="Minor", email="minor@example.com")

        # Act & Assert
        assert adult_user.is_adult is True
        assert minor_user.is_adult is False
```

### View Testing (Django)

```python
# tests/unit/test_user_views.py
import json
import pytest
from django.test import TestCase, Client
from django.contrib.auth.models import User as AuthUser
from django.urls import reverse
from src.models.user import User

class TestUserViews(TestCase):
    """Test suite for user-related views."""

    def setUp(self):
        """Set up test data and client."""
        self.client = Client()
        self.auth_user = AuthUser.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.user = User.objects.create(
            name='John Doe',
            email='john@example.com',
            age=30
        )

    def test_user_list_view_success(self):
        """Test user list view returns users."""
        # Act
        response = self.client.get(reverse('user:list'))

        # Assert
        assert response.status_code == 200
        assert 'users' in response.context
        assert self.user in response.context['users']

    def test_user_detail_view_success(self):
        """Test user detail view returns specific user."""
        # Act
        response = self.client.get(
            reverse('user:detail', kwargs={'pk': self.user.pk})
        )

        # Assert
        assert response.status_code == 200
        assert response.context['user'] == self.user

    def test_user_detail_view_not_found(self):
        """Test user detail view with non-existent user."""
        # Act
        response = self.client.get(
            reverse('user:detail', kwargs={'pk': 999})
        )

        # Assert
        assert response.status_code == 404

    def test_user_create_view_get(self):
        """Test GET request to user create view."""
        # Arrange
        self.client.login(username='testuser', password='testpass123')

        # Act
        response = self.client.get(reverse('user:create'))

        # Assert
        assert response.status_code == 200
        assert 'form' in response.context

    def test_user_create_view_post_success(self):
        """Test successful POST to user create view."""
        # Arrange
        self.client.login(username='testuser', password='testpass123')
        user_data = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'age': 25
        }

        # Act
        response = self.client.post(reverse('user:create'), data=user_data)

        # Assert
        assert response.status_code == 302  # Redirect after success
        assert User.objects.filter(email='jane@example.com').exists()

    def test_user_create_view_post_invalid_data(self):
        """Test POST to user create view with invalid data."""
        # Arrange
        self.client.login(username='testuser', password='testpass123')
        invalid_data = {
            'name': '',  # Invalid: empty name
            'email': 'invalid-email',  # Invalid: bad email format
            'age': -5  # Invalid: negative age
        }

        # Act
        response = self.client.post(reverse('user:create'), data=invalid_data)

        # Assert
        assert response.status_code == 200  # Returns form with errors
        assert 'form' in response.context
        assert response.context['form'].errors

    def test_user_create_view_requires_authentication(self):
        """Test user create view requires authentication."""
        # Act
        response = self.client.get(reverse('user:create'))

        # Assert
        assert response.status_code == 302  # Redirect to login
        assert '/login/' in response.url
```

### API Testing (FastAPI)

```python
# tests/unit/test_user_api.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from src.main import app
from src.services.user_service import UserService
from src.models.user import User

client = TestClient(app)

class TestUserAPI:
    """Test suite for User API endpoints."""

    @patch('src.dependencies.get_user_service')
    def test_get_user_success(self, mock_get_service):
        """Test successful user retrieval via API."""
        # Arrange
        user_id = "123"
        expected_user = User(id=user_id, name="John Doe", email="john@example.com")
        mock_service = Mock(spec=UserService)
        mock_service.get_user_by_id.return_value = expected_user
        mock_get_service.return_value = mock_service

        # Act
        response = client.get(f"/users/{user_id}")

        # Assert
        assert response.status_code == 200
        assert response.json()["id"] == user_id
        assert response.json()["name"] == "John Doe"
        mock_service.get_user_by_id.assert_called_once_with(user_id)

    @patch('src.dependencies.get_user_service')
    def test_get_user_not_found(self, mock_get_service):
        """Test user not found via API."""
        # Arrange
        user_id = "999"
        mock_service = Mock(spec=UserService)
        mock_service.get_user_by_id.side_effect = UserNotFoundError("User not found")
        mock_get_service.return_value = mock_service

        # Act
        response = client.get(f"/users/{user_id}")

        # Assert
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    @patch('src.dependencies.get_user_service')
    def test_create_user_success(self, mock_get_service):
        """Test successful user creation via API."""
        # Arrange
        user_data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "age": 25
        }
        created_user = User(id="456", **user_data)
        mock_service = Mock(spec=UserService)
        mock_service.create_user.return_value = created_user
        mock_get_service.return_value = mock_service

        # Act
        response = client.post("/users/", json=user_data)

        # Assert
        assert response.status_code == 201
        assert response.json()["id"] == "456"
        assert response.json()["name"] == user_data["name"]
        mock_service.create_user.assert_called_once_with(user_data)

    def test_create_user_validation_error(self):
        """Test user creation with invalid data."""
        # Arrange
        invalid_data = {
            "name": "",  # Invalid: empty name
            "email": "invalid-email",  # Invalid: bad format
            "age": -5  # Invalid: negative age
        }

        # Act
        response = client.post("/users/", json=invalid_data)

        # Assert
        assert response.status_code == 422
        assert "detail" in response.json()

    @pytest.mark.parametrize("user_data,expected_status", [
        ({"name": "Valid User", "email": "valid@example.com", "age": 25}, 201),
        ({"name": "", "email": "valid@example.com", "age": 25}, 422),
        ({"name": "Valid User", "email": "invalid-email", "age": 25}, 422),
        ({"name": "Valid User", "email": "valid@example.com", "age": -1}, 422),
    ])
    @patch('src.dependencies.get_user_service')
    def test_create_user_various_data(
        self, mock_get_service, user_data, expected_status
    ):
        """Test user creation with various data combinations."""
        # Arrange
        if expected_status == 201:
            created_user = User(id="123", **user_data)
            mock_service = Mock(spec=UserService)
            mock_service.create_user.return_value = created_user
            mock_get_service.return_value = mock_service

        # Act
        response = client.post("/users/", json=user_data)

        # Assert
        assert response.status_code == expected_status
```

## Integration Testing

### Database Integration Testing

```python
# tests/integration/test_user_repository.py
import pytest
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.database.base import Base
from src.repositories.user_repository import UserRepository
from src.models.user import User

class TestUserRepositoryIntegration:
    """Integration tests for UserRepository with real database."""

    @pytest.fixture(scope="class")
    def db_engine(self):
        """Create test database engine."""
        engine = create_engine("sqlite:///:memory:", echo=False)
        Base.metadata.create_all(engine)
        yield engine
        Base.metadata.drop_all(engine)

    @pytest.fixture
    def db_session(self, db_engine):
        """Create database session for each test."""
        Session = sessionmaker(bind=db_engine)
        session = Session()
        yield session
        session.rollback()
        session.close()

    @pytest.fixture
    def user_repository(self, db_session):
        """Create UserRepository with real database session."""
        return UserRepository(session=db_session)

    def test_create_and_find_user(self, user_repository):
        """Test creating and finding a user in database."""
        # Arrange
        user_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'age': 30
        }

        # Act
        created_user = user_repository.create(user_data)
        found_user = user_repository.find_by_id(created_user.id)

        # Assert
        assert found_user is not None
        assert found_user.id == created_user.id
        assert found_user.name == user_data['name']
        assert found_user.email == user_data['email']

    def test_find_by_email(self, user_repository):
        """Test finding user by email."""
        # Arrange
        user_data = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'age': 25
        }
        created_user = user_repository.create(user_data)

        # Act
        found_user = user_repository.find_by_email('jane@example.com')

        # Assert
        assert found_user is not None
        assert found_user.id == created_user.id
        assert found_user.email == 'jane@example.com'

    def test_update_user(self, user_repository):
        """Test updating user information."""
        # Arrange
        user_data = {
            'name': 'Original Name',
            'email': 'original@example.com',
            'age': 30
        }
        created_user = user_repository.create(user_data)

        # Act
        update_data = {'name': 'Updated Name', 'age': 31}
        updated_user = user_repository.update(created_user.id, update_data)

        # Assert
        assert updated_user.name == 'Updated Name'
        assert updated_user.age == 31
        assert updated_user.email == 'original@example.com'  # Unchanged

    def test_delete_user(self, user_repository):
        """Test deleting a user."""
        # Arrange
        user_data = {
            'name': 'To Be Deleted',
            'email': 'delete@example.com',
            'age': 25
        }
        created_user = user_repository.create(user_data)

        # Act
        result = user_repository.delete(created_user.id)
        found_user = user_repository.find_by_id(created_user.id)

        # Assert
        assert result is True
        assert found_user is None

    def test_list_users_with_pagination(self, user_repository):
        """Test listing users with pagination."""
        # Arrange
        users_data = [
            {'name': f'User {i}', 'email': f'user{i}@example.com', 'age': 20 + i}
            for i in range(5)
        ]
        created_users = [user_repository.create(data) for data in users_data]

        # Act
        page_1 = user_repository.list_users(page=1, per_page=2)
        page_2 = user_repository.list_users(page=2, per_page=2)

        # Assert
        assert len(page_1) == 2
        assert len(page_2) == 2
        assert page_1[0].id != page_2[0].id  # Different users
```

### API Integration Testing

```python
# tests/integration/test_api_integration.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.main import app
from src.database.base import Base
from src.dependencies import get_database_session

class TestAPIIntegration:
    """Integration tests for API with real database."""

    @pytest.fixture(scope="class")
    def test_engine(self):
        """Create test database engine."""
        engine = create_engine("sqlite:///:memory:", echo=False)
        Base.metadata.create_all(engine)
        yield engine
        Base.metadata.drop_all(engine)

    @pytest.fixture
    def test_session(self, test_engine):
        """Create test database session."""
        Session = sessionmaker(bind=test_engine)
        session = Session()
        yield session
        session.close()

    @pytest.fixture
    def client(self, test_session):
        """Create test client with test database."""
        def override_get_db():
            yield test_session

        app.dependency_overrides[get_database_session] = override_get_db
        client = TestClient(app)
        yield client
        app.dependency_overrides.clear()

    def test_full_user_crud_workflow(self, client):
        """Test complete CRUD workflow for users."""
        # Create user
        user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "age": 30
        }

        create_response = client.post("/users/", json=user_data)
        assert create_response.status_code == 201
        created_user = create_response.json()
        user_id = created_user["id"]

        # Read user
        get_response = client.get(f"/users/{user_id}")
        assert get_response.status_code == 200
        assert get_response.json()["name"] == user_data["name"]

        # Update user
        update_data = {"name": "Updated User", "age": 31}
        update_response = client.patch(f"/users/{user_id}", json=update_data)
        assert update_response.status_code == 200
        assert update_response.json()["name"] == "Updated User"

        # List users
        list_response = client.get("/users/")
        assert list_response.status_code == 200
        users = list_response.json()
        assert len(users) >= 1
        assert any(user["id"] == user_id for user in users)

        # Delete user
        delete_response = client.delete(f"/users/{user_id}")
        assert delete_response.status_code == 204

        # Verify deletion
        get_deleted_response = client.get(f"/users/{user_id}")
        assert get_deleted_response.status_code == 404

    def test_user_email_uniqueness_constraint(self, client):
        """Test email uniqueness is enforced at API level."""
        # Arrange
        user_data = {
            "name": "First User",
            "email": "duplicate@example.com",
            "age": 25
        }

        # Act - Create first user
        first_response = client.post("/users/", json=user_data)
        assert first_response.status_code == 201

        # Act - Try to create second user with same email
        user_data["name"] = "Second User"
        second_response = client.post("/users/", json=user_data)

        # Assert
        assert second_response.status_code == 400
        assert "email" in second_response.json()["detail"].lower()
```

## Async Testing

### Async Function Testing

```python
# tests/unit/test_async_service.py
import pytest
import asyncio
from unittest.mock import AsyncMock, Mock
from src.services.async_user_service import AsyncUserService

class TestAsyncUserService:
    """Test suite for async user service."""

    @pytest.fixture
    def mock_async_repository(self):
        """Mock async repository."""
        mock = AsyncMock()
        return mock

    @pytest.fixture
    def async_user_service(self, mock_async_repository):
        """Async user service with mocked dependencies."""
        return AsyncUserService(repository=mock_async_repository)

    @pytest.mark.asyncio
    async def test_get_user_by_id_async(self, async_user_service, mock_async_repository):
        """Test async user retrieval."""
        # Arrange
        user_id = "123"
        expected_user = {"id": user_id, "name": "John Doe"}
        mock_async_repository.find_by_id.return_value = expected_user

        # Act
        result = await async_user_service.get_user_by_id(user_id)

        # Assert
        assert result == expected_user
        mock_async_repository.find_by_id.assert_called_once_with(user_id)

    @pytest.mark.asyncio
    async def test_create_multiple_users_concurrently(
        self, async_user_service, mock_async_repository
    ):
        """Test creating multiple users concurrently."""
        # Arrange
        users_data = [
            {"name": f"User {i}", "email": f"user{i}@example.com"}
            for i in range(3)
        ]
        mock_async_repository.create.side_effect = [
            {"id": f"id_{i}", **data} for i, data in enumerate(users_data)
        ]

        # Act
        tasks = [
            async_user_service.create_user(data) for data in users_data
        ]
        results = await asyncio.gather(*tasks)

        # Assert
        assert len(results) == 3
        assert all("id" in result for result in results)
        assert mock_async_repository.create.call_count == 3

    @pytest.mark.asyncio
    async def test_timeout_handling(self, async_user_service, mock_async_repository):
        """Test handling of timeout in async operations."""
        # Arrange
        async def slow_operation(*args, **kwargs):
            await asyncio.sleep(2)  # Simulate slow operation
            return {"id": "123", "name": "Slow User"}

        mock_async_repository.find_by_id.side_effect = slow_operation

        # Act & Assert
        with pytest.raises(asyncio.TimeoutError):
            await asyncio.wait_for(
                async_user_service.get_user_by_id("123"),
                timeout=1.0
            )
```

## Mocking and Fixtures

### Complex Fixture Patterns

```python
# tests/conftest.py
import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timedelta
from src.models.user import User
from src.services.email_service import EmailService

@pytest.fixture
def freeze_time():
    """Fixture to freeze time for consistent testing."""
    frozen_time = datetime(2023, 1, 1, 12, 0, 0)
    with patch('src.utils.datetime.datetime') as mock_datetime:
        mock_datetime.now.return_value = frozen_time
        mock_datetime.utcnow.return_value = frozen_time
        yield frozen_time

@pytest.fixture
def mock_email_service():
    """Mock email service for testing."""
    mock = Mock(spec=EmailService)
    mock.send_email.return_value = True
    mock.send_bulk_email.return_value = {"sent": 5, "failed": 0}
    return mock

@pytest.fixture(params=[
    {"name": "John Doe", "age": 30, "email": "john@example.com"},
    {"name": "Jane Smith", "age": 25, "email": "jane@example.com"},
])
def user_data_variations(request):
    """Parametrized fixture for different user data."""
    return request.param

@pytest.fixture
def users_factory():
    """Factory fixture for creating multiple users."""
    def _create_users(count=3, **overrides):
        users = []
        for i in range(count):
            user_data = {
                "name": f"User {i}",
                "email": f"user{i}@example.com",
                "age": 20 + i,
                **overrides
            }
            users.append(User(**user_data))
        return users
    return _create_users

@pytest.fixture(scope="session")
def test_config():
    """Session-scoped configuration for tests."""
    return {
        "database_url": "sqlite:///:memory:",
        "debug": True,
        "testing": True,
        "email_backend": "mock"
    }
```

### Advanced Mocking Patterns

```python
# tests/unit/test_advanced_mocking.py
import pytest
from unittest.mock import Mock, patch, MagicMock, call
from datetime import datetime
from src.services.notification_service import NotificationService

class TestAdvancedMocking:
    """Test suite demonstrating advanced mocking patterns."""

    def test_property_mocking(self):
        """Test mocking object properties."""
        # Arrange
        mock_user = Mock()
        type(mock_user).is_active = PropertyMock(return_value=True)

        # Act & Assert
        assert mock_user.is_active is True

    def test_context_manager_mocking(self):
        """Test mocking context managers."""
        # Arrange
        with patch('builtins.open', mock_open(read_data='file content')) as mock_file:
            # Act
            with open('test.txt', 'r') as f:
                content = f.read()

        # Assert
        assert content == 'file content'
        mock_file.assert_called_once_with('test.txt', 'r')

    def test_side_effect_with_exception(self):
        """Test using side_effect to raise exceptions."""
        # Arrange
        mock_service = Mock()
        mock_service.get_user.side_effect = [
            {"id": "1", "name": "User 1"},  # First call succeeds
            Exception("Service unavailable"),  # Second call fails
            {"id": "3", "name": "User 3"},  # Third call succeeds
        ]

        # Act & Assert
        result1 = mock_service.get_user("1")
        assert result1["name"] == "User 1"

        with pytest.raises(Exception, match="Service unavailable"):
            mock_service.get_user("2")

        result3 = mock_service.get_user("3")
        assert result3["name"] == "User 3"

    def test_mock_chain_calls(self):
        """Test mocking chained method calls."""
        # Arrange
        mock_database = Mock()
        mock_database.users.filter.return_value.order_by.return_value.limit.return_value = [
            {"id": "1", "name": "User 1"}
        ]

        # Act
        result = mock_database.users.filter(active=True).order_by('name').limit(10)

        # Assert
        assert len(result) == 1
        assert result[0]["name"] == "User 1"

    @patch('src.services.notification_service.EmailService')
    @patch('src.services.notification_service.SMSService')
    def test_multiple_patches(self, mock_sms_service, mock_email_service):
        """Test using multiple patches."""
        # Arrange
        notification_service = NotificationService()
        mock_email_service.return_value.send.return_value = True
        mock_sms_service.return_value.send.return_value = True

        # Act
        result = notification_service.send_notification(
            "user@example.com",
            "Test message",
            channels=["email", "sms"]
        )

        # Assert
        assert result is True
        mock_email_service.return_value.send.assert_called_once()
        mock_sms_service.return_value.send.assert_called_once()
```

## Performance and Load Testing

### Performance Testing with pytest-benchmark

```python
# tests/performance/test_user_performance.py
import pytest
from src.services.user_service import UserService
from src.utils.data_processor import DataProcessor

class TestUserServicePerformance:
    """Performance tests for user service operations."""

    @pytest.fixture
    def large_user_dataset(self):
        """Generate large dataset for performance testing."""
        return [
            {"name": f"User {i}", "email": f"user{i}@example.com", "age": 20 + (i % 50)}
            for i in range(1000)
        ]

    def test_user_creation_performance(self, benchmark, user_service, large_user_dataset):
        """Benchmark user creation performance."""
        # Act & Assert
        result = benchmark(user_service.create_bulk_users, large_user_dataset)
        assert len(result) == 1000

    def test_user_search_performance(self, benchmark, user_service):
        """Benchmark user search performance."""
        # Arrange
        # Assume users are already created in database

        # Act & Assert
        result = benchmark(user_service.search_users, query="User", limit=100)
        assert len(result) <= 100

    @pytest.mark.parametrize("batch_size", [100, 500, 1000])
    def test_batch_processing_performance(self, benchmark, batch_size):
        """Test performance with different batch sizes."""
        # Arrange
        processor = DataProcessor(batch_size=batch_size)
        data = list(range(10000))

        # Act & Assert
        result = benchmark(processor.process_batch, data)
        assert len(result) == 10000
```
