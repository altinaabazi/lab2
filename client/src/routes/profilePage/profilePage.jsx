import './profilePage.scss';
import List from '../../components/list/List';
import Chat from '../../components/chat/chat';
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";

function ProfilePage() {

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = apiRequest.post("/auth/logout");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <button>Update Profile</button>
          </div>
          <div className="info">
            <span>Avatar:
                <img src="/noavatar.jpg" alt="foto" />
            </span>
            <span>Username: <b>Blenda</b></span>
            <span>E-mail: <b>user@gmail.com</b></span>
            <button onClick={handleLogout}>Logout</button>

            <div className="title">
              <h1>My List</h1>
              <button>Create New Post</button>
            </div>
           
          </div>
          <List />
            <div className="title">
              <h1>Saved List</h1>
            </div>
            <List />
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
            <Chat />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
