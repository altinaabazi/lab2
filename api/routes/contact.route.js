// import express from 'express';
// const router = express.Router();

// // Mund të ruash në memory për tani ose në databazë më vonë
// let messages = [];

// router.post("/", (req, res) => {
//   const { name, lastname, email, phone, message } = req.body;

//   if (!name || !lastname || !email || !phone || !message) {
//     return res.status(400).json({ error: "Të gjitha fushat janë të detyrueshme." });
//   }

//   // Ruaje mesazhin në array
//   const newMessage = { name, lastname, email, phone, message, date: new Date() };
//   messages.push(newMessage);

//   console.log("Mesazh i ri:", newMessage); // Debug
//   return res.status(200).json({ message: "Mesazhi u ruajt me sukses." });
// });

// // Opsional: merr të gjitha mesazhet (për admin)
// router.get("/", (req, res) => {
//   res.json(messages);
// });

// export default router;
import express from 'express';
import { saveContactMessage,getContactMessages } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/', saveContactMessage);
router.get('/', getContactMessages);       // GET /api/contact  - për të marrë mesazhet

export default router;
