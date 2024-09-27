from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# CORS configuration for all routes and methods
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY"]}})

users = {}

@app.route('/')
def home():
    return jsonify(message="Welcome to the Flask API, Ovidiu")

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email in users:
        return jsonify(message="User already exists"), 400

    users[email] = password
    return jsonify(message="User registered successfully"), 201

if __name__ == "__main__":
    app.run(debug=True)
