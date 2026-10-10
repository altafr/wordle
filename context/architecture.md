# Architecture Context

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Runtime and platform | Browser (static files) | Run the game without a server or install step |
| Language and framework | Modern JavaScript modules | Implement game logic and interaction |
| UI styling | Plain CSS with custom properties | Present the board, controls, and feedback |
| Dictionary source | Bundled `dictionary.js` corpus | Supply 9,981 normalized five-letter entries for the first release |
| Persistence | None yet | The first release starts a fresh round on reload |
| Verification tooling | Browser smoke checks | Verify the board, input, scoring, and round completion |

No application code, dependencies, or build configuration existed at initialization.

## System Boundaries

Existing boundary:

- `context/` owns the six project planning and continuity documents.
- `index.html`, `styles.css`, and `app.js` own the static browser game and presentation.

Proposed logical boundaries; source folders remain TBD:

- Game rules: round state, guess evaluation, and completion rules.
- Dictionary handling: word loading, normalization, eligibility, and validation.
- Presentation: input, letter feedback, errors, and round outcome.
- Persistence, if needed: settings and custom word lists.

## Storage Model

- Standard word list: `dictionary.js` is generated from `/usr/share/dict/web2` and contains unique five-letter alphabetic entries. Its redistribution provenance and license should be documented before publishing outside this machine.
- Custom dictionary: format, size limits, and persistence are TBD.
- Active round state: location and reload behavior are TBD.
- No backend or database is required for the first release.

## Auth and Access Model

Authentication has not been requested. Account requirements, sharing, and any remote access model are TBD if those capabilities enter scope. Do not introduce an authentication dependency based on the template.

## Invariants

Proposed implementation constraints to preserve when selecting the stack:

1. Game rules must work with either the standard or a validated custom dictionary.
2. An answer must be eligible under the selected word rules and accepted as a valid guess.
3. Letter feedback must account for repeated-letter counts in the answer.
4. Dictionary normalization must be consistent for answers and guesses.
5. A round must use a stable answer and dictionary policy; a dictionary change should apply to a new round.
6. An empty eligible answer list must be detected before starting a round.
