---
name: metacoding-debug
description: Diagnose a bug, failure, flaky behavior, or performance regression whose cause is unknown, starting from a command that reproduces it. Use when the user reports something broken, failing, or slow, or when the metacoding workflow is given a bug to fix.
---

# Debug

Find the cause before changing code. Each phase has an exit condition; move on only when it is met.

## 1. Reproduce with one command

Build a single command that fails because of this bug and will pass once it is fixed. Try these in order:

1. A failing automated test at whatever level reaches the bug
2. A script that calls the code, CLI, or HTTP endpoint with a fixed input and checks the output
3. A replay of a captured request, payload, or log through the affected code path
4. A loop that runs the trigger many times, for failures that happen only sometimes
5. A comparison of two versions, configs, or datasets on the same input, for regressions

Make the command fast and repeatable: narrow it to the affected path, pin time and randomness, isolate files and network.

Captures from a real system often hold secrets: credentials (tokens, passwords, keys, cookies) and personal data (names, emails, addresses, account numbers).

- Keep the raw capture outside the repo, and replay it from there.
- Mask the secrets in everything you show the user, write into the repo, or commit: the command's input, a fixture, a log excerpt, the regression test. Replace each secret with a made-up value of the same shape, then rerun the command to check that the masked version still fails.

Exit when you have run the command and it shows the symptom the user described, every time or at a steady high rate. When you cannot build one, say what you tried and ask the user for access, a captured artifact, or permission to add temporary logging. Leave theories until the command exists.

## 2. Minimize

Remove inputs, steps, config, and data one at a time, rerunning the command after each cut. Exit when removing any remaining element makes the failure go away.

## 3. Hypothesize

Write three to five possible causes, ranked. Give each a prediction that can prove it wrong: "If X is the cause, changing Y makes the failure stop." Show the list to the user, who may know something that reorders it, then carry on with your ranking.

## 4. Test one hypothesis at a time

Check predictions in rank order, changing one thing per run. Prefer a debugger or a few targeted log lines at the point where two hypotheses differ. Mark every temporary log line with one unique tag, such as `[DEBUG-7f3a]`, so a single search finds them all later. Never print a credential or personal data in a log line: removing the line later does not remove what it already wrote. For slow code, measure before and after instead of logging.

Exit when one hypothesis predicted every observation and the others are ruled out.

## 5. Fix with a regression test

1. Turn the minimized reproduction into a test at the level where the bug really occurs.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass, then rerun the original command from phase 1.

When no test can reach the bug at the right level, say so. That gap is a finding for the user.

## 6. Clean up

- The phase 1 command no longer shows the symptom.
- The regression test passes, or the missing test level is reported.
- A search for the debug tag returns nothing.
- Throwaway scripts are deleted.
- Raw captures you made are deleted. A file the user supplied stays theirs.
- The cause is stated in the commit message or handoff.
