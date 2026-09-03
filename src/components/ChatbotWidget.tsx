import React, { useState, useRef, useEffect } from 'react';
import { Signal, ChatMessage } from '../types';
import { sendChatbotMessage } from '../services/aiService';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RefreshCw, 
  AlertCircle,
  HelpCircle,
  Minimize2,
  ChevronDown
} from 'lucide-react';

interface ChatbotWidgetProps {
  signals: Signal[];
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ signals }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello Dr. Thorne. I am your **Nova Orbit Copilot**.\n\nI have real-time surveillance context across **${signals.length} active intelligence signals** in biopharma clinical trials (NCT), FDA/EMA regulatory filings, and pharmacovigilance registries.\n\nHow can I assist your team today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);
    setErrorMessage(null);

    try {
      const responseText = await sendChatbotMessage(textToSend, messages, signals);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: "I encountered an error connecting to the intelligence engine. Please try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    "Summarize Phase 3 bispecific antibody data",
    "What are the latest EMA safety signals?",
    "Status of AAV5 gene therapy label expansion?",
    "Explain paediatric HTA reimbursement shift"
  ];

  return (
    <div className="chatbot-root-container">
      
      {/* Floating Pill Action Button */}
      {!isOpen && (
        <button 
          className="pill-fab-button"
          onClick={() => setIsOpen(true)}
          title="Open Nova Orbit AI Intelligence Copilot"
        >
          {/* Pill Capsule Graphic (Two-tone split design) */}
          <div className="pill-capsule-wrapper">
            <div className="pill-half pill-left">
              <Sparkles size={14} color="#FFFFFF" />
            </div>
            <div className="pill-half pill-right">
              <span className="pill-text">NOVA AI</span>
            </div>
          </div>
          <span className="pill-online-dot" />
        </button>
      )}

      {/* Floating Chat Drawer / Panel */}
      {isOpen && (
        <div className="chat-drawer-panel">
          
          {/* Header */}
          <div className="chat-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="chat-bot-avatar">
                <Bot size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="chat-header-title">Nova Orbit Copilot</span>
                  <span className="chat-live-tag">Grounded AI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                  <span className="chat-status-dot" />
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Active • {signals.length} Signals Scoped</span>
                </div>
              </div>
            </div>


            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button 
                className="chat-ctrl-btn" 
                onClick={() => setIsOpen(false)}
                title="Minimize chat drawer"
              >
                <Minimize2 size={15} />
              </button>
              <button 
                className="chat-ctrl-btn" 
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Starter Suggestions */}
          <div className="chat-suggestions-bar">
            <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HelpCircle size={11} /> Suggested Queries:
            </span>
            <div className="chat-suggestion-chips">
              {suggestedPrompts.map((prompt, i) => (
                <button 
                  key={i} 
                  className="chat-chip"
                  onClick={() => handleSend(prompt)}
                  disabled={isTyping}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Message History List */}
          <div className="chat-messages-container">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`chat-message-row ${isUser ? 'user-row' : 'bot-row'}`}>
                  {!isUser && (
                    <div className="message-avatar bot-avatar">
                      <Bot size={13} color="#FFFFFF" />
                    </div>
                  )}
                  <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'} ${msg.isError ? 'error-bubble' : ''}`}>
                    <div className="message-text">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => {
                        // Basic bold parsing for markdown style
                        const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={pIdx} style={{ margin: '0 0 6px', lineHeight: 1.45 }}>
                            {parts.map((part, partIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                          </p>
                        );
                      })}
                    </div>
                    <span className="message-timestamp">{msg.timestamp}</span>
                  </div>
                  {isUser && (
                    <div className="message-avatar user-avatar-icon">
                      <User size={13} color="#FFFFFF" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing / Loading Indicator */}
            {isTyping && (
              <div className="chat-message-row bot-row">
                <div className="message-avatar bot-avatar">
                  <Bot size={13} color="#FFFFFF" />
                </div>
                <div className="message-bubble bot-bubble typing-bubble">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>
                    Consulting Haemophilia Intelligence...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box & Send Action */}
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="chat-text-input"
              placeholder="Ask about trials, drugs, EMA/FDA alerts, or team impact..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button 
              className="chat-send-btn" 
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isTyping}
              title="Send message (Enter)"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
