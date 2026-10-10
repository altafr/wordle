# Custom Dictionary Wordle

## Overview

A Wordle-like word guessing game for the project owner and other players who want to play with a standard dictionary or their own custom word list. Start with a standard dictionary; keep custom dictionary support in the product scope. The wider audience and distribution platform are TBD.

## Goals

1. Deliver a playable word guessing round using a standard dictionary.
2. Allow the owner to use a custom dictionary without rewriting game logic.
3. Give understandable feedback on guesses and the outcome of each round.

## Core User Flow

Proposed flow, pending confirmation of detailed game rules:

1. Open the game with the standard dictionary selected by default.
2. Enter and submit a word guess.
3. See feedback for letters in the correct position, letters elsewhere in the answer, and absent letters.
4. Continue until the answer is guessed or the attempt limit is reached.
5. See the outcome and start another round.
6. Once custom dictionary support is implemented, supply a custom list and use it for subsequent rounds.

## Features

### Word Guessing

- Wordle-like rounds with guess validation, letter feedback, and win/loss states.
- Proposed initial rules: five-letter words and six attempts. These are proposals, not confirmed decisions.
- Daily puzzle versus unrestricted replay: TBD.

### Dictionaries

- Standard dictionary for initial play; source, language, license, and eligible word policy are TBD.
- Ability to use the owner's custom dictionary is required in the overall scope.
- Custom dictionary entry/import format, persistence, and delivery milestone are TBD.
- Whether answer words and accepted guesses use the same list is TBD.

## Scope

### In Scope

- Wordle-like gameplay.
- Standard dictionary as the initial word source.
- Custom dictionary capability, with implementation timing still to be decided.

### Out of Scope

- This initialization does not implement the game or install dependencies.
- Accounts, multiplayer, leaderboards, analytics, and paid features have not been requested and are excluded from the current planned scope unless requested later.

## Success Criteria

1. A player can complete a round using the selected standard word source.
2. Feedback correctly handles repeated letters under the finalized rules.
3. Invalid guesses produce a useful explanation and follow the finalized attempt policy.
4. The player can use a valid custom dictionary once that capability is delivered.
5. Empty or unusable custom lists are handled without leaving the game in a broken state.
