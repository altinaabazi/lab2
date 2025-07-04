// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import CustomAlertModal from "../../components/customAlertModal/CustomAlertModal";
// function AuditLogTable() {
//   const [logs, setLogs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [confirmCallback, setConfirmCallback] = useState(null);

//   const showAlert = (message, type = "success", onConfirm = null) => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setConfirmCallback(() => onConfirm); // ruan funksionin në state
//   };

//   const closeAlert = () => {
//     setAlertMessage("");
//     setAlertType("success");
//     setConfirmCallback(null);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const logsResponse = await axios.get("http://localhost:8800/api/audit-logs", {
//         withCredentials: true,
//       });
//       const usersResponse = await axios.get("http://localhost:8800/api/users", {
//         withCredentials: true,
//       });

//       let logsData = logsResponse.data;
//       if (typeof logsData === "string") logsData = JSON.parse(logsData);

//       let usersData = usersResponse.data;
//       if (typeof usersData === "string") usersData = JSON.parse(usersData);

//       if (!Array.isArray(logsData) || !Array.isArray(usersData)) {
//         setError("Data format error: Expected arrays.");
//         setLogs([]);
//         setUsers([]);
//         return;
//       }

//       const usersMap = new Map(usersData.map(user => [user.id, user]));

//       const updatedLogs = logsData.map(log => {
//         let newMessage = log.message || "";

//         if (log.targetId && usersMap.has(log.targetId)) {
//           const targetUser = usersMap.get(log.targetId);
//           const targetString = `${targetUser.username} (${targetUser.email})`;

//           // Pavarësisht action-it (update/delete), shfaq vetëm targetin
//           newMessage = targetString;
//         }

//         return { ...log, message: newMessage };
//       });

//       setLogs(updatedLogs);
//       setUsers(usersData);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch data");
//       setLogs([]);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Funksion për fshirjen e të gjithë audit logs
//   const handleDeleteAll = async () => {
//     showAlert(
//       "A jeni i sigurt që doni të fshini të gjithë audit logs?",
//       "confirm",
//       async () => {
//         try {
//           await axios.delete("http://localhost:8800/api/audit-logs", { withCredentials: true });
//           showAlert("Audit logs u fshinë me sukses!", "success");
//           fetchData();
//         } catch (error) {
//           showAlert("Dështoi fshirja e audit logs!", "error");
//           console.error(error);
//         }
//       }
//     );
//   };

//   // Shto këtë funksion për fshirje të veçantë
//   const handleDelete = async (id) => {
//     showAlert(
//       "A jeni i sigurt që doni të fshini këtë audit log?",
//       "confirm",
//       async () => {
//         try {
//           await axios.delete(`http://localhost:8800/api/audit-logs/${id}`, {
//             withCredentials: true,
//           });
//           showAlert("Audit log u fshi me sukses!", "success");
//           fetchData();
//         } catch (error) {
//           showAlert("Dështoi fshirja e audit log!", "error");
//           console.error(error);
//         }
//       }
//     );
//   };



//   const getUsernameById = (userId) => {
//     const user = users.find((u) => u.id === userId);
//     return user ? user.username : "Unknown";
//   };

//   if (loading) return <p>Loading audit logs...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h3>Audit Logs</h3>
//       <button onClick={handleDeleteAll} style={{ marginBottom: "1rem", backgroundColor: "#c62311", color: "white", padding: "0.5rem 1rem", border: "none", cursor: "pointer" }}>
//         Delete All
//       </button>
//       <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
//         <thead>
//           <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
//             <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Data</th>
//             <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Përdoruesi</th>
//             <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Veprimi</th>
//             <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Mesazhi</th>
//             <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Veprime</th> {/* Shtojmë këtë */}
//           </tr>
//         </thead>
//         <tbody>
//           {logs.length > 0 ? (
//             logs.map((log) => (
//               <tr key={log.id} style={{ borderBottom: "1px solid #ddd" }}>
//                 <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>{new Date(log.createdAt).toLocaleString()}</td>
//                 <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>{getUsernameById(log.userId)}</td>
//                 <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>{log.action}</td>
//                 <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>{log.message}</td>
//                 <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>
//                   <button
//                     onClick={() => handleDelete(log.id)}
//                     style={{ backgroundColor: "#c62311", color: "white", border: "none", padding: "0.3rem 0.7rem", cursor: "pointer" }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
//                 Nuk ka të dhëna për audit logs.
//               </td>
//             </tr>
//           )}
//         </tbody>

