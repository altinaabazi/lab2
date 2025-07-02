import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const { chatId } = req.params; // Chat ID from the request URL
  const text = req.body.text; // The message text sent by the user
  const tokenUserId = req.userId; // ID of the logged-in user

  try {
    // Find the chat by chatId and ensure the user is part of the chat
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          has: tokenUserId,
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Create a new message in the chat
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // Check if user is already in seenBy and add if not present
    const updatedSeenBy = chat.seenBy.includes(tokenUserId)
      ? chat.seenBy
      : [...chat.seenBy, tokenUserId];

    // Update the chat with the new message and set the last message
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessage: text, // Store the last message
        seenBy: updatedSeenBy, // Ensure user is in seenBy list without duplicates
      },
    });

    res.status(200).json(message); // Return the created message
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
