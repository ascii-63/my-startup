# Agent notes

This checkout is a fork of khanh020905/my-office, used as a Cursor office. Read [docs/FORK.md](docs/FORK.md) before changing it. That file is the handoff: what the owner wants customized, what is already on `feat/cursor-sessions`, and the next work.

Operating constraints (also in `.cursor/rules/fork-intent.mdc`):

- Keep Claude Code hooks. Cursor is a second source of sessions, via `hooks/cursor.mjs`, fail-open.
- The Claude plan pill and the activity-board API price tile are being removed. Leave other cost UI until the owner asks.
- On this PC, `node` is often absent from PowerShell. The Cursor hooks currently call an fnm multishell `node.exe` that will not survive that shell. Reinstall them with a durable Node when you next touch install.
- Do not commit or push unless the owner asks. Leave `package-lock.json` out of a feature commit.
