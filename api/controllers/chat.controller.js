import prisma from "../lib/prisma.js";
export const getUserByUsername = async (req, res) => {
  const { username } = req.params; // Merrni emrin e përdoruesit nga parametri i URL-së

  try {
    // Gjeni përdoruesin duke përdorur emrin e përdoruesit
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kthe përdoruesin
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving user" });
  }
};


// export const getChatWithUser = async (req, res) => {
//   const tokenUserId = req.userId;       // ID nga token-i i autentifikimit (middleware)
//   const otherUserId = req.params.userId; // ID nga URL param

//   if (!tokenUserId || !otherUserId) {
//     return res.status(400).json({ message: "Missing user IDs" });
//   }

//   try {
//     const chat = await prisma.chat.findFirst({
//       where: {
//         userIDs: {
//           hasEvery: [tokenUserId, otherUserId], // chat me këta dy usera
//         },
//       },
//       include: {
//         messages: true,  // opsional, por zakonisht do mesazhet
//         users: true,     // për info rreth përdoruesve të chat-it
//       },
//     });

//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     res.status(200).json(chat);
//   } catch (err) {
//     console.error("Error in getChatWithUser:", err);
//     res.status(500).json({ message: "Failed to get chat with user" });
//   }
// };

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
  
// export const addChat = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const newChat = await prisma.chat.create({
//       data: {
//         userIDs: [tokenUserId, req.body.receiverId],
//       },
//     });
//     res.status(200).json(newChat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add chat!" });
//   }
// };

// Funksioni për krijimin e një chat-i të ri
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;  // ID e përdoruesit të loguar
  const receiverId = req.body.receiverId;  // ID e përdoruesit tjetër (për të cilin po krijohet chat-i)

  // Kontrollo nëse të dhënat janë të plota
  if (!tokenUserId || !receiverId) {
    return res.status(400).json({ message: "Missing user ID or receiver ID" });
  }

  try {
    // Kontrollo nëse ekziston një chat mes këtyre dy përdoruesve
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId], // Kontrollo nëse të dy përdoruesit janë pjesë e chat-it
        },
      },
    });

    // Nëse ekziston një chat, kthe atë
    if (existingChat) {
      return res.status(200).json(existingChat); // Kthe chat-in ekzistues
    }

    // Krijo një chat të ri nëse nuk ekziston
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId], // Shto përdoruesit në chat
      },
    });

    // Kthe chat-in e ri
    return res.status(200).json(newChat);

  } catch (err) {
    console.error("Error creating chat:", err.message, err.stack);  // Logim i detajuar i gabimit
    return res.status(500).json({ message: "Failed to add chat!" });
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
export const deleteChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    // Verifikoni nëse përdoruesi është pjesë e këtij chati
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true, // Përfshi mesazhet që janë pjesë e chat-it
      },
    });

    if (!chat || !chat.userIDs.includes(tokenUserId)) {
      return res.status(403).json({ message: "Not authorized to delete this chat" });
    }

    // Fshi mesazhet e lidhura me chat-in
    await prisma.message.deleteMany({
      where: {
        chatId: chatId,
      },
    });

    // Fshi chat-in
    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    res.status(200).json({ message: "Chat and messages deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat and messages:", err);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
