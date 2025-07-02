// // // // import React, { useEffect, useState } from 'react';
// // // // import axios from 'axios';

// // // // export default function ArticlesList() {
// // // //   const [articles, setArticles] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [editId, setEditId] = useState(null);
// // // //   const [formData, setFormData] = useState({
// // // //     title: '',
// // // //     content: '',
// // // //     image: '',
// // // //     categoryId: '',
// // // //   });
// // // //   const [categories, setCategories] = useState([]);

// // // //   const fetchArticles = async () => {
// // // //     try {
// // // //       const res = await axios.get('http://localhost:8800/api/articles');
// // // //       setArticles(res.data);
// // // //       setLoading(false);
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const fetchCategories = async () => {
// // // //     try {
// // // //       const res = await axios.get('http://localhost:8800/api/article-categories');
// // // //       setCategories(res.data);
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchArticles();
// // // //     fetchCategories();
// // // //   }, []);

// // // //   const startEdit = (article) => {
// // // //     setEditId(article.id);
// // // //     setFormData({
// // // //       title: article.title,
// // // //       content: article.content,
// // // //       image: article.image || '',
// // // //       categoryId: article.category?.id || '',
// // // //     });
// // // //   };

// // // //   const handleChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setFormData(prev => ({ ...prev, [name]: value }));
// // // //   };

// // // //   const saveEdit = async () => {
// // // //     try {
// // // //       await axios.put(`http://localhost:8800/api/articles/${editId}`, formData);
// // // //       alert('Artikulli u përditësua me sukses!');
// // // //       setEditId(null);
// // // //       fetchArticles();
// // // //     } catch (err) {
// // // //       alert('Gabim gjatë përditësimit.');
// // // //       console.error(err.response?.data || err.message);
// // // //     }
// // // //   };

// // // //   // Funksioni për fshirje
// // // //   const deleteArticle = async (id) => {
// // // //     if (!window.confirm("A je i sigurt që dëshiron të fshish këtë artikull?")) return;

// // // //     try {
// // // //       await axios.delete(`http://localhost:8800/api/articles/${id}`);
// // // //       alert('Artikulli u fshi me sukses!');
// // // //       // Rifresko listën
// // // //       fetchArticles();
// // // //     } catch (err) {
// // // //       alert('Gabim gjatë fshirjes së artikullit.');
// // // //       console.error(err.response?.data || err.message);
// // // //     }
// // // //   };

// // // //   if (loading) return <p>Loading articles...</p>;
// // // //   if (articles.length === 0) return <p>Nuk ka artikuj për të shfaqur.</p>;

// // // //   return (
// // // //     <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
// // // //       <h2>Lista e Artikujve</h2>
// // // //       <ul style={{ listStyle: 'none', padding: 0 }}>
// // // //         {articles.map(article => (
// // // //           <li key={article.id} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
// // // //             {editId === article.id ? (
// // // //               <>
// // // //                 <input
// // // //                   type="text"
// // // //                   name="title"
// // // //                   value={formData.title}
// // // //                   onChange={handleChange}
// // // //                   style={{ width: '100%', marginBottom: 8, padding: 6 }}
// // // //                 />
// // // //                 <textarea
// // // //                   name="content"
// // // //                   value={formData.content}
// // // //                   onChange={handleChange}
// // // //                   rows={4}
// // // //                   style={{ width: '100%', marginBottom: 8, padding: 6 }}
// // // //                 />
// // // //                 <input
// // // //                   type="text"
// // // //                   name="image"
// // // //                   value={formData.image}
// // // //                   onChange={handleChange}
// // // //                   placeholder="URL Imazhi"
// // // //                   style={{ width: '100%', marginBottom: 8, padding: 6 }}
// // // //                 />
// // // //                 <select
// // // //                   name="categoryId"
// // // //                   value={formData.categoryId}
// // // //                   onChange={handleChange}
// // // //                   style={{ width: '100%', marginBottom: 8, padding: 6 }}
// // // //                 >
// // // //                   <option value="">Zgjidh Kategorinë</option>
// // // //                   {categories.map(cat => (
// // // //                     <option key={cat.id} value={cat.id}>{cat.name}</option>
// // // //                   ))}
// // // //                 </select>
// // // //                 <button onClick={saveEdit} style={{ marginRight: 10 }}>Ruaj</button>
// // // //                 <button onClick={() => setEditId(null)}>Anulo</button>
// // // //               </>
// // // //             ) : (
// // // //               <>
// // // //                 <h3>{article.title}</h3>
// // // //                 <p><strong>Kategoria:</strong> {article.category?.name || 'Pa kategori'}</p>
// // // //                 <p>{article.content}</p>
// // // //                 {article.image && (
// // // //                   <img
// // // //                     src={article.image}
// // // //                     alt={article.title}
// // // //                     style={{ maxWidth: '100%', height: 'auto', marginBottom: 8 }}
// // // //                   />
// // // //                 )}
// // // //                 <button onClick={() => startEdit(article)} style={{ marginRight: 10 }}>Edito</button>
// // // //                 <button onClick={() => deleteArticle(article.id)} style={{ color: 'red' }}>Fshi</button>
// // // //               </>
// // // //             )}
// // // //           </li>
// // // //         ))}
// // // //       </ul>
// // // //     </div>
// // // //   );
// // // // }
// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // export default function ArticlesList() {
// // //   const [articles, setArticles] = useState([]);
// // //   const [categories, setCategories] = useState([]);
// // //   const [selectedCategory, setSelectedCategory] = useState(''); // bosh = të gjithë artikujt
// // //   const [loading, setLoading] = useState(true);

// // //   // Merr të gjitha kategoritë
// // //   const fetchCategories = async () => {
// // //     try {
// // //       const res = await axios.get('http://localhost:8800/api/article-categories');
// // //       setCategories(res.data);
// // //     } catch (err) {
// // //       console.error(err);
// // //     }
// // //   };

// // //   // Merr artikuj (me filter nëse ka selectedCategory)
// // //   const fetchArticles = async (categoryId = '') => {
// // //     setLoading(true);
// // //     try {
// // //       let url = 'http://localhost:8800/api/articles';
// // //       if (categoryId) {
// // //         url += `?categoryId=${categoryId}`;
// // //       }
// // //       const res = await axios.get(url);
// // //       setArticles(res.data);
// // //     } catch (err) {
// // //       console.error(err);
// // //     }
// // //     setLoading(false);
// // //   };

// // //   // Kur ngarkohet komponenti
// // //   useEffect(() => {
// // //     fetchCategories();
// // //     fetchArticles();
// // //   }, []);

// // //   // Kur ndryshon dropdown i kategorisë
// // //   const handleCategoryChange = (e) => {
// // //     const catId = e.target.value;
// // //     setSelectedCategory(catId);
// // //     fetchArticles(catId);
// // //   };

// // //   if (loading) return <p>Loading articles...</p>;

// // //   if (articles.length === 0) return <p>Nuk ka artikuj për të shfaqur.</p>;

// // //   return (
// // //     <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
// // //       <h2>Lista e Artikujve</h2>

// // //       <label>
// // //         Zgjidh kategorinë:
// // //         <select
// // //           value={selectedCategory}
// // //           onChange={handleCategoryChange}
// // //           style={{ marginLeft: 10, padding: 6 }}
// // //         >
// // //           <option value="">Të gjithë</option> {/* opsioni për të shfaqur të gjithë artikujt */}
// // //           {categories.map(cat => (
// // //             <option key={cat.id} value={cat.id}>{cat.name}</option>
// // //           ))}
// // //         </select>
// // //       </label>

// // //       {/* <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
// // //         {articles.map(article => (
// // //           <li
// // //             key={article.id}
// // //             style={{
// // //               marginBottom: 20,
// // //               borderBottom: '1px solid #ccc',
// // //               paddingBottom: 10,
// // //             }}
// // //           >
// // //             <h3>{article.title}</h3>
// // //             <p><strong>Kategoria:</strong> {article.category?.name || 'Pa kategori'}</p>
// // //             <p>{article.content}</p>
// // //             {article.image && (
// // //               <img
// // //                 src={article.image}
// // //                 alt={article.title}
// // //                 style={{ maxWidth: '100%', height: 'auto', marginBottom: 8 }}
// // //               />
// // //             )}
// // //           </li>
// // //         ))}
// // //       </ul> */}
// // //       <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
// // //   {articles.map(article => (
// // //     <li
// // //       key={article.id}
// // //       style={{
// // //         marginBottom: 20,
// // //         borderBottom: '1px solid #ccc',
// // //         paddingBottom: 10,
// // //       }}
// // //     >
// // //       <h3>{article.title}</h3>
// // //       <p><strong>ID:</strong> {article.id}</p>
// // //       <p><strong>Category ID:</strong> {article.categoryId}</p>
// // //       <p><strong>Kategoria:</strong> {article.category?.name || 'Pa kategori'}</p>
// // //       <p><strong>Content:</strong> {article.content}</p>
// // //       {article.image && (
// // //         <img
// // //           src={article.image}
// // //           alt={article.title}
// // //           style={{ maxWidth: '100%', height: 'auto', marginBottom: 8 }}
// // //         />
// // //       )}
// // //       <p>
// // //         <strong>Krijuar më:</strong>{' '}
// // //         {new Date(article.createdAt).toLocaleDateString('sq-AL', {
// // //           year: 'numeric',
// // //           month: 'long',
// // //           day: 'numeric',
// // //           hour: '2-digit',
// // //           minute: '2-digit',
// // //         })}
// // //       </p>
// // //     </li>
// // //   ))}
// // // </ul>

// // //     </div>
// // //   );
// // // }
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // export default function ArticlesList() {
// //   const [articles, setArticles] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [selectedCategory, setSelectedCategory] = useState('');
// //   const [fromDate, setFromDate] = useState(''); // data fillestare e filtrit
// //   const [loading, setLoading] = useState(true);

// //   const fetchCategories = async () => {
// //     try {
// //       const res = await axios.get('http://localhost:8800/api/article-categories');
// //       setCategories(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const fetchArticles = async (categoryId = '', date = '') => {
// //     setLoading(true);
// //     try {
// //       let url = 'http://localhost:8800/api/articles?';

// //       if (categoryId) {
// //         url += `categoryId=${categoryId}&`;
// //       }
// //       if (date) {
// //         url += `fromDate=${date}&`;
// //       }

// //       const res = await axios.get(url);
// //       setArticles(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchCategories();
// //     fetchArticles();
// //   }, []);

// //   // Përditëso filter kur ndryshon kategori
// //   const handleCategoryChange = (e) => {
// //     const catId = e.target.value;
// //     setSelectedCategory(catId);
// //     fetchArticles(catId, fromDate);
// //   };

// //   // Përditëso filter kur ndryshon data
// //   const handleDateChange = (e) => {
// //     const dateValue = e.target.value; // pranon format yyyy-mm-dd
// //     setFromDate(dateValue);
// //     fetchArticles(selectedCategory, dateValue);
// //   };

// //   if (loading) return <p>Loading articles...</p>;

// //   if (articles.length === 0) return <p>Nuk ka artikuj për të shfaqur.</p>;

// //   return (
// //     <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
// //       <h2>Lista e Artikujve</h2>

// //       <label>
// //         Zgjidh kategorinë:
// //         <select
// //           value={selectedCategory}
// //           onChange={handleCategoryChange}
// //           style={{ marginLeft: 10, padding: 6 }}
// //         >
// //           <option value="">Të gjithë</option>
// //           {categories.map(cat => (
// //             <option key={cat.id} value={cat.id}>{cat.name}</option>
// //           ))}
// //         </select>
// //       </label>

// //       <label style={{ marginLeft: 20 }}>
// //         Artikuj nga data:
// //         <input
// //           type="date"
// //           value={fromDate}
// //           onChange={handleDateChange}
// //           style={{ marginLeft: 10, padding: 6 }}
// //         />
// //       </label>

// //       <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
// //         {articles.map(article => (
// //           <li
// //             key={article.id}
// //             style={{
// //               marginBottom: 20,
// //               borderBottom: '1px solid #ccc',
// //               paddingBottom: 10,
// //             }}
// //           >
// //             <h3>{article.title}</h3>
// //             <p><strong>ID:</strong> {article.id}</p>
// //             <p><strong>Category ID:</strong> {article.categoryId}</p>
// //             <p><strong>Kategoria:</strong> {article.category?.name || 'Pa kategori'}</p>
// //             <p><strong>Content:</strong> {article.content}</p>
// //             {article.image && (
// //               <img
// //                 src={article.image}
// //                 alt={article.title}
// //                 style={{ maxWidth: '100%', height: 'auto', marginBottom: 8 }}
// //               />
// //             )}
// //             <p>
// //               <strong>Krijuar më:</strong>{' '}
// //               {new Date(article.createdAt).toLocaleDateString('sq-AL', {
// //                 year: 'numeric',
// //                 month: 'long',
// //                 day: 'numeric',
// //                 hour: '2-digit',
// //                 minute: '2-digit',
// //               })}
// //             </p>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function ArticlesList() {
//   const [articles, setArticles] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [loading, setLoading] = useState(true);

//   const [editingArticle, setEditingArticle] = useState(null); // artikulli në editim
//   const [editTitle, setEditTitle] = useState('');
//   const [editContent, setEditContent] = useState('');
//   const [editCategoryId, setEditCategoryId] = useState('');

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get('http://localhost:8800/api/article-categories');
//       setCategories(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchArticles = async (categoryId = '', date = '') => {
//     setLoading(true);
//     try {
//       let url = 'http://localhost:8800/api/articles?';

//       if (categoryId) {
//         url += `categoryId=${categoryId}&`;
//       }
//       if (date) {
//         url += `fromDate=${date}&`;
//       }

//       const res = await axios.get(url);
//       setArticles(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchArticles();
//   }, []);

//   const handleCategoryChange = (e) => {
//     const catId = e.target.value;
//     setSelectedCategory(catId);
//     fetchArticles(catId, fromDate);
//   };

//   const handleDateChange = (e) => {
//     const dateValue = e.target.value;
//     setFromDate(dateValue);
//     fetchArticles(selectedCategory, dateValue);
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     if (!window.confirm('A jeni i sigurt që dëshironi të fshini këtë artikull?')) return;

//     try {
//       await axios.delete(`http://localhost:8800/api/articles/${id}`);
//       // rifresko listën pas fshirjes
//       fetchArticles(selectedCategory, fromDate);
//     } catch (err) {
//       console.error(err);
//       alert('Gabim gjatë fshirjes së artikullit.');
//     }
//   };

//   // START EDIT
//   const startEdit = (article) => {
//     setEditingArticle(article);
//     setEditTitle(article.title);
//     setEditContent(article.content);
//     setEditCategoryId(article.categoryId);
//   };

//   // CANCEL EDIT
//   const cancelEdit = () => {
//     setEditingArticle(null);
//   };

//   // SAVE EDIT
//   const saveEdit = async () => {
//     try {
//       await axios.put(`http://localhost:8800/api/articles/${editingArticle.id}`, {
//         title: editTitle,
//         content: editContent,
//         categoryId: editCategoryId,
//       });
//       setEditingArticle(null);
//       fetchArticles(selectedCategory, fromDate);
//     } catch (err) {
//       console.error(err);
//       alert('Gabim gjatë përditësimit të artikullit.');
//     }
//   };

//   if (loading) return <p>Loading articles...</p>;

//   if (articles.length === 0) return <p>Nuk ka artikuj për të shfaqur.</p>;

//   return (
//     <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
//       <h2>Lista e Artikujve</h2>

//       <label>
//         Zgjidh kategorinë:
//         <select
//           value={selectedCategory}
//           onChange={handleCategoryChange}
//           style={{ marginLeft: 10, padding: 6 }}
//         >
//           <option value="">Të gjithë</option>
//           {categories.map(cat => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>
//       </label>

//       <label style={{ marginLeft: 20 }}>
//         Artikuj nga data:
//         <input
//           type="date"
//           value={fromDate}
//           onChange={handleDateChange}
//           style={{ marginLeft: 10, padding: 6 }}
//         />
//       </label>

//       <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
//         {articles.map(article => (
//           <li
//             key={article.id}
//             style={{
//               marginBottom: 20,
//               borderBottom: '1px solid #ccc',
//               paddingBottom: 10,
//             }}
//           >
//             {editingArticle?.id === article.id ? (
//               // Forma e editimit
//               <>
//                 <input
//                   type="text"
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   style={{ width: '100%', marginBottom: 8, padding: 6 }}
//                 />
//                 <textarea
//                   value={editContent}
//                   onChange={(e) => setEditContent(e.target.value)}
//                   style={{ width: '100%', marginBottom: 8, padding: 6 }}
//                 />
//                 <select
//                   value={editCategoryId}
//                   onChange={(e) => setEditCategoryId(e.target.value)}
//                   style={{ marginBottom: 8, padding: 6 }}
//                 >
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </select>
//                 <br />
//                 <button onClick={saveEdit} style={{ marginRight: 8 }}>Ruaj</button>
//                 <button onClick={cancelEdit}>Anulo</button>
//               </>
//             ) : (
//               // Shfaqja normale
//               <>
//                 <h3>{article.title}</h3>
//                 <p><strong>ID:</strong> {article.id}</p>
//                 <p><strong>Category ID:</strong> {article.categoryId}</p>
//                 <p><strong>Kategoria:</strong> {article.category?.name || 'Pa kategori'}</p>
//                 <p><strong>Content:</strong> {article.content}</p>
//                 {article.image && (
//                   <img
//                     src={article.image}
//                     alt={article.title}
//                     style={{ maxWidth: '100%', height: 'auto', marginBottom: 8 }}
//                   />
//                 )}
//                 <p>
//                   <strong>Krijuar më:</strong>{' '}
//                   {new Date(article.createdAt).toLocaleDateString('sq-AL', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </p>
//                 <button onClick={() => startEdit(article)} style={{ marginRight: 10 }}>
//                   Edit
//                 </button>
//                 <button onClick={() => handleDelete(article.id)} style={{ color: 'red' }}>
//                   Delete
//                 </button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
//  const styles = {
//     container: {
//       maxWidth: 800,
//       margin: 'auto',
//       padding: 20,
//       fontFamily: 'Arial, sans-serif',
//     },
//     filters: {
//       marginBottom: 20,
//       display: 'flex',
//       gap: 20,
//       alignItems: 'center',
//     },
//     label: {
//       fontWeight: 'bold',
//     },
//     select: {
//       marginLeft: 10,
//       padding: 6,
//       borderRadius: 4,
//       border: '1px solid #ccc',
//     },
//     inputDate: {
//       marginLeft: 10,
//       padding: 6,
//       borderRadius: 4,
//       border: '1px solid #ccc',
//     },
//     articleItem: {
//       marginBottom: 20,
//       borderBottom: '1px solid #ccc',
//       paddingBottom: 15,
//     },
//     articleImage: {
//       maxWidth: '100%',
//       height: 'auto',
//       marginBottom: 8,
//       borderRadius: 6,
//       boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//     },
//     buttonsContainer: {
//       marginTop: 10,
//       display: 'flex',
//       gap: 10,
//     },
//     button: {
//       padding: '6px 12px',
//       borderRadius: 4,
//       border: 'none',
//       cursor: 'pointer',
//       fontWeight: 'bold',
//     },
//     buttonEdit: {
//       backgroundColor: '#007bff',
//       color: 'white',
//     },
//     buttonDelete: {
//       backgroundColor: '#dc3545',
//       color: 'white',
//     },
//     buttonSave: {
//       backgroundColor: '#28a745',
//       color: 'white',
//     },
//     buttonCancel: {
//       backgroundColor: '#6c757d',
//       color: 'white',
//     },
//     inputText: {
//       width: '100%',
//       marginBottom: 8,
//       padding: 6,
//       borderRadius: 4,
//       border: '1px solid #ccc',
//       fontSize: 16,
//     },
//     textarea: {
//       width: '100%',
//       marginBottom: 8,
//       padding: 6,
//       borderRadius: 4,
//       border: '1px solid #ccc',
//       fontSize: 16,
//       minHeight: 80,
//     },
//   };

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingArticle, setEditingArticle] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImage, setEditImage] = useState(''); // Për URL-n e imazhit

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8800/api/article-categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchArticles = async (categoryId = '', date = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:8800/api/articles?';

      if (categoryId) url += `categoryId=${categoryId}&`;
      if (date) url += `fromDate=${date}&`;

      const res = await axios.get(url);
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    fetchArticles(catId, fromDate);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setFromDate(dateValue);
    fetchArticles(selectedCategory, dateValue);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni i sigurt që dëshironi të fshini këtë artikull?')) return;
    try {
      await axios.delete(`http://localhost:8800/api/articles/${id}`);
      fetchArticles(selectedCategory, fromDate);
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë fshirjes së artikullit.');
    }
  };

  const startEdit = (article) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditContent(article.content);
    setEditCategoryId(article.categoryId);
    setEditImage(article.image || '');
  };

  const cancelEdit = () => {
    setEditingArticle(null);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:8800/api/articles/${editingArticle.id}`, {
        title: editTitle,
        content: editContent,
        categoryId: editCategoryId,
        image: editImage,
      });
      setEditingArticle(null);
      fetchArticles(selectedCategory, fromDate);
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë përditësimit të artikullit.');
    }
  };

  const styles = {
    container: {
      maxWidth: 900,
      margin: 'auto',
      padding: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
    },
    filters: {
      marginBottom: 30,
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    label: {
      fontWeight: '600',
      fontSize: 16,
      color: '#333',
    },
    select: {
      marginLeft: 10,
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #ccc',
      fontSize: 16,
      minWidth: 160,
    },
    inputDate: {
      marginLeft: 10,
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #ccc',
      fontSize: 16,
    },
    articlesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 24,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 320,
      transition: 'transform 0.2s ease',
      cursor: 'default',
    },
    imageWrapper: {
      width: '100%',
      height: 140,
      marginBottom: 16,
      overflow: 'hidden',
      borderRadius: 10,
      backgroundColor: '#eee',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 8,
      color: '#222',
    },
    category: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 12,
      color: '#555',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    content: {
      fontSize: 15,
      color: '#444',
      flexGrow: 1,
      marginBottom: 20,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 4,
      WebkitBoxOrient: 'vertical',
    },
    dateText: {
      fontSize: 13,
      color: '#999',
      marginBottom: 12,
    },
    buttonsRow: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
    },
    button: {
      padding: '8px 14px',
      borderRadius: 8,
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: 14,
      transition: 'background-color 0.3s ease',
    },
    buttonEdit: {
      backgroundColor: '#1976d2',
      color: 'white',
    },
    buttonDelete: {
      backgroundColor: '#d32f2f',
      color: 'white',
    },
    inputText: {
      width: '100%',
      padding: 10,
      marginBottom: 10,
      borderRadius: 8,
      border: '1px solid #ccc',
      fontSize: 16,
      fontWeight: '500',
    },
    textarea: {
      width: '100%',
      padding: 10,
      marginBottom: 12,
      borderRadius: 8,
      border: '1px solid #ccc',
      fontSize: 16,
      fontWeight: '500',
      minHeight: 100,
      resize: 'vertical',
    },
    selectEdit: {
      width: '100%',
      padding: 10,
      marginBottom: 12,
      borderRadius: 8,
      border: '1px solid #ccc',
      fontSize: 16,
      fontWeight: '500',
    },
    editButtonsRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
    },
    buttonSave: {
      backgroundColor: '#388e3c',
      color: 'white',
    },
    buttonCancel: {
      backgroundColor: '#757575',
      color: 'white',
    },
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading articles...</p>;
  if (articles.length === 0) return <p style={{ textAlign: 'center', marginTop: 40 }}>Nuk ka artikuj për të shfaqur.</p>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: 24, color: '#222' }}>Articles</h2>

      <div style={styles.filters}>
        <label style={styles.label}>
          Zgjidh kategorinë:
          <select value={selectedCategory} onChange={handleCategoryChange} style={styles.select}>
            <option value="">Të gjithë</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Artikuj nga data:
          <input type="date" value={fromDate} onChange={handleDateChange} style={styles.inputDate} />
        </label>
      </div>

      <div style={styles.articlesGrid}>
        {articles.map(article => (
          <div key={article.id} style={styles.card}>
            {editingArticle?.id === article.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Titulli"
                  style={styles.inputText}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Përmbajtja"
                  style={styles.textarea}
                />
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  style={styles.selectEdit}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="URL e imazhit"
                  style={styles.inputText}
                />

                <div style={styles.editButtonsRow}>
                  <button onClick={saveEdit} style={{ ...styles.button, ...styles.buttonSave }}>
                    Ruaj
                  </button>
                  <button onClick={cancelEdit} style={{ ...styles.button, ...styles.buttonCancel }}>
                    Anulo
                  </button>
                </div>
              </>
            ) : (
              <>
                {article.image && (
                  <div style={styles.imageWrapper}>
                    <img src={article.image} alt={article.title} style={styles.image} />
                  </div>
                )}

                <h3 style={styles.title}>{article.title}</h3>
                <p style={styles.category}>{article.category?.name || 'Pa kategori'}</p>
                <p style={styles.content}>{article.content}</p>
                <p style={styles.dateText}>
                  <em>Krijuar më: {new Date(article.createdAt).toLocaleDateString('sq-AL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</em>
                </p>

                {/* <div style={styles.buttonsRow}>
                  <button
                    onClick={() => startEdit(article)}
                    style={{ ...styles.button, ...styles.buttonEdit }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    style={{ ...styles.button, ...styles.buttonDelete }}
                  >
                    Delete
                  </button>
                </div> */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
