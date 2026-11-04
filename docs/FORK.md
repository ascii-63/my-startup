# Fork handoff

Read this before changing the repo. It is the note for the next session: what this checkout is, what the owner wants changed from the original project, and what to do next.

## What this is

This workspace (`d:\PersonalProjects\my-startup`) is a fork of [khanh020905/my-office](https://github.com/khanh020905/my-office) (“My Office”). Git `origin` is `https://github.com/ascii-63/my-startup.git`. `package.json` still names the package `claude-my-office` and still points `repository` at the upstream repo. Leave that metadata alone until the owner asks to publish this fork under its own name.

My Office is a local web app. A Node server on port **4310** receives agent events and streams them to a Next.js page. The page draws a three.js office: each session is a person at a desk (read files in the library, edit at the desk, run commands in the server room). The page does not call Claude or Cursor. It only listens to this machine.

```
Claude Code hooks ──POST /event──▶ server/index.mjs ──SSE /stream──▶ src/office
Cursor agent     ──hooks/cursor.mjs──▶ same /event
```

Architecture detail is in `docs/ARCHITECTURE.md`. Product behavior is in `README.md` (English) and `README.vi.md`.

## What the owner wants from the original

Keep the office. Change the input and the Claude-billing chrome.

1. **Cursor is a source of people.** Every local Cursor Agent chat, on any model, should show up as a session. Claude Code hooks stay. This is additive. Do not replace or delete the Claude Code hook path.
2. **Drop the Claude plan from the top bar.** The “Claude plan” pill and the card it opened (5-hour and weekly limits, account switching, Codex and Antigravity tabs, the shortcut into “What eats your plan”) come off the top bar.
3. **Drop the API price tile on the activity board.** The board keeps Prompts, Reads, Edits, and Cmds. Session-drawer cost, the 2D list cost, the accountant, and the “What eats your plan” drawer stay. Ask before removing any more money UI.

Leave the Vietnamese office life (altar, lunch, duty rota, fire drill, street, karaoke) as it is. The owner has not asked to reskin or strip that.

## Already done

Branch `feat/cursor-sessions`, commit `4fa54f1` (“Đưa phiên Agent của Cursor vào văn phòng.”), tracking `origin/feat/cursor-sessions`.

| Piece | Where |
| --- | --- |
| Pure event mapping | `hooks/cursor-map.mjs` |
| Fail-open hook (always prints `{}`, exits 0) | `hooks/cursor.mjs` |
| Install / uninstall / doctor | `bin/cli.mjs` (`--no-cursor` skips `~/.cursor/hooks.json`) |
| Session tag, kept until `SessionEnd`, no Claude transcript pricing | `server/index.mjs` (`agent: "cursor"`) |
| Cursor mark and model chip | `src/office/people/workers.js`, `src/office/ui/activity.js`, `src/office/ui/lite.js` |
| Mapper and install tests | `tests/unit/cursor-hook.test.mjs` |
| User-facing docs | `README.md`, `README.vi.md`, `docs/ARCHITECTURE.md` |

Cursor events that become office events: `sessionStart`, `sessionEnd`, `beforeSubmitPrompt`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `stop`, `preCompact`. `Shell` is shown as a command, `StrReplace` as an edit. A chat that is already open appears on its next prompt or tool call, because `sessionStart` runs only when a conversation is created.

`%USERPROFILE%\.cursor\hooks.json` on this machine already has those ten commands. They call `hooks/cursor.mjs` through an fnm multishell `node.exe` (`fnm_multishells\285712_1793791609685`). That path dies with the shell that created it. After a reboot the hooks can fail even though the file looks installed. Re-run install with a Node binary that stays on disk.

## In the working tree, not committed

The plan pill and the activity price tile are removed in uncommitted edits. Confirm the tree before editing them again; another session may still be finishing the tests.

Touched (leave `package-lock.json` out of a feature commit; the two-line change is from `npm install`):

- `src/components/office/TopBar.tsx` — pill and `#pop-plan` card removed
- `src/office/ui/settings.js`, `topbar.js`, `phone.js` — missing plan nodes do not throw
- `src/office/ui/mac-drawer.js` — `renderLimits` skips the pill and card; the 80% / 95% toast remains
- `src/office/ui/burn.js` — drawer no longer binds `#plan-burn`; it still opens from the group chat ••• menu and from `?burn`
- `src/office/ui/activity.js` — `cost` dropped from `KPIS`
- `src/styles/sessions.css` — `.kpis` is four equal columns

Still pointing at the removed pill, until updated:

- `tests/e2e/burn.spec.ts` opens `#btn-plan` / `#plan-burn`. Point it at the group chat item whose label is the `burn.open` string.
- `tests/e2e/office.spec.ts` and `tests/e2e/ai-accounts.spec.ts` add, rename, or switch accounts from the plan card. Remove those cases. Keep the server account APIs.

Do not commit unless the owner asks. Commit messages in this repo are short Vietnamese sentences about why.

## Next work

Do these in order.

### 1. Finish the UI cut

- Update the three e2e files above if they still click `#btn-plan`.
- With the server up, open `http://localhost:4310` and confirm: no Claude plan pill, activity board has four tiles and no API price, the office still connects, Escape and the phone sheets do not throw.
- Commit only when asked. Stage the UI files, not `package-lock.json`.

### 2. Make a Cursor person readable

A Cursor session has no `~/.claude/sessions` pid file and its transcript is not Claude’s jsonl. The server already skips `refreshTitle` and token pricing for `agent === "cursor"`. The person therefore shows up as `cursor-xx`, with an empty last reply.

- Take a title from the first prompt, or from Cursor’s transcript if its format is stable.
- Show the last assistant text when the transcript actually contains it.
- Keep the subagent brief on `task` (already wired on `SubagentStart`).
- Keep the model chip. Search in the session list already includes the model id.

### 3. Make the hooks survive on this Windows machine

`node` is often missing from PowerShell. Dependencies were installed with a portable Node at `%TEMP%\node-v24.22.1-win-x64` (v24.22.1). Do not install a machine-wide Node unless the owner asks.

- Start the app with `node server/index.mjs --dev` once `node` resolves.
- Re-run `node bin/cli.mjs install` using a durable `node.exe`, so `hooks.json` stops pointing at `fnm_multishells`.
- `node bin/cli.mjs doctor` should report all 10 Cursor hooks.
- Hook commands must keep failing open: print `{}`, exit 0, two-second timeout. A stopped office must not block the agent.

### 4. Leave these Claude-only on purpose

Plan usage, context fill, and “What eats your plan” come from Claude Code’s status line and OpenTelemetry. Cursor does not send them. Do not invent numbers for a Cursor chat.

Cursor’s allow/deny hooks (`beforeShellExecution` and the rest) are a different protocol from Claude’s `PermissionRequest`. They stay unmapped until the owner asks for office approvals. If that work starts, it stays observe-or-fail-open: never hold the agent because the office is down.

Tab completions are not sessions. Cloud agents appear only when Cursor runs these local hooks.

### 5. Ask before going further

- Removing session-drawer cost, the 2D row cost, the accountant, or the burn drawer.
- Renaming the package, the GitHub repo URL, or the “My Office” brand.
- Changing floor plans, staff, or the Vietnamese calendar scenes.
- Turning Cursor hooks into approval gates.

## Checks

```powershell
node --test tests/unit/cursor-hook.test.mjs
node server/index.mjs --dev
```

Browser check for UI work: load `http://localhost:4310`, confirm the top bar and the four activity tiles, send a Cursor prompt, and see that chat as a person whose status follows the tool call. A screenshot of the floor alone is not that check.

## Prior session

The decisions above come from [Cursor office hooks](241e3628-5541-48eb-a304-2bb564415ca1).
