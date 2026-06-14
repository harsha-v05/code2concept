from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from groq import Groq
import json, os, re, sqlite3
from typing import Optional
from dotenv import load_dotenv
from database import init_db, get_db
from auth import hash_password, verify_password, create_token, get_current_user, get_optional_user

load_dotenv()
init_db()

app = FastAPI(title="Code2Concept API", version="2.0.0")
app.add_middleware(CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://code2concept-eight.vercel.app",
        os.environ.get("FRONTEND_URL", ""),
    ],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

# ─── Models ───────────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    code: str
    viz_mode: str = "flowchart"

class CompareRequest(BaseModel):
    code1: str
    lang1: str = "unknown"
    code2: str
    lang2: str = "unknown"

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ForgotRequest(BaseModel):
    email: str

class HistoryRequest(BaseModel):
    code: str
    viz_mode: str
    result: str


# ─── Auth Routes ──────────────────────────────────────────────────
@app.post("/auth/signup")
async def signup(req: SignupRequest):
    db = get_db()
    try:
        existing = db.execute("SELECT id FROM users WHERE email=?", (req.email,)).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered. Please sign in.")
        if len(req.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
        hashed = hash_password(req.password)
        cur = db.execute("INSERT INTO users (name, email, password_hash) VALUES (?,?,?)",
            (req.name.strip(), req.email.lower().strip(), hashed))
        db.commit()
        user_id = cur.lastrowid
        user = {"id": user_id, "name": req.name, "email": req.email, "created_at": "now"}
        token = create_token(user_id, req.email)
        return {"user": user, "token": token}
    finally:
        db.close()

@app.post("/auth/login")
async def login(req: LoginRequest):
    db = get_db()
    try:
        user = db.execute("SELECT * FROM users WHERE email=?", (req.email.lower().strip(),)).fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="No account found with this email.")
        if not user["password_hash"]:
            raise HTTPException(status_code=401, detail="This account uses Google login.")
        if not verify_password(req.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Incorrect password.")
        token = create_token(user["id"], user["email"])
        return {"user": dict(user), "token": token}
    finally:
        db.close()

@app.post("/auth/forgot-password")
async def forgot_password(req: ForgotRequest):
    return {"message": "If this email exists, a reset link has been sent."}

@app.get("/auth/me")
async def me(current_user=Depends(get_current_user)):
    db = get_db()
    try:
        user = db.execute("SELECT id,name,email,avatar,created_at FROM users WHERE id=?",
            (current_user["user_id"],)).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return dict(user)
    finally:
        db.close()


# ─── History Routes ────────────────────────────────────────────────
@app.post("/history")
async def save_history(req: HistoryRequest, current_user=Depends(get_current_user)):
    db = get_db()
    try:
        db.execute("INSERT INTO history (user_id, code, viz_mode, result) VALUES (?,?,?,?)",
            (current_user["user_id"], req.code, req.viz_mode, req.result))
        db.commit()
        return {"success": True}
    finally:
        db.close()

@app.get("/history")
async def get_history(current_user=Depends(get_current_user)):
    db = get_db()
    try:
        rows = db.execute("SELECT * FROM history WHERE user_id=? ORDER BY created_at DESC LIMIT 50",
            (current_user["user_id"],)).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()

@app.delete("/history/{item_id}")
async def delete_history(item_id: int, current_user=Depends(get_current_user)):
    db = get_db()
    try:
        db.execute("DELETE FROM history WHERE id=? AND user_id=?", (item_id, current_user["user_id"]))
        db.commit()
        return {"success": True}
    finally:
        db.close()


# ─── Analyze Route ─────────────────────────────────────────────────
def fix_mermaid(code: str, viz_mode: str) -> str:
    if not code: return code
    lines = code.strip().splitlines()
    fixed = []
    for line in lines:
        if viz_mode in ("flowchart", "graph"):
            line = re.sub(r"->+>", "-->", line)
            line = re.sub(r"=>>|=>", "-->", line)
        line = line.replace("`", "")
        fixed.append(line)
    result = "\n".join(fixed)
    first = fixed[0].strip().lower() if fixed else ""
    if viz_mode == "flowchart" and not first.startswith(("flowchart","graph")):
        result = "flowchart TD\n" + result
    elif viz_mode == "sequence" and not first.startswith("sequencediagram"):
        result = "sequenceDiagram\n" + result
    elif viz_mode == "stateDiagram" and not first.startswith("statediagram"):
        result = "stateDiagram-v2\n" + result
    elif viz_mode == "classDiagram" and not first.startswith("classdiagram"):
        result = "classDiagram\n" + result
    return result

SYSTEM_PROMPT = """You are a friendly computer science educator. Explain code clearly, mixing simple language with technical terms.
Each step: 2-3 sentences. First = plain English (what happens). Second = technical (how/why).
Always respond with valid JSON only — no markdown fences, no extra text."""

def build_prompt(code, viz_mode):
    examples = {
        "flowchart": "flowchart TD\n  A[Start] --> B[Process]\n  B --> C{Decision}\n  C -->|Yes| D[End]\n  C -->|No| B",
        "sequence": "sequenceDiagram\n  participant A\n  participant B\n  A->>B: Message\n  B-->>A: Reply",
        "stateDiagram": "stateDiagram-v2\n  [*] --> State1\n  State1 --> State2\n  State2 --> [*]",
        "classDiagram": "classDiagram\n  class Animal{\n    +String name\n    +makeSound()\n  }",
    }
    return f"""Analyze this code and respond ONLY with this JSON:
{{
  "name": "Algorithm name",
  "language": "detected language",
  "description": "2-3 sentence explanation",
  "time_complexity": "O(...)",
  "space_complexity": "O(...)",
  "key_concepts": ["concept1","concept2","concept3"],
  "steps": [{{"title":"Step","desc":"2-3 sentence friendly+technical explanation","code_ref":"line/function"}}],
  "mermaid": "valid {viz_mode} diagram string",
  "use_cases": ["use case"],
  "tips": "friendly tip"
}}
MERMAID RULES: Only use --> arrows in flowcharts. Keep labels under 4 words. No special chars. No backticks.
Example: {examples.get(viz_mode,examples['flowchart'])}
Code: ```{code}```"""

@app.post("/analyze")
async def analyze_code(req: AnalyzeRequest):
    if not req.code.strip(): raise HTTPException(400, "Code cannot be empty")
    if len(req.code) > 10000: raise HTTPException(400, "Code too long")
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role":"system","content":SYSTEM_PROMPT},{"role":"user","content":build_prompt(req.code,req.viz_mode)}],
            temperature=0.2, max_tokens=2000)
        raw = completion.choices[0].message.content.strip()
        try: parsed = json.loads(raw)
        except:
            clean = re.sub(r"```json|```","",raw).strip()
            try: parsed = json.loads(clean)
            except:
                m = re.search(r'\{[\s\S]*\}', clean)
                if m: parsed = json.loads(m.group(0))
                else: raise HTTPException(500, "AI returned invalid JSON")
        if parsed.get("mermaid"): parsed["mermaid"] = fix_mermaid(parsed["mermaid"], req.viz_mode)
        return {"success": True, "data": parsed, "raw": raw}
    except HTTPException: raise
    except Exception as e:
        msg = str(e)
        if "auth" in msg.lower() or "api key" in msg.lower(): raise HTTPException(401, "Invalid Groq API key")
        if "rate" in msg.lower(): raise HTTPException(429, "Rate limit hit. Wait a moment.")
        raise HTTPException(500, f"Error: {msg}")


