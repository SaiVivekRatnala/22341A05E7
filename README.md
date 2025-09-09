# 22341A05E7 - URL Shortener (Frontend Submission)

## Project Overview
This project implements a client-side URL Shortener named **TinyLink** using React and Material UI.  
The application allows users to create short links, redirect through them, and view analytics such as the number of clicks, timestamps, and source details.  
All data is managed on the client side using `localStorage`, and a custom Logging Middleware is integrated to capture application events.

---

## Architecture

The application is organized into the following key parts:

### 1. Pages
- **Shortener Page (`/`)**  
  Users can shorten up to 5 URLs at a time. Each entry allows:
  - Original long URL
  - Optional validity (in minutes, defaults to 30 minutes)
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

---

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

