import React, { useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";



const ChatPage = () => {
  const [activeConversation, setActiveConversation] = useState(null);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
      />
      <ChatWindow conversationId={activeConversation} />
    </div>
  );
};

export default ChatPage;