import { useContext, useState } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const navigate = useNavigate();

  if (currentUser) fetch();

  const handleUserClick = () => {
    navigate("/profile");
  };

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/placepoint.jpg" alt="logo" />
          <span>PlacePoint</span>
        </a>
        <a href="/">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        {currentUser.role === "ADMIN" && (
              <Link to="/dashboard">
                Dashboard
              </Link>
            )}
      </div>

      <div className="right">
        {currentUser ? (
          <div className="user" onClick={handleUserClick}>
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar" />
            <span>{currentUser.username}</span>
            {number > 0 && <div className="notification">{number}</div>}

          </div>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}

        <div className="menuIcon">
          <img
            src="/menu.png"
            alt="menu"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
           {currentUser?.role === "ADMIN" && (
            <a href="/dashboard">Dashboard</a>
          )}
          {!currentUser && (
            <>
              <a href="/login">Sign in</a>
              <a href="/register">Sign up</a>
            </>
          )}
         
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
