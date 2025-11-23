import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_refresh():
    email = "debug_user_3@example.com"
    password = "password123"

    # Login to get tokens
    print(f"Logging in {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        data = resp.json()
        refresh_token = data.get("refresh_token")
        access_token = data.get("access_token")
        print(f"Login successful. Got refresh token: {refresh_token[:10]}...")
    except Exception as e:
        print(f"Login failed: {e}")
        return

    # Refresh token
    print("Refreshing token...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/refresh", params={
            "refresh_token": refresh_token
        })
        if resp.status_code == 200:
            new_data = resp.json()
            new_access_token = new_data.get("access_token")
            print(f"Refresh successful. New access token: {new_access_token[:10]}...")
            if new_access_token != access_token:
                print("Success: Access token changed.")
            else:
                print("Warning: Access token is same (might be expected if immediate refresh).")
        else:
            print(f"Refresh failed: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Refresh failed: {e}")

if __name__ == "__main__":
    test_refresh()
