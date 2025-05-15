# Battleship Game
A JavaScript-based implementation of the classic Battleship game, built as part of The Odin Project curriculum. This project emphasizes Test-Driven Development (TDD), modular JavaScript, and separation of logic and DOM manipulation.

## live Preview

## 📌 Project Goals
- Practice writing testable, modular JavaScript code
- Apply TDD principles using Jest
- Create game logic isolated from UI
- Dynamically render boards in the DOM
- Enable user and computer interactions

## 🧠 Features
- 10×10 game board grid
- Ship placement (manual preset)
- Turn-based gameplay (player vs computer)
- Attack handling and visual feedback
- Ships track hits and sunk status
- Basic AI for computer player
- Clear separation between logic and DOM

## 🧪 Testing
- This project follows a TDD workflow using Jest. Tests include:
- Ship creation, hit tracking, and sunk logic
- Gameboard creation, ship placement, and attack handling
- Player turn and computer AI logic

## To run the tests:
1. npm install
2. npm test

## 🛠️ Technologies Used
- JavaScript (ES6 Modules)
- HTML/CSS
- Jest (unit testing)
- Webpack (module bundling)
- ESLint & Prettier (code linting & formatting)

## 🎮 Gameplay Logic
- Ships are placed programmatically.
- User clicks on enemy board to attack.
- Visual feedback shows hit/miss.
- Computer selects random coordinates (basic AI).
- Game ends when all of a player’s ships are sunk.
