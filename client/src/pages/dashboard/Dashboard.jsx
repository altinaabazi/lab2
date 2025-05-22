import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../../components/modal/Modal";
import "./Dashboard.scss";

// Importo komponentet e nevojshme nga Chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";


// Regjistro komponentet që do përdorim
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "USER" });
  const [editingUser, setEditingUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);

const fetchMessages = async () => {
  try {
    const res = await axios.get("http://localhost:8800/api/contact", {
      withCredentials: true,
    });
    setMessages(res.data);
  } catch (err) {
    console.error("Gabim gjatë marrjes së mesazheve:", err);
  }
};

useEffect(() => {
  if (currentUser?.role === "ADMIN") {
    fetchMessages();
  }
}, [currentUser]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", newUser, {
        withCredentials: true,
      });
      setNewUser({ username: "", email: "", password: "", role: "USER" });
      fetchUsers();
      setIsAddModalOpen(false);  // Close the modal
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("A je i sigurt që dëshiron të fshish këtë përdorues?")) return;

    try {
      await axios.delete(`http://localhost:8800/api/users/${id}`, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8800/api/users/${editingUser.id}`,
        {
          username: editingUser.username,
          email: editingUser.email,
          role: editingUser.role,
        },
        { withCredentials: true }
      );
      setEditingUser(null);
      fetchUsers();
      setIsEditModalOpen(false);  // Close the modal after saving
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const donutData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const registrationOverTime = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Maj", "Qer"],
    datasets: [
      {
        label: "Përdorues të rinj",
        data: [2, 4, 8, 5, 7, 10],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        label: "Numri i përdoruesve",
        data: Object.values(roleCounts),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="user-stats">
        <div className="stat-card">
          <h4>✅ Numri total i përdoruesve</h4>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h4>👑 Numri i adminëve</h4>
          <p>{users.filter((u) => u.role === "ADMIN").length}</p>
        </div>
        <div className="stat-card">
          <h4>👥 Numri i përdoruesve standard</h4>
          <p>{users.filter((u) => u.role === "USER").length}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-card">
          <h3>Shpërndarja e roleve</h3>
          <Doughnut data={donutData} />
        </div>

        <div className="chart-card">
          <h3>Regjistrimet mujore</h3>
          <Line data={registrationOverTime} />
        </div>

        <div className="chart-card">
          <h3>Rolet në total</h3>
          <Bar data={barData} />
        </div>
      </div>

      <div className="top-bar">
        <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>Shto</button>
      </div>

      <h2>Lista e përdoruesve</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Roli</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-edit" onClick={() => handleEditClick(user)}>Edito</button>
                  <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>Fshij</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Contact Form</h2>
<table className="user-table">
  <thead>
    <tr>
      <th>Emri</th>
      <th>Mbiemri</th>
      <th>Email</th>
      <th>Telefoni</th>
      <th>Mesazhi</th>
      <th>Data</th>
    </tr>
  </thead>
  <tbody>
    {messages.map((msg, index) => (
      <tr key={index}>
        <td>{msg.name}</td>
        <td>{msg.lastname}</td>
        <td>{msg.email}</td>
        <td>{msg.phone}</td>
        <td>{msg.message}</td>
        <td>{new Date(msg.date).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddUser}>
        <h2>Shto përdorues të ri</h2>
        <form onSubmit={handleAddUser} className="add-user-form">
          <input
            type="text"
            placeholder="Emri"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Fjalëkalimi"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal isOpen={isEditModalOpen} onClose={() => setEditingUser(null)} onSubmit={handleSaveEdit}>
          <h3>Edito Përdoruesin</h3>
          <form onSubmit={handleSaveEdit} className="add-user-form">
            <input
              name="username"
              type="text"
              value={editingUser.username}
              onChange={handleEditChange}
              required
            />
            <input
              name="email"
              type="email"
              value={editingUser.email}
              onChange={handleEditChange}
              required
            />
            <select name="role" value={editingUser.role} onChange={handleEditChange} required>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

          </form>
        </Modal>
      )}

    </div>
  );
}

export default Dashboard;
