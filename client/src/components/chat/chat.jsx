// import { useContext, useState, useEffect, useRef } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import apiRequest from "../../lib/apiRequest";
// import { format } from "timeago.js";
// import { SocketContext } from "../../context/SocketContext";
// import "./chat.scss";

// function Chat({ chats, setChats }) {
//   const [chat, setChat] = useState(null);
//   const [searchUsername, setSearchUsername] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { currentUser } = useContext(AuthContext);
//   const { socket } = useContext(SocketContext);
//   const messageEndRef = useRef();

//   // Updates the view to scroll to the latest message
//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chat]);

//   // Listen for incoming messages from the socket
//   useEffect(() => {
//     if (chat && socket) {
//       socket.on("getMessage", (data) => {
//         if (chat.id === data.chatId) {
//           setChat((prev) => ({
//             ...prev,
//             messages: prev.messages ? [...prev.messages, data] : [data],
//           }));
//           markAsRead();
//         }
//       });
//     }
//     return () => socket.off("getMessage");
//   }, [socket, chat]);

//   // Open a chat with a specific user
//   const handleOpenChat = async (id, receiver) => {
//     setLoading(true);
//     try {
//       const res = await apiRequest(`/chats/${id}`);
//       setChat({ ...res.data, receiver, messages: res.data.messages || [] });
//     } catch (err) {
//       console.error("Error opening chat:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search users by username
//   const handleSearch = async () => {
//     if (!searchUsername.trim()) {
//       setSearchResults([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await apiRequest.get(`/chats/username/${searchUsername}`);
//       setSearchResults(res.data ? [res.data] : []);
//     } catch (err) {
//       console.error("Error searching for user:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Start a new chat with a specific user
//   const startNewChat = async (receiver) => {
//     setLoading(true);
//     try {
//       const res = await apiRequest.post("/chats", { receiverId: receiver.id });
//       setChat({ ...res.data, receiver });
//     } catch (err) {
//       console.error("Error starting new chat:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send a new message
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const text = e.target.text.value.trim();
//     if (!text) return;

//     try {
//       const res = await apiRequest.post(`/messages/${chat.id}`, { text });
//       setChat((prev) => ({
//         ...prev,
//         messages: prev.messages ? [...prev.messages, res.data] : [res.data],
//       }));
//       e.target.reset();
//       socket.emit("sendMessage", { receiverId: chat.receiver.id, data: res.data });
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   // Mark the chat as read
//   const markAsRead = async () => {
//     try {
//       await apiRequest.put(`/chats/read/${chat.id}`);
//     } catch (err) {
//       console.error("Error marking chat as read:", err);
//     }
//   };

//   // Delete a chat
//   const handleDeleteChat = async (chatId) => {
//     if (window.confirm("Are you sure you want to delete this chat?")) {
//       try {
//         await apiRequest.delete(`/chats/${chatId}`);
//         setChat(null);
//         alert("Chat deleted successfully.");
//         const updatedChats = chats.filter((chat) => chat.id !== chatId);
//         setChats(updatedChats);
//       } catch (err) {
//         console.error("Error deleting chat:", err);
//         alert("An error occurred while deleting the chat.");
//       }
//     }
//   };

//   // Handle closing the chat when clicking on the header
//   const handleCloseChat = () => {
//     setChat(null); // Close the current chat
//   };

//   return (
//     <div className="chat">
//       <div className="search">
//         <input
//           type="text"
//           placeholder="Search for users..."
//           value={searchUsername}
//           onChange={(e) => setSearchUsername(e.target.value)}
//         />
//         <button onClick={handleSearch} disabled={loading}>
//           {loading ? "Searching..." : "Search"}
//         </button>
//         {searchUsername && (
//           <div className="searchResults">
//             {searchResults.length > 0 ? (
//               searchResults.map((user) => (
//                 <div
//                   key={user.id}
//                   className="searchResultItem"
//                   onClick={() => startNewChat(user)}
//                 >
//                   <img src={user.avatar || "/noavatar.jpg"} alt={user.username} />
//                   <span>{user.username}</span>
//                 </div>
//               ))
//             ) : (
//               <div>No users found</div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="messages">
//         {chats.map((c) => (
//           <div
//             className="message"
//             key={c.id}
//             onClick={() => handleOpenChat(c.id, c.receiver)}
//             style={{
//               backgroundColor:
//                 c.seenBy?.includes(currentUser.id) || chat?.id === c.id
//                   ? "white"
//                   : "#fecd514e",
//             }}
//           >
//             <img src={c.receiver?.avatar || "/noavatar.jpg"} alt="" />
//             <span>{c.receiver?.username || "Unknown User"}</span>
//             <p>{c.lastMessage || ""}</p>
//           </div>
//         ))}
//       </div>

//       {chat && (
//         <div className="chatBox">
//           <div className="top" onClick={handleCloseChat}>
//             <div className="user">
//               <img src={chat.receiver?.avatar || "/noavatar.jpg"} alt="" />
//               {chat.receiver?.username || "Unknown User"}
//             </div>
//             {/* Conditionally render or disable the close button */}
//             {!loading && (
//               <span className="close" onClick={handleCloseChat}>
                
