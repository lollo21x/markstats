import React, { useState } from 'react';
import { ArrowUp, User as UserIcon } from 'lucide-react';
import { askWill, Vote } from '../src/services/willService';
import { contentData } from '../src/contentData';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface WillChatProps {
  votes: Vote[];
  topicId?: string;
}

export const WillChat: React.FC<WillChatProps> = ({ votes, topicId }) => {
  const getInitialMessage = () => {
    if (topicId) {
      // Find the topic and use its initialMessage if available
      for (const subj of contentData) {
        const topic = subj.topics.find(t => t.id === topicId);
        if (topic?.initialMessage) {
          return topic.initialMessage;
        }
      }
    }
    return "Ciao! Sono Will, il tuo assistente di studio. Posso aiutarti ad analizzare i tuoi voti, dare consigli per migliorare, o rispondere a qualsiasi domanda sul tuo rendimento accademico. Cosa vorresti sapere?";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: getInitialMessage(),
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const willMessageId = (Date.now() + 1).toString();
    let accumulatedContent = '';

    try {
      for await (const chunk of askWill(userMessage.content, votes, topicId)) {
        accumulatedContent += chunk;
        setMessages(prev => {
          const existingMessage = prev.find(m => m.id === willMessageId);
          if (existingMessage) {
            return prev.map(m =>
              m.id === willMessageId
                ? { ...m, content: accumulatedContent }
                : m
            );
          } else {
            return [...prev, {
              id: willMessageId,
              content: accumulatedContent,
              isUser: false,
              timestamp: new Date()
            }];
          }
        });
      }
    } catch (error) {
      console.error('Error in Will chat:', error);
      setMessages(prev => [...prev, {
        id: willMessageId,
        content: "Sorry, I encountered an error. Please try again later.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
        <div className="chat-header">
          <h3 className="flex items-center gap-2 m-0">
            Will AI
          </h3>
        </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className="chat-message"
          >
            <div className={`chat-avatar ${message.isUser ? 'bg-accent' : ''}`}>
              {message.isUser ? <UserIcon size={16} color="white" /> : <img src="https://res.cloudinary.com/dk0f2y0hu/image/upload/v1751113936/Will-watchOS-Default-1024x1024_2x_xtphav.png" alt="Will" style={{width: '32px', height: '32px', borderRadius: '50%'}} />}
            </div>
            <div className={`chat-bubble ${message.isUser ? 'chat-bubble-user' : 'chat-bubble-will'}`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message">
            <div className="chat-avatar">
              <img src="https://res.cloudinary.com/dk0f2y0hu/image/upload/v1751113936/Will-watchOS-Default-1024x1024_2x_xtphav.png" alt="Will" style={{width: '32px', height: '32px', borderRadius: '50%'}} />
            </div>
            <div className="chat-bubble flex items-center gap-2">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              Will sta pensando...
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chiedi a Will dei tuoi voti..."
            className="chat-input"
            disabled={isLoading}
          />
           <button
             onClick={handleSend}
             disabled={!input.trim() || isLoading}
             className={`btn btn-icon ${(!input.trim() || isLoading) ? 'btn-secondary' : 'btn-primary'}`}
             style={{
               width: '48px',
               height: '48px',
               cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
               background: (!input.trim() || isLoading) ? 'white' : 'var(--accent)',
               color: (!input.trim() || isLoading) ? 'var(--text-primary)' : 'white'
             }}
           >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>

       <style>{`
         .typing-indicator {
           display: flex;
           gap: 4px;
           align-items: center;
         }
         .typing-indicator span {
           width: 6px;
           height: 6px;
           border-radius: 50%;
           background: var(--text-secondary);
           animation: typing 1.4s infinite;
         }
         .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
         .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
         .chat-bubble-will {
           background: white;
           color: black;
         }
         @keyframes typing {
           0%, 60%, 100% { opacity: 0.4; }
           30% { opacity: 1; }
         }
       `}</style>
    </div>
  );
};