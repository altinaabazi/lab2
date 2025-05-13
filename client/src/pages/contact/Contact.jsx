// src/components/Contact.jsx
import "./contact.scss";

function Contact() {
  return (
    <section className="contactSection" id="contact">
      <div className="box">
        <h2>Na kontakto</h2>
        <p>Email: <a href="mailto:support@placepoint.com">support@placepoint.com</a></p>
        <p>Telefon: +383 49 123 456</p>
        <p>Adresa: Prishtinë, Kosovë</p>
      </div>
    </section>
  );
}

export default Contact;
