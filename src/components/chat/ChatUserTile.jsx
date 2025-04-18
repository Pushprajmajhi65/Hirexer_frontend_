import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const ChatUserTile = ({ user, isSelected, onClick }) => {
  if (!user) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(user)}
      className={`p-3 cursor-pointer ${isSelected ? 'bg-accent' : 'hover:bg-muted'}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          {user.is_online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">
            {user.name || user.username || 'Unknown User'}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {user.role || 'User'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatUserTile;