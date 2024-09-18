from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simulated user storage (in-memory, not for production use)
users = {}

@app.route('/')
def home():
    return jsonify(message="Welcome to the Flask API")

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(data={"key": "value"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email in users and users[email] == password:
        return jsonify(message="Login successful")
    else:
        return jsonify(message="Invalid email or password"), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email in users:
        return jsonify(message="User already exists"), 400

    users[email] = password
    return jsonify(message="User registered successfully"), 201

if __name__ == '__main__':
    app.run(debug=True)
