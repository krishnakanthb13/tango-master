<div align="center">
<img width="1200" height="475" alt="Tango Master Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ☀️ Tango Master 🌙

**Tango Master** is a high-performance solver and interactive playground for the popular "Tango" (Sun and Moon) logic puzzle. Whether you're stuck on a difficult grid or want to see AI reason through spatial constraints, Tango Master has you covered.

---

## 🚀 Features

- **Interactive Grid Editor**: Manually input puzzles with a click-based interface for cells and constraints.
- **Instant Backtracking Solver**: Solves any valid 6x6 Tango puzzle in milliseconds.
- **AI-Powered Vision**: Upload a screenshot of a puzzle, and let **Google Gemini 3.0 Flash Preview** (with Thinking mode) analyze the grid and constraints for you. AI can make mistakes, so always double-check the solution. Double click on a cell to toggle between equal (=), cross (x), sun, and moon.
- **Premium UI**: A sleek, dark-themed experience with fluid animations powered by Framer Motion and Lucide icons.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI (@google/genai)
- **Icons**: Lucide React
- **Build Tool**: Vite 6

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A Google AI Studio API Key (for Vision features)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tango-master.git
   cd tango-master
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   - You can get the API key from [Google AI Studio](https://aistudio.google.com/api-keys).

4. **Run Locally**:
   ```bash
   npm run dev
   ```
   - The app will be available at `http://localhost:3000/`. 
   - And you can run using the run_app.bat file.

---

## 📖 How to Use

For a detailed guide on how to play, use the solver, and master the vision features, check out the **[Walkthrough Guide](walkthrough.md)**.

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**.  
See the [LICENSE](LICENSE) file for the full license text.

---

*Enjoy solving! If you find this helpful, consider giving it a ⭐ on GitHub.*
