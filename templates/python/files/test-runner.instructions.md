---
description: "Python testing guidelines with pytest, Django testing, and cleanup procedures"
applyTo: "test/**/*.py"
---

# Python Testing Guidelines

## Testing Framework Setup

### pytest Configuration

Configure pytest as the primary testing framework with appropriate plugins:

```ini
# pytest.ini
[tool:pytest]
DJANGO_SETTINGS_MODULE = myproject.settings.test
python_files = tests.py test_*.py *_tests.py
python_classes = Test*
python_functions = test_*
addopts = 
    --verbose
    --tb=short
    --cov=src
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=80
testpaths = tests
```

### Django Testing Configuration

For Django projects, configure test settings and database:

```python
# settings/test.py
from .base import *

DEBUG = False
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Test-specific settings
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
```

## Test Organization and Structure

### Directory Structure

Organize tests to mirror your application structure:

```
tests/
├── conftest.py              # pytest fixtures
├── factories.py             # Test data factories
├── utils.py                 # Test utilities
├── unit/                    # Unit tests
│   ├── test_models.py
│   ├── test_services.py
│   └── test_utils.py
├── integration/             # Integration tests
│   ├── test_api.py
│   ├── test_database.py
│   └── test_external_services.py
├── functional/              # End-to-end tests
│   ├── test_user_workflows.py
│   └── test_admin_workflows.py
└── fixtures/                # Test data fixtures
    ├── users.json
    └── sample_data.py
```

### Test Naming Conventions

Follow consistent naming patterns for test discovery and clarity:

```python
# Good test naming
def test_user_creation_with_valid_data():
    """Test that a user is created successfully with valid data."""
    pass

def test_user_creation_fails_with_invalid_email():
    """Test that user creation fails with invalid email format."""
    pass

def test_api_returns_404_for_nonexistent_user():
    """Test that API returns 404 status for non-existent user."""
    pass
```

## Unit Testing Patterns

### Model Testing

Test Django models with focus on business logic and validation:

```python
import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from accounts.models import User

class TestUserModel:
    """Test cases for User model."""
    
    def test_user_creation_with_valid_data(self):
        """Test user creation with valid data."""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.check_password('testpass123')
    
    def test_user_email_must_be_unique(self):
        """Test that user email must be unique."""
        User.objects.create_user(
            username='user1',
            email='test@example.com',
            password='testpass123'
        )
        
        with pytest.raises(IntegrityError):
            User.objects.create_user(
                username='user2',
                email='test@example.com',
                password='testpass123'
            )
```

### Service Layer Testing

Test business logic in service classes:

```python
import pytest
from unittest.mock import Mock, patch
from accounts.services import UserService
from accounts.factories import UserFactory

class TestUserService:
    """Test cases for UserService."""
    
    @pytest.fixture
    def user_service(self):
        """Create UserService instance for testing."""
        return UserService()
    
    def test_get_user_by_id_returns_user(self, user_service):
        """Test getting user by ID returns correct user."""
        user = UserFactory()
        result = user_service.get_user_by_id(user.id)
        assert result == user
    
    def test_get_user_by_id_returns_none_for_invalid_id(self, user_service):
        """Test getting user by invalid ID returns None."""
        result = user_service.get_user_by_id(99999)
        assert result is None
    
    @patch('accounts.services.send_email')
    def test_send_welcome_email_calls_email_service(self, mock_send_email, user_service):
        """Test that welcome email is sent when user is created."""
        user = UserFactory()
        user_service.send_welcome_email(user)
        mock_send_email.assert_called_once_with(
            subject='Welcome!',
            recipient=user.email,
            template='welcome.html'
        )
```

## Integration Testing

### API Testing with Django REST Framework

Test API endpoints with proper authentication and data validation:

