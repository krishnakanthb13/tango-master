# Tango Master - Code Walkthrough

Welcome to the **Tango Master** codebase! This guide will help you understand how all the files fit together so you can easily edit or learn from them.

## 🏗️ Core Application
| File | Description |
| :--- | :--- |
| **[index.tsx](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/index.tsx)** | The **entry point** for React. It finds the "root" element in the HTML and mounts the entire app into it. |
| **[App.tsx](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/App.tsx)** | The **Main Component**. It holds the "state" (the grid data) and handles user interactions like clicking a cell or uploading an image. |
| **[types.ts](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/types.ts)** | Defines the **Schemas** and **Enums**. It tells the app what a "SUN", "MOON", or "EQUAL" constraint actually is in code. |

## 🧩 Components & UI
| File | Description |
| :--- | :--- |
| **[components/Grid.tsx](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/components/Grid.tsx)** | Renders the **Puzzle Board**. It draws the 6x6 grid and the small icons (= for equal, x for opposite) between cells. |
| **[components/HistoryModal.tsx](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/components/HistoryModal.tsx)** | Renders the **History Overlay**. A sleek modal that lists past solve attempts. |
| **[components/GeneratorModal.tsx](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/components/GeneratorModal.tsx)** | Renders the **New Game Modal**. Allows users to choose a difficulty for board generation. |
| **[index.html](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/index.html)** | The basic **HTML Skeleton**. Now updated with a custom favicon. |
| **[public/favicon.svg](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/public/favicon.svg)** | The **App Icon**. A geometric representation of the Sun and Moon. |

## 🧠 Logic & Services
| File | Description |
| :--- | :--- |
| **[services/solver.ts](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/services/solver.ts)** | The **Solver Engine**. It uses a "backtracking" algorithm (trying possibilities and going back if it fails) to solve the puzzle instantly. |
| **[services/geminiService.ts](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/services/geminiService.ts)** | The **AI Vision Integration**. It sends your screenshot to Google's Gemini AI. |
| **[services/generator.ts](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/services/generator.ts)** | The **Random Grid Engine**. Generates solvable 6x6 boards based on difficulty level. |

## ⚙️ Configuration & Scripts
| File | Description |
| :--- | :--- |
| **[vite.config.ts](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/vite.config.ts)** | Config for **Vite** (the build tool). It tells the app how to compile and where to find your API keys. |
| **[package.json](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/package.json)** | The **Manifest**. Lists all the "NPM" packages (libraries) used and the scripts to run the app. |
| **[run_app.bat](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/run_app.bat)** | A **Shortcut Script** for Windows. Double-click this to automatically install dependencies and start the local server. |
| **[tsconfig.json](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/tsconfig.json)** | Rules for **TypeScript**. Ensures the code is typed correctly and helps catch bugs during development. |

## 📄 Documentation & Meta
| File | Description |
| :--- | :--- |
| **[README.md](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/README.md)** | The **Intro Guide**. Basic instructions for users. |
| **[walkthrough.md](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/walkthrough.md)** | A **Project Walkthrough**. Summarizes the features and usage. |
| **[codewalkthrough.md](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/codewalkthrough.md)** | This **Deep Dive**. Contains information on why and how the app was built. |
| **[LICENSE](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/LICENSE)** | The **Legal Stuff**. Defines usage rights (GNU GPL v3.0). |

---

## 🎯 Project Rationale

Tango Master is designed to be the ultimate companion for "Tango" logic puzzle enthusiasts, bridging the gap between manual solving and automated assistance.

### Why built this?
1. **Accessibility**: Lowers the barrier to entry for beginners by providing a solver and generator that help explain constraint logic.
2. **AI Exploration**: Explores the spatial reasoning abilities of **Gemini 3.0 Flash Preview**. parsing a grid from a screenshot is a high-level test of AI layout understanding.
3. **Engagement**: Transforms a simple tool into a full game through the **Random Generator**, allowing users to practice without needing external puzzle sources.

---

## ⚙️ Technical Implementation

### 1. Random Board Generator (`services/generator.ts`)
The generator ensures every board is valid and solvable via a two-step process:
- **Solution Generation**: Uses the backtracking solver logic with randomized selection orders to find a perfectly valid 6x6 completed grid.
- **Puzzle Reduction**: Punches holes and removes constraints based on difficulty probabilities:
    - **Easy**: Keeps ~55% of cells and 40% of constraints.
    - **Medium**: Keeps ~40% of cells and 30% of constraints.
    - **Hard**: Keeps ~25% of cells and 20% of constraints.

### 2. AI Vision (`services/geminiService.ts`)
Sends screenshots to Google's Gemini AI to "read" cell values and constraints. This reduces friction for users who want to solve puzzles from other apps or sites instantly.

### 3. State & UI (`App.tsx` & `components/`)
- **State Management**: Uses React hooks to manage the 6x6 grid, constraints, and solve snapshots.
- **Generator UI**: `GeneratorModal.tsx` provides a premium selection interface using Lucide icons (Battery levels) to represent difficulty.
- **Visuals**: Static assets like the sun/moon `favicon.svg` are served from the `public/` directory for correct browser resolution.