//       </table>
//       <CustomAlertModal
//         message={alertMessage}
//         type={alertType}
//         onClose={closeAlert}
//         onConfirm={confirmCallback}
//       />

//     </div>
//   );
// }

// export default AuditLogTable;
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomAlertModal from "../../components/customAlertModal/CustomAlertModal";

function AuditLogTable() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [confirmCallback, setConfirmCallback] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const showAlert = (message, type = "success", onConfirm = null) => {
    setAlertMessage(message);
    setAlertType(type);
    setConfirmCallback(() => onConfirm);
  };

  const closeAlert = () => {
    setAlertMessage("");
    setAlertType("success");
    setConfirmCallback(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const logsResponse = await axios.get("http://localhost:8800/api/audit-logs", {
        withCredentials: true,
      });
      const usersResponse = await axios.get("http://localhost:8800/api/users", {
        withCredentials: true,
      });

      let logsData = logsResponse.data;
      if (typeof logsData === "string") logsData = JSON.parse(logsData);

      let usersData = usersResponse.data;
      if (typeof usersData === "string") usersData = JSON.parse(usersData);

      if (!Array.isArray(logsData) || !Array.isArray(usersData)) {
        setError("Data format error: Expected arrays.");
        setLogs([]);
        setUsers([]);
        return;
      }

      const usersMap = new Map(usersData.map(user => [user.id, user]));

      const updatedLogs = logsData.map(log => {
        let newMessage = log.message || "";

        if (log.targetId && usersMap.has(log.targetId)) {
          const targetUser = usersMap.get(log.targetId);
          const targetString = `${targetUser.username} (${targetUser.email})`;
          newMessage = targetString;
        }

        return { ...log, message: newMessage };
      });

      setLogs(updatedLogs);
      setUsers(usersData);
      setError(null);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setLogs([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    showAlert(
      "A jeni i sigurt që doni të fshini të gjithë audit logs?",
      "confirm",
      async () => {
        try {
          await axios.delete("http://localhost:8800/api/audit-logs", { withCredentials: true });
          showAlert("Audit logs u fshinë me sukses!", "success");
          fetchData();
        } catch (error) {
          showAlert("Dështoi fshirja e audit logs!", "error");
          console.error(error);
        }
      }
    );
  };

  const handleDelete = async (id) => {
    showAlert(
      "Are you sure you want to delete this audit log?",
      "confirm",
      async () => {
        try {
          await axios.delete(`http://localhost:8800/api/audit-logs/${id}`, {
            withCredentials: true,
          });
          showAlert("Audit log deleted successfully!", "success");
          fetchData();
        } catch (error) {
          showAlert("Failed to delete the audit log!", "error");
          console.error(error);
        }
      }
    );
  };

  const getUsernameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : "Unknown";
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  if (loading) return <p>Loading audit logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Audit Logs</h3>
      <button
        onClick={handleDeleteAll}
        style={{
          marginBottom: "1rem",
          backgroundColor: "#c62311",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        Delete All
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Data</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Përdoruesi</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Veprimi</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Mesazhi</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.length > 0 ? (
            currentLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>
                  {getUsernameById(log.userId)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>{log.action}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>{log.message}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem 1rem" }}>
                  <button
                    onClick={() => handleDelete(log.id)}
                    style={{
                      backgroundColor: "#c62311",
                      color: "white",
                      border: "none",
                      padding: "0.3rem 0.7rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                No data available for audit logs.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination style si që ke kërkuar */}
      <div className="pagination" style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          style={{ marginRight: "1rem" }}
        >
          Prev
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          style={{ marginLeft: "1rem" }}
        >
          Next
        </button>
      </div>

      <CustomAlertModal
        message={alertMessage}
        type={alertType}
        onClose={closeAlert}
        onConfirm={confirmCallback}
      />
    </div>
  );
}

export default AuditLogTable;
