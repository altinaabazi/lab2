import React from "react";
import "./customAlertModal.scss";

function CustomAlertModal({ message, type = "success", onClose, onConfirm }) {
  if (!message) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className={`custom-alert-modal ${type}`}>
        <p>{message}</p>

     {type === "confirm" ? (
  <div className="buttons">
    <button className="confirm" onClick={onConfirm}>Confirm</button>
    <button className="cancel" onClick={onClose}>Cancel</button>
  </div>
) : type === "warning" && onConfirm ? (
  <div className="buttons">
    <button onClick={onConfirm}>Yes</button>
    <button onClick={onClose}  style={{ backgroundColor: "gray", color: "white", }}>No</button>
  </div>
) : (
  <button onClick={onClose}>OK</button>
)}

      </div>
    </div>
  );
}

export default CustomAlertModal;
