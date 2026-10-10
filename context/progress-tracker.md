# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

First playable browser implementation complete.

## Current Goal

Define a Wordle-like game that uses a standard dictionary initially and supports the owner's custom dictionary.

## Completed

- 2026-09-29: Inspected the workspace; only Git metadata was present, with no application files or existing context documents.
- 2026-09-29: Created and tailored all six context documents from the bundled initproject templates.
- 2026-09-29: Recorded confirmed scope, proposed behavior, and unresolved decisions without selecting an unsupported stack or design.
- 2026-09-29: Implemented a dependency-free browser game with six guesses, five-letter validation, repeated-letter scoring, physical/on-screen keyboard input, win/loss dialog, and new-round control.
- 2026-09-29: Replaced the compact word list with 9,981 unique five-letter entries generated from the system English dictionary; `paste` and uncommon dictionary words are now accepted.
- 2026-09-29: Added named onboarding, a darker game-focused visual theme, sound effects with mute control, staggered tile-flip reveals, win confetti, and a loss dialog that reveals the answer with an encouraging message.
- 2026-09-29: Added persistent light/dark mode switching and fixed submitted tile feedback so letters and state colors remain visible after the flip in both themes.
- 2026-09-29: Improved mobile touch and keyboard support with accessible labels, focus states, safe-area spacing, smooth scrolling, and larger touch targets; refined flip motion and expanded per-tile audio feedback.
- 2026-09-29: Added a persistent local leaderboard for wins and best tries, animated invalid-word row feedback, and per-tile color reveal during the flip sequence.
- 2026-09-29: Made audio fail-safe and finalized the flip row after the last tile so submitted letters and colors remain visible after animation completion.
- 2026-10-11: Added sentence clues for each round, a letter-based fallback clue for the full dictionary, and a transform-only staggered flip that commits each tile's color at the midpoint.
- 2026-10-11: Added a three-minute round timer and a zero-point reveal action; manual reveals and timeouts end the round without recording a win or best score.

## In Progress

- First playable round is implemented; custom dictionary management is not yet exposed in the UI.
- The latest UI and feedback changes are implemented locally and need a new deployment when ready.

## Next Up

1. Document and verify redistribution rights for the bundled dictionary source before publishing.
2. Add custom dictionary import and validation once the preferred format is chosen.
3. Add automated scoring checks and browser playtesting.

## Open Questions

- Platform and stack: browser, desktop, or mobile; language, framework, and delivery target are TBD.
- Game rules: accept the proposed five-letter words and six attempts, or use different limits?
- Round scheduling: daily puzzle or unrestricted replay?
- Standard dictionary: language, source, redistribution license, and allowed word policy?
- Dictionary membership: should possible answers and accepted guesses use one list or separate lists?
- Custom dictionary: pasted words, file import, or another mechanism; replace or supplement the standard list?
- Custom dictionary milestone: part of the first playable release or a later increment?
- Input policy: character set, normalization, duplicates, invalid words, and import limits?
- Persistence: retain custom words, settings, or unfinished rounds across sessions?
- UI: visual theme, target devices, keyboard controls, and accessibility acceptance criteria?

## Architecture Decisions

- Confirmed: build a Wordle-like game.
- Confirmed: use a standard dictionary initially.
- Confirmed: ability to use the owner's custom dictionary belongs in the overall product scope.
- Proposed: separate scoring, dictionary handling, and presentation so word sources can change without rewriting game rules.
- Chosen for the first release: static browser files with modern JavaScript and plain CSS, because no framework or build setup existed.
- Chosen for the first release: five-letter words and six attempts, matching the initial Wordle-like proposal.
- Chosen for the first release: unrestricted random rounds rather than daily scheduling.

## Session Notes

- Initialization destination: `/Users/altafr/Documents/ChatGPT/wordle/context/`.
- The user's follow-up requested implementation, so the proposed five-letter/six-attempt rules were used for the first playable increment.
- Open `index.html` in a browser to play; no build step is required.
- The standard list is now a broad bundled corpus; custom dictionary UI and automated tests remain next.
