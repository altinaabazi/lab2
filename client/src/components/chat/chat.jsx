import { useState } from "react";
import "./chat.scss";

function Chat() {
  const [chat, setChat] = useState(null);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        <div className="message">
        <img src="/noavatar.jpg" alt="" />
        <span>Joe</span>
        <p>.....mesage</p>
        </div>
        <div className="message">
        <img src="/noavatar.jpg" alt="" />
        <span>Joe</span>
        <p>.....mesage</p>
        </div>
        <div className="message">
        <img src="/noavatar.jpg" alt="" />
        <span>Joe</span>
        <p>.....mesage</p>
        </div>
        <div className="message">
        <img src="/noavatar.jpg" alt="" />
        <span>Joe</span>
        <p>.....mesage</p>
        </div>
      </div>

      {<div className="chatBox">
        <div className="top">
          <div className="user">
            <img src="/logo.png" alt="" />
            john
          </div>
          <span className="close">x</span>
        </div>
        <div className="center">
          <div className="chatMessage own">
            <p>message here</p>
            <span>1 hour</span>
          </div>
          <div className="chatMessage">
            <p>message here</p>
            <span>1 hour</span>
          </div>
          <div className="chatMessage">
            <p>message here</p>
            <span>1 hour</span>
          </div>
          <div className="chatMessage own">
            <p>message here</p>
            <span>1 hour</span>
          </div>
        </div>
        <div className="bottom">
          <textarea name="" id=""></textarea>
          <button>Send</button>
        </div>
      </div>}
    </div>
  );
}

export default Chat;
