import React from "react";
import "./Modal.scss";

function Modal({ isOpen, onClose, onSubmit, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="modal-actions">
          <button onClick={onSubmit}>Ruaj</button>
          <button onClick={onClose}>Anulo</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
