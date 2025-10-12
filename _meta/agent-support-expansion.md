# Agent Support Expansion for `metacoding`

This document defines the **updated prompt** for a coding agent, to expand `metacoding` to support **Claude Code**, **Codex / OpenAI-compatible**, and **Gemini Code Assist**, using adapter strategies tailored to each assistant.

---

## 🧩 Prompt for Coding Agent

> **Prompt:**  
> Expand the `metacoding` repository to support **Claude Code**, **Codex / OpenAI-compatible**, and **Gemini Code Assist**. Use an **adapter architecture**.
>
> For **each assistant adapter**, do the following:
>
> 1. Identify which **instruction / configuration mechanism** the assistant supports (e.g. project instructions, slash commands, config files, prompt injection).
> 2. Scaffold a folder + file structure (e.g. `.claude/instructions.md`, `.claude/commands/`, `.gemini/config.yaml`, `prompts/codex_bootstrap.md`) appropriate for that assistant.
> 3. Derive instruction content (7-step workflow, enforcement rules, prompt guidance) from a shared canonical source (e.g. `workflow/core.md`).
> 4. Enhance CLI with flags (`--claude`, `--codex`, `--gemini`) so `metacoding init` and `update` can generate or validate those adapter files.
> 5. In documentation, for each adapter, tell the user **how to activate** the instructions in the assistant (for example: “in Claude, set project instructions to the contents of `.claude/instructions.md`”, or “configure your OpenAI wrapper to read `prompts/codex_bootstrap.md` as the system message”, or “Gemini picks up `.gemini/styleguide.md` automatically”).
> 6. Provide fallback prompt templates or copy-paste snippets if a user’s assistant plan lacks native support.
> 7. Document limitations and caveats per adapter.
>
> Make sure existing Copilot / Cursor behavior remains untouched. Use clean, well-structured commits and include validation tests.
>
> After scaffolding, in each assistant environment ask:
>
> > “What is the development workflow for this project?”
>
> The assistant should respond referencing the 7-step workflow and follow the style/terminology of that assistant.
>
> Tailor phrasing in instructions/prompts to each assistant’s vocabulary (e.g. “project instructions” for Claude, “system message / prompt template” for Codex, “style guide / config” for Gemini).

Claude: CLAUDE.md file (https://www.anthropic.com/engineering/claude-code-best-practices);
Codex – AGENTS.md (https://openai.com/index/introducing-codex/);
Gemini – GEMINI.md (https://developers.google.com/gemini-code-assist/docs/agent-mode)