//               </span>
//             )}
//             {/* Alternatively, disable the delete button while loading */}
//             <button
//               className="deleteChatBtn"
//               onClick={() => handleDeleteChat(chat.id)}
//               disabled={loading}
//             >
//               <i className="fas fa-trash"></i> Delete Chat
//             </button>
//           </div>
//           <div className="center">
//             {chat?.messages?.length > 0 ? (
//               chat.messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className="chatMessage"
//                   style={{
//                     alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
//                     textAlign: message.userId === currentUser.id ? "right" : "left",
//                   }}
//                 >
//                   <p>{message.text}</p>
//                   <span>{format(message.createdAt)}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No messages yet</p>
//             )}
//             <div ref={messageEndRef}></div>
//           </div>
//           <form onSubmit={handleSubmit} className="bottom">
//             <textarea name="text" placeholder="Type a message..."></textarea>
//             <button type="submit" disabled={loading}>
//               {loading ? "Sending..." : "Send"}
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Chat;
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import "./chat.scss";

function Chat({ chats, setChats }) {
  const [chat, setChat] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();

  // Zustend store functions për njoftime
  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const decreaseNotifications = useNotificationStore((state) => state.decrease);

  // Scroll në mesazhin e fundit
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  // Listen për mesazhe të reja nga socket
  useEffect(() => {
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: prev.messages ? [...prev.messages, data] : [data],
          }));
          markAsRead();
          fetchNotifications(); // Përditëso numrin e njoftimeve në navbar
        }
      });
    }
    return () => socket?.off("getMessage");
  }, [socket, chat, fetchNotifications]);

  // Hap chat me përdorues të caktuar
  const handleOpenChat = async (id, receiver) => {
    setLoading(true);
    try {
      const res = await apiRequest(`/chats/${id}`);
      setChat({ ...res.data, receiver, messages: res.data.messages || [] });

      // Marko si lexuar dhe ul numrin e njoftimeve
      await apiRequest.put(`/chats/read/${id}`);
      decreaseNotifications();
    } catch (err) {
      console.error("Error opening chat:", err);
    } finally {
      setLoading(false);
    }
  };

  // Kërko përdorues për username
  const handleSearch = async () => {
    if (!searchUsername.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest.get(`/chats/username/${searchUsername}`);
      setSearchResults(res.data ? [res.data] : []);
    } catch (err) {
      console.error("Error searching for user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fill chat të ri me përdorues
  const startNewChat = async (receiver) => {
    setLoading(true);
    try {
      const res = await apiRequest.post("/chats", { receiverId: receiver.id });
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.error("Error starting new chat:", err);
    } finally {
      setLoading(false);
    }
  };

  // Dërgo mesazh të ri
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;

    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, { text });
      setChat((prev) => ({
        ...prev,
        messages: prev.messages ? [...prev.messages, res.data] : [res.data],
      }));
      e.target.reset();
      socket.emit("sendMessage", { receiverId: chat.receiver.id, data: res.data });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Marko chat si lexuar
  const markAsRead = async () => {
    try {
      await apiRequest.put(`/chats/read/${chat.id}`);
    } catch (err) {
      console.error("Error marking chat as read:", err);
    }
  };

  // Fshi chat
  const handleDeleteChat = async (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        await apiRequest.delete(`/chats/${chatId}`);
        setChat(null);
        alert("Chat deleted successfully.");
        const updatedChats = chats.filter((c) => c.id !== chatId);
        setChats(updatedChats);
      } catch (err) {
        console.error("Error deleting chat:", err);
        alert("An error occurred while deleting the chat.");
      }
    }
  };

  // Mbyll chat-in aktual
  const handleCloseChat = () => {
    setChat(null);
  };

  return (
    <div className="chat">
      <div className="search">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        {searchUsername && (
          <div className="searchResults">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  className="searchResultItem"
                  onClick={() => startNewChat(user)}
                >
                  <img src={user.avatar || "/noavatar.jpg"} alt={user.username} />
                  <span>{user.username}</span>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>

      <div className="messages">
        {chats.map((c) => (
          <div
            key={c.id}
            className={`message ${
              !c.seenBy?.includes(currentUser.id) && chat?.id !== c.id ? "unread" : ""
            }`}
            onClick={() => handleOpenChat(c.id, c.receiver)}
            style={{ cursor: "pointer" }}
          >
            <img src={c.receiver?.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver?.username || "Unknown User"}</span>
            <p>{c.lastMessage || ""}</p>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top" onClick={handleCloseChat}>
            <div className="user">
              <img src={chat.receiver?.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver?.username || "Unknown User"}
            </div>
            {!loading && (
              <span className="close" onClick={handleCloseChat}>
                &times;
              </span>
            )}
            <button
              className="deleteChatBtn"
              onClick={() => handleDeleteChat(chat.id)}
              disabled={loading}
            >
              <i className="fas fa-trash"></i> Delete Chat
            </button>
          </div>
          <div className="center">
            {chat?.messages?.length > 0 ? (
              chat.messages.map((message) => (
                <div
                  key={message.id}
                  className="chatMessage"
                  style={{
                    alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                    textAlign: message.userId === currentUser.id ? "right" : "left",
                  }}
                >
                  <p>{message.text}</p>
                  <span>{format(message.createdAt)}</span>
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type a message..."></textarea>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
