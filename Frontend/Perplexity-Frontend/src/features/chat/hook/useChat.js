import { initializeSocketConnection } from "../service/chat.sokcet";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages,deleteChatState } from "../chat.slice";
import { useDispatch } from "react-redux";

let socket;


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data
        if (!chatId)
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "user",
        }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[ chatId ]?.messages.length)

        if (chats[ chatId ]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))


      
    }

    async function handleDeleteChat(chatId) {
        try {
            dispatch(setLoading(true));
            
            // 1. Backend API call (Jo aapne import kiya hai)
            await deleteChat(chatId); 
    
            // 2. Redux state se delete karna (Jo aapne slice mein banaya hai)
            dispatch(deleteChatState(chatId));
    
            dispatch(setLoading(false));
        } catch (err) {
            console.error("Delete failed:", err);
            dispatch(setError("Could not delete chat"));
            dispatch(setLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat
    }

}