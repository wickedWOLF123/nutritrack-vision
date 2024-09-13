from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allows React frontend to communicate with Flask backend

# API endpoint to handle image upload and classification
@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files['image']

    # Save the image temporarily
    image_path = os.path.join('uploads', image.filename)
    image.save(image_path)
    
    # TODO: Call the food detection API here with the image file
    # Example placeholder:
    result = {
        "food_item": "Pizza",
        "calories": 285,
        "carbs": 36,
        "protein": 12
    }
    
    return jsonify(result), 200

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)  # Create uploads folder if not exists
    app.run(debug=True)
