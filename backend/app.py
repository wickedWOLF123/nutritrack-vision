from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # Allows React frontend to communicate with Flask backend

API_KEY = 'CqR3erOI.2SJSZh11NH9xiZj3igVpU5VjFS4qLbeo'
FOOD_DETECTION_URL = "https://vision.foodvisor.io/api/1.0/en/analysis/"

# API endpoint to handle image upload and classification
@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files['image']

    # Save the image temporarily
    image_path = os.path.join('uploads', image.filename)
    image.save(image_path)
    
    headers = {"Authorization": f"Api-Key {API_KEY}"}
    try:
        with open(image_path, "rb") as img:
            response = requests.post(FOOD_DETECTION_URL, headers=headers, files={"image": img})
            response.raise_for_status()
            data = response.json()
            
            # Extract relevant information
            items = data.get('items', [])
            result = []
            for item in items:
                food_item = item.get('food', [])[0]  # Get the top food item
                food_info = food_item.get('food_info', {})
                result.append({
                    "name": food_info.get('display_name', 'Unknown'),
                    "calories": food_info.get('nutrition', {}).get('calories_100g', 0),
                    "ingredients": [ingredient['food_info']['display_name'] for ingredient in food_item.get('ingredients', [])]
                })
            
            return jsonify(result), 200
    
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)  # Create uploads folder if not exists
    app.run(debug=True)
