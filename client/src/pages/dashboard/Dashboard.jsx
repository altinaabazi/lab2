import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Doughnut, Line, Bar } from "react-chartjs-2";
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
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.scss";

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

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      navigate("/");
      return;
    }

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

    fetchUsers();
  }, [currentUser, navigate]);

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

      <h2>Lista e përdoruesve</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Roli</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
