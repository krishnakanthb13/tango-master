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
| **[components/HistoryModal.tsx](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/components/HistoryModal.tsx)** | Renders the **History Overlay**. A sleek modal that lists past solve attempts and allows you to reload them. |
| **[index.html](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/index.html)** | The basic **HTML Skeleton**. It provides the container where the React app lives. |

## 🧠 Logic & Services
| File | Description |
| :--- | :--- |
| **[services/solver.ts](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/services/solver.ts)** | The **Solver Engine**. It uses a "backtracking" algorithm (trying possibilities and going back if it fails) to solve the puzzle instantly. |
| **[services/geminiService.ts](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/services/geminiService.ts)** | The **AI Vision Integration**. It sends your screenshot to Google's Gemini AI to "read" the puzzle positions. |

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
| **[README.md](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/README.md)** | The **Intro Guide**. Basic instructions for users on how to set up the project. |
| **[walkthrough.md](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/walkthrough.md)** | A **Project Walkthrough**. Summarizes the features and technical implementation. |
| **[LICENSE](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/LICENSE)** | The **Legal Stuff**. Defines how others are allowed to use this code (MIT License). |
| **[metadata.json](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/metadata.json)** | Simple **JSON Metadata** like name and description for the project. |
| **[.gitignore](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/.gitignore)** | Tells **Git** which files to ignore (like big folders of dependencies) when saving your work. |
| **[.gitattributes](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/tango-master/.gitattributes)** | Extra **Git settings** for consistent file formatting across different computers. |
