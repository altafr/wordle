# UI Context

## Theme

A game interface is expected, but the target platform, visual theme, and light/dark preferences are TBD. No existing design assets or UI implementation are present.

## Colors

Palette and token naming are TBD. Proposed semantic roles include page background, surface, primary text, muted text, border, focus, error, correct-position letter, misplaced letter, and absent letter. Letter feedback should include a non-color cue.

## Typography

Font family, scale, weights, and letter tile sizing are TBD. Proposed priority: legible words and clearly distinguishable letter states.

## Border Radius

Tile, button, panel, and overlay radius values are TBD.

## Component Library

TBD. No component library or CSS framework has been selected.

## Layout Patterns

Proposed interface structure, subject to platform and game-rule decisions:

- A guess grid as the primary play area.
- Guess entry and submission controls, with clear invalid-guess messages.
- Letter feedback and a visible round outcome.
- A control to begin the next round if unrestricted replay is selected.
- A dictionary control indicating the active source and supporting custom input when that feature is delivered.

Physical keyboard support, an on-screen keyboard, responsive layouts, and the custom dictionary editor/import interaction are TBD.

## Icons

Icon set is TBD. Use text labels where an icon alone would make a control unclear.

## Accessibility

Proposed requirements: keyboard-operable controls, visible focus, sufficient text contrast, and accessible descriptions of letter feedback and round outcomes. Verify platform-specific behavior after selecting the UI stack.
