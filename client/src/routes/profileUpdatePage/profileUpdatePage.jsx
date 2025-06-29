import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import CustomAlertModal from "../../components/customAlertModal/CustomAlertModal";
function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const [alert, setAlert] = useState({ message: "", type: "", onConfirm: null });
  const showAlert = (message, type = "success", onConfirm = null) => {
    setAlert({ message, type, onConfirm });
  };
  const closeAlert = () => {
    setAlert({ message: "", type: "", onConfirm: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      updateUser(res.data);
      showAlert("Profili u përditësua me sukses!", "success", () => {
        closeAlert();
        navigate("/profile");
      });
    } catch (err) {
      console.log(err);
      const errMsg = err?.response?.data?.message || "Dështoi përditësimi!";
      showAlert(errMsg, "error");
    }

  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span>error</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] || currentUser.avatar || "/noavatar.jpg"} alt="" className="avatar" />
        <UploadWidget
          uwConfig={{
            cloudName: "lamdev",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
      <CustomAlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
      />

    </div>
  );
}

export default ProfileUpdatePage;