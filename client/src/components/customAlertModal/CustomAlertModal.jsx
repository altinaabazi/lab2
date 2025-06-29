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
    <button className="confirm" onClick={onConfirm}>Po, fshije</button>
    <button className="cancel" onClick={onClose}>Anulo</button>
  </div>
) : type === "warning" && onConfirm ? (
  <div className="buttons">
    <button onClick={onConfirm}>Po</button>
    <button onClick={onClose}>Jo</button>
  </div>
) : (
  <button onClick={onClose}>OK</button>
)}

      </div>
    </div>
  );
}

export default CustomAlertModal;
