import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
    const tokenUserId = req.userId; // ID e përdoruesit të loguar
  
    try {
      // Merrni chat-et që përmbajnë përdoruesin aktual
      const chats = await prisma.chat.findMany({
        where: {
          userIDs: {
            has: tokenUserId, // Kërko chat-et ku përdoruesi është pjesë e tyre
          },
        },
        include: {
          users: true, // Përfshi përdoruesit që janë pjesë e chat-it
        },
      });
  
      // Përshtatni secilin chat me informacionin e përdoruesit të tjetër që është pjesë e chat-it
      for (const chat of chats) {
        const receiver = chat.users.find((user) => user.id !== tokenUserId);
        if (receiver) {
          chat.receiver = receiver; // Shto përdoruesin tjetër (receiver)
        }
      }
  
      // Kthe chat-et në përgjigje
      res.status(200).json(chats);
    } catch (err) {
      console.log(err); // Mund të printoni më shumë informacion për gabimin
      res.status(500).json({ message: "Failed to get chats!" });
    }
  };

  export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
  
    if (!tokenUserId) {
      return res.status(401).json({ message: "User not authenticated!" });
    }
  
    try {
      const chat = await prisma.chat.findUnique({
        where: {
          id: req.params.id,
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
  
      if (!chat) {
        return res.status(404).json({ message: "Chat not found!" });
      }
  
      // Përditësoni chat-in për të shtuar përdoruesin që ka parë mesazhin
      await prisma.chat.update({
        where: {
          id: req.params.id,
        },
        data: {
          seenBy: {
            push: [tokenUserId],
          },
        },
      });
  
      res.status(200).json(chat);
    } catch (err) {
      console.log("Error fetching chat:", err);
      res.status(500).json({ message: "Failed to get chat!" });
    }
  };
  
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};