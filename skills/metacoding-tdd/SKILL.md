---
name: metacoding-tdd
description: Build a feature or fix a bug test-first, one behavior at a time, with a failing test before each piece of production code. Use when the user asks for TDD, red-green, or tests first, or when the metacoding workflow reaches its build step.
---

# Test-Driven Development

Build the change as a series of small loops. Each loop proves one behavior with a test that fails first.

## Before the first loop

1. Write down the test intent: the behaviors the change must prove, including error and edge cases. Start from the test intent of the ticket you are building, when the task has more than one ticket; otherwise from the test intent of the confirmed scope summary, when one exists. Record the list where the repo keeps such notes, or in your plan when it keeps none.
2. Find how this repo tests similar code: the framework, the file layout, the helpers, and the command that runs one test file. Follow that.
3. Name the public interface each behavior will be tested through: a function, a CLI command, an HTTP route, a rendered component. When the right interface is unclear or does not exist yet, settle it with the user before writing tests.

## The loop

Take one behavior from the list at a time.

1. **Red.** Write one test for that behavior through the public interface. Run it and watch it fail for the expected reason. A test that passes straight away, or fails on a typo or an import, is not red yet.
2. **Green.** Write the least production code that makes the test pass. Run the test, then the rest of the file.
3. **Next.** Pick the next behavior. Let what you just learned change the list: add cases you discovered, drop ones that turned out to be covered.

Leave restructuring until the behaviors on the list are green. Then refactor in small steps, running the tests after each one.

## What a good test looks like

- It checks behavior a caller can observe, through the same interface a caller uses. It keeps passing when the internals are rewritten and the behavior stays the same.
- Its name states the behavior: "rejects an expired token", "returns an empty list when nothing matches".
- Its expected value comes from somewhere other than the code under test: a literal, a worked example, the spec. A test that recomputes the answer the way the code does always passes.
- It replaces only what sits outside your control: network, clock, randomness, third-party services. The modules of this codebase run for real.

## When a behavior cannot be tested first

Some changes have no practical automated test: pure configuration, generated files, visual polish. Say which behavior is affected and why, get the user to accept the exception, record it, and verify that behavior by hand.

## Done

- Every behavior in the test intent has a test that was seen failing and now passes, or a recorded exception.
- The full test suite passes.
- Temporary test files and debug output are removed.
