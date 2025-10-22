import { ChatPanel } from './ChatPanel';

interface ChatPageProps {
  accessToken: string;
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
}

export function ChatPage({ accessToken, currentUser }: ChatPageProps) {
  return (
    <div className="h-full p-6">
      <div className="max-w-5xl mx-auto h-full">
        <ChatPanel accessToken={accessToken} currentUser={currentUser} />
      </div>
    </div>
  );
}
