import prisma from '../lib/prisma.js'; // importo klientin Prisma

export const saveContactMessage = async (req, res) => {
  const { name, lastname, email, phone, message } = req.body;

  if (!name || !lastname || !email || !phone || !message) {
    return res.status(400).json({ error: "Të gjitha fushat janë të detyrueshme." });
  }

  try {
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        lastname,
        email,
        phone,
        message,
      },
    });

    res.status(201).json({ message: "Mesazhi u ruajt me sukses.", data: newMessage });
  } catch (error) {
    console.error("Gabim në ruajtjen e mesazhit të kontaktit:", error);
    res.status(500).json({ error: "Gabim serveri gjatë ruajtjes së mesazhit." });
  }
};
export const getContactMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Gabim gjatë marrjes së mesazheve të kontaktit:", error);
    res.status(500).json({ error: "Gabim serveri gjatë marrjes së mesazheve." });
  }
};