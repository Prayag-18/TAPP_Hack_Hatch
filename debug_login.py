import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_register_and_login():
    email = "debug_user_3@example.com"
    password = "password123"
    role = "CREATOR"

    # Register
    print(f"Registering {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": password,
            "role": role
        })
        print(f"Register status: {resp.status_code}")
        print(f"Register response: {resp.text}")
    except Exception as e:
        print(f"Register failed: {e}")

    # Login
    print(f"Logging in {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        print(f"Login status: {resp.status_code}")
        print(f"Login response: {resp.text}")
    except Exception as e:
        print(f"Login failed: {e}")

if __name__ == "__main__":
    test_register_and_login()
