// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function CategoriesManager() {
//   const [categories, setCategories] = useState([]);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Merr kategoritë nga backend
//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get('http://localhost:8800/api/article-categories');
//       setCategories(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Gabim gjatë marrjes së kategorive:', err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Shto kategori të re
//   const addCategory = async (e) => {
//     e.preventDefault();
//     if (!newCategoryName.trim()) return;

//     try {
//       await axios.post('http://localhost:8800/api/article-categories', { name: newCategoryName });
//       setNewCategoryName('');
//       fetchCategories();
//       alert('Kategoria u shtua me sukses!');
//     } catch (err) {
//       alert('Gabim gjatë shtimit të kategorisë.');
//       console.error(err.response?.data || err.message);
//     }
//   };

//   // Fshi kategori
//   const deleteCategory = async (id) => {
//     if (!window.confirm('A je i sigurt që dëshiron të fshish këtë kategori?')) return;

//     try {
//       await axios.delete(`http://localhost:8800/api/article-categories/${id}`);
//       alert('Kategoria u fshi me sukses!');
//       fetchCategories();
//     } catch (err) {
//       alert('Gabim gjatë fshirjes së kategorisë.');
//       console.error(err.response?.data || err.message);
//     }
//   };

//   if (loading) return <p>Loading categories...</p>;

//   return (
//     <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
//       <h2>Menaxho Kategoritë</h2>

//       <form onSubmit={addCategory} style={{ marginBottom: 20 }}>
//         <input
//           type="text"
//           placeholder="Emri i kategorisë"
//           value={newCategoryName}
//           onChange={e => setNewCategoryName(e.target.value)}
//           required
//           style={{ padding: 8, width: '70%', marginRight: 10 }}
//         />
//         <button type="submit" style={{ padding: '8px 16px' }}>Shto</button>
//       </form>

//       {categories.length === 0 ? (
//         <p>Nuk ka kategori për të shfaqur.</p>
//       ) : (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {categories.map(cat => (
//             <li key={cat.id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <span>{cat.name}</span>
//               <button onClick={() => deleteCategory(cat.id)} style={{ color: 'red' }}>Fshi</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Merr kategoritë nga backend
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/article-categories"
      );
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gabim gjatë marrjes së kategorive:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Shto kategori të re
  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await axios.post("http://localhost:8800/api/article-categories", {
        name: newCategoryName,
      });
      setNewCategoryName("");
      fetchCategories();
      alert("Kategoria u shtua me sukses!");
    } catch (err) {
      alert("Gabim gjatë shtimit të kategorisë.");
      console.error(err.response?.data || err.message);
    }
  };

  // Fshi kategori
  const deleteCategory = async (id) => {
    if (!window.confirm("A je i sigurt që dëshiron të fshish këtë kategori?"))
      return;

    try {
      await axios.delete(`http://localhost:8800/api/article-categories/${id}`);
      alert("Kategoria u fshi me sukses!");
      fetchCategories();
    } catch (err) {
      alert("Gabim gjatë fshirjes së kategorisë.");
      console.error(err.response?.data || err.message);
    }
  };

  // Nis editimin e një kategorie
  const startEdit = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  // Anulo editimin
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  // Ruaj ndryshimet e editimit
  const saveEdit = async () => {
    if (!editName.trim())
      return alert("Emri i kategorisë nuk mund të jetë bosh.");

    try {
      await axios.put(
        `http://localhost:8800/api/article-categories/${editId}`,
        { name: editName }
      );
      alert("Kategoria u përditësua me sukses!");
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      alert("Gabim gjatë përditësimit të kategorisë.");
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Category</h2>

      <form
        onSubmit={addCategory}
        style={{
          marginBottom: 30,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Emri i kategorisë"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          required
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>

      {categories.length === 0 ? (
        <p>Nuk ka kategori për të shfaqur.</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 16,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              {editId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      flexGrow: 1,
                      padding: 8,
                      fontSize: 16,
                      marginRight: 10,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    onClick={saveEdit}
                    style={{
                      marginRight: 8,
                      padding: "8px 12px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Ruaj
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 18, fontWeight: 500 }}>
                    {cat.name}
                  </span>
                  <div>
                    <button
                      onClick={() => startEdit(cat.id, cat.name)}
                      style={{
                        marginRight: 10,
                        padding: "6px 12px",
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#d32f2f",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
