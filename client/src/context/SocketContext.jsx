//Autentifikim dhe komunikim në kohë reale me përdorues online.
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket.current && currentUser) {
      socket.current.emit("newUser", {
        userId: currentUser.id,
        username: currentUser.username,
      });
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};
