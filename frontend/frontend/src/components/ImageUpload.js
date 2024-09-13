import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      // TODO: Replace this with the actual API call when API details are provided
      const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      setError('');
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h1>Food Classifier</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit}>Upload</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
          <h2>Results:</h2>
          <p>Food Item: {result.food_item}</p>
          <p>Calories: {result.calories}</p>
          <p>Carbs: {result.carbs}g</p>
          <p>Protein: {result.protein}g</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
