import express from "express";
import { createOrder, getOrders, updateOrder, deleteOrder, markApartmentAsSold } from "../controllers/order.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/mark-sold", markApartmentAsSold); 
router.post("/",createOrder);
router.get("/",verifyToken, getOrders);
router.put("/:id",verifyToken, updateOrder);
router.delete("/:id",verifyToken, deleteOrder);

export default router;
