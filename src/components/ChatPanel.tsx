import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Send, Hash, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  channel: string;
  timestamp: string;
}

interface ChatPanelProps {
  accessToken: string;
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
}

export function ChatPanel({ accessToken, currentUser }: ChatPanelProps) {
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    general: [],
    development: [],
    team: [],
  });
  const [currentChannel, setCurrentChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'general', name: 'General', icon: Hash },
    { id: 'development', name: 'Development', icon: Hash },
    { id: 'team', name: 'Team Updates', icon: Users },
  ];

  // Fetch messages for current channel
  const fetchMessages = async (channel: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a56a7689/chat/messages/${channel}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(prev => ({
        ...prev,
        [channel]: data.messages || [],
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a56a7689/chat/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: newMessage.trim(),
            channel: currentChannel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add the new message to the current channel
      setMessages(prev => ({
        ...prev,
        [currentChannel]: [data.message, ...(prev[currentChannel] || [])],
      }));

      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Load messages when channel changes
  useEffect(() => {
    fetchMessages(currentChannel);
  }, [currentChannel]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(currentChannel);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentChannel]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Team Leader':
        return 'bg-primary text-white';
      case 'Backend':
        return 'bg-blue-500 text-white';
      case 'AI/ML':
        return 'bg-purple-500 text-white';
      case 'Frontend':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          Team Chat
        </CardTitle>
        <CardDescription>
          Communicate with your team in real-time
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <Tabs value={currentChannel} onValueChange={setCurrentChannel} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            {channels.map(channel => (
              <TabsTrigger 
                key={channel.id} 
                value={channel.id}
                className="gap-2"
              >
                <channel.icon className="w-4 h-4" />
                {channel.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {channels.map(channel => (
            <TabsContent 
              key={channel.id} 
              value={channel.id} 
              className="flex-1 flex flex-col m-0 overflow-hidden"
            >
              <ScrollArea className="flex-1 px-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages[channel.id]?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Hash className="w-8 h-8 mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {messages[channel.id]?.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={getRoleColor(msg.userRole)}>
                            {getInitials(msg.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-medium">{msg.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {msg.userRole}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-1 break-words">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Message #${channel.name.toLowerCase()}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={isSending || !newMessage.trim()}
                    size="icon"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
