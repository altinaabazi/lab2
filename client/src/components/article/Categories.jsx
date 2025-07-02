import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/article-categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/api/article-categories', { name });
      setName('');
      fetchCategories();
      alert('Kategoria u shtua me sukses!');
    } catch (err) {
      alert('Gabim gjatë shtimit të kategorisë.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Menaxho Kategoritë</h2>

      <form onSubmit={handleAddCategory}>
        <input 
          type="text" 
          placeholder="Emri i kategorisë" 
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: 8, width: '70%', marginRight: 10 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Shto</button>
      </form>

      <ul style={{ marginTop: 20 }}>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
