# TaskFlow AI 🧠✨

TaskFlow AI is a modern, AI-enhanced Kanban-style task management application designed to streamline your workflow. It leverages the power of Google's Gemini API for intelligent task description generation and sub-task suggestions, Firebase for real-time data persistence and authentication, and a sleek, responsive UI built with React and Tailwind CSS.

## Features

* **Kanban Board:** Visualize your tasks in "Pending," "Active," and "Completed" columns.
* **Drag & Drop:** Easily move tasks between columns to update their status.
* **Task Creation:** Add new tasks with titles and detailed descriptions.
* **AI-Powered Descriptions:** Automatically generate task descriptions using the Gemini API based on the task title.
* **AI Sub-task Suggestions:** Break down complex tasks into smaller, actionable sub-tasks with suggestions from the Gemini API.
* **Confetti Animation:** Celebrate task completion with a fun confetti effect!
* **Persistent Storage:** Tasks are saved in real-time using Firebase Firestore, so your data is always up-to-date across sessions.
* **User Authentication:** Uses Firebase Anonymous Authentication to keep user tasks private.
* **Responsive Design:** Built with Tailwind CSS for a great experience on all screen sizes.

## Tech Stack

* **Frontend:** React
* **Backend & Database:** Firebase (Firestore, Authentication)
* **AI Integration:** Google Gemini API
* **Styling:** Tailwind CSS
* **Build Tool:** Create React App (`react-scripts`)

## Project Structure

The project follows a standard React application structure:

taskflow-ai/
├── public/
│   └── index.html
├── src/
│   ├── App.js                 # Main application component
│   ├── index.js               # React entry point
│   ├── index.css              # Global styles & Tailwind
│   ├── firebase.js            # Firebase configuration
│   ├── components/            # Reusable UI components
│   │   ├── AddTaskForm/
│   │   ├── Column/
│   │   ├── ConfettiCannon/
│   │   ├── KanbanBoard/
│   │   ├── Modal/
│   │   ├── TaskCard/
│   │   └── icons/             # SVG icon components
│   └── services/
│       └── geminiApi.js       # Gemini API utility
└── .env                       # Environment variables (API keys, etc.)
└── package.json
└── tailwind.config.js
└── postcss.config.js




## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18 LTS or v20 LTS recommended for better compatibility than v22+ with some `react-scripts` versions; if using Node v17+, see note below)
* npm or yarn package manager

### Installation

1.  **Clone the repository (or set up from provided files):**
    ```bash
    git clone [https://github.com/Git-Aarya/TaskFlowAI.git](https://github.com/Git-Aarya/TaskFlowAI.git) 
    cd TaskFlowAI
    ```
    If you don't have it as a git repository, create the folder structure and files as previously outlined.

2.  **Create a Firebase Project:**
    * Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    * Add a **Web app** to your Firebase project.
    * Enable **Anonymous Authentication**: In your Firebase project, go to Authentication > Sign-in method > Enable "Anonymous".
    * Enable **Firestore Database**: Go to Firestore Database > Create database > Start in **test mode** (for easy setup, secure later).

3.  **Get API Keys:**
    * **Firebase:** In your Firebase project settings (click the gear icon > Project settings), find your web app's configuration details (apiKey, authDomain, etc.).
    * **Gemini API:** Go to [Google AI Studio](https://aistudio.google.com/) and "Get API key". Ensure the "Generative Language API" is enabled in the associated Google Cloud project.

4.  **Set Up Environment Variables:**
    * In the root of your project (`taskflow-ai/`), create a file named `.env`.
    * Add your Firebase and Gemini API keys to it like this:

        ```env
        REACT_APP_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
        REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
        REACT_APP_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
        REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
        REACT_APP_FIREBASE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID_FOR_WEB_APP"

        # Optional: You can define a custom App ID for your Firestore paths if you want
        REACT_APP_APP_ID="taskflow-ai-app"

        REACT_APP_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```
    * **Important:** Do NOT commit your `.env` file to Git. Add `.env` to your `.gitignore` file.

5.  **Install Dependencies:**
    * Navigate to your project directory in the terminal.
    * If you had previous `node_modules` or `package-lock.json` from an incompatible setup, delete them first:
        ```bash
        # For PowerShell:
        Remove-Item -Recurse -Force node_modules
        Remove-Item -Force package-lock.json
        # For Git Bash / Linux / macOS:
        # rm -rf node_modules
        # rm package-lock.json
        ```
    * Install packages:
        ```bash
        npm install
        ```

6.  **Run the Application:**
    * If you are using Node.js v17 or newer (like v22), you may need to set the `NODE_OPTIONS` flag due to an OpenSSL compatibility issue with older build tools:
        ```powershell
        # For PowerShell:
        $env:NODE_OPTIONS = "--openssl-legacy-provider"
        npm start
        ```
        ```bash
        # For Git Bash / Linux / macOS:
        # export NODE_OPTIONS=--openssl-legacy-provider
        # npm start
        ```
    * The app should open in your browser at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

* ### `npm start`
    Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
    The page will reload if you make edits. You will also see any lint errors in the console.

* ### `npm test`
    Launches the test runner in interactive watch mode.

* ### `npm run build`
    Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

* ### `npm run eject`
    **Note: this is a one-way operation. Once you `eject`, you can’t go back!**
    If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## License

---

This README should provide a good overview and setup instructions for anyone looking at your project!
