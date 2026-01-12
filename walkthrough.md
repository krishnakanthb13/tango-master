# Tango Master Walkthrough

Tango Master is a logic puzzle solver designed specifically for the "Tango" (Sun and Moon) game.

## Features

### 1. Interactive Grid
You can manually input a puzzle by clicking on the grid:
- **Cells**: Click once for a **Sun** (yellow circle), twice for a **Moon** (blue crescent), and three times to clear.
- **Constraints**: Click on the grid lines between cells to toggle between **Equal (=)**, **Opposite (x)**, and **None**.

### 2. Instant Solver & Timer
Once the grid matches your puzzle, click **Solve Puzzle**. The app uses a backtracking algorithm to find the unique solution. 
- **Performance Timer**: After solving, the app displays exactly how long it took in milliseconds (and even microseconds for ultra-fast solves).

### 3. AI-Powered Vision (Gemini 3)
Instead of manual entry, you can upload a screenshot:
- Click **Upload Screenshot**.
- Select a screenshot of a 6x6 Tango grid.
- **Gemini 3.0 Flash Preview** (with Thinking mode) will analyze the image, reason through the spatial layout, and automatically populate the grid.

### 4. Solve History
Access your previous work by clicking the **Clock Icon** in the top right corner:
- **History Modal**: View a list of your past solves with timestamps and durations.
- **Limitless History**: All successful solves are stored in your browser's local storage.
- **Review Boards**: Click **Load Board** on any history item to see the saved state.
- **Export Data**: Click the **Save Logs** button to download a clean text file (`tango_master_logs.txt`) containing all your solve details.
- **Clear History**: Use the **Clear All History** button to wipe your local records and start fresh.

### 5. Random Board Generator
Feeling stuck or want to practice? Generate a new puzzle instantly:
- Click **New Game**.
- Choose your difficulty: **Easy**, **Medium**, or **Hard**.
- The app will generate a valid, solvable board for you to play!

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
Note: You can get the API key from [Google AI Studio](https://aistudio.google.com/api-keys).

- Once configured, the "Upload Screenshot" button will use Gemini to "see" the puzzle for you!

## Publishing Readiness

The repository is now ready for GitHub publication:
- **`README.md`**: Fully updated with a project banner, feature list, tech stack, installation guide, and license details.
- **`LICENSE`**: GPL-3.0 license is present and linked.
- **`.gitignore`**: Optimized to keep build artifacts and environment secrets out of your public repo.
- **`walkthrough.md`**: This guide provides in-depth usage details for new users.

---

For a detailed breakdown of all the files in this repository, check out the **[Code Walkthrough](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/codewalkthrough.md)**.

