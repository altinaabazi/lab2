// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// function ReportsSection({ users, messages, orders }) {
//   const [reportType, setReportType] = useState("users");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [exportFormat, setExportFormat] = useState("json");

//   // Filtrim sipas dates për fushën createdAt ose orderDate
//   const filterByDate = (data, dateField) => {
//     if (!dateFrom && !dateTo) return data;
//     return data.filter(item => {
//       const itemDate = new Date(item[dateField]);
//       if (dateFrom && itemDate < new Date(dateFrom)) return false;
//       if (dateTo && itemDate > new Date(dateTo)) return false;
//       return true;
//     });
//   };

//   const getReportData = () => {
//     if (reportType === "users") {
//       return filterByDate(users, "createdAt");
//     } else if (reportType === "messages") {
//       return filterByDate(messages, "createdAt");
//     } else if (reportType === "orders") {
//       return filterByDate(orders, "orderDate");
//     }
//     return [];
//   };

//   // Funksion për eksport të dhënash
//   const exportData = () => {
//     const data = getReportData();

//     if (exportFormat === "json") {
//       const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//       saveAs(blob, `${reportType}_report.json`);
//     } else if (exportFormat === "csv") {
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Report");
//       const wbout = XLSX.write(wb, { bookType: "csv", type: "array" });
//       const blob = new Blob([wbout], { type: "text/csv;charset=utf-8;" });
//       saveAs(blob, `${reportType}_report.csv`);
//     } else if (exportFormat === "excel") {
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Report");
//       const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//       const blob = new Blob([wbout], { type: "application/octet-stream" });
//       saveAs(blob, `${reportType}_report.xlsx`);
//     }
//   };

//   return (
//     <div>
//       <h2>Gjenero Raport Dinamik</h2>
//       <div>
//         <label>Tipi i raportit: </label>
//         <select value={reportType} onChange={e => setReportType(e.target.value)}>
//           <option value="users">Përdoruesit</option>
//           <option value="messages">Mesazhet</option>
//           <option value="orders">Porositë</option>
//         </select>
//       </div>
//       <div>
//         <label>Data fillimit: </label>
//         <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
//       </div>
//       <div>
//         <label>Data mbarimit: </label>
//         <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
//       </div>
//       <div>
//         <label>Formati i eksportit: </label>
//         <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
//           <option value="json">JSON</option>
//           <option value="csv">CSV</option>
//           <option value="excel">Excel</option>
//         </select>
//       </div>
//       <button onClick={exportData}>Gjenero dhe Eksporto</button>
//     </div>
//   );
// }

// export default ReportsSection;
// // 
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ReportsSection({ users, messages, orders }) {
  const [reportType, setReportType] = useState("users");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exportFormat, setExportFormat] = useState("json");

  const filterByDate = (data, dateField) => {
    if (!dateFrom && !dateTo) return data;
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      if (dateFrom && itemDate < new Date(dateFrom)) return false;
      if (dateTo && itemDate > new Date(dateTo)) return false;
      return true;
    });
  };

  const getReportData = () => {
    if (reportType === "users") {
      return filterByDate(users, "createdAt");
    } else if (reportType === "messages") {
      return filterByDate(messages, "createdAt");
    } else if (reportType === "orders") {
      return filterByDate(orders, "orderDate");
    }
    return [];
  };

  const exportData = () => {
    const data = getReportData();

    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      saveAs(blob, `${reportType}_report.json`);
    } else if (exportFormat === "csv") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      const wbout = XLSX.write(wb, { bookType: "csv", type: "array" });
      const blob = new Blob([wbout], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${reportType}_report.csv`);
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, `${reportType}_report.xlsx`);
    }
  };

  // Dizajni profesional me CSS inline
  const styles = {
    container: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      maxWidth: "600px",
      margin: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
    },
    heading: {
      fontSize: "1.8rem",
      marginBottom: "25px",
      fontWeight: "700",
      textAlign: "center",
      color: " #2980b9",
      letterSpacing: "1px",
    },
    label: {
      display: "block",
      fontWeight: "600",
      marginBottom: "6px",
      marginTop: "20px",
      color: "#555",
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1.5px solid #ddd",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.3s ease",
      cursor: "pointer",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1.5px solid #ddd",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: " #2980b9",
    },
    button: {
      marginTop: "30px",
      width: "100%",
      backgroundColor: " #2980b9",
      color: "#fff",
      fontWeight: "700",
      padding: "14px",
      fontSize: "1.1rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 6px 15px rgba(0, 123, 255, 0.4)",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  // Optional: State për hover efekt tek butoni (opsionale)
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Gjenero Raport Dinamik</h2>

      <label style={styles.label} htmlFor="reportType">Tipi i raportit:</label>
      <select
        id="reportType"
        style={styles.select}
        value={reportType}
        onChange={e => setReportType(e.target.value)}
      >
        <option value="users">Përdoruesit</option>
        <option value="messages">Mesazhet</option>
        <option value="orders">Porositë</option>
      </select>

      <label style={styles.label} htmlFor="dateFrom">Data fillimit:</label>
      <input
        id="dateFrom"
        type="date"
        style={styles.input}
        value={dateFrom}
        onChange={e => setDateFrom(e.target.value)}
      />

      <label style={styles.label} htmlFor="dateTo">Data mbarimit:</label>
      <input
        id="dateTo"
        type="date"
        style={styles.input}
        value={dateTo}
        onChange={e => setDateTo(e.target.value)}
      />

      <label style={styles.label} htmlFor="exportFormat">Formati i eksportit:</label>
      <select
        id="exportFormat"
        style={styles.select}
        value={exportFormat}
        onChange={e => setExportFormat(e.target.value)}
      >
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="excel">Excel</option>
      </select>

      <button
        style={{
          ...styles.button,
          ...(btnHover ? styles.buttonHover : {}),
        }}
        onClick={exportData}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        Gjenero dhe Eksporto
      </button>
    </div>
  );
}

export default ReportsSection;
