# Code2Concept — AI-Powered Algorithm Visualizer

Turn any code into interactive diagrams and step-by-step concept maps using AI.

---

## Project Structure

```
code2concept/
├── backend/          # FastAPI Python backend
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CodeEditor.jsx
    │   │   ├── MermaidDiagram.jsx
    │   │   ├── ResultPanel.jsx
    │   │   └── States.jsx
    │   ├── hooks/
    │   │   └── useAnalyze.js
    │   └── utils/
    │       ├── api.js
    │       └── snippets.js
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## Quick Start

### 1. Get your Anthropic API key
Sign up at [console.anthropic.com](https://console.anthropic.com) and create an API key.

### 2. Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your API key
cp .env.example .env
# Edit .env and replace: ANTHROPIC_API_KEY=your_actual_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Features

- **6 built-in snippets** — Stack, Bubble Sort, Binary Search, BFS, Quicksort, Linked List
- **4 diagram types** — Flowchart, Sequence, State, Class diagrams
- **AI analysis** — Name, description, complexity, steps, use cases
- **Dark mode** — Full dark/light theme toggle
- **CodeMirror editor** — Syntax highlighting for Python and JavaScript
- **Mermaid.js diagrams** — Interactive, rendered diagrams

## API Endpoints

| Method | Path             | Description                    |
|--------|------------------|--------------------------------|
| POST   | `/analyze`       | Analyze code and return JSON   |
| POST   | `/analyze/stream`| Stream response via SSE        |
| GET    | `/health`        | Health check                   |
| GET    | `/snippets`      | List available snippet metadata|

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Tailwind CSS      |
| Editor   | CodeMirror 6                      |
| Diagrams | Mermaid.js 10                     |
| Backend  | FastAPI, Uvicorn, Python 3.11+    |
| AI       | Anthropic Claude (claude-opus-4-5)|

---

## Build for Production

```bash
# Frontend
cd frontend && npm run build

# Serve with backend (copy dist/ to static files or use nginx)
```
