// src/components/Footer.jsx
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} PlacePoint. Të gjitha të drejtat e rezervuara.</p>
    </footer>
  );
}

export default Footer;
