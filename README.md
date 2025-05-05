# CyberTask - Solo Leveling Inspired Task Manager

CyberTask is a web application designed to gamify your daily tasks and self-improvement goals, drawing inspiration from the "System" in the popular anime/manhwa *Solo Leveling*. It features a futuristic UI, daily quest assignments that scale with your level, XP rewards, and task management functionalities.

## Features

* **Futuristic UI:** Customizable theme (Blue, Green, Red, Purple) with glowing effects and cyberpunk aesthetics.
* **Task Management:** Add, edit, complete, and delete tasks with titles, descriptions, deadlines, priorities, and XP rewards.
* **Daily Quest System:**
    * Automatically assigns daily exercise tasks (e.g., push-ups, plank, run) each day at midnight.
    * Quest difficulty (required repetitions/duration) scales based on the user's level.
    * Daily quests have a deadline of midnight.
    * Includes a chance for random "Surprise Tasks" with special rewards (e.g., badges, items - *implementation may vary*).
* **Leveling & XP:** Gain experience points (XP) for completing tasks. Level up to increase quest difficulty and potentially unlock features.
* **Filtering & Views:** View tasks by status (All, Pending, Completed, Expired) and see a dashboard overview with stats.
* **State Management:** Uses Zustand for efficient global state management.
* **Persistence:** Tasks and user progress are saved in `localStorage`.
* **Authentication:** Basic user login/logout functionality (details depend on `authStore` implementation).

## Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS (with custom cyberpunk theme colors/effects)
* **State Management:** Zustand
* **Routing:** React Router DOM
* **Icons:** React Icons
* **Unique IDs:** UUID

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18+ or v20+ recommended - Check with `node -v`)
* npm (v8+ recommended - Check with `npm -v`) or Yarn
* Git (for cloning and version control)

### Installation & Running (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder-name>
    ```
    *(Replace `<your-repository-url>` and `<repository-folder-name>`)*

2.  **Install dependencies:**
    ```bash
    npm install
    # or if using yarn:
    # yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or if using yarn:
    # yarn dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173` (or the next available port). Open this URL in your browser.

## Available Scripts

In the project directory, you can run:

* `npm run dev`: Runs the app in development mode with hot reloading.
* `npm run build`: Builds the app for production to the `dist` folder.
* `npm run lint`: Lints the code using Biome and checks TypeScript types.
* `npm run format`: Formats the code using Biome.
* `npm run preview`: Serves the production build locally for preview.

## Project Structure (Example)
```
/
├── public/          # Static assets (e.g., favicon)
├── src/
│   ├── components/  # Reusable React components (Button, Layout, NavBar, TaskCard, TaskForm, Notification etc.)
│   ├── pages/       # Page-level components (DashboardPage, TasksPage, SettingsPage, AuthPage, etc.)
│   ├── store/       # Zustand state management stores (authStore, taskStore, themeStore, notificationStore etc.)
│   ├── types/       # TypeScript type definitions (index.ts)
│   ├── App.tsx      # Main application component, routing setup
│   ├── main.tsx     # Entry point, renders App
│   └── index.css    # Global styles, Tailwind directives
├── .gitignore       # Files/folders ignored by Git
├── biome.json       # Biome formatter/linter configuration
├── index.html       # Main HTML template for Vite
├── package.json     # Project dependencies and scripts
├── postcss.config.js # PostCSS configuration (for Tailwind)
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json    # TypeScript configuration
└── README.md        # This file
```



## Contributing

Contributions are welcome! Please feel free to submit a Pull Request
