import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Articles() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8800/api/article-categories');
      setCategories(res.data);
      if (res.data.length > 0) setCategoryId(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/api/articles', {
        title,
        content,
        image,
        categoryId,
      });
      alert('Artikulli u krijua me sukses!');
      setTitle('');
      setContent('');
      setImage('');
      if (categories.length > 0) setCategoryId(categories[0].id);
    } catch (err) {
      alert('Gabim gjatë krijimit të artikullit.');
    }
  };

  return (
    <div style={{
      maxWidth: 700,
      margin: '40px auto',
      padding: 30,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{ marginBottom: 20, fontSize: 24, color: '#333' }}>📝 Create Article</h2>

      <form onSubmit={handleSubmit}>

        {/* Titulli */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Tittle:</label><br />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #ccc'
            }}
          />
        </div>

        {/* Përmbajtja */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Content:</label><br />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            style={{
              width: '100%',
              height: 120,
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #ccc',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Imazhi */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>URL Image (optional):</label><br />
          <input
            type="text"
            value={image}
            onChange={e => setImage(e.target.value)}
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #ccc'
            }}
          />
        </div>

        {/* Kategoria */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Category:</label><br />
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #ccc'
            }}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            fontSize: 16,
            borderRadius: 8,
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add Article
        </button>
      </form>
    </div>
  );
}
