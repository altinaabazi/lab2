import dotenv from "dotenv";  // Importojmë dotenv për të ngarkuar variablat e ambientit
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import contactRoute from "./routes/contact.route.js";
import orderRoute from "./routes/order.route.js"; // Importojmë order.route.js
import auditLogRouter from "./routes/auditLog.route.js"
// Ngarkojmë variablat nga skedari .env
dotenv.config();

const app = express();

// Përdorim një opsion të ri për CORS që lejon më shumë origjina
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Lejon të dy origjinat
  credentials: true, // Lejon përdorimin e cookies
};

app.use(cors(corsOptions)); // Aplikojmë CORS me këto mundësi

app.use(express.json());
app.use(cookieParser());

// Printojmë JWT_SECRET_KEY për të siguruar që është ngarkuar si duhet
console.log(process.env.JWT_SECRET_KEY); // Sigurohemi që ky nuk është undefined

// Rrugët e aplikacionit
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/contact", contactRoute);
app.use("/api/orders", orderRoute);  // Shtojmë rrugën për porositë
app.use("/api/audit-logs", auditLogRouter);

// Dëgjojmë për kërkesa në portin 8800
app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
