import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";


 const app = express();

 app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
 app.use(express.json());
 app.use(cookieParser());
 console.log(process.env.JWT_SECRET_KEY);  // Kontrolloni nëse është ngarkuar çelësi sekret



 app.use("/api/posts",postRoute);
 app.use("/api/auth",authRoute);
 app.use("/api/test",testRoute);



 app.listen(8800 , () => {
    console.log("Server is runnung");
 })