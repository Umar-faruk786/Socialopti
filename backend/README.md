# SocialOpti Backend — Intelligent Multi-Agent AI Framework

**Final Year Project**: Intelligent Multi-Agent AI Framework for Social Media Content Optimization and Engagement Prediction

## Technology Stack
- **Framework**: Python FastAPI
- **Database**: PostgreSQL (with SQLite zero-config local development support)
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **API Documentation**: OpenAPI / Swagger UI at `/docs`

---

## Backend Architecture

```
backend/
├── app/
│   ├── main.py                  # App entry point, CORS, lifespan startup
│   ├── config.py                # Environment configuration & settings
│   ├── database.py              # SQLAlchemy database session & engine
│   ├── models/                  # SQLAlchemy ORM database models
│   ├── schemas/                 # Pydantic validation schemas
│   ├── routes/                  # API routers (/auth, /profile, /content, /analysis, etc.)
│   ├── services/                # Business logic & authentication services
│   ├── agents/                  # Multi-Agent AI Framework
│   │   ├── base_agent.py        # Abstract BaseAgent interface
│   │   ├── coordinator.py       # MultiAgentCoordinator
│   │   ├── trend_agent.py       # Trend Analysis Agent
│   │   ├── content_agent.py     # Content Analysis Agent
│   │   ├── planning_agent.py    # Content Planning Agent
│   │   ├── prediction_agent.py  # Engagement Prediction Agent
│   │   ├── recommendation_agent.py # Recommendation Agent
│   │   └── analytics_agent.py   # Analytics Agent
│   ├── middleware/              # Exception handling middleware
│   └── utils/                   # Security, file storage, and DB seeder
├── uploads/                     # Uploaded media storage
├── requirements.txt
├── .env.example
└── .env
```

---

## 6-Agent AI Architecture

1. **Trend Analysis Agent (`trend_agent.py`)**: Analyzes trending social topics, hashtags, and viral velocity index.
2. **Content Analysis Agent (`content_agent.py`)**: Computes image quality, NLP caption readability, grammar score, emotion, and tone detection.
3. **Content Planning Agent (`planning_agent.py`)**: Generates optimized caption hooks, hashtag clusters, and calendar posting schedule.
4. **Engagement Prediction Agent (`prediction_agent.py`)**: Predicts expected likes, comments, shares, reach, virality probability, and platform breakdown.
5. **Recommendation Agent (`recommendation_agent.py`)**: Synthesizes multi-agent outputs into actionable recommendations and audience targeting.
6. **Analytics Agent (`analytics_agent.py`)**: Analyzes historical metrics and outputs dynamic AI insight cards.

---

## Running the Backend

1. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. Start the FastAPI development server:
   ```bash
   cd backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

3. Open Swagger UI in your browser:
   👉 **http://127.0.0.1:8000/docs**

---

## Default Seed Account
- **Email**: `umarfaruk@example.com`
- **Password**: `password123`