# ─── Compare Route ─────────────────────────────────────────────────
COMPARE_SYSTEM_PROMPT = """You are a senior software engineer doing a rigorous code review.
Compare two code snippets objectively. Be specific — mention actual algorithmic differences.
Always respond with valid JSON only — no markdown fences, no extra text."""

def build_compare_prompt(code1, lang1, code2, lang2):
    return f"""Compare these two code snippets and respond ONLY with this exact JSON:
{{
  "code1_analysis": {{
    "language": "{lang1}",
    "time_complexity": "O(...)",
    "space_complexity": "O(...)",
    "readability_score": <integer 1-10>,
    "maintainability_score": <integer 1-10>,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "bugs": [],
    "use_cases": ["use case 1", "use case 2"]
  }},
  "code2_analysis": {{
    "language": "{lang2}",
    "time_complexity": "O(...)",
    "space_complexity": "O(...)",
    "readability_score": <integer 1-10>,
    "maintainability_score": <integer 1-10>,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "bugs": [],
    "use_cases": ["use case 1", "use case 2"]
  }},
  "verdict": {{
    "winner": "A" or "B" or "tie",
    "reasoning": "2-3 sentences citing specific differences",
    "tradeoffs": "What you give up choosing the winner",
    "recommendation": "One sentence on when to use the winner"
  }}
}}

RULES:
- winner must be exactly "A", "B", or "tie"
- readability_score and maintainability_score must be integers 1-10
- bugs list should be empty [] if no bugs found

Code A ({lang1}):
```
{code1}
```

Code B ({lang2}):
```
{code2}
```"""

