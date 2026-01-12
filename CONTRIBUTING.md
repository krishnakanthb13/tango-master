# 🤝 Contributing to Tango Master

First off, thank you for considering contributing to Tango Master! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🐛 How to Report Bugs
- **Check for existing issues**: Before opening a new issue, please search the issue tracker to see if the problem has already been reported.
- **Be descriptive**: Include steps to reproduce the bug, the expected behavior, and what actually happened.
- **Environment**: Mention your browser, OS, and any relevant console errors.

## ✨ How to Suggest Features
- Open an issue with the tag `enhancement`.
- Describe the use case and why this feature would be valuable to users.

## 💻 How to Submit Code
1. **Fork the repository**.
2. **Create a branch**: `git checkout -b feature/your-feature-name`.
3. **Set up development environment**:
   - `npm install`
   - Create `.env.local` with `GEMINI_API_KEY=your_key`
4. **Make your changes**.
5. **Verify your code**: Ensure the app builds and the solver still works.
6. **Push to your fork**: `git push origin feature/your-feature-name`.
7. **Submit a Pull Request**.

## 🛠️ Development Setup
Tango Master is a React project built with Vite.
```bash
# Clone
git clone https://github.com/krishnakanthb13/tango-master.git
cd tango-master

# Install
npm install

# Run
npm run dev
```

## ✅ Testing Checklist
- [ ] Does the grid respond to clicks correctly?
- [ ] Does the "Solve" button find the correct solution for a known board?
- [ ] Does the "Random Generator" produce solvable boards at all difficulties?
- [ ] Is the UI responsive on smaller screens?
- [ ] (If updating AI) Does the Gemini vision still correctly identify Sun/Moon cells?

---

*By contributing, you agree that your contributions will be licensed under the project's **GNU GPL v3.0**.*