```python
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from accounts.factories import UserFactory

@pytest.mark.django_db
class TestUserAPI:
    """Test cases for User API endpoints."""
    
    @pytest.fixture
    def api_client(self):
        """Create API client for testing."""
        return APIClient()
    
    @pytest.fixture
    def authenticated_user(self, api_client):
        """Create and authenticate a user."""
        user = UserFactory()
        api_client.force_authenticate(user=user)
        return user
    
    def test_get_user_list_requires_authentication(self, api_client):
        """Test that user list endpoint requires authentication."""
        url = reverse('user-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_user_list_returns_users(self, api_client, authenticated_user):
        """Test that authenticated user can retrieve user list."""
        UserFactory.create_batch(3)
        url = reverse('user-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 4  # 3 created + 1 authenticated
    
    def test_create_user_with_valid_data(self, api_client):
        """Test user creation with valid data."""
        url = reverse('user-list')
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['username'] == 'newuser'
        assert response.data['email'] == 'new@example.com'
        assert 'password' not in response.data
```

### Database Testing

Test database operations and migrations:

```python
import pytest
from django.db import transaction
from django.core.management import call_command
from accounts.models import User

@pytest.mark.django_db
class TestDatabaseOperations:
    """Test database operations and constraints."""
    
    def test_database_transaction_rollback(self):
        """Test that database transactions roll back on error."""
        with pytest.raises(IntegrityError):
            with transaction.atomic():
                User.objects.create_user(
                    username='user1',
                    email='test@example.com',
                    password='pass123'
                )
                # This should cause IntegrityError due to duplicate email
                User.objects.create_user(
                    username='user2',
                    email='test@example.com',
                    password='pass123'
                )
        
        # Verify no users were created due to rollback
        assert User.objects.count() == 0
    
    def test_migration_forward_and_backward(self):
        """Test that migrations can be applied and reversed."""
        # Apply migration
        call_command('migrate', 'accounts', '0001', verbosity=0)
        
        # Verify expected state
        # Add specific checks for your migration
        
        # Reverse migration
        call_command('migrate', 'accounts', 'zero', verbosity=0)
        
        # Verify reverted state
        # Add specific checks for reversed state
```

## Test Data Management

### Using Factory Boy

Create maintainable test data with factory_boy:

```python
# factories.py
import factory
from django.contrib.auth import get_user_model
from accounts.models import Profile

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    """Factory for creating User instances."""
    
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@example.com')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True

class ProfileFactory(factory.django.DjangoModelFactory):
    """Factory for creating Profile instances."""
    
    class Meta:
        model = Profile
    
    user = factory.SubFactory(UserFactory)
    bio = factory.Faker('text', max_nb_chars=200)
    birth_date = factory.Faker('date_of_birth', minimum_age=18, maximum_age=80)
```

### Pytest Fixtures

Create reusable test fixtures:

```python
# conftest.py
import pytest
from django.contrib.auth import get_user_model
from accounts.factories import UserFactory, ProfileFactory

User = get_user_model()

@pytest.fixture
def user():
    """Create a test user."""
    return UserFactory()

@pytest.fixture
def admin_user():
    """Create an admin user."""
    return UserFactory(is_staff=True, is_superuser=True)

@pytest.fixture
def user_with_profile():
    """Create a user with profile."""
    return ProfileFactory().user

@pytest.fixture
def api_client():
    """Create API client for testing."""
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def authenticated_client(api_client, user):
    """Create authenticated API client."""
    api_client.force_authenticate(user=user)
    return api_client
```

## Testing Best Practices

### Test Isolation and Independence

Ensure tests are isolated and can run independently:

- Use `@pytest.mark.django_db` for database tests
- Reset database state between tests
- Avoid shared state between tests
- Use factories instead of fixtures for test data

### Mocking External Dependencies

Mock external services and APIs:

```python
import pytest
from unittest.mock import patch, Mock
from services.payment import PaymentService

class TestPaymentService:
    """Test payment service with mocked external API."""
    
    @patch('services.payment.stripe.Charge.create')
    def test_process_payment_success(self, mock_stripe_charge):
        """Test successful payment processing."""
        mock_stripe_charge.return_value = Mock(
            id='ch_123',
            status='succeeded',
            amount=1000
        )
        
        payment_service = PaymentService()
        result = payment_service.process_payment(
            amount=1000,
            token='tok_123'
        )
        
        assert result['status'] == 'succeeded'
        assert result['charge_id'] == 'ch_123'
        mock_stripe_charge.assert_called_once_with(
            amount=1000,
            currency='usd',
            source='tok_123'
        )
```

