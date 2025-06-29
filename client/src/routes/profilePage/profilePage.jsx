import Chat from "../../components/chat/chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CustomAlertModal from "../../components/customAlertModal/CustomAlertModal";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMyList, setShowMyList] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [confirmCallback, setConfirmCallback] = useState(null);

  const showAlert = (message, type = "success", onConfirm = null) => {
    setAlertMessage(message);
    setAlertType(type);
    setConfirmCallback(() => onConfirm);
  };

  const closeAlert = () => {
    setAlertMessage("");
    setAlertType("success");
    setConfirmCallback(null);
  };

const handleLogout = () => {
  showAlert("Are you sure you want to logout?", "warning", async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
      showAlert("Dështoi logout. Ju lutem provoni sërish.", "error");
    }
  });
};


  const toggleMyList = () => {
    setShowMyList(prev => !prev);
  };

  const toggleSavedList = () => {
    setShowSavedList(prev => !prev);
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              <img src={currentUser.avatar || "noavatar.jpg"} alt="User Avatar" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* My List Section */}
          <div className="title">
            <h1>My List</h1>
            <button onClick={toggleMyList}>
              {showMyList ? 'Hide My List' : 'Show My List'}
            </button>
          </div>
          {showMyList && (
            <Suspense fallback={<p>Loading...</p>}>
              <Await
                resolve={data.postResponse}
                errorElement={<p>Error loading posts!</p>}
              >
                {(postResponse) => <List posts={postResponse.data.userPosts} />}
              </Await>
            </Suspense>
          )}

          {/* Saved List Section */}
          <div className="title">
            <h1>Saved List</h1>
            <button onClick={toggleSavedList}>
              {showSavedList ? 'Hide Saved List' : 'Show Saved List'}
            </button>
          </div>
          {showSavedList && (
            <Suspense fallback={<p>Loading...</p>}>
              <Await
                resolve={data.postResponse}
                errorElement={<p>Error loading posts!</p>}
              >
                {(postResponse) => <List posts={postResponse.data.savedPosts} />}
              </Await>
            </Suspense>
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <CustomAlertModal
        message={alertMessage}
        type={alertType}
        onClose={closeAlert}
        onConfirm={confirmCallback}
      />

    </div>
  );
}

export default ProfilePage;
