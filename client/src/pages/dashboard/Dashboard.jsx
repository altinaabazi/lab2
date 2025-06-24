import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.scss";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ReportsSection from "../report/ReportsSection";
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

// Modal minimal funksional brenda këtij file
function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "320px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [totalPosts, setTotalPosts] = useState(0);
  const [postsByCity, setPostsByCity] = useState([]);


  const [userSearch, setUserSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  // Gjendjet
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "USER" });
  const [editingUser, setEditingUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [currentPageMessages, setCurrentPageMessages] = useState(1);
  const messagesPerPage = 5;

  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const ordersPerPage = 5;

  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const usersPerPage = 5;
  const [orderSortOption, setOrderSortOption] = useState(""); // "" | "priceAsc" | "priceDesc" | "dateAsc" | "dateDesc"
  const [userSortOption, setUserSortOption] = useState(""); // "" | "admin" | "user"
  const [messageSortOption, setMessageSortOption] = useState(""); // "" | "newest" | "oldest"
  const [exportFormatOrders, setExportFormatOrders] = useState("");
  const [exportFormatMessages, setExportFormatMessages] = useState("");
  const [exportFormatUsers, setExportFormatUsers] = useState("");


  const [activeSection, setActiveSection] = useState("analytics");

  // Modal gjendjet
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchUsers();
    fetchMessages();
    fetchOrders();
    fetchTotalPosts();
    fetchPostsByCity();;
  }, [currentUser, navigate]);

  // Marrja e të dhënave
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/users", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };
  const fetchTotalPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/posts/count", { withCredentials: true });
      setTotalPosts(res.data.total);
    } catch (err) {
      console.error("Failed to fetch total posts:", err);
    }
  };
  const fetchPostsByCity = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/posts/group-by-city", { withCredentials: true });
      setPostsByCity(res.data);
    } catch (err) {
      console.error("Failed to fetch posts by city:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/contact", { withCredentials: true });
      setMessages(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së mesazheve:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/orders", { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së porosive:", err);
    }
  };

  // Pagination
  const currentUsers = users.slice((currentPageUsers - 1) * usersPerPage, currentPageUsers * usersPerPage);
  const totalPagesUsers = Math.ceil(users.length / usersPerPage);

  const currentMessages = messages.slice((currentPageMessages - 1) * messagesPerPage, currentPageMessages * messagesPerPage);
  const totalPagesMessages = Math.ceil(messages.length / messagesPerPage);

  const currentOrders = orders.slice((currentPageOrders - 1) * ordersPerPage, currentPageOrders * ordersPerPage);
  const totalPagesOrders = Math.ceil(orders.length / ordersPerPage);

  const filteredUsers = currentUsers
    .filter(user =>
      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearch.toLowerCase())
    )
    .filter(user => {
      if (userSortOption === "admin") return user.role === "ADMIN";
      if (userSortOption === "user") return user.role === "USER";
      return true;
    });

  const filteredMessages = currentMessages
    .filter((msg) => {
      if (messageSearch) {
        return (
          msg.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
          msg.lastname.toLowerCase().includes(messageSearch.toLowerCase()) ||
          msg.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
          msg.message.toLowerCase().includes(messageSearch.toLowerCase())
        );
      }
      return true;
    })
    .filter((msg) => {
      if (messageSortOption === "gmail") return msg.email.includes("@gmail.com");
      if (messageSortOption === "outlook") return msg.email.includes("@outlook.com");
      return true;
    })
    .sort((a, b) => {
      if (messageSortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (messageSortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });


  const filteredOrders = currentOrders
    .filter(order =>
      order.username?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.apartmentName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.status?.toLowerCase().includes(orderSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (orderSortOption === "priceAsc") {
        return (a.apartmentPrice || 0) - (b.apartmentPrice || 0);
      } else if (orderSortOption === "priceDesc") {
        return (b.apartmentPrice || 0) - (a.apartmentPrice || 0);
      } else if (orderSortOption === "dateAsc") {
        return new Date(a.orderDate) - new Date(b.orderDate);
      } else if (orderSortOption === "dateDesc") {
        return new Date(b.orderDate) - new Date(a.orderDate);
      }
      return 0; // pa ndryshim
    });

  //exporti


  const exportData = (data, format, fileName) => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      saveAs(blob, `${fileName}.json`);
    } else if (format === "csv" || format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      const fileType = format === "csv" ? "csv" : "xlsx";
      const fileExtension = format === "csv" ? ".csv" : ".xlsx";

      const excelBuffer = XLSX.write(workbook, { bookType: fileType, type: "array" });
      const blob = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(blob, `${fileName}${fileExtension}`);
    }
  };

  // Statistikat e roleve
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
  const cityLabels = postsByCity.map(item => item.city || "Undefined");
  const cityCounts = postsByCity.map(item => item._count.city);

  const cityBarData = {
    labels: cityLabels,
    datasets: [
      {
        label: "Numri i postimeve",
        data: cityCounts,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // FUNKSIONE PËR MODALET --------------------------------------

  // Shto përdorues të ri
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", newUser, { withCredentials: true });
      setNewUser({ username: "", email: "", password: "", role: "USER" });
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Gabim gjatë shtimit të përdoruesit:", err);
      alert("Gabim gjatë shtimit të përdoruesit!");
    }
  };

  // Ruaj ndryshimet e përdoruesit ekzistues
  const handleEditUser = async (e) => {
    e.preventDefault();
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
      setIsEditUserModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Gabim gjatë editimit të përdoruesit:", err);
      alert("Gabim gjatë editimit të përdoruesit!");
    }
  };

  // Ruaj ndryshimet e porosisë ekzistuese
  const handleEditOrder = async (e) => {
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
      console.error("Gabim gjatë editimit të porosisë:", err);
      alert("Gabim gjatë editimit të porosisë!");
    }
  };

  return (
    <div className="dashboard" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Menaxhimi</h2>
        <div>
          <Link className="button-add" to="/add">New Post</Link>
        </div>
        <button
          className={`sidebar-btn ${activeSection === "users" ? "active" : ""}`}
          onClick={() => setActiveSection("users")}
        >
          Users
        </button>
        <button
          className={`sidebar-btn ${activeSection === "messages" ? "active" : ""}`}
          onClick={() => setActiveSection("messages")}
        >
          Messages
        </button>
        <button
          className={`sidebar-btn ${activeSection === "orders" ? "active" : ""}`}
          onClick={() => setActiveSection("orders")}
        >
          Orders
        </button>
        <button
          className={`sidebar-btn ${activeSection === "analytics" ? "active" : ""}`}
          onClick={() => setActiveSection("analytics")}
        >
          Analysis
        </button>
        <button
  className={`sidebar-btn ${activeSection === "reports" ? "active" : ""}`}
  onClick={() => setActiveSection("reports")}
>
  Raporte
</button>

        <a className={`sidebar-btn`} href="/post">Agents</a>
      </aside>

      {/* Content */}
      <main className="content">
        <h1>Dashboard</h1>


        {/* ANALYTICS */}
        {activeSection === "analytics" && (
          <>
            <div className="user-stats">
              <div className="stat-card">
                <h4>✅ Total Users</h4>
                <p>{users.length}</p>
              </div>
              <div className="stat-card">
                <h4>👑Admin</h4>
                <p>{users.filter((u) => u.role === "ADMIN").length}</p>
              </div>
              <div className="stat-card">
                <h4>👥User</h4>
                <p>{users.filter((u) => u.role === "USER").length}</p>
              </div>
              <div className="stat-card">
                <h4>Total Apartments</h4>
                <p>{totalPosts}</p>
              </div>
            </div>

            <div className="charts">
              <div className="chart-card">
                <h3>Roles</h3>
                <Doughnut data={donutData} />
              </div>
              <div className="chart-card">
                <h3>New Users for month</h3>
                <Line data={registrationOverTime} />
              </div>
              {/* <div className="chart-card">
                <h3>Total roles</h3>
                <Bar data={barData} />
              </div> */}
              <div className="chart-card">
                <h3>Posts by City</h3>
                <Bar data={cityBarData} />
              </div>
            </div>
          </>
        )}

        {/* USERS SECTION */}
        {activeSection === "users" && (
          <>
            <button className="add-link" onClick={() => setIsAddModalOpen(true)}>
              Shto përdorues
            </button>
            <input
              type="text"
              placeholder="Kërko përdorues..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="search-input"
            />
            <div className="filter-export-container">
  <div>
    <label htmlFor="userSortSelect"><strong>Filtro sipas rolit: </strong></label>
    <select
      id="userSortSelect"
      value={userSortOption}
      onChange={(e) => setUserSortOption(e.target.value)}
    >
      <option value="">Të gjithë</option>
      <option value="admin">Vetëm ADMIN</option>
      <option value="user">Vetëm USER</option>
    </select>
  </div>

  <div>
    <label htmlFor="exportUsers"><strong>Eksporto: </strong></label>
    <select
      id="exportUsers"
      value={exportFormatUsers}
      onChange={(e) => {
        const selectedFormat = e.target.value;
        setExportFormatUsers(selectedFormat);
        if (selectedFormat) exportData(users, selectedFormat, "Users");
      }}
    >
      <option value="">Zgjedh formatin</option>
      <option value="json">JSON</option>
      <option value="csv">CSV</option>
      <option value="excel">Excel</option>
    </select>
  </div>
</div>


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
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="edit-btn"
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditUserModalOpen(true);
                        }}
                      >
                        Edito
                      </button>{" "}
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm("A je i sigurt që dëshiron të fshish këtë përdorues?")) {
                            axios
                              .delete(`http://localhost:8800/api/users/${user.id}`, { withCredentials: true })
                              .then(fetchUsers)
                              .catch(console.error);
                          }
                        }}
                      >
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination për përdorues */}
            <div className="pagination">
              <button
                disabled={currentPageUsers === 1}
                onClick={() => setCurrentPageUsers((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>
              <span>
                {currentPageUsers} / {totalPagesUsers}
              </span>
              <button
                disabled={currentPageUsers === totalPagesUsers}
                onClick={() => setCurrentPageUsers((p) => Math.min(p + 1, totalPagesUsers))}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* MESSAGES SECTION */}
        {activeSection === "messages" && (
          <>
            <h2>Mesazhet</h2>
            <input
              type="text"
              placeholder="Kërko mesazhe..."
              value={messageSearch}
              onChange={(e) => setMessageSearch(e.target.value)}
              className="search-input"
            />
           <div className="filter-export-container">
  <div>
    <label htmlFor="messageSortOption"><strong>Filtro sipas: </strong></label>
    <select
      id="messageSortOption"
      value={messageSortOption}
      onChange={(e) => setMessageSortOption(e.target.value)}
    >
      <option value="">Pa filtër</option>
      <option value="newest">Data (New → Old)</option>
      <option value="oldest">Data (Old → New)</option>
      <option value="gmail">Email (Gmail)</option>
      <option value="outlook">Email (Outlook)</option>
    </select>
  </div>

  <div>
    <label htmlFor="exportMessages"><strong>Eksporto: </strong></label>
    <select
      id="exportMessages"
      value={exportFormatMessages}
      onChange={(e) => {
        const selectedFormat = e.target.value;
        setExportFormatMessages(selectedFormat);
        if (selectedFormat) exportData(messages, selectedFormat, "Messages");
      }}
    >
      <option value="">Zgjedh formatin</option>
      <option value="json">JSON</option>
      <option value="csv">CSV</option>
      <option value="excel">Excel</option>
    </select>
  </div>
</div>


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
                {filteredMessages.map((msg, idx) => (
                  <tr key={idx}>
                    <td>{msg.name}</td>
                    <td>{msg.lastname}</td>
                    <td>{msg.email}</td>
                    <td>{msg.phone}</td>
                    <td>{msg.message}</td>
                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination për mesazhet */}
            <div className="pagination">
              <button
                disabled={currentPageMessages === 1}
                onClick={() => setCurrentPageMessages((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>
              <span>
                {currentPageMessages} / {totalPagesMessages}
              </span>
              <button
                disabled={currentPageMessages === totalPagesMessages}
                onClick={() => setCurrentPageMessages((p) => Math.min(p + 1, totalPagesMessages))}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* ORDERS SECTION */}
        {activeSection === "orders" && (
          <>
            <h2>Porositë</h2>
            <input
              type="text"
              placeholder="Kërko porosi..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="search-input"
            />
          <div className="filter-export-container">
  <div>
    <label htmlFor="orderSortSelect"><strong>Filtro sipas: </strong></label>
    <select
      id="orderSortSelect"
      value={orderSortOption}
      onChange={(e) => setOrderSortOption(e.target.value)}
    >
      <option value="">Pa filtër</option>
      <option value="priceAsc">Çmimi (Low → High)</option>
      <option value="priceDesc">Çmimi (High → Low)</option>
      <option value="dateAsc">Data (Old → New)</option>
      <option value="dateDesc">Data (New → Old)</option>
    </select>
  </div>

  <div>
    <label htmlFor="exportOrders"><strong>Eksporto: </strong></label>
    <select
      id="exportOrders"
      value={exportFormatOrders}
      onChange={(e) => {
        const selectedFormat = e.target.value;
        setExportFormatOrders(selectedFormat);
        if (selectedFormat) exportData(orders, selectedFormat, "Orders");
      }}
    >
      <option value="">Zgjedh formatin</option>
      <option value="json">JSON</option>
      <option value="csv">CSV</option>
      <option value="excel">Excel</option>
    </select>
  </div>
</div>



            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Përdoruesi</th>
                  <th>Produkti</th>
                  <th>Çmimi</th>
                  <th>Data e porosisë</th>
                  <th>Statusi</th>
                  <th>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.username || order.userId}</td>
                    <td>{order.apartmentName || order.apartmentId}</td>
                    <td>{order.apartmentPrice ? `$${order.apartmentPrice}` : "-"}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>{order.status || "N/A"}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingOrder(order);
                          setIsEditOrderModalOpen(true);
                        }}
                      >
                        Edito
                      </button>{" "}
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm("A je i sigurt që dëshiron të fshish këtë porosi?")) {
                            axios
                              .delete(`http://localhost:8800/api/orders/${order.id}`, { withCredentials: true })
                              .then(fetchOrders)
                              .catch(console.error);
                          }
                        }}
                      >
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination për porositë */}
            <div className="pagination">
              <button
                disabled={currentPageOrders === 1}
                onClick={() => setCurrentPageOrders((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>
              <span>
                {currentPageOrders} / {totalPagesOrders}
              </span>
              <button
                disabled={currentPageOrders === totalPagesOrders}
                onClick={() => setCurrentPageOrders((p) => Math.min(p + 1, totalPagesOrders))}
              >
                Next
              </button>
            </div>
          </>
        )}
{activeSection === "reports" && <ReportsSection users={users} messages={messages} orders={orders} />}

        {/* MODAL: SHTO PËRDORUES */}
        {isAddModalOpen && (
          <Modal onClose={() => setIsAddModalOpen(false)}>
            <h3>Shto përdorues</h3>
            <form onSubmit={handleAddUser} className="add-user-form">
              <input
                type="text"
                placeholder="Emri"
                value={newUser.username}
                onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="Fjalëkalimi"
                value={newUser.password}
                onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button type="submit">Shto</button>
              <button type="button" onClick={() => setIsAddModalOpen(false)}>
                Anulo
              </button>
            </form>
          </Modal>
        )}

        {/* MODAL: EDITO PËRDORUES */}
        {isEditUserModalOpen && editingUser && (
          <Modal onClose={() => setIsEditUserModalOpen(false)}>
            <h3>Edito përdorues</h3>
            <form onSubmit={handleEditUser} className="edit-user-form">
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, role: e.target.value }))}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button type="submit">Ruaj</button>
              <button type="button" onClick={() => setIsEditUserModalOpen(false)}>
                Anulo
              </button>
            </form>
          </Modal>
        )}

        {/* MODAL: EDITO POROSI */}
        {isEditOrderModalOpen && editingOrder && (
          <Modal onClose={() => setIsEditOrderModalOpen(false)}>
            <h3>Edito porosi</h3>
            <form onSubmit={handleEditOrder} className="edit-order-form">
              <label>Statusi:</label>
              <select
                value={editingOrder.status}
                onChange={(e) => setEditingOrder((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>

              <label>Data e porosisë:</label>
              <input
                type="datetime-local"
                value={editingOrder.orderDate ? new Date(editingOrder.orderDate).toISOString().slice(0, 16) : ""}
                onChange={(e) => setEditingOrder((prev) => ({ ...prev, orderDate: e.target.value }))}
              />

              <button type="submit">Ruaj</button>
              <button type="button" onClick={() => setIsEditOrderModalOpen(false)}>
                Anulo
              </button>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