## Performance Testing

### Load Testing with pytest-benchmark

Test performance-critical code:

```python
import pytest
from accounts.services import UserService

class TestUserServicePerformance:
    """Performance tests for UserService."""
    
    @pytest.mark.benchmark
    def test_get_users_performance(self, benchmark):
        """Test performance of get_users method."""
        # Create test data
        UserFactory.create_batch(1000)
        
        service = UserService()
        result = benchmark(service.get_active_users)
        
        assert len(result) == 1000
        # Add performance assertions if needed
```

## Temporary File cleanup and Testing

### Test Artifact cleanup

Clean up test-generated files and data:

```python
import tempfile
import shutil
import pytest
from pathlib import Path

@pytest.fixture
def temp_media_dir():
    """Create temporary media directory for tests."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    # cleanup after test
    shutil.rmtree(temp_dir)

def test_file_upload_with_cleanup(temp_media_dir):
    """Test file upload and ensure cleanup."""
    # Test file operations
    test_file = temp_media_dir / 'test.txt'
    test_file.write_text('test content')
    
    # Test your file handling logic here
    
    # File will be automatically cleaned up by fixture
```

### Database cleanup

Ensure test database is clean:

```python
import pytest

@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """Enable database access for all tests."""
    pass

@pytest.fixture
def clean_database():
    """Ensure clean database state."""
    # Clear all data before test
    from django.core.management import call_command
    call_command('flush', '--noinput')
    yield
    # Optional: cleanup after test if needed
```

## Testing Commands

### Running Tests

Essential commands for running Python tests:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_models.py

# Run specific test class
pytest tests/unit/test_models.py::TestUserModel

# Run specific test method
pytest tests/unit/test_models.py::TestUserModel::test_user_creation

# Run tests matching pattern
pytest -k "test_user"

# Run tests with specific marker
pytest -m "slow"

# Run tests in parallel
pytest -n 4

# Run with detailed output
pytest -v --tb=long

# Run only failed tests from last run
pytest --lf

# Generate coverage report
pytest --cov=src --cov-report=html --cov-report=term-missing
```

### Django-Specific Testing Commands

```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test accounts

# Run with coverage
coverage run --source='.' manage.py test
coverage html

# Run tests with specific settings
python manage.py test --settings=myproject.settings.test

# Create test database
python manage.py migrate --run-syncdb --settings=myproject.settings.test
```

## Continuous Integration Configuration

### GitHub Actions for Python Testing

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
        django-version: [3.2, 4.1, 4.2]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v3
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install Django==${{ matrix.django-version }}
        pip install -r requirements.txt
        pip install -r requirements-test.txt
    
    - name: Run tests
      run: |
        pytest --cov=src --cov-report=xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
```

## cleanup and Maintenance

### Test Environment cleanup

Regular cleanup of test artifacts:

```bash
# Clean pytest cache
rm -rf .pytest_cache/

# Clean coverage files
rm -f .coverage
rm -rf htmlcov/

# Clean Python bytecode
find . -type f -name "*.pyc" -delete
find . -type d -name "__pycache__" -delete

# Clean test databases
rm -f test_*.db

# Clean temporary test files
find /tmp -name "test_*" -type f -mtime +1 -delete
```

### Database cleanup Scripts

Create management commands for test data cleanup:

```python
# management/commands/cleanup_test_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    """Clean up test data from database."""
    
    help = 'Remove test data from database'
    
    def handle(self, *args, **options):
        # Remove test users
        test_users = User.objects.filter(email__contains='test')
        count = test_users.count()
        test_users.delete()
        
        self.stdout.write(
            self.style.SUCCESS(f'Removed {count} test users')
        )
```
