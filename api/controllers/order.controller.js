import prisma from "../lib/prisma.js";
import Stripe from "stripe";
import { getSqlPool, sql } from "../lib/sql.js";

// Inicjalizo Stripe me çelësin sekret nga .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Krijimi i një porosie të re
export const createOrder = async (req, res) => {
    const { userId, apartmentId, amount } = req.body;

    // Validimi i input-it
    if (!userId || !apartmentId || !amount) {
        return res.status(400).json({ message: "UserId, ApartmentId dhe amount janë të nevojshme" });
    }

    try {
        // 1. Krijo një Payment Intent në Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // në cent (p.sh. 25000 për 250 USD)
            currency: "usd",
            payment_method_types: ["card"],
            metadata: {
                userId,
                apartmentId,
            },
        });

        // 2. Lidhe me databazën dhe ruaj porosinë me status "pending"
        const pool = await getSqlPool();

        await pool.request()
            .input("UserId", sql.NVarChar(50), userId)
            .input("ApartmentId", sql.NVarChar(24), apartmentId)
            .input("PaymentIntentId", sql.NVarChar(100), paymentIntent.id)
            .input("OrderDate", sql.DateTime, new Date())
            .input("Status", sql.NVarChar(20), "pending")
            .query(`
        INSERT INTO Orders (UserId, ApartmentId, PaymentIntentId, OrderDate, Status)
        VALUES (@UserId, @ApartmentId, @PaymentIntentId, @OrderDate, @Status)
      `);

        // 3. Kthe klientit client_secret për të vazhduar me pagesën në frontend
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            message: "Order created, please proceed with payment",
        });

    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Failed to create order" });
    }
};

// Merr të gjitha porositë (për admin dashboard ose histori)
// export const getOrders = async (req, res) => {
//   try {
//     const pool = await getSqlPool();
//     const result = await pool.request()
//       .query("SELECT * FROM Orders ORDER BY OrderDate DESC");

//     res.status(200).json(result.recordset);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get orders" });
//   }
// };

export const getOrders = async (req, res) => {
    try {
        const pool = await getSqlPool();
        const result = await pool.request()
            .query("SELECT * FROM Orders ORDER BY OrderDate DESC");

        const orders = result.recordset;

        // Merr të dhënat e userit dhe postit nga MongoDB për çdo porosi
        const populatedOrders = await Promise.all(
            orders.map(async (order) => {
                const user = await prisma.user.findUnique({
                    where: { id: order.UserId },
                });

                const post = await prisma.post.findUnique({
                    where: { id: order.ApartmentId },
                });

                return {
                    id: order.Id,
                    userId: order.UserId, // Në rast që e do
                    username: user?.username || user?.email || "Pa emër",
                    apartmentId: order.ApartmentId,
                    apartmentName: post?.title || post?.address || "Pa titull",
                    apartmentPrice: post?.price || null,  // Nëse ke fushën cmimi në post
                    orderDate: order.OrderDate,
                    status: order.Status,
                    paymentIntentId: order.PaymentIntentId,
                };

            })
        );

        res.status(200).json(populatedOrders);
    } catch (error) {
        console.error("Gabim në getOrders:", error);
        res.status(500).json({ message: "Failed to get enriched orders" });
    }
};




export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, orderDate } = req.body;

  // Kontrollo që të paktën statusi ose data të jenë të dërguara
  if (!status && !orderDate) {
    return res.status(400).json({
      message: "Duhet të dërgohet së paku statusi ose orderDate për përditësim",
    });
  }

  try {
    const pool = await getSqlPool();

    const updateFields = [];
    const inputs = [];

    if (status) {
      updateFields.push("Status = @Status");
      inputs.push({
        name: "Status",
        type: sql.NVarChar(20),
        value: status,
      });
    }

    if (orderDate) {
      updateFields.push("OrderDate = @OrderDate");
      inputs.push({
        name: "OrderDate",
        type: sql.DateTime,
        value: new Date(orderDate),
      });
    }

    const request = pool.request();

    inputs.forEach((input) => {
      request.input(input.name, input.type, input.value);
    });

    request.input("Id", sql.Int, id);

    const result = await request.query(`
      UPDATE Orders
      SET ${updateFields.join(", ")}
      WHERE Id = @Id
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Porosia nuk u gjet për përditësim" });
    }

    res.status(200).json({ message: "Porosia u përditësua me sukses" });
  } catch (error) {
    console.error("Gabim në updateOrder:", error);
    res.status(500).json({ message: "Nuk u përditësua porosia" });
  }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getSqlPool();

        await pool.request()
            .input("Id", sql.Int, id)
            .query("DELETE FROM Orders WHERE Id = @Id");

        res.status(200).json({ message: "Porosia u fshi me sukses" });

    } catch (error) {
        console.error("Gabim në deleteOrder:", error);
        res.status(500).json({ message: "Nuk u fshi porosia" });
    }
};
