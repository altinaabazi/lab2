import { useState } from "react";
import "./chat.scss";

function Chat() {
  const [chat, setChat] = useState(null);

  const handleSelect = (user) => {
    setChat(user); // user mund të jetë emri apo objekti i përdoruesit
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>

        {["Blenda", "Altin", "Vlerona", "Dren"].map((user, index) => (
          <div className="message" key={index} onClick={() => handleSelect(user)}>
            <img src="/noavatar.jpg" alt="" />
            <span>{user}</span>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src="/logo.png" alt="" />
              {chat}
            </div>
            <span className="close" onClick={() => setChat(null)}>x</span>
          </div>

          <div className="center">
            <div className="chatMessage own">
              <p>Hello {chat}, how are you?</p>
              <span>2 mins ago</span>
            </div>
            <div className="chatMessage">
              <p>I’m good, thank you! How about you?</p>
              <span>1 min ago</span>
            </div>
            <div className="chatMessage own">
              <p>Just working on the new project.</p>
              <span>Just now</span>
            </div>
          </div>

          <div className="bottom">
            <textarea placeholder="Type your message..." />
            <button>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
