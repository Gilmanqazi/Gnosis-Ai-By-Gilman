import { generateResponse, generateChatTitle } from "../services/ai.servise.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, chat: chatId } = req.body;
    let title = null;
    let chat = null;

    // 1. Agar chatId nahi hai, toh pehle naya chat create karein
    if (!chatId) {
      title = await generateChatTitle(message);
      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    }

    // 2. Consistent ID handle karein (Frontend se aayi hui ya nayi bani hui)
    const currentChatId = chatId || chat._id;

    // 3. User ka message database mein save karein
    await messageModel.create({
      chat: currentChatId,
      content: message,
      role: "user",
    });

    // 4. USI ID ke saare messages fetch karein (Yahan galti thi pehle)
    const messages = await messageModel.find({ chat: currentChatId });


    // 5. AI se response generate karwayein
    const result = await generateResponse(messages);

    // 6. AI ka response database mein save karein
    const aiMessage = await messageModel.create({
      chat: currentChatId,
      content: result,
      role: "ai",
    });

    // 7. Response bhein
    res.status(201).json({
      title: title || (chatId ? "Existing Chat" : null),
      chat: chat || { _id: chatId },
      aiMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function getChats(req, res) {
  try {
    const user = req.user;
    const chats = await chatModel.find({ user: user.id });

    // 204 No Content mein body nahi dikhti, isliye 200 use karna behtar hai agar data bhej rahe hain
    res.status(200).json({
      message: "Chats received successfully",
      chats,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats" });
  }
}

export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await messageModel.find({ chat: chatId });

    res.status(200).json({
      message: "Messages retrieved successfully",
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Chat delete hone par uske messages bhi saaf karein
    await messageModel.deleteMany({ chat: chatId });

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting chat" });
  }
}