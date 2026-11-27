---
name: metacoding-design
description: Decide the shape of code by module depth, interfaces, and seams, so that a lot of behavior sits behind a small interface and a seam exists only where something varies. Use when the user asks to design a module or an interface, to decide where a seam goes, or to make code easier to test or to change, or when the metacoding workflow has an interface to design.
---

# Design

Use this skill to decide the shape of code before it is written. The shape is three things: how much a module hides, what its callers must know, and where one part can be swapped for another.

## Terms

Use these four words with these meanings, in your own reasoning and in what you tell the user.

- **Module**: anything with an interface and code behind it, such as a function, a class, a package, or a service. Avoid: component, unit.
- **Interface**: everything a caller must know to use a module: names and types, the order of calls, errors, config. Avoid: API, signature.
- **Depth**: how much behavior sits behind the interface, compared with how much a caller must know. A module is deep or shallow. Avoid: size.
- **Seam**: a place where what sits behind an interface can be swapped without editing its callers. A test puts a stand-in there. Avoid: boundary, layer.

## Rules

### 1. Prefer a deep module

A deep module puts a lot of behavior behind a small interface. A shallow module's caller must know nearly as much as it would take to write the code behind it; a module that only passes calls on is the plainest case. Depth is judged at the interface: a deep module can be built from small parts inside, as long as callers do not see them.

Good: one call. The caller knows nothing about discounts, tax, or rounding.

```text
total = price_of(cart)
```

Bad: the caller must know every step and the order they go in. The module hides nothing.

```text
subtotal = pricing.subtotal(cart)
discount = pricing.discount_for(cart, subtotal)
tax = pricing.tax_on(subtotal - discount)
total = pricing.round(subtotal - discount + tax)
```

### 2. Keep the whole interface small

Judge an interface by everything in it, not only by its names and types. A required order of calls, an error the caller must handle, a config value that must be set first: a caller must know each of these. Count all of it when you judge how small the interface is, and move what you can behind it.

### 3. Apply the deletion test

When you doubt that a module earns its place, imagine it gone. If its complexity reappears in every caller, it earns its place. If nothing gets harder, it does not: merge it into its caller or into the module it passes calls to.

### 4. Put a seam only where something varies

A seam has a cost: one more interface to learn and to keep stable. Put a seam where something really varies or sits outside your control: network, clock, randomness, third-party services. Add none for a single implementation that nothing replaces. A seam is real when two things do sit behind it, such as the real service and the stand-in a test uses. With one, it is a guess about the future.

Good: the payment provider is outside your control, so it sits behind a seam, and a test puts a stand-in there.

```text
receipt = checkout(cart, payments)    # payments: the real provider, or a stand-in in a test
```

Bad: a seam with one implementation that nothing replaces. A reader follows one more hop and gains nothing.

```text
abstract type ReportFormatter
class DefaultReportFormatter is a ReportFormatter    # the only one, and no test replaces it
```

### 5. Test through the interface

Callers and tests meet a module at its interface. A test that goes through the interface keeps passing when the code behind it is rewritten. When you want to test past the interface, at a private step or an inner helper, the module has the wrong shape: either that step deserves an interface of its own, or the interface does not return enough for a test to check the behavior.

### 6. Pass dependencies in, and return results

When a dependency sits behind a seam, the module that uses it must be handed it. A module that creates the dependency itself cannot be given anything else, so a test cannot put a stand-in there. Take the dependency as an argument. Return the result to the caller instead of changing something out of sight, so that the caller and the test can both see what happened.

Good: the clock comes in, and the date comes back.

```text
expires_on = expiry_date(order, clock)
```

Bad: the clock is created inside, and the result is written where the caller cannot see it.

```text
function set_expiry(order):
    now = SystemClock().now()
    database.orders.update(order.id, expires_on = now + 7 days)
```

### 7. Design a lasting interface more than once

For an interface that will be hard to change, such as one that other projects call, a data format, or a module with many callers, sketch two or three different interfaces before choosing. Make them differ in kind: the smallest one that works, the one that makes the common case a single call, the one that leaves the most room for later. When the host agent supports subagents, you may give each one to its own subagent. Put the choice to the user with your recommendation and what each one costs.
