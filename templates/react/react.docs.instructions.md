---
description: 'React-specific documentation standards and guidelines'
language: 'react'
category: 'documentation'
---

# React Documentation Standards

## Component Documentation Guidelines

### JSDoc for React Components

````typescript
/**
 * A reusable button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="large" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @param props - The component props
 * @param props.variant - The visual style variant
 * @param props.size - The size of the button
 * @param props.disabled - Whether the button is disabled
 * @param props.children - The button content
 * @param props.onClick - Click event handler
 */
export function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  // Component implementation
}
````

### PropTypes and TypeScript Interfaces

```typescript
/**
 * Props for the Button component.
 */
export interface ButtonProps {
  /** The visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'danger';
  /** The size of the button */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** The content to display inside the button */
  children: React.ReactNode;
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

## Component API Documentation

### Required Documentation Elements

1. **Purpose and Use Cases:** Clear description of what the component does
2. **Props Interface:** Complete TypeScript interface with descriptions
3. **Usage Examples:** Common usage patterns with code examples
4. **Accessibility Notes:** ARIA requirements and keyboard interactions
5. **Styling Information:** CSS classes, design tokens, theming support
6. **Dependencies:** Required peer dependencies or context providers

### Component README Template

````markdown
# ComponentName

Brief description of the component's purpose and primary use case.

## Usage

```tsx
import { ComponentName } from './ComponentName';

function Example() {
  return (
    <ComponentName prop1="value" prop2={variable} onAction={handleAction}>
      Content
    </ComponentName>
  );
}
```
````

## Props

| Prop  | Type    | Default   | Description          |
| ----- | ------- | --------- | -------------------- |
| prop1 | string  | 'default' | Description of prop1 |
| prop2 | boolean | false     | Description of prop2 |

## Examples

### Basic Usage

[Code example]

### Advanced Usage

[Code example with complex props]

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- ARIA attributes used

## Styling

- CSS classes available
- Design tokens used
- Theming support

## Related Components

- List of related components
- When to use alternatives

````

## Hook Documentation

### Custom Hook Documentation

```typescript
/**
 * A hook for managing form state with validation.
 *
 * @example
 * ```tsx
 * function ContactForm() {
 *   const { values, errors, handleChange, handleSubmit } = useForm({
 *     initialValues: { email: '', message: '' },
 *     validation: {
 *       email: (value) => value.includes('@') ? null : 'Invalid email'
 *     }
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         value={values.email}
 *         onChange={handleChange('email')}
 *         aria-invalid={!!errors.email}
 *       />
 *       {errors.email && <span>{errors.email}</span>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @param config - Hook configuration options
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(
  config: FormConfig<T>
): FormReturn<T> {
  // Hook implementation
}
````

## Storybook Documentation

### Story Documentation Standards

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants and sizes.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default button style used for primary actions.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

/**
 * Secondary buttons for less prominent actions.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};
```

## Architecture Documentation

### Component Architecture Docs

Document component relationships and data flow:

```markdown
# Component Architecture

## Component Hierarchy
```

App
├── Header
│ ├── Navigation
│ └── UserMenu
├── Main
│ ├── Sidebar
│ └── ContentArea
│ ├── FeatureComponent
│ └── DataDisplay
└── Footer

```

## Data Flow

1. **State Management:** Describe state management approach (Context, Redux, Zustand)
2. **Props Flow:** How data flows down through component tree
3. **Event Handling:** How events bubble up and are handled
4. **Side Effects:** API calls, external integrations

## Performance Considerations

- Component memoization strategies
- Bundle splitting points
- Lazy loading implementation
- Re-render optimization
```

## Design System Documentation

### Component Design Specs

```markdown
# Design System - Button Component

## Design Tokens

### Colors

- Primary: `--color-primary-500`
- Secondary: `--color-neutral-200`
- Danger: `--color-error-500`

### Typography

- Font: `--font-family-base`
- Size: `--font-size-md`
- Weight: `--font-weight-medium`

### Spacing

- Padding: `--space-3` `--space-4`
- Margin: `--space-2`

## Variants

### Primary Button

- Background: Primary color
- Text: White
- Border: None
- Shadow: `--shadow-sm`

### Secondary Button

- Background: Transparent
- Text: Primary color
- Border: 1px solid primary
- Shadow: None

## States

- **Default:** Base styling
- **Hover:** Darker background, `--shadow-md`
- **Active:** Pressed state with inset shadow
- **Disabled:** 50% opacity, no interactions
- **Focus:** Visible focus ring for accessibility
```

## API Integration Documentation

### Component API Integration

````typescript
/**
 * A component that fetches and displays user data.
 *
 * @example
 * ```tsx
 * <UserProfile userId="123" />
 * ```
 *
 * ## API Dependencies
 *
 * - **GET /api/users/:id** - Fetches user profile data
 * - **PUT /api/users/:id** - Updates user profile
 *
 * ## Error Handling
 *
 * - Network errors: Shows retry button
 * - 404 errors: Shows "User not found" message
 * - 403 errors: Shows permission denied message
 *
 * ## Loading States
 *
 * - Initial load: Skeleton placeholder
 * - Update: Spinner overlay
 * - Background refresh: Subtle loading indicator
 */
