# Tango Master Walkthrough

Tango Master is a logic puzzle solver designed specifically for the "Tango" (Sun and Moon) game.

## Features

### 1. Interactive Grid
You can manually input a puzzle by clicking on the grid:
- **Cells**: Click once for a **Sun** (yellow circle), twice for a **Moon** (blue crescent), and three times to clear.
- **Constraints**: Click on the grid lines between cells to toggle between **Equal (=)**, **Opposite (x)**, and **None**.

### 2. Instant Solver
Once the grid matches your puzzle, click **Solve Puzzle**. The app uses a backtracking algorithm to find the unique solution.

### 3. AI-Powered Vision (Gemini 3)
Instead of manual entry, you can upload a screenshot:
- Click **Upload Screenshot**.
- Select a screenshot of a 6x6 Tango grid.
- **Gemini 3 Flash Preview** (with Thinking mode) will analyze the image, reason through the spatial layout, and automatically populate the grid.

> [!TIP]
> **For the best AI results**:
> 1. Crop your screenshot to just the grid area.
> 2. Ensure clear resolution so small "=" and "x" symbols are visible.
> 3. If a constraint is misplaced, you can manually click it on the grid to fix it before solving!

## How to use the Vision feature

To use the AI vision, ensure you have your Gemini API key in `.env.local`:
```env
GEMINI_API_KEY=your_key_here
```

Once configured, the "Upload Screenshot" button will use Gemini to "see" the puzzle for you!
