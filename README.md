# ⭕❌ Tic Tac Toe vs CPU

A browser-based Tic Tac Toe game built with vanilla JavaScript, HTML, and CSS — featuring four CPU difficulty levels and clean, modular code architecture.

## 🧠 Features

- ✅ Play against a CPU with increasing challenge:
  - **Easy** – Random moves
  - **Medium** – Occasional smart moves
  - **Hard** – Prioritizes winning and blocking
  - **Impossible** – Perfect play using the **Minimax algorithm**
- 🔁 Restart and difficulty selection without reloading the page
- 💡 Encapsulated code using IIFE and factory functions

## 🧩 Code Structure

* `Gameboard` – Stores the game state  
* `Player` – Factory for creating player objects  
* `GameController` – Handles game flow, turn logic, win/tie detection  
* `DisplayController` – Manages DOM interaction and rendering  
* `Minimax` – Implements unbeatable AI for Impossible mode  

## 📦 Technologies Used

- HTML5
- CSS3
- JavaScript
  - Factory functions
  - Module pattern (IIFE)
  - Minimal global scope

## 🎓 What I Learned

* Structuring a project with minimal global scope
* Separating logic and UI responsibilities
* Implementing AI behavior with increasing complexity
* Writing clean, reusable code with the factory pattern

## 🎮 Try It

1. Try the live preview [here](https://pietrodnd.github.io/tic-tac-toe-vs-cpu/).
