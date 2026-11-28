---
name: metacoding-tdd
description: Build a feature or fix a bug test-first, one behavior at a time, with a failing test before each piece of production code. Use when the user asks for TDD, red-green, or tests first, or when the metacoding workflow reaches its build step.
---

# Test-Driven Development

Build the change as a series of small loops. Each loop proves one behavior with a test that fails first.

## Before the first loop

1. List the behaviors the change must prove, including error and edge cases. Take the list from what was agreed for the change:
   - **Scenarios.** A scenario is one agreed case of a behavior, written as Given/When/Then, with an ID such as `UPDATE-4`. Start from the scenarios of the ticket you are building, or of the confirmed scope summary when the task is one ticket: each scenario is a behavior on the list.
   - **Test intent.** A task without stories has test intent where the scenarios are: a plain list of the behaviors to prove. Start from that.
   - **Nothing agreed.** Write the list yourself.

   Record the list where the repo keeps such notes, or in your plan when it keeps none.
2. Find how this repo tests similar code: the framework, the file layout, the helpers, and the command that runs one test file. Follow that.
3. Name the public interface each behavior will be tested through: a function, a CLI command, an HTTP route, a rendered component. When the scope summary or the task spec names the interface to test a behavior through, which they call its test seam, use that one. When none was agreed and the right interface is unclear or does not exist yet, settle it with the user before writing tests.

## The loop

Take one behavior from the list at a time.

1. **Red.** Write one test for that behavior through the public interface. Run it and watch it fail for the expected reason. A test that passes straight away, or fails on a typo or an import, is not red yet.
2. **Green.** Write the least production code that makes the test pass. Run the test, then the rest of the file.
3. **Next.** Pick the next behavior. Let what you just learned change the list: add cases you discovered, and drop cases of your own that turned out to be covered. A scenario stays on the list: it is part of the agreed scope.

Leave restructuring until the behaviors on the list are green. Then refactor in small steps, running the tests after each one.

## What a good test looks like

- It checks behavior a caller can observe, through the same interface a caller uses. It keeps passing when the internals are rewritten and the behavior stays the same.
- Its name states the behavior: "rejects an expired token", "returns an empty list when nothing matches".
- Its expected value comes from somewhere other than the code under test: a literal, a worked example, a written requirement such as a scenario. A test that recomputes the answer the way the code does always passes.
- It replaces only what sits outside your control: network, clock, randomness, third-party services. The modules of this codebase run for real.

## Test doubles

A test double stands in for something the test cannot use for real. The last point above is the rule: replace only what sits outside your control. This is how to apply it.

- Prefer a real or in-memory stand-in to a mock that checks which calls were made: a temporary directory, an in-memory database, a clock you can set. Check calls only when the call itself is the behavior, such as "sends one email".
- Never replace the code under test or another module of this codebase. A test that does so passes while the real pieces no longer fit together.

Good: the double is a clock, which is outside your control, and the test checks the result.

```text
clock = FixedClock("2026-01-01")
order = place_order(cart, clock)
assert order.expires_on == "2026-01-08"
```

Bad: the double replaces a module of this codebase, and the test checks a call.

```text
pricing = mock(pricing_module)
place_order(cart, pricing)
assert pricing.calculate was called once
```

## Tests for scenarios

This section applies when the change has scenarios: agreed cases with an ID each, from the scope summary, a ticket, or a feature spec. Use the IDs you were given, and never make one up.

The test that proves a scenario carries the ID, so that a search for the ID finds the proof.

- Put the ID in the name of the test, as in "UPDATE-4: keeps the saved settings". Where a name cannot hold it, put it in a comment or a tag on the test.
- When a scenario needs more than one test, each of them carries the ID.
- A test for a lower-level case that no scenario names carries no ID.
- When the ticket changes a scenario, change the tests that carry its ID. When it removes a scenario, delete them.

## When a behavior cannot be tested first

Some changes have no practical automated test: pure configuration, generated files, visual polish. Say which behavior is affected and why, get the user to accept the exception, record it, and verify that behavior by hand.

## Done

- Every scenario the change adds or changes has a test that carries its ID, and every other behavior on the list has a test. Each of these tests was seen failing and now passes. The one behavior without a test is a behavior with a recorded exception.
- No test carries the ID of a scenario the change removed.
- The full test suite passes.
- Temporary test files and debug output are removed.
