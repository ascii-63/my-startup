# Quick start (this branch)

This file is only for the checkout at `d:\PersonalProjects\my-startup`, branch `feat/cursor-sessions`. It is not the upstream install in [README.md](../README.md). Do not run `npm install -g claude-my-office`.

The office is a local page. Cursor Agent chats, on any model, are the people in it. The page does not call Cursor or Claude. A Node server on port **4310** receives hook events and streams them to the floor.

```
Cursor agent ── hooks/cursor.mjs ──POST /event──▶ server/index.mjs ──SSE /stream──▶ src/office
```

Claude Code is leaving this branch: its hooks, plan pill, plan card, API price tile, status line, and OpenTelemetry usage. Some of that UI is already gone in the working tree. The installer still writes Claude settings until that path is deleted. Do not install or start Claude Code for this office.

Product map: [FORK.md](FORK.md). Behavior of the floor itself stays in the README.

## What you need

- This git checkout.
- Node.js **20.9** or newer, on a path that survives the shell.

On this PC, `node` is often missing from PowerShell. An fnm multishell `node.exe` (a path containing `fnm_multishells`) dies when that shell closes, and the Cursor hooks then point at nothing. Use a `node.exe` that stays on disk. Do not install a machine-wide Node unless you decide to.

Put the fnm installation directory on `PATH` for that PowerShell window before `npm install` or `npm run dev`:

```powershell
$env:PATH = "$env:APPDATA\fnm\node-versions\v26.13.0\installation;" + $env:PATH
node -v
npm -v
```

Use your actual version folder under `%APPDATA%\fnm\node-versions\` if it is not `v26.13.0`. The dev script is `npm run dev`, not `npm start dev`.

A source run keeps settings, the phone PIN, and the history vault in `data\` inside this checkout.

## 1. Start the office

```powershell
cd d:\PersonalProjects\my-startup
npm install
npm run dev
```

`npm run dev` is `node server/index.mjs --dev`. Leave that terminal open.

Open <http://localhost:4310>.

An empty floor is normal until a Cursor chat sends a prompt. <http://localhost:4310/?demo> is the made-up demo and needs no agent.

## 2. Put Cursor chats on the floor

User hooks live in `%USERPROFILE%\.cursor\hooks.json`. Install merges ten observe-only commands, each one the absolute path of `node` plus `hooks\cursor.mjs`. Running install again rewrites the command if `node` moved, and does not add the same command twice.

```powershell
node bin/cli.mjs install --no-approve --no-status --no-otel --no-pins --no-loop-guard --no-panel
```

That command still writes Claude Code **event** hooks into `%USERPROFILE%\.claude\settings.json`. There is no flag yet that skips them. Those lines are leftover. The flags above keep the optional Claude pieces off: approval hooks, the status line, OpenTelemetry, compact pins, the loop guard, and the editor panel. Do not turn Claude Code on to feed the office.

Then check the Cursor half:

```powershell
node bin/cli.mjs doctor
```

Doctor still reports Claude files. For this branch the line that matters is Cursor: **10** hooks, and the `node.exe` in `hooks.json` is not under `fnm_multishells`. If an older install used an fnm node, run the install command again with the durable `node` so the commands get rewritten.

`uninstall` removes the Cursor commands that point at `hooks\cursor.mjs` and also removes the Claude hooks this installer added. Skip it unless you mean to take both out.

The hook prints `{}` and exits 0. The POST to the office times out after two seconds. A stopped office does not block the agent. These hooks do not approve tools.

| Cursor hook | What the office shows |
| --- | --- |
| `sessionStart` / `sessionEnd` | the person arrives / leaves |
| `beforeSubmitPrompt` | the prompt you sent |
| `preToolUse` / `postToolUse` / `postToolUseFailure` | the tool (`Shell` is a command, `StrReplace` is an edit) |
| `subagentStart` / `subagentStop` | a subagent of that chat |
| `stop` | the turn ended, or failed |
| `preCompact` | the chat was compacted (also carries context fill for a subagent when Cursor sends it) |

A chat that is already open shows up on its next prompt or tool call. `sessionStart` runs only when a conversation is created. Tab completions are not sessions. A cloud agent appears only when Cursor runs these local hooks.

`hooks/cursor-map.mjs` forwards optional `context` on hooks that include it: `model_params` with `id: "context"` (for example `1m`) gives the window size; `preCompact` can add `context_tokens`, `context_usage_percent`, and `context_window_size`. The server stores those on the subagent record. Cursor does not stream a live fill on every tool step.

## 3. Confirm a person

Send a prompt in a local Cursor Agent chat. The floor should show that chat as a person with a Cursor mark and the model name. Reads walk to the library, edits stay at the desk, commands go to the server room.

A Cursor session has no Claude transcript, so the name may still be `cursor-xx` and the last reply may be empty. Titles and last replies are the next product work, not part of startup.

In the browser, also confirm: no Claude plan pill on the top bar, and the activity board has four tiles (Prompts, Reads, Edits, Cmds) with no API price. The activity **feed** lists only today’s events, not yesterday’s. Escape and the phone sheets should not throw.

Hook unit test, with no server:

```powershell
node --test tests/unit/cursor-hook.test.mjs
```

## 4. Names, activity, and context

**Names.** A new chat is labeled `{folder}-{first two chars of session id}` (for example `my-startup-c7`). Claude Code can replace that with a transcript title; Cursor does not yet, so the short name often stays. On screen, a title wins over the short name when one exists.

**Activity column.** The feed list shows only **today** in your browser’s local calendar. Older events stay in `data/state.json` for replay and stats, but they no longer appear in the right-hand feed. KPI tiles at the top are still today’s totals.

**Context on the main chat.** The session drawer’s context tile (`–` when empty) comes from Claude Code’s status line and transcript scan. Cursor parent chats do not fill it yet. Do not expect a percentage on the main person.

**Context on a subagent.** Open the parent → **Subagents** → click the subagent (or its row under the parent in the session list). When Cursor has reported numbers, you see **percent · used / max** (for example `94% · 120k / 128k`) in the subagent header and in the drawer’s context tile while that subagent is open. The window size may appear alone (`– / 1.0M`) until a `preCompact` (or similar) hook sends token counts. Subagent cards in the list also show the same line when known.

## Claude Code on this branch

Do not install Claude Code, and do not follow the Quick start in the README. Cursor does not send plan usage, context fill, or “What eats your plan”. The office must not invent those numbers.

Already removed in the working tree, not committed yet:

- the top-bar Claude plan pill and the card it opened
- the activity board’s API price tile

Still in the tree, and not part of this quick start:

- `bin/cli.mjs install` writing `%USERPROFILE%\.claude\settings.json`
- `hooks/send.mjs` and `hooks/status-line.mjs`
- session-drawer cost, the 2D list cost, the accountant, and the burn drawer
- the package name `claude-my-office` and the upstream repository URL

Leave the floor plans, staff, and Vietnamese calendar scenes as they are. Do not commit unless asked. Leave `package-lock.json` out of a feature commit.
