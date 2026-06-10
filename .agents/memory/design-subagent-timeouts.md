---
name: Design subagent timeout pattern
description: Why design-conversion subagents time out and how to scope them so they don't
---

When fanning out a large visual refactor across many files via async subagents, agents
**time out (StartToClose)** on files that are large or gradient-dense. Empirically the
single largest/densest file (e.g. a ~1500-line page with 40 inline gradients) fails
repeatedly even solo, while a partial pass still lands (a timed-out agent often
converts most matches before dying — re-grep before assuming nothing happened).

**Why:** the timeout tracks total edit volume + file size per agent, not file count.
A few small files batch fine; one huge file does not.

**How to apply:**
- Keep each agent's total gradient load roughly under ~20–22 matches.
- Solo the heaviest files; batch light files 3–5 at a time.
- Tell the agent: "SPEED CRITICAL — use `sed -i` / edit replace_all for repeated
  identical class strings, don't wait on the dev server, run tsc ONCE at the end,
  final report = ONE sentence." The one-sentence rule also protects the main agent's
  context across 20+ completions.
- Expect ~1 in 8 to time out or hit a transient gRPC INTERNAL error; just relaunch the
  failed batch (split smaller). Re-grep the file first — it may already be done.
