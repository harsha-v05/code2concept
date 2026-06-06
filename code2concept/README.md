# Code2Concept — AI Code Visualizer & Algorithm Diagram Generator

> Paste any code → get instant flowcharts, diagrams & AI-powered explanations.

**Code2Concept** is a free AI-powered tool that converts any code into interactive visual diagrams and step-by-step concept maps. Perfect for developers, students, and educators who want to understand, explain, or document algorithms visually.

🚀 **Live Demo:** [code2concept-eight.vercel.app](https://code2concept-eight.vercel.app)

---

## ✨ Features

- **AI Code Analyzer** — instantly understands any code and explains it
- **Code to Flowchart** — converts logic into clean Mermaid.js flowcharts
- **4 Diagram Types** — Flowchart, Sequence, State, Class diagrams
- **6 Built-in Snippets** — Stack, Bubble Sort, Binary Search, BFS, Quicksort, Linked List
- **Time & Space Complexity** — auto-detected by AI
- **Step-by-step Explanation** — beginner-friendly breakdowns
- **CodeMirror Editor** — syntax highlighting for Python & JavaScript
- **Dark / Light Mode** — full theme toggle
- **Free to use** — no signup required

---

## 🖥️ Live Demo

👉 [https://code2concept-eight.vercel.app](https://code2concept-eight.vercel.app)

---

## 🛠️ Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Tailwind CSS      |
| Editor   | CodeMirror 6                      |
| Diagrams | Mermaid.js 10                     |
| Backend  | FastAPI, Uvicorn, Python 3.11+    |
| AI       | Groq — LLaMA 3.3 70B              |

---

## 📁 Project Structure

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

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/code2concept.git
cd code2concept
```

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
# Edit .env and add: GROQ_API_KEY=your_actual_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Path       | Description                  |
|--------|------------|------------------------------|
| POST   | `/analyze` | Analyze code and return JSON |
| GET    | `/health`  | Health check                 |

---

## 🌐 Deployment

- **Frontend** — Vercel
- **Backend** — Render

```bash
# Build frontend
cd frontend && npm run build
```

---

## 🔍 Use Cases

- Visualize sorting algorithms (bubble sort, quicksort, merge sort)
- Generate flowcharts from any function or script
- Understand unfamiliar code quickly
- Create diagrams for documentation
- Learn data structures visually
- Explain code to non-technical teammates

---

## 📬 Contributing

Pull requests are welcome! Feel free to open an issue for bugs or feature requests.

---

## ⭐ Support

If you find this useful, give it a **star** ⭐ on GitHub — it helps others discover the project!

---

**Keywords:** code visualizer, algorithm visualizer, code analyzer, code to flowchart, AI code explainer, code diagram generator, visualize code online, code to diagram, explain code with AI, free code analyzer