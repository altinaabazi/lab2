import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

// Përdorim një opsion të ri për CORS që lejon më shumë origjina
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Lejon të dy origjinat
  credentials: true, // Lejon përdorimin e cookies
};

app.use(cors(corsOptions)); // Aplikoni CORS me këto mundësi

app.use(express.json());
app.use(cookieParser());
console.log(process.env.JWT_SECRET_KEY); 

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/test", testRoute);

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
