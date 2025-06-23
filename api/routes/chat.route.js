// import express from "express";
// import {
//   getChats,
//   getChat,
//   addChat,
//   readChat,
// } from "../controllers/chat.controller.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// router.get("/", verifyToken, getChats);
// router.get("/:id", verifyToken, getChat);
// router.post("/", verifyToken, addChat);
// router.put("/read/:id", verifyToken, readChat);

// export default router;
import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
  getUserByUsername,
  deleteChat,
  // getChatWithUser
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);
router.get("/username/:username", verifyToken, getUserByUsername); 
router.delete("/:id", verifyToken, deleteChat);
// router.get("/with/:userId", verifyToken, getChatWithUser);

export default router;
