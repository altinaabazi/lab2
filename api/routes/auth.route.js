import express from "express";
import { logout, register,login } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/register" , (req,res) =>{
//         console.log("router works!")
//     })
//     router.post("/login" , (req,res) =>{
//         console.log("router works!")
//     })
//     router.post("/logout" , (req,res) =>{
//         console.log("router works!")
//     })
  
router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);








export default router;