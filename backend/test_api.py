import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.utils.db_seeder import init_db

def run_tests():
    print("==================================================")
    print("Testing SocialOpti FastAPI Backend & Multi-Agent AI")
    print("==================================================")

    init_db()

    with TestClient(app) as client:
        # 1. Health check & Root
        res = client.get("/")
        assert res.status_code == 200, f"Root endpoint failed: {res.text}"
        print("[PASS] 1. Root & Health Check Endpoint")

        # 2. Login with Default Seed User
        login_res = client.post("/api/auth/login", json={
            "email": "umarfaruk@example.com",
            "password": "password123"
        })
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        token_data = login_res.json()
        token = token_data["access_token"]
        assert token, "No token returned"
        print(f"[PASS] 2. Login JWT Token issued: {token[:20]}...")

        headers = {"Authorization": f"Bearer {token}"}

        # 3. Get /api/auth/me
        me_res = client.get("/api/auth/me", headers=headers)
        assert me_res.status_code == 200, f"/me failed: {me_res.text}"
        assert me_res.json()["email"] == "umarfaruk@example.com"
        print("[PASS] 3. /api/auth/me authenticated successfully")

        # 4. Get User Profile
        profile_res = client.get("/api/profile", headers=headers)
        assert profile_res.status_code == 200, f"Profile failed: {profile_res.text}"
        profile_data = profile_res.json()
        assert profile_data["name"] == "Umar Faruk"
        print(f"[PASS] 4. /api/profile returned user: {profile_data['name']}")

        # 5. Get Dashboard Analytics
        dash_res = client.get("/api/analytics/dashboard", headers=headers)
        assert dash_res.status_code == 200, f"Dashboard failed: {dash_res.text}"
        dash_data = dash_res.json()
        assert len(dash_data["summaryCards"]) > 0
        print(f"[PASS] 5. /api/analytics/dashboard returned {len(dash_data['summaryCards'])} summary cards")

        # 6. Test Multi-Agent AI Content Optimization Pipeline
        opt_payload = {
            "caption": "Excited to launch our brand new Multi-Agent AI engine! 🚀 Test our new workflow. Which feature do you like most? 👇",
            "platforms": ["instagram", "linkedin"],
            "hashtags": ["#AIRevolution", "#Innovation"],
            "goal": "engagement",
            "aspect_ratio": "1:1 Square"
        }
        opt_res = client.post("/api/content/optimize", json=opt_payload, headers=headers)
        assert opt_res.status_code == 200, f"Optimization failed: {opt_res.text}"
        opt_data = opt_res.json()
        content_id = opt_data["content"]["id"]
        analysis = opt_data["analysis"]
        recs = opt_data["recommendations"]
        pred = opt_data["prediction"]

        assert analysis["overall_score"] > 0
        assert len(recs["hashtags"]) > 0
        assert pred["total_engagement_score"] > 0
        print(f"[PASS] 6. Multi-Agent AI Pipeline ran successfully! Content ID: {content_id}")
        print(f"       - Content Score: {analysis['overall_score']}% (Emotion: {analysis['emotion_detected']}, Tone: {analysis['tone']})")
        print(f"       - Engagement Prediction: {pred['total_engagement_score']}% (Likes: {pred['expected_engagement']['likes']})")

        # 7. Get Analysis by Content ID
        ana_res = client.get(f"/api/analysis/{content_id}", headers=headers)
        assert ana_res.status_code == 200
        print("[PASS] 7. /api/analysis/{content_id} returned analysis")

        # 8. Get Recommendations by Content ID
        rec_res = client.get(f"/api/recommendations/{content_id}", headers=headers)
        assert rec_res.status_code == 200
        print("[PASS] 8. /api/recommendations/{content_id} returned recommendations")

        # 9. Get Prediction by Content ID
        pred_res = client.get(f"/api/prediction/{content_id}", headers=headers)
        assert pred_res.status_code == 200
        print("[PASS] 9. /api/prediction/{content_id} returned predictions")

        # 10. Get Trends
        trends_res = client.get("/api/trends", headers=headers)
        assert trends_res.status_code == 200
        print(f"[PASS] 10. /api/trends returned {len(trends_res.json()['trends'])} trends")

        # 11. Get Calendar Events
        cal_res = client.get("/api/calendar/events", headers=headers)
        assert cal_res.status_code == 200
        print(f"[PASS] 11. /api/calendar/events returned calendar items")

        # 12. Get History
        hist_res = client.get("/api/history", headers=headers)
        assert hist_res.status_code == 200
        print(f"[PASS] 12. /api/history returned {len(hist_res.json()['items'])} historical posts")

        print("\n==================================================")
        print(" ALL 12 BACKEND & MULTI-AGENT TESTS PASSED SUCCESSFULLY! ")
        print("==================================================")

if __name__ == "__main__":
    run_tests()
