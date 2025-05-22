import { useState } from "react";
import './contactForm.scss';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Duke dërguar...");

    try {
      const res = await fetch("http://localhost:8800/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Mesazhi u dërgua me sukses!");
        setFormData({
          name: "",
          lastname: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setStatus("Gabim gjatë dërgimit. Provoni përsëri.");
      }
    } catch (error) {
      console.error("Gabim:", error);
      setStatus("Gabim gjatë dërgimit. Provoni përsëri.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contactForm">
      <div className="nameRow">
        <input
          type="text"
          name="name"
          placeholder="Emri"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Mbiemri"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Numri i telefonit"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Mesazhi"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <button type="submit">Dërgo</button>
      <p>{status}</p>
    </form>
  );
}

export default ContactForm;
