import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChatHeader = ({ user, onBack, connectionStatus }) => {
  const statusColors = {
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500',
    error: 'bg-red-500',
    disconnected: 'bg-gray-500'
  };

  return (
    <div className="border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name?.charAt(0) || user.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${statusColors[connectionStatus]}`} />
          </div>
          <div>
            <h2 className="font-medium">{user.name || user.username}</h2>
            <p className="text-xs text-muted-foreground">
              {connectionStatus === 'connected' ? 'Online' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;