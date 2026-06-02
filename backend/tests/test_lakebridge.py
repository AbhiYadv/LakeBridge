import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """Health check endpoint"""
    
    def test_root_health(self):
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "LakeBridge" in data["message"]

class TestWaitlist:
    """Waitlist CRUD tests"""
    
    TEST_EMAIL = "TEST_lakebridge_pytest@example.com"
    
    def test_post_valid_email(self):
        # Cleanup first
        response = requests.post(f"{BASE_URL}/api/waitlist", json={"email": self.TEST_EMAIL})
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["status"] in ["success", "existing"]
    
    def test_post_duplicate_email(self):
        # First signup
        requests.post(f"{BASE_URL}/api/waitlist", json={"email": self.TEST_EMAIL})
        # Second signup with same email
        response = requests.post(f"{BASE_URL}/api/waitlist", json={"email": self.TEST_EMAIL})
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "existing"
        assert "already" in data["message"].lower()
    
    def test_post_invalid_email(self):
        response = requests.post(f"{BASE_URL}/api/waitlist", json={"email": "not-an-email"})
        assert response.status_code == 422
    
    def test_get_waitlist_count(self):
        response = requests.get(f"{BASE_URL}/api/waitlist/count")
        assert response.status_code == 200
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)
