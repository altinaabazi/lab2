
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../../components/card/Card";
import { AuthContext } from "../../context/AuthContext";
import CustomAlertModal from "../../components/customAlertModal/CustomAlertModal";
import "./postsPages.scss";

function EditPostModal({ post, isOpen, onClose, onSave }) {
  const [editedPost, setEditedPost] = useState({});


  useEffect(() => {
    if (post) {
      setEditedPost(post);
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedPost);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edito Postin</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(editedPost).map(([key, value]) => {
            // Fushat që janë array mund ti shfaqim thjesht si string të ndarë me koma
            if (Array.isArray(value)) {
              return (
                <label key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <input
                    type="text"
                    name={key}
                    value={value.join(", ")}
                    onChange={(e) => {
                      // Kthej inputin në array duke ndarë me presje
                      const val = e.target.value.split(",").map(v => v.trim());
                      setEditedPost((prev) => ({ ...prev, [key]: val }));
                    }}
                    required
                  />
                </label>
              );
            }

            // Nëse është datë
            if (
              value &&
              typeof value === "string" &&
              !isNaN(Date.parse(value)) &&
              key.toLowerCase() !== "latitude" &&  // përjashto këto fushat
              key.toLowerCase() !== "longitude"
            ) {
              return (
                <label key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <input
                    type="date"
                    name={key}
                    value={value.substring(0, 10)}
                    onChange={handleChange}
                    required
                  />
                </label>
              );
            }

            // Nëse është string me gjatësi të madhe, përdor textarea
            if (typeof value === "string" && value.length > 50) {
              return (
                <label key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required
                  />
                </label>
              );
            }

            // Nëse është number
            if (typeof value === "number") {
              return (
                <label key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={(e) =>
                      setEditedPost((prev) => ({
                        ...prev,
                        [key]: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </label>
              );
            }

            // Për fushat boolean (true/false)
            if (typeof value === "boolean") {
              return (
                <label key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <select
                    name={key}
                    value={value}
                    onChange={(e) =>
                      setEditedPost((prev) => ({
                        ...prev,
                        [key]: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>
              );
            }

            // Default input tekst për fushat e tjera
            return (
              <label key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                <input
                  type="text"
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                  required
                />
              </label>
            );
          })}

          <button type="submit">Save</button>
          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: "1px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

function PostPage() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8800/api/posts", {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      setError("Nuk jeni të autorizuar për të parë postimet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`http://localhost:8800/api/posts/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((post) => post.id !== id));
      setAlert({ message: "Post deleted successfully!", type: "success" });

    } catch (err) {
      console.error("Error occurred while deleting the post:", err.response?.data || err.message);
      setAlert({ message: "Error occurred while deleting the post", type: "error" });
    }
  };

  const handleEditClick = (post) => {
    // Mund të personalizosh autorin nëse do
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedPost) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Ndaj postin në pjesën kryesore dhe postDetail
      const {
        desc,
        utilities,
        pet,
        income,
        size,
        school,
        bus,
        restaurant,
        ...mainData
      } = updatedPost;

      const postToSend = {
        ...mainData,
        postDetail: {
          desc,
          utilities,
          pet,
          income,
          size,
          school,
          bus,
          restaurant
        }
      };

      const response = await axios.put(
        `http://localhost:8800/api/posts/${editingPost.id}`,
        postToSend,
        {
          withCredentials: true,
          // headers: { Authorization: `Bearer ${token}` } // shto këtë nëse duhet
        }
      );

      const updatedPostFromBackend = response.data;

      const updatedPosts = posts.map((p) =>
        p.id === updatedPostFromBackend.id ? updatedPostFromBackend : p
      );
      setPosts(updatedPosts);

      setIsEditModalOpen(false);
      setEditingPost(null);
      setAlert({ message: "Post updated successfully!", type: "success" });


    } catch (err) {
      console.error(
        "Error occurred while updating the post:",
        err.response?.data || err.message
      );
      setAlert({ message: "Error occurred while updating the post", type: "error" });
    }
  };


  return (
    <div className="post-page">
      <h1>PlacePoint</h1>
      {/* <button onClick={fetchPosts} className="refresh-btn">
        Rifresko listën
      </button> */}

      {loading && <p className="status-message loading">Duke ngarkuar postimet...</p>}
      {error && <p className="status-message error">{error}</p>}

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-wrapper">
            <Card item={post} />

            {currentUser?.role === "ADMIN" && (
              <>
                <button className="delete-btn" onClick={() => setPostIdToDelete(post.id)}>
                  Delete
                </button>

                <button className="edit-btn" onClick={() => handleEditClick(post)}>
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>


      <EditPostModal
        post={editingPost}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
      />
      {/* Modal për konfirmim fshirje */}
      {postIdToDelete !== null && (
        <CustomAlertModal
          message="Are you sure!"
          type="confirm"
          onConfirm={() => {
            handleDelete(postIdToDelete);
            setPostIdToDelete(null);
          }}
          onClose={() => setPostIdToDelete(null)}
        />
      )}

      {/* Modal për mesazh suksesi ose errori */}
      {alert.message && (
        <CustomAlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "success" })}
        />
      )}

    </div>

  );
}

export default PostPage;
