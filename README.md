# **SmartKisan**

**SmartKisan** is an AI-powered Integrated Farm Decision & Risk Support System designed specifically for Indian smallholder farmers. It leverages modern web technologies (React, Node.js, Supabase) and advanced AI models (Google Gemini) to provide actionable, localized advice for crop health, weather forecasting, and market intelligence.

## **Table of Contents**

*   [Overview](#overview)
*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Project Structure](#project-structure)
*   [Environmental Setup](#environmental-setup)
*   [Installation & Run](#installation--run)
*   [API Endpoints](#api-endpoints)

## **Overview**

SmartKisan bridges the information gap for farmers by providing a "digital twin" of their farm. It integrates real-time weather data, AI-driven disease diagnosis, and market price tracking into a single, easy-to-use platform. The system is designed to be mobile-responsive and supports multilingual interactions to ensure accessibility.

## **Features**

### **Core Functionality**

*   **AI-Powered Diagnostics**: Instant crop disease identification using Google's **Gemini 1.5 Flash** vision capabilities. Simply upload a photo of a leaf to get a diagnosis and treatment plan.
*   **Smart Farming Assistant**: A multilingual chatbot powered by **Gemini 1.5 Flash** that answers agricultural queries in the farmer's local language.
*   **Weather Intelligence**: Hyper-local weather forecasts (current, hourly, and daily) powered by the **Open-Meteo API**.
*   **Market Price Discovery**: Real-time tracking of commodity prices across various Mandis (markets) to help farmers decide when and where to sell (currently using mock data for demonstration).

## **Tech Stack**

### **Frontend (Client)**
*   **Framework**: React.js with Vite
*   **Styling**: Tailwind CSS with Shadcn/UI (Radix Primitives) & Lucide Icons
*   **State Management**: React Hooks
*   **Authentication & Database**: Supabase (Auth & PostgreSQL)
*   **HTTP Client**: Fetch API

### **Backend (Server)**
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **AI Integration**: Google Generative AI SDK (@google/generative-ai)
*   **Environment Management**: Dotenv
*   **CORS**: Cross-Origin Resource Sharing enabled

## **Project Structure**

```
Smart_Kissan/
├── server/                     # Backend Application
│   ├── client/                 # Frontend Application (React + Vite)
│   │   ├── public/
│   │   │   ├── vite.svg
│   │   │   └── _redirects
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   └── react.svg
│   │   │   ├── components/     # Reusable Components
│   │   │   │   ├── ui/         # Shadcn UI Components
│   │   │   │   │   ├── alert.jsx
│   │   │   │   │   ├── avatar.jsx
│   │   │   │   │   ├── badge.jsx
│   │   │   │   │   ├── button.jsx
│   │   │   │   │   ├── card.jsx
│   │   │   │   │   ├── dialog.jsx
│   │   │   │   │   ├── input.jsx
│   │   │   │   │   ├── label.jsx
│   │   │   │   │   ├── progress.jsx
│   │   │   │   │   ├── scroll-area.jsx
│   │   │   │   │   ├── separator.jsx
│   │   │   │   │   └── tabs.jsx
│   │   │   │   ├── GlobalVoiceAssistant.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── contexts/       # React Context Providers
│   │   │   │   ├── AuthContext.jsx
│   │   │   │   ├── LanguageContext.jsx
│   │   │   │   └── ThemeContext.jsx
│   │   │   ├── lib/            # Utilities & Config
│   │   │   │   ├── api.js
│   │   │   │   ├── config.js
│   │   │   │   ├── smart_answers.js
│   │   │   │   ├── supabase.js
│   │   │   │   ├── translations.js
│   │   │   │   ├── utils.js
│   │   │   │   └── weather.js
│   │   │   ├── pages/          # Application Pages
│   │   │   │   ├── Auth.jsx
│   │   │   │   ├── CropHealth.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ExpertChat.jsx
│   │   │   │   ├── Market.jsx
│   │   │   │   ├── Marketplace.jsx
│   │   │   │   ├── NotFound.jsx
│   │   │   │   ├── Plots.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Schemes.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── Weather.jsx
│   │   │   ├── App.jsx
│   │   │   ├── App.css
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   └── eslint.config.js
│   ├── routes/                 # Express API Routes
│   │   ├── ai.js
│   │   ├── market.js
│   │   └── weather.js
│   ├── .env                    # Backend Environment Variables
│   ├── index.js                # Server Entry Point
│   ├── package.json
│   ├── supabase_schema.sql     # Database Schema
│   └── vercel.json
└── README.md
```

## **Environmental Setup**

You need to set up environment variables for both the backend and frontend.

### **1. Backend (`server/.env`)**
Create a `.env` file in the `server` directory:

```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
```
*   Get your Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### **2. Frontend (`server/client/.env`)**
Create a `.env` file in the `server/client` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*   Get your Supabase credentials from your [Supabase Project Settings](https://supabase.com/).

## **Installation & Run**

### **Prerequisites**
*   Node.js (v18+)
*   npm (Node Package Manager)

### **1. Backend Setup**
Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Start the backend server:

```bash
# Development mode (with nodemon)
npm run dev

# OR Production start
npm start
```
The server will start on `http://localhost:5000`.

### **2. Frontend Setup**
Open a new terminal, navigate to the `server/client` directory, and install dependencies:

```bash
cd server/client
npm install
```

Start the frontend development server:

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173` (or the port shown in your terminal).

## **API Endpoints**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/weather` | Fetch current, hourly, and daily weather. Query params: `lat`, `lon`, or `location`. |
| **POST** | `/api/ai/chat` | Send a message to the AI assistant. Body: `{ "message": "..." }` |
| **POST** | `/api/ai/crop-health` | Upload an image for disease diagnosis. Body: Raw image binary data. |
| **GET** | `/api/market` | Get market prices. Query params: `state`, `commodity`, `search`. |

---
**Note**: Ensure both the backend and frontend servers are running simultaneously for the application to function correctly.