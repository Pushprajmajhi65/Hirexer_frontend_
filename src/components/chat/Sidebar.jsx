import React from "react";
import { useUsers, useConversations } from "../../services/chat";
import { useStartConversation } from "../../services/chat";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ activeConversation, onConversationSelect }) => {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: conversations, isLoading: convLoading } = useConversations();
  const { mutate: startConv } = useStartConversation();
  const { user } = useAuth();

  const handleStartConversation = (participantId) => {
    startConv(participantId);
  };

  if (usersLoading || convLoading) {
    return (
      <div className="w-64 bg-gray-100 h-full p-4 overflow-y-auto">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Add null checks for user and userprofile
  const currentUserId = user?.userprofile?.id;

  return (
    <div className="w-64 bg-gray-100 h-full p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <div className="space-y-2">
          {users?.map((userItem) => (
            <div
              key={userItem.id}
              className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer"
              onClick={() => handleStartConversation(userItem.id)}
            >
              <img
                src={userItem.avatar || "/default-avatar.png"}
                alt={userItem.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="font-medium">{userItem.name}</p>
                <p className="text-xs text-gray-500">
                  {userItem.is_online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        <div className="space-y-2">
          {conversations?.map((conv) => {
            // Safely find other participant
            const otherParticipant = conv.participants?.find(
              (p) => p.id !== currentUserId
            );
            
            return (
              <div
                key={conv.id}
                className={`flex items-center p-2 rounded cursor-pointer ${
                  activeConversation === conv.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => onConversationSelect(conv.id)}
              >
                <img
                  src={otherParticipant?.avatar || "/default-avatar.png"}
                  alt={otherParticipant?.username || "Unknown"}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {otherParticipant?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.last_message?.content || "No messages yet"}
                  </p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conv.unread_count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;