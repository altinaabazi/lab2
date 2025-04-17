import './profilePage.scss';
import List from '../../components/list/List';
import Chat from '../../components/chat/chat';

function ProfilePage() {
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
            <span>E-mail: <b>user@gmial.com</b></span>

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
