# Hackathon Habit 🚀

**Hackathon Habit** is a daily coding challenge application designed to help you build and maintain your coding streak. Solve algorithmic problems, verify your solutions with real test cases, and track your progress over time.

## 🌟 Features

*   **Dynamic Problem Library**: Includes classic challenges like Two Sum, Palindrome Number, and Valid Parentheses.
*   **Multi-Language Support**: Solve problems in **JavaScript** (local execution) or **Python** (remote execution via Piston API).
*   **Real Code Execution**: Write code and run it instantly against multiple test cases.
*   **Test Results Analysis**: Detailed breakdown of passed/failed tests with expected vs. actual outputs.
*   **Streak Tracking**: Automatically saves your daily streak and total solved problems.
*   **Confetti Celebration**: Visual rewards for successful submissions!

## 🛠️ Tech Stack

*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

## ⚡ Quick Run

To get started immediately, run this single command in your terminal:

```sh
npm install && npm run dev
```

## 🚀 Step-by-Step Setup

1.  **Clone the repository**:
    ```sh
    git clone <YOUR_GIT_URL>
    cd hackathon-habit
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    ```

3.  **Run the App** (Development Mode):
    ```sh
    npm run dev
    ```
    > The app will open at `http://localhost:8080`

4.  **Build for production** (Optional):
    ```sh
    npm run build
    ```

## 📝 Usage

1.  Click **Start** on the timer to track your session.
2.  Read the problem description and examples.
3.  Write your solution in the code editor.
4.  Click **Submit Solution** to run the test cases.
5.  Celebrate when you pass all tests!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License


## 📂 Project Structure

- `src/components`: Reusable UI components (Atomic design)
- `src/lib`: Utilities, API clients (Gemini), and helper functions
- `src/pages`: Main application routes/views
- `src/data`: Static data assets (problem definitions)
