# 🎨 Design Philosophy

This document explains the rationale, principles, and target audience behind **Tango Master**.

## 💡 Problem Statement
Logic puzzles like "Tango" (Sun and Moon) are engaging but can be frustrating when players encounter a "dead end." Existing digital solvers are often clunky, lack visual appeal, or require tedious manual input for every single cell.

## 🚀 Why This Solution?
Tango Master was built to provide a **frictionless, premium experience** for puzzle enthusiasts.
1. **AI Vision**: Instead of spending 2 minutes clicking cells to replicate a physical puzzle, users can simple upload a screenshot.
2. **Speed**: The backtracking engine is optimized for sub-millisecond solves on a 6x6 grid.
3. **Playability**: Beyond just a solver, it's a game in its own right thanks to the procedural generator.

## 💎 Design Principles
- **Simplicity**: The UI is distraction-free. The grid is the hero.
- **Speed**: Every interaction (solving, generating, navigating history) must feel instantaneous.
- **Aesthetics**: A dark-themed, modern interface with fluid transitions (using Framer Motion) that feels like a professional desktop application.
- **Feedback**: High-precision timers provide transparency into the "AI's" reasoning speed.

## 🎯 Target Users
- **Beginners**: Learn the rules and logic of Tango by seeing how a solver completes a board.
- **Enthusiasts**: Practice with infinite levels using the Random Generator.
- **Power Users**: Quickly solve difficult puzzles found in other apps or print media using the Vision feature.

## 🔄 Workflow Integration
Tango Master is designed to fit into a solver's daily habit:
- **Input**: Screenshot or manual entry.
- **Solve**: Immediate feedback with valid results.
- **Record**: History logs for tracking performance over time.
- **Export**: Ability to save results for documentation or sharing.

---

## 🧠 Behind the Scenes: Solver & Generator

### 🔍 The Solver (Simple Terms)
The solver is like a logical judge. For every empty cell, it asks: "If I put a Sun here, does it create 3-in-a-row? Does it balance out the Moons? Does it match the '=' or 'x' symbols nearby?". If the answer is yes to all, it stays. If it gets stuck later, it comes back and tries the Moon instead. This happens so fast that it seems like magic!

### 🎲 The Generator (Simple Terms)
Creating a Tango puzzle is like creating a secret code—a fresh one every time. Our generator first makes a perfectly filled grid using randomized placements, so it's never the same twice. Then it starts erasing pieces of the grid and replacing them with clues (like the `=` and `x` signs). It keeps just enough clues so that you can use logic to rebuild that original, unique solution.

---
