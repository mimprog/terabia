import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../slices/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Picker } from "emoji-mart";

import {
  CONVERSATION_URL,
  MESSAGES_URL,
  USER_SEARCH_URL,
  MESSAGE_URL,
  CONVERSATION_START_URL,
} from "../routes/serverRoutes";

const Conversation = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const loggedUserId = user ? user.id : null;

  const [conversations, setConversations] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const messagesEndRef = useRef(null);
  const headers = { Authorization: `Bearer ${token}` };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);


  // Fetch conversations
  const fetchConversations = async () => {
    setLoadingConvs(true);
    try {
      // NOTE: this expects an idUser param (see controller). If you use auth, change accordingly.
      const res = await axios.get(`${CONVERSATION_URL}?idUser=${loggedUserId}`, { headers });
      console.log(res?.data);
      setConversations(res.data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    if (token && loggedUserId) fetchConversations();
  }, [token, loggedUserId]);

  // Fetch messages of a conversation
  const fetchMessages = async (convId) => {
    setLoadingMsgs(true);
    try {
      const res = await axios.get(`${MESSAGES_URL}/${convId}`, { headers });
      console.log(res?.data);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMsgs(false);
    }
  };

  // Start a conversation with a user (from search results)
  const startConversation = async (userId) => {
    console.log(loggedUserId, userId);
    try {
      const res = await axios.post(
        `${CONVERSATION_START_URL}?idExpediteur=${loggedUserId}&idDestinataire=${userId}`,
        {},
      );
      console.log("Started conversation:", res.data);
      const msg = res.data;
      // The backend returns MessageResponseDto which contains idConversation
      setActiveConv(msg.idConversation);
      fetchMessages(msg.idConversation);
      fetchConversations();
      setSearchResults([]);
      setSearchQuery("");
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };

  // Send message to an existing conversation
const sendMessage = async () => {
  if (!newMessage.trim() || !activeConv) return;

  try {
    const res = await axios.post(
      `${MESSAGE_URL}?idExpediteur=${loggedUserId}&idConversation=${activeConv}`,
      { contenu: newMessage }
    );

    setMessages((prev) => [...prev, res.data]);
    setNewMessage("");
    setShowEmojiPicker(false);
    fetchConversations();
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

  // Search users
  const searchUsers = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`${USER_SEARCH_URL}?q=${encodeURIComponent(query)}`, { headers });
      setSearchResults(res.data);
    } catch (err) {
      console.error("Error searching users:", err);
    }
  };

  const addEmoji = (emoji) => setNewMessage((p) => p + emoji.native);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div className="w-full md:w-1/3 bg-white shadow-lg p-5 flex flex-col overflow-y-auto"
                  initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <h2 className="text-xl font-semibold mb-3">Conversations</h2>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => searchUsers(e.target.value)}
          className="p-2 rounded-md mb-3 border border-gray-300"
        />

        {searchResults.length > 0 && (
          <div className="mb-3">
            {searchResults.map((u) => (
              <motion.div key={u.id}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="p-3 bg-blue-100 rounded-lg mb-2 cursor-pointer"
                onClick={() => startConversation(u.id)}
              >
                {u.firstname} {u.lastname}
              </motion.div>
            ))}
          </div>
        )}

        {conversations ? (
          conversations.map((conv) => (
            <motion.div
              key={conv.idConversation}
              className={`p-3 rounded-lg mb-2 cursor-pointer ${activeConv === conv.idConversation ? "bg-gray-200" : "bg-gray-100"}`}
              onClick={() => { setActiveConv(conv.idConversation); fetchMessages(conv.idConversation); }}
            >
              {conv.firstname} {conv.lastname}
            </motion.div>
          ))
        ) : (
          <p>No conversations found.</p>
        )}
      </motion.div> 
      {/* Chat area */}
      <motion.div className="flex-1 bg-gray-50 p-5 flex flex-col relative"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-semibold mb-3">
          {activeConv ? `Conversation #${activeConv}` : "Select a conversation"}
        </h2>

<div className="flex-1 overflow-y-auto mb-3">
  {loadingMsgs ? (
    <p>Loading messages...</p>
  ) : (
    <AnimatePresence>
      {messages.map((msg) => {
        const senderId = msg.emetteur?.userId;
        const isMe = senderId === loggedUserId;

        // Convert dateEnvoi array to JS Date
        const d = msg.dateEnvoi;
        const dateObj = new Date(d[0], d[1], d[2], d[3], d[4], d[5]);

        return (
          <motion.div
            key={msg.idMessage}
            initial={{ x: isMe ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-3 mb-3 rounded-xl max-w-[70%] shadow break-words ${
              isMe ? "bg-gray-200 text-black ml-0" : "bg-red-500 text-white ml-auto"
            }`}
          >
            {msg.type === "sticker" ? (
              <img src={msg.contenu} alt="sticker" className="w-20 h-20" />
            ) : (
              <p>{msg.contenu}</p>
            )}

            <div className="text-xs mt-1 flex justify-between">
              <span>{msg.emetteur?.firstname} {msg.emetteur?.lastname}</span>
              <span>{dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </motion.div>
        );
      })}
      <div ref={messagesEndRef} />
    </AnimatePresence>
  )}
</div>




        {/* Input & Emoji */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 rounded border border-gray-300"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => setShowEmojiPicker((s) => !s)} className="p-2 text-2xl">😀</button>
          <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded">Send</button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 z-50">
            <Picker onSelect={addEmoji} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Conversation;
