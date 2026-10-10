# Code Standards

## General

- Keep game rules, dictionary handling, and presentation separate.
- Prefer small functions with explicit inputs and outputs for guess evaluation.
- Define detailed product rules before encoding them; record unresolved requirements in the progress tracker.
- Treat custom dictionary content as untrusted input and validate it before use.

## Language Conventions

Language is TBD. Select formatting, typing, and linting conventions after the language is chosen; none are imposed by this initialization.

## Framework Conventions

Framework and runtime are TBD. Keep core scoring independent of presentation where practical.

## Styling

- Theme, styling system, and tokens are TBD in `ui-context.md`.
- Proposed accessibility standard: visible focus, labeled controls, and feedback that does not rely on color alone.

## APIs and External Boundaries

No API or backend is currently specified. If imports or network sources are introduced, validate the incoming data at the boundary and provide useful failure messages.

## Data and Storage

- Specify supported word length, language, character rules, casing, whitespace handling, and duplicate handling before implementing dictionary normalization.
- Record the standard dictionary's provenance and license alongside the chosen source.
- Keep answer eligibility distinct from accepted-guess membership if separate lists are chosen.
- Persistence and import limits remain TBD; do not assume a database is required.

## File Organization

- `context/` contains the six project context documents.
- Application source, dictionary assets, and test locations are TBD until the stack is selected.
- Preserve the original skill templates outside the project.

## Verification

Once implementation begins, verify scoring for exact matches, misplaced letters, absent letters, and repeated letters. Check dictionary validation and complete win/loss flows. Build, lint, and test commands are TBD until real tooling exists.
