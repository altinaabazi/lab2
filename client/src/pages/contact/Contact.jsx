import "./contact.scss";
import ContactForm from "../../components/contactForm/ContactForm";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Contact() {
  const { currentUser } = useContext(AuthContext);

  // Vetëm përdoruesit me rol USER e shohin formën
  const canSeeForm = currentUser && currentUser.role === "USER";

  return (
    <section className="contactSection" id="contact">
      <div className="box">
        <h2>Na kontakto</h2>
        <p>
          Email: <a href="mailto:support@placepoint.com">support@placepoint.com</a>
        </p>
        <p>Telefon: +383 49 123 456</p>
        <p>Adresa: Prishtinë, Kosovë</p>
      </div>

      {canSeeForm ? (
        <ContactForm />
      ) : (
        <p>Vetëm përdoruesit standard mund të dërgojnë mesazh.</p>
      )}
    </section>
  );
}

export default Contact;
