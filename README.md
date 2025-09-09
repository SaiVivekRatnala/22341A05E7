# 22341A05E7 - URL Shortener (Frontend Submission)
  - Optional custom shortcode

- **Statistics Page (`/stats`)**  
  Displays all shortened URLs with:
  - Creation & expiry times
  - Total number of clicks
  - Detailed click logs (timestamp, source, coarse location)

- **Redirect Handler (`/:shortcode`)**  
  Handles client-side redirection. When a user visits a short URL, it:
  - Logs the click event
  - Redirects to the original long URL

- **Logs Page (`/logs`)**  
  Shows structured events captured by the Logging Middleware, including:
  - App start events
  - Short URL creation
  - Redirect clicks
  - Theme toggles and errors

---

### 2. Storage
- **localStorage** is used to persist:
  - URL mappings
  - Click data
  - Application logs

This ensures the app runs entirely in the browser without needing a backend.

---

### 3. Logging Middleware
A custom logging module records important events in a structured JSON format.  
Each log entry includes:
- Event name (e.g., `shorten.created`, `url.clicked`)
- Timestamp
- Metadata (e.g., shortcode, URL, theme mode)

Logs can be exported/imported for review.

---

### 4. User Interface
- **Material UI** is used for styling components such as forms, buttons, tables, and app bars.
- The app supports **Light/Dark theme toggling**.
- The design focuses on being simple, uncluttered, and easy to navigate.

--- url-shortener/
├── Frontend-Test-Submission/ # React app
│ ├── public/ # Static assets
│ ├── src/ # Source code
│ │ ├── components/ # Reusable UI
│ │ ├── logging/ # Middleware
│ │ ├── pages/ # App pages
│ │ ├── storage/ # localStorage helpers
│ │ ├── theme/ # Material UI theme
│ │ └── utils/ # Utility functions
│ ├── package.json
│ └── README.md
├── Logging-Middleware/ # Standalone logger
│ └── LoggingMiddleware.js
├── screenshots/ # Screenshots
└── README.md 
## Screenshots

### Shortener Page (Desktop)
![Shortener Page Desktop](./Screenshot%202025-09-09%20121027.png)

### Statistics Page
![Statistics Page](./Screenshot%202025-09-09%20121036.png)

### Logs Page
![Logs Page](./Screenshot%202025-09-09%20121047.png)

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/SaiVivekRatnala/22341A05E7.git
   cd 22341A05E7/Frontend-Test-Submission
2.Install dependencies:
   ```bash
    npm install
3.Start the development server:

npm start


Open your browser at:

http://localhost:3000

