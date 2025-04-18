import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import { useTitle } from '@/hooks/useTitle';

const Chat = () => {
  useTitle('Chat | Hirex');

  return (
    <div className="flex flex-col h-full">
      <ChatContainer />
    </div>
  );
};

export default Chat;