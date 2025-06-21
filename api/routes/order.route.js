import express from "express";
import { createOrder, getOrders, updateOrder, deleteOrder, markApartmentAsSold } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/mark-sold", markApartmentAsSold);  // Ky endpoint POST ekziston

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
