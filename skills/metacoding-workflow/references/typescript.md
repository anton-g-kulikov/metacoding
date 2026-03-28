# TypeScript Guidance

- Prefer explicit types at public boundaries and inferred types within local implementation detail.
- Keep modules small, composable, and side-effect aware.
- Validate runtime input explicitly; types alone do not protect process boundaries.
- Update or add tests for behavior changes before broad refactors.
- Document only non-obvious contracts and invariants.