export function UserProfile({ userId }: UserProfileProps) {
  // Component implementation
}
````

## Testing Documentation Integration

### Component Test Documentation

```typescript
/**
 * Tests for the Button component.
 *
 * @testcases
 * - Renders with correct text content
 * - Applies variant classes correctly
 * - Handles click events properly
 * - Shows disabled state appropriately
 * - Meets accessibility requirements
 * - Supports keyboard navigation
 */
describe('Button Component', () => {
  // Test implementations
});
```

## Migration and Deprecation Docs

### Breaking Changes Documentation

````markdown
# Migration Guide: Button v2.0

## Breaking Changes

### Removed Props

- `type` prop removed - use `variant` instead
- `large` prop removed - use `size="large"` instead

### API Changes

- `onClick` now receives event object as first parameter
- `disabled` prop now affects aria-disabled attribute

## Migration Steps

1. Replace `type="primary"` with `variant="primary"`
2. Replace `large={true}` with `size="large"`
3. Update click handlers to accept event parameter

### Before

```tsx
<Button type="primary" large onClick={handleClick}>
  Click me
</Button>
```
````

### After

```tsx
<Button variant="primary" size="large" onClick={(e) => handleClick(e)}>
  Click me
</Button>
```

```

## Documentation Maintenance

- **Component Updates:** Update docs when component API changes
- **Example Accuracy:** Ensure all code examples are tested and working
- **Version Alignment:** Keep documentation in sync with component versions
- **Accessibility Updates:** Update accessibility docs when ARIA patterns change
- **Performance Notes:** Document performance implications of component usage

## Repeated React Documentation Tasks and Checklist Templates

For any recurring React documentation process (such as component library releases, API documentation updates, or component migration guides), always use a dedicated checklist template to ensure all necessary documentation steps are followed and nothing is missed.

- **React Documentation Checklist Template Principle:**
  - Maintain a template checklist file for each repeated React documentation process (e.g., `component-release-docs-checklist.md`, `react-migration-docs-checklist.md`).
  - For each new instance (e.g., each component release or migration), copy the template checklist and tag it with the relevant version or context, preserving the original template for future use.
  - Systematically work through the checklist for every instance of the repeated documentation task, marking each step as completed.
  - Proactively identify any React documentation process that would benefit from a checklist and prompt the user to use or create one if it does not exist.
  - If, during execution, you or the user identify missing or unclear documentation steps, update the template checklist to improve future reliability.

**Examples of repeated React documentation tasks requiring checklists:**
- Component library releases (PropTypes updates, example verification, Storybook updates)
- React version migrations (hook migration guides, breaking changes documentation, compatibility notes)
- Performance optimization documentation (profiling results, optimization guides, benchmark updates)
- Accessibility documentation updates (ARIA pattern updates, keyboard navigation guides, screen reader testing)
- Testing documentation (test pattern updates, snapshot reviews, accessibility test updates)
- Any other React documentation process with multiple required steps or risk of omission

**Agent Guidance for React Documentation Tasks:**
- Always check for the existence of a React documentation checklist template before starting a repeated documentation task.
- If a template does not exist, prompt the user to create one and assist in drafting it.
- When using a documentation checklist, copy it for the specific instance (e.g., `component-release-v2.1.0.md`), and work through each step systematically.
- If new documentation steps are discovered or improvements are needed, update the template and inform the user.
```
