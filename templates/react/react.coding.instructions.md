---
description: 'React/Frontend-specific coding standards and best practices'
applyTo: '**/*.{tsx,jsx,ts,js}'
---

# React/Frontend Coding Standards and Best Practices

## Language and Framework Preferences

- **Primary Language:** TypeScript with React 18+ for all React projects
- **Build Tool:** Vite for development and build tooling
- **Code Style:** Prettier with ESLint for consistent formatting and linting
- **State Management:** Context API for simple state, Zustand/Redux Toolkit for complex state
- **Target Compatibility:** Modern browsers (ES2020+), Node.js 18+

## Code Quality Guidelines

- **Component Design:** Small, focused components with single responsibilities
- **Functions:** Prefer functional components with hooks over class components
- **Performance:** Use React.memo, useMemo, and useCallback judiciously
- **Error Handling:** Implement error boundaries and proper error handling
- **Accessibility:** Follow WCAG guidelines and use semantic HTML
- **Type Safety:** Strict TypeScript configuration with comprehensive type coverage

## Naming Conventions

- **Files:** PascalCase for components (e.g., `UserProfile.tsx`), camelCase for utilities (e.g., `apiHelpers.ts`)
- **Components:** PascalCase (e.g., `UserCard`, `NavigationMenu`)
- **Functions/Hooks:** camelCase (e.g., `useUserData`, `handleSubmit`)
- **Variables:** camelCase (e.g., `userData`, `isLoading`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS`, `DEFAULT_TIMEOUT`)
- **Interfaces/Types:** PascalCase with descriptive names (e.g., `UserData`, `ApiResponse`)
- **CSS Classes:** kebab-case (e.g., `user-card`, `navigation-menu`)

## Code Organization

- **Feature-Based Structure:** Organize by features rather than file types
- **Component Co-location:** Keep related files (component, styles, tests) together
- **Barrel Exports:** Use index.ts files for clean imports
- **Separation of Concerns:** Separate business logic from presentation logic

### Recommended Project Structure

```
src/
  components/          # Reusable UI components
    ui/               # Basic UI primitives (Button, Input, Modal)
    layout/           # Layout components (Header, Sidebar, Footer)
  features/           # Feature-specific components and logic
    auth/            # Authentication feature
    dashboard/       # Dashboard feature
  hooks/             # Custom React hooks
  services/          # API calls and external services
  utils/             # Utility functions
  types/             # TypeScript type definitions
  stores/            # State management (Context, Zustand, etc.)
  assets/            # Static assets (images, icons, fonts)
```

## React-Specific Best Practices

### Component Design Patterns

```tsx
// Good: Functional component with TypeScript
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  className,
}) => {
  const handleEditClick = useCallback(() => {
    onEdit?.(user);
  }, [user, onEdit]);

  return (
    <div className={`user-card ${className || ''}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && <button onClick={handleEditClick}>Edit</button>}
    </div>
  );
};
```

### Custom Hooks

```tsx
// Good: Custom hook for data fetching
interface UseUserDataResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserData = (userId: string): UseUserDataResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUser(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
};
```

### State Management Patterns

```tsx
// Good: Context for global state
interface AppContextType {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const value = useMemo(
    () => ({
      user,
      theme,
      setUser,
      setTheme,
    }),
    [user, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

## Performance Optimization

### Component Optimization

```tsx
// Good: Memoized component to prevent unnecessary re-renders
interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

export const UserList = React.memo<UserListProps>(({ users, onUserSelect }) => {
  return (
    <div className="user-list">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onEdit={onUserSelect} />
      ))}
    </div>
  );
});

UserList.displayName = 'UserList';
```

### Optimized Callbacks and Values

```tsx
// Good: Memoized callbacks and computed values
export const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  // Memoize expensive computations
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  // Memoize callbacks to prevent child re-renders
  const handleUserSelect = useCallback((user: User) => {
    console.log('Selected user:', user);
  }, []);

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    []
  );

  return (
    <div>
      <input
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filter users..."
      />
      <UserList users={filteredUsers} onUserSelect={handleUserSelect} />
    </div>
  );
};
```

## Error Handling and Validation

### Error Boundaries

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Form Validation

```tsx
// Good: Form with validation using react-hook-form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

type UserFormData = z.infer<typeof userSchema>;

