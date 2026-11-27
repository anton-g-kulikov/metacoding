# Architecture Decisions

## 2026-11-27: Shape creates specs and tickets even where the repo tracks work nowhere

**Decision.** When a shaped task has more than one ticket or a decision worth recording, `metacoding-shape` writes a spec to `/_meta/specs/` and lists the tickets in it, unless the repo already has a place for either.

**Alternatives.**

- Keep the confirmed scope summary in the conversation and create no task record in a repo that lacks one. This was the rule until this decision.
- Write a spec for every task, whatever its size.

**Why.** A scope that lives only in a conversation is gone when the session ends. A later session, or a review running in a fresh context, then has nothing to check the work against, which happened during the review of the companion-skills change. A spec for every one-line fix would be clutter, so the threshold is a count the agent cannot argue away: more than one ticket, or any recorded decision. A separate test document is still not created; test intent lives in the spec and the tests.

## 2026-11-27: Decision records are written at the end of shape

**Decision.** A decision marked `[record]` is written to this file when the user confirms the scope summary, before the build starts. The artifact step amends an entry the build proved wrong.

**Alternatives.**

- Write the records in the artifact step, once the work is done. This was the rule until this decision.

**Why.** The decision is made when the user confirms it, and the build should follow a decision that is already on record, together with the spec that refers to it. Writing afterwards avoids recording a decision that did not survive the build, but an amended entry tells a future reader more than a missing one.
