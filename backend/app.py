from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

users = {}

@app.route('/')
def home():
    return jsonify(message="Welcome to the Flask API, Ovidiu")

@app.route('/api/register', methods=['POST'])
@cross_origin()
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
