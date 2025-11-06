import React, { useState, useEffect } from 'react';
import { ArrowUp, User as UserIcon, X } from 'lucide-react';
import { askWill, Vote } from '../src/services/willService';
import { contentData } from '../src/contentData';
import { useAuth } from '../src/hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../src/services/firebase';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

interface WillChatProps {
  votes: Vote[];
  topicId?: string;
}

export const WillChat: React.FC<WillChatProps> = ({ votes, topicId }) => {
  const { user } = useAuth();

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
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<{ name?: string; surname?: string; chatPreference?: string }>({});

  useEffect(() => {
    if (user) {
      const fetchApiKey = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserApiKey(data.apiKey || null);
          setPreferences({
            name: data.name,
            surname: data.surname,
            chatPreference: data.chatPreference
          });
        }
      };
      fetchApiKey();
    }
  }, [user]);



  const sendMessage = async (messageContent: string) => {
    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);

    if (newCount > 5 && !userApiKey) {
      setIsBlurred(true);
      setShowApiKeyModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const willMessageId = (Date.now() + 1).toString();
    let accumulatedContent = '';

    try {
      for await (const chunk of askWill(userMessage.content, votes, topicId, userApiKey || undefined, preferences)) {
        accumulatedContent += chunk;
        setMessages(prev => {
          const existingMessage = prev.find(m => m.id === willMessageId);
          if (existingMessage) {
            return prev.map(m =>
              m.id === willMessageId
                ? { ...m, content: accumulatedContent, isError: false }
                : m
            );
          } else {
            return [...prev, {
              id: willMessageId,
              content: accumulatedContent,
              isUser: false,
              timestamp: new Date(),
              isError: false
            }];
          }
        });
      }
    } catch (error) {
      console.error('Error in Will chat:', error);
      setMessages(prev => [...prev, {
        id: willMessageId,
        content: "Si è riscontrato un errore. Riprova più tardi.",
        isUser: false,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    await sendMessage(message);
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

      <div className={`chat-messages ${isBlurred ? 'blurred' : ''}`}>
        {(() => {
          const lastUserMessage = messages.filter(m => m.isUser).pop();
          return messages.map((message) => (
            <div
              key={message.id}
              className="chat-message"
            >
              <div className={`chat-avatar ${message.isUser ? 'bg-accent' : ''}`}>
                {message.isUser ? <UserIcon size={16} color="white" /> : <img src="https://res.cloudinary.com/dk0f2y0hu/image/upload/v1751113936/Will-watchOS-Default-1024x1024_2x_xtphav.png" alt="Will" style={{width: '32px', height: '32px', borderRadius: '50%'}} />}
              </div>
              <div className={`chat-bubble ${message.isUser ? 'chat-bubble-user' : 'chat-bubble-will'}`}>
                {message.content}
                {message.isError && lastUserMessage && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={() => sendMessage(lastUserMessage.content)}
                      className="btn btn-secondary"
                      style={{ fontSize: '14px', padding: '4px 8px' }}
                    >
                      Riprova
                    </button>
                  </div>
                )}
              </div>
            </div>
          ));
        })()}
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
          .blurred {
            filter: blur(5px);
            pointer-events: none;
          }
          @keyframes typing {
            0%, 60%, 100% { opacity: 0.4; }
            30% { opacity: 1; }
          }
        `}</style>

        {showApiKeyModal && (
          <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowApiKeyModal(false)}>
            <div className="modal-content" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto', padding: '1.5rem' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Inserisci Openrouter API Key</h2>
                <button onClick={() => setShowApiKeyModal(false)} className="btn btn-icon btn-secondary">
                  <X size={16} />
                </button>
              </div>
              <p>Hai raggiunto il limite di 5 messaggi gratuiti. Per continuare a chattare con Will, inserisci la tua Openrouter API Key.</p>
              <p>Vai su <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer">Openrouter</a>, clicca "Create API Key", assegna un nome, lascia gli altri campi vuoti e clicca "Create". Copia il codice fornito e incollalo qui sotto.</p>
              <p>Avrai accesso a 50 messaggi gratuiti al giorno.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const apiKey = formData.get('apiKey') as string;
                if (!apiKey.startsWith('sk-or-v1-')) {
                  alert('Formato API Key non valido. Deve iniziare con sk-or-v1-');
                  return;
                }
                if (user) {
                  await setDoc(doc(db, 'users', user.uid), { apiKey }, { merge: true });
                  setUserApiKey(apiKey);
                  setIsBlurred(false);
                  setShowApiKeyModal(false);
                }
              }}>
                <input type="text" name="apiKey" placeholder="sk-or-v1-..." required className="form-input" />
                <button type="submit" className="btn btn-primary">Salva e Continua</button>
              </form>
            </div>
          </div>
        )}
     </div>
   );
 };