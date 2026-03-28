# Node Guidance

- Treat APIs, background jobs, and service boundaries as explicit contracts.
- Validate inputs, return stable error shapes, and log with operational context.
- Avoid mixing unrelated infrastructure cleanup into feature work.
- Verify the smallest meaningful slice first: unit, integration, then full workflow.
- Document config, env, or deployment implications when they change.
