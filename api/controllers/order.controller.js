import prisma from "../lib/prisma.js";
import Stripe from "stripe";
import { getSqlPool, sql } from "../lib/sql.js";

// Inicjalizo Stripe me çelësin sekret nga .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ===========================
// Krijimi i një porosie të re
// ===========================
export const createOrder = async (req, res) => {
  const {
    userId,
    apartmentId,
    amount,
    paymentMethod,
    customerName,
    customerPhone,
    customerEmail,
  } = req.body;

  if (!userId || !apartmentId || !amount || !paymentMethod) {
    return res
      .status(400)
      .json({ message: "UserId, ApartmentId, amount dhe paymentMethod janë të nevojshme" });
  }

  try {
    // Kontrollo në MongoDB nëse apartamenti është shitur
    const apartment = await prisma.post.findUnique({
      where: { id: apartmentId },
    });

    if (!apartment) {
      return res.status(404).json({ message: "Apartamenti nuk u gjet" });
    }

    if (apartment.isSold) {
      return res.status(400).json({ message: "Apartamenti është tashmë i shitur" });
    }

    const pool = await getSqlPool();

    if (paymentMethod === "cash") {
      // Ruaj porosinë direkt me status 'completed' sepse nuk ka pagesë me Stripe
      await pool.request()
        .input("UserId", sql.NVarChar(50), userId)
        .input("ApartmentId", sql.NVarChar(24), apartmentId)
        .input("PaymentIntentId", sql.NVarChar(100), null)
        .input("OrderDate", sql.DateTime, new Date())
        .input("Status", sql.NVarChar(20), "completed")
        .query(`
          INSERT INTO Orders (UserId, ApartmentId, PaymentIntentId, OrderDate, Status)
          VALUES (@UserId, @ApartmentId, @PaymentIntentId, @OrderDate, @Status)
        `);

      // Përditëso MongoDB për banesën si të shitur
      await prisma.post.update({
        where: { id: apartmentId },
        data: { isSold: true },
      });

      return res.status(201).json({ message: "Porosia me cash u krijua me sukses." });

    } else if (paymentMethod === "stripe") {
      // Krijo PaymentIntent në Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { userId, apartmentId },
      });

      // Ruaj porosinë me status pending
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

      return res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        message: "Order created, please proceed with payment",
      });
    } else {
      return res.status(400).json({ message: "Mënyra e pagesës nuk mbështetet" });
    }
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// =====================================
// Përditëso statusin e apartamentit si 'sold' pas suksesit me Stripe
// =====================================
export const markApartmentAsSold = async (req, res) => {
  const { apartmentId, paymentIntentId } = req.body;

  if (!apartmentId || !paymentIntentId) {
    return res
      .status(400)
      .json({ message: "ApartmentId dhe PaymentIntentId janë të nevojshme" });
  }

  try {
    const pool = await getSqlPool();

    // 1. Përditëso statusin në SQL
    await pool.request()
      .input("PaymentIntentId", paymentIntentId)
      .query(`UPDATE Orders SET Status = 'completed' WHERE PaymentIntentId = @PaymentIntentId`);

    // 2. Përditëso apartamentin në MongoDB
    await prisma.post.update({
      where: { id: apartmentId },
      data: { isSold: true },
    });

    res.status(200).json({ message: "Apartment marked as sold successfully" });
  } catch (error) {
    console.error("Gabim në markApartmentAsSold:", error);
    res.status(500).json({ message: "Failed to mark apartment as sold" });
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
 if (status === "completed") {
      // Mark as sold = isSold = true
      const orderQuery = await pool.request()
        .input("Id", sql.Int, id)
        .query(`SELECT ApartmentId FROM Orders WHERE Id = @Id`);

      const apartmentId = orderQuery.recordset[0]?.ApartmentId;

      if (apartmentId) {
        await prisma.post.update({
          where: { id: apartmentId },
          data: { isSold: true },
        });
      }
} else if (status === "pending" || status === "canceled") {
      // Unmark as sold = isSold = false
      try {
        const orderQuery = await pool.request()
          .input("Id", sql.Int, id)
          .query(`SELECT ApartmentId FROM Orders WHERE Id = @Id`);

        const apartmentId = orderQuery.recordset[0]?.ApartmentId;

        if (apartmentId) {
          await prisma.post.update({
            where: { id: apartmentId },
            data: { isSold: false },
          });
        }
      } catch (err) {
        console.error("Gabim gjatë unmarkimit të apartamentit si sold:", err);
      }
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
