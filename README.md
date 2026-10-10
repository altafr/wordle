# Wordle / Five

A small, dependency-free browser Wordle-like game. Open `index.html` directly, or serve the folder with any static file server.

## Play

- Enter guesses with the physical keyboard or the on-screen keyboard.
- Green letters are in the correct position, amber letters are in the word but elsewhere, and gray letters are not in the answer.
- Use the refresh button or the result dialog to start a new round.

The game uses the bundled `dictionary.js` corpus generated from the system English dictionary. It includes 9,981 unique five-letter alphabetic entries, including uncommon dictionary words. The dictionary is normalized through `normalizeDictionary`, so a future custom dictionary import can use the same game engine.