@app.post("/compare")
async def compare_code(req: CompareRequest):
    if not req.code1.strip() or not req.code2.strip():
        raise HTTPException(400, "Both code snippets are required")
    if len(req.code1) > 10000 or len(req.code2) > 10000:
        raise HTTPException(400, "Code too long (max 10,000 chars each)")
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": COMPARE_SYSTEM_PROMPT},
                {"role": "user", "content": build_compare_prompt(
                    req.code1, req.lang1, req.code2, req.lang2
                )},
            ],
            temperature=0.2,
            max_tokens=2000,
        )
        raw = completion.choices[0].message.content.strip()
        try:
            parsed = json.loads(raw)
        except Exception:
            clean = re.sub(r"```json|```", "", raw).strip()
            try:
                parsed = json.loads(clean)
            except Exception:
                m = re.search(r'\{[\s\S]*\}', clean)
                if m:
                    parsed = json.loads(m.group(0))
                else:
                    raise HTTPException(500, "AI returned invalid JSON")

        winner = parsed.get("verdict", {}).get("winner", "").strip().upper()
        if winner not in ("A", "B", "TIE"):
            winner = "TIE"
        if "verdict" in parsed:
            parsed["verdict"]["winner"] = "tie" if winner == "TIE" else winner

        return {"success": True, "data": parsed, "raw": raw}
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        if "auth" in msg.lower() or "api key" in msg.lower():
            raise HTTPException(401, "Invalid Groq API key")
        if "rate" in msg.lower():
            raise HTTPException(429, "Rate limit hit. Wait a moment.")
        raise HTTPException(500, f"Error: {msg}")


# ─── Health ────────────────────────────────────────────────────────
@app.get("/health")
async def health(): return {"status":"ok","provider":"Groq","model":"llama-3.3-70b-versatile","version":"2.0"}


# ─── Google OAuth ─────────────────────────────────────────────────
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://127.0.0.1:8000/auth/google/callback")

@app.get("/auth/google/login")
async def google_login():
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(400, "Google OAuth not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file.")
    params = f"client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile"
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")

@app.get("/auth/google/callback")
async def google_callback(code: str):
    import httpx
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(400, "Google OAuth not configured.")
    async with httpx.AsyncClient() as client:
        token_res = await client.post("https://oauth2.googleapis.com/token", data={
            "code": code, "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI, "grant_type": "authorization_code"
        })
        tokens = token_res.json()
        user_res = await client.get("https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"})
        guser = user_res.json()

    db = get_db()
    try:
        existing = db.execute("SELECT * FROM users WHERE email=?", (guser["email"],)).fetchone()
        if existing:
            user_id = existing["id"]
            db.execute("UPDATE users SET google_id=?, avatar=? WHERE id=?", (guser["id"], guser.get("picture",""), user_id))
        else:
            cur = db.execute("INSERT INTO users (name, email, google_id, avatar) VALUES (?,?,?,?)",
                (guser["name"], guser["email"], guser["id"], guser.get("picture","")))
            user_id = cur.lastrowid
        db.commit()
        token = create_token(user_id, guser["email"])
        frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(f"{frontend_url}?token={token}&name={guser['name']}")
    finally:
        db.close()


# ─── Code Execution ────────────────────────────────────────────────
import subprocess, tempfile, sys

class ExecuteRequest(BaseModel):
    code: str
    language: str = "python"

LANG_CONFIG = {
    "python":     {"ext": "py",  "cmd": [sys.executable]},
    "javascript": {"ext": "js",  "cmd": ["node"]},
    "php":        {"ext": "php", "cmd": ["php"]},
    "ruby":       {"ext": "rb",  "cmd": ["ruby"]},
    "lua":        {"ext": "lua", "cmd": ["lua"]},
    "r":          {"ext": "r",   "cmd": ["Rscript"]},
    "go":         {"ext": "go",  "cmd": ["go", "run"]},
    "typescript": {"ext": "ts",  "cmd": ["npx", "ts-node"]},
}

UNSUPPORTED = ["java","c++","cpp","c","rust","swift","kotlin","csharp","c#"]

@app.post("/execute")
async def execute_code(req: ExecuteRequest):
    if not req.code.strip():
        raise HTTPException(400, "Code cannot be empty")
    if len(req.code) > 10000:
        raise HTTPException(400, "Code too long")

    lang = req.language.lower().strip()

    if lang in UNSUPPORTED:
        return {
            "success": False,
            "output": "",
            "error": f"{req.language} requires a compiler. Supported: Python, JavaScript, PHP, Ruby, Go, Lua."
        }

    config = LANG_CONFIG.get(lang, LANG_CONFIG["python"])

    try:
        with tempfile.NamedTemporaryFile(
            mode='w', suffix='.' + config["ext"],
            delete=False, encoding='utf-8'
        ) as f:
            f.write(req.code)
            tmp_path = f.name

        result = subprocess.run(
            config["cmd"] + [tmp_path],
            capture_output=True, text=True, timeout=10
        )

        try: os.unlink(tmp_path)
        except: pass

        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr,
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(408, "Execution timed out (10s limit)")
    except FileNotFoundError as e:
        return {"success": False, "output": "", "error": f"Runtime not installed: {str(e)}"}
    except Exception as e:
        raise HTTPException(500, f"Execution error: {str(e)}")
