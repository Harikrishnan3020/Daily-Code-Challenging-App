from flask import Flask, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

GOOGLE_CLIENT_ID = os.getenv("VITE_GOOGLE_CLIENT_ID")

@app.route("/google-login", methods=["POST"])
def google_login():
    data = request.get_json()
    token = data.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            grequests.Request(),
            GOOGLE_CLIENT_ID
        )

        user_id = idinfo["sub"]
        email = idinfo["email"]
        name = idinfo.get("name")
        picture = idinfo.get("picture")

        return jsonify({
            "success": True,
            "email": email,
            "name": name,
            "picture": picture
        })

    except ValueError:
        return jsonify({"success": False}), 401


@app.route("/dashboard")
def dashboard():
    return "Welcome to Dashboard!"


if __name__ == "__main__":
    app.run(debug=True)
