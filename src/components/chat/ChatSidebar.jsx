import React from 'react';
import ChatUserTile from './ChatUserTile';
import ChatConversationTile from './ChatConversationTile';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ChatSidebar = ({
  users = [],
  conversations = [],
  selectedConversation,
  selectedUser,
  onSelectUser,
  onSelectConversation,
  isLoading
}) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-1 border-r border-border bg-card overflow-y-auto"
    >
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Messages</h2>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="divide-y divide-border">
        <div className="p-2">
          <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">Recent Conversations</h3>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`conv-skel-${i}`} className="p-2 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            conversations.map((conversation) => (
              <ChatConversationTile
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                onClick={() => onSelectConversation(conversation)}
              />
            ))
          )}
        </div>

        <div className="p-2">
          <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">All Users</h3>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={`user-skel-${i}`} className="p-2 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            users.map((user) => (
              <ChatUserTile
                key={user.id}
                user={user}
                isSelected={selectedUser?.id === user.id}
                onClick={() => onSelectUser(user)}
              />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;