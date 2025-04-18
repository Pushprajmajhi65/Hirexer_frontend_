import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const ChatConversationTile = ({ conversation, isSelected, onClick }) => {
  if (!conversation) return null;

  const otherParticipant = conversation.participants.find(
    p => p.id !== conversation.currentUserParticipantId
  );

  const lastMessage = conversation.last_message;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(conversation)}
      className={`p-3 cursor-pointer ${isSelected ? 'bg-accent' : 'hover:bg-muted'}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={otherParticipant?.avatar} />
            <AvatarFallback>
              {otherParticipant?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {otherParticipant?.is_online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium text-foreground truncate">
              {otherParticipant?.name || otherParticipant?.username || 'Unknown User'}
            </h3>
            {lastMessage && (
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {format(new Date(lastMessage.timestamp), 'h:mm a')}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage?.content || 'No messages yet'}
          </p>
          {conversation.unread_count > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {conversation.unread_count}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatConversationTile;