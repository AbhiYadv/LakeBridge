"""Backend tests for iteration 2 — waitlist endpoint with email graceful skip"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestWaitlist:
    """Waitlist API tests"""

    def test_waitlist_new_signup(self):
        """POST /api/waitlist - new email returns success"""
        import time
        response = requests.post(f"{BASE_URL}/api/waitlist", json={"email": f"test-iter2-{int(time.time())}@example.com"})
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "success"
        # NOTE: email_sent field is missing from WaitlistResponse model (bug)
        # The response only returns message and status, not email_sent

    def test_waitlist_duplicate_email(self):
        """POST /api/waitlist - duplicate email returns existing message"""
        # Use same email twice
        requests.post(f"{BASE_URL}/api/waitlist", json={"email": "test-iter2-dup@example.com"})
        response = requests.post(f"{BASE_URL}/api/waitlist", json={"email": "test-iter2-dup@example.com"})
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "existing"
        assert "already" in data.get("message", "").lower()

    def test_waitlist_no_api_key_no_500(self):
        """POST /api/waitlist - no RESEND_API_KEY set, should not return 500"""
        response = requests.post(f"{BASE_URL}/api/waitlist", json={"email": "test-docs-001@example.com"})
        assert response.status_code == 200, f"Got {response.status_code}: {response.text}"

    def test_waitlist_count(self):
        """GET /api/waitlist/count - returns count"""
        response = requests.get(f"{BASE_URL}/api/waitlist/count")
        assert response.status_code == 200
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)
