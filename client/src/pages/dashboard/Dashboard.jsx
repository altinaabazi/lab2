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
const [editingOrder, setEditingOrder] = useState(null);
const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
const [showUsers, setShowUsers] = useState(false);
const [showMessages, setShowMessages] = useState(false);
const [showOrders, setShowOrders] = useState(false);

  // Shtesë: orders
  const [orders, setOrders] = useState([]);

  // Funksioni për marrjen e mesazheve
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

const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/orders", {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së porosive:", err);
    }
  };

  // UseEffect për mesazhet dhe porositë vetëm nëse është ADMIN
  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      fetchMessages();
      fetchOrders();
    }
  }, [currentUser]);

  // UseEffect për kontrollin e rolit dhe marrjen e përdoruesve
  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [currentUser, navigate]);

  // Funksioni për marrjen e përdoruesve
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

  // Funksionet për shtimin, fshirjen dhe editimin e përdoruesve
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", newUser, {
        withCredentials: true,
      });
      setNewUser({ username: "", email: "", password: "", role: "USER" });
      fetchUsers();
      setIsAddModalOpen(false);
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
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };
const handleDeleteOrder = async (id) => {
  if (!window.confirm("A je i sigurt që dëshiron të fshish këtë porosi?")) return;

  try {
    await axios.delete(`http://localhost:8800/api/orders/${id}`, { withCredentials: true });
    fetchOrders();  // rifreskon listën e porosive
  } catch (err) {
    console.error("Failed to delete order:", err);
  }
};

const handleEditOrder = (order) => {
  setEditingOrder(order);
  setIsEditOrderModalOpen(true);
};

const handleOrderChange = (e) => {
  const { name, value } = e.target;
  setEditingOrder(prev => ({
    ...prev,
    [name]: value,   // Kjo rresht mungon dhe duhet shtuar
  }));
};


const handleSaveOrderEdit = async (e) => {
  e.preventDefault();

  try {
    await axios.put(
      `http://localhost:8800/api/orders/${editingOrder.id}`,
      {
        status: editingOrder.status,
        orderDate: editingOrder.orderDate,
      },
      { withCredentials: true }
    );
    setEditingOrder(null);
    setIsEditOrderModalOpen(false);
    fetchOrders();
  } catch (err) {
    console.error("Failed to update order:", err);
  }
};

  // Statistikat e roleve
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  // Data për charts
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

      {/* <div className="top-bar">
        <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>Shto</button>
      </div> */}

    <div className="toggle-buttons">
  <button onClick={() => setShowUsers(prev => !prev)}>
    {showUsers ? "Fshih Përdoruesit" : "Shfaq Përdoruesit"}
  </button>
</div>
{showUsers && (
  <>
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
                          <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>Shto</button>

                  <button className="btn-edit" onClick={() => handleEditClick(user)}>Edito</button>
                  <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>Fshij</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
     </table>
  </>
)}

     <div className="toggle-buttons">
  <button onClick={() => setShowMessages(prev => !prev)}>
    {showMessages ? "Fshih Mesazhet" : "Shfaq Mesazhet"}
  </button>
</div>
{showMessages && (
  <>
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
              <td>{msg.emri}</td>
              <td>{msg.mbiemri}</td>
              <td>{msg.email}</td>
              <td>{msg.telefoni}</td>
              <td>{msg.mesazhi}</td>
              <td>{new Date(msg.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
         </table>
  </>
)}



    <div className="toggle-buttons">
  <button onClick={() => setShowOrders(prev => !prev)}>
    {showOrders ? "Fshih Porositë" : "Shfaq Porositë"}
  </button>
</div>
{showOrders && (
  <>
    <h2>Lista e porosive</h2>
    <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Përdoruesi</th>
            <th>Produkti</th>
            <th>Çmimi</th>
            <th>Data e porosisë</th>
            <th>Statusi</th>
            <th>Veprime</th>  {/* Shto këtë */}
          </tr>
        </thead>
        <tbody>
         {orders.map((order) => (
  <tr key={order.id}>
    <td>{order.id}</td>
    <td>{order.username || order.userId}</td>
    <td>{order.apartmentName || order.apartmentId}</td>
    <td>{order.apartmentPrice ? `$${order.apartmentPrice}` : "-"}</td>
    <td>{new Date(order.orderDate).toLocaleString()}</td>
    <td>{order.status || "N/A"}</td>
     <td>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button className="btn-edit" onClick={() => handleEditOrder(order)}>Edito</button>
    <button className="btn-delete" onClick={() => handleDeleteOrder(order.id)}>Fshij</button>
  </div>
</td>

  </tr>
))}

        </tbody>
      </table>
  </>
)}
   

      {/* Modal për shtimin e përdoruesit */}
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
{/* {isEditOrderModalOpen && editingOrder && (
<Modal
  isOpen={isEditOrderModalOpen}
  onClose={() => setIsEditOrderModalOpen(false)}
  onSubmit={handleSaveOrderEdit}
>
    <h2>Edito Porosinë</h2>
    <form onSubmit={handleSaveOrderEdit} className="modal-form">
      <label>Statusi:</label>
      <select name="status" value={editingOrder.status} onChange={handleOrderChange}>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
      </select>

      <label>Data e Porosisë:</label>
      <input
        type="date"
        name="orderDate"
        value={editingOrder.orderDate?.slice(0, 10) || ""}
        onChange={handleOrderChange}
      />

    </form>
  </Modal>
)} */}
{isEditOrderModalOpen && editingOrder && (
  <Modal
    isOpen={isEditOrderModalOpen}
    onClose={() => setIsEditOrderModalOpen(false)}
    onSubmit={handleSaveOrderEdit}
  >
    <h3>Edito Porosinë</h3>
    <form onSubmit={handleSaveOrderEdit} className="add-user-form">
      <label>Statusi</label>
      <select
        name="status"
        value={editingOrder.status}
        onChange={handleOrderChange}
        required
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <label>Data e porosisë</label>
      <input
        name="orderDate"
        type="datetime-local"
        value={editingOrder.orderDate ? new Date(editingOrder.orderDate).toISOString().slice(0,16) : ""}
        onChange={handleOrderChange}
        required
      />

     
    </form>
  </Modal>
)}



    </div>
  );
}


export default Dashboard;
