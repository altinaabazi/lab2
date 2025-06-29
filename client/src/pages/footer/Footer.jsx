// src/components/Footer.jsx
import "./Footer.scss";

function Footer() {
  return (
     <footer className="footer">
      <p>&copy; {new Date().getFullYear()} PlacePoint. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
