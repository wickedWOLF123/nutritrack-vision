import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
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
      const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
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

      {results.length > 0 && (
        <div>
          <h2>Results:</h2>
          {results.map((item, index) => (
            <div key={index}>
              <h3>{item.name}</h3>
              <p>Calories: {item.calories}</p>
              <p>Ingredients: {item.ingredients.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