export const UserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await userService.createUser(data);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name')} placeholder="Name" />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('age', { valueAsNumber: true })}
          type="number"
          placeholder="Age"
        />
        {errors.age && <p className="error">{errors.age.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
```

## Testing Standards

### Component Testing

```tsx
// Good: Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

describe('UserCard', () => {
  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });

  it('does not render edit button when onEdit is not provided', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
```

### Hook Testing

```tsx
// Good: Custom hook testing
import { renderHook, waitFor } from '@testing-library/react';
import { useUserData } from './useUserData';

// Mock the service
jest.mock('../services/userService');

describe('useUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches user data successfully', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    (userService.getUser as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUserData('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBe(null);
  });

  it('handles error states correctly', async () => {
    const errorMessage = 'User not found';
    (userService.getUser as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useUserData('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(errorMessage);
  });
});
```

## Accessibility Standards

### Semantic HTML and ARIA

```tsx
// Good: Accessible form component
export const AccessibleForm: React.FC = () => {
  const [fieldError, setFieldError] = useState<string>('');

  return (
    <form role="form" aria-label="User registration form">
      <fieldset>
        <legend>Personal Information</legend>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            aria-required="true"
            aria-describedby={fieldError ? 'username-error' : undefined}
            aria-invalid={fieldError ? 'true' : 'false'}
          />
          {fieldError && (
            <div
              id="username-error"
              role="alert"
              aria-live="polite"
              className="error-message"
            >
              {fieldError}
            </div>
          )}
        </div>
      </fieldset>

      <button type="submit" aria-describedby="submit-help">
        Register
      </button>
      <div id="submit-help" className="help-text">
        Click to create your account
      </div>
    </form>
  );
};
```

### Keyboard Navigation

```tsx
// Good: Keyboard accessible dropdown
export const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex >= 0) {
          onSelect(options[activeIndex]);
        }
        setIsOpen(!isOpen);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div className="dropdown" onKeyDown={handleKeyDown}>
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        Select option
      </button>
      {isOpen && (
        <ul role="listbox" className="dropdown-menu">
          {options.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'active' : ''}
              onClick={() => onSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## Styling and CSS Standards

### CSS-in-JS with Styled Components

```tsx
import styled from 'styled-components';

// Good: Styled component with theme support
const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          
          &:hover {
            background-color: ${theme.colors.primaryDark};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text};
          
          &:hover {
            background-color: ${theme.colors.secondaryDark};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
```

### CSS Modules

```tsx
// UserCard.module.css
.userCard {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.userCard:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.userInfo {
  margin-bottom: 12px;
}

.userName {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 4px;
}

// UserCard.tsx
import styles from './UserCard.module.css';

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className={styles.userCard}>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};
```

## Common Anti-Patterns to Avoid

- **Inline Styles for Complex Styling:** Use CSS-in-JS or CSS modules instead
- **Prop Drilling:** Use Context or state management for deeply nested props
- **Mutating Props:** Always treat props as read-only
- **Missing Keys in Lists:** Always provide unique keys for list items
- **Not Cleaning Up Effects:** Remove event listeners and cancel async operations
- **Using Index as Key:** Use stable, unique identifiers for keys
- **Overusing useEffect:** Consider if the effect is really necessary
- **Not Memoizing Expensive Calculations:** Use useMemo for expensive computations
- **Creating Objects/Functions in Render:** This causes unnecessary re-renders
- **Ignoring Accessibility:** Always consider screen readers and keyboard navigation

## Security Considerations

### XSS Prevention

```tsx
// Good: Safe rendering of user content
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  content: string;
}

export const SafeHtml: React.FC<SafeHtmlProps> = ({ content }) => {
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

// Good: Escape user input in URL parameters
const SearchResults: React.FC = () => {
  const query = useSearchParams().get('q') || '';
  const encodedQuery = encodeURIComponent(query);

  return (
    <div>
      <h2>Results for: {query}</h2>
      <a href={`/search/advanced?query=${encodedQuery}`}>Advanced search</a>
    </div>
  );
};
```

### Environment Variables

```tsx
// Good: Environment configuration
interface Config {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  environment:
    (import.meta.env.VITE_ENVIRONMENT as Config['environment']) ||
    'development',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

// Validate required environment variables
if (!config.apiUrl) {
  throw new Error('VITE_API_URL environment variable is required');
}

export default config;
```
