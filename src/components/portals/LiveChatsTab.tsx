import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckCircle, Trash2, Star, Clock } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  senderType: 'GUEST' | 'OPS_AGENT';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  guestName: string;
  email: string | null;
  status: string;
  rating?: number | null;
  closedAt?: string;
  messages: ChatMessage[];
  updatedAt: string;
}

interface LiveChatsTabProps {
  onDataRefresh?: () => void;
}

export default function LiveChatsTab({ onDataRefresh }: LiveChatsTabProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Manual Ticket Issue State
  const [isIssuingTicket, setIsIssuingTicket] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const QUICK_REPLIES = [
    "Hello! How can I help you today?",
    "Please wait a moment while I check on that for you.",
    "Could you provide more details?",
    "I have created a support ticket for your issue.",
    "Is there anything else I can assist you with?"
  ];

  useEffect(() => {
    fetchSessions();
    const newSocket = io((import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')));
    setSocket(newSocket);

    newSocket.emit('join_ops_room');

    newSocket.on('new_chat_message', ({ sessionId, message }) => {
      // Refresh sessions list
      fetchSessions();
      
      // If we are looking at this session, add the message
      if (sessionId === activeSessionId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    newSocket.on('receive_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('chat_closed', ({ sessionId, rating, timestamp }) => {
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, status: 'CLOSED', rating, closedAt: timestamp } : s
      ));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeSessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/chat/sessions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('crm_token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  const loadSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    if (socket) {
      socket.emit('join_session', sessionId);
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/chat/${sessionId}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('crm_token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !activeSessionId) return;

    socket.emit('send_message', {
      sessionId: activeSessionId,
      content: inputText.trim(),
      senderType: 'OPS_AGENT'
    });
    setInputText('');
  };

  const sendQuickReply = (text: string) => {
    if (!socket || !activeSessionId) return;
    socket.emit('send_message', {
      sessionId: activeSessionId,
      content: text,
      senderType: 'OPS_AGENT'
    });
  };

  const handleIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSessionId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/chat/${activeSessionId}/ticket`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          title: ticketTitle,
          description: ticketDesc
        })
      });
      if (res.ok) {
        alert('Ticket successfully created from chat context.');
        setIsIssuingTicket(false);
        setTicketTitle('');
        setTicketDesc('');
        if (onDataRefresh) onDataRefresh();
      }
    } catch (error) {
      console.error('Failed to issue ticket:', error);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat session?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/chat/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('crm_token')}` }
      });
      if (res.ok) {
        if (activeSessionId === id) setActiveSessionId(null);
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex h-[80vh] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      {/* Left Pane: Sessions List */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-500" /> Inbox
          </h2>
          <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">{sessions.length} Open</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No active chats</div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={`w-full text-left cursor-pointer relative group p-4 border-b border-slate-200 dark:border-slate-800 transition-colors ${
                  activeSessionId === session.id 
                    ? 'bg-blue-50 dark:bg-slate-800' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {session.guestName || session.email || 'Guest User'}
                  {session.status === 'CLOSED' && <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[9px] uppercase font-bold rounded">Closed</span>}
                </div>
                <div className="text-xs text-slate-500 truncate mt-1">
                  {session.messages && session.messages.length > 0 
                    ? session.messages[0].content 
                    : 'New chat started...'}
                </div>
                <button 
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane: Chat View */}
      <div className="w-2/3 flex flex-col bg-white dark:bg-slate-900">
        {activeSessionId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Chatting with {activeSession?.guestName}
                </h3>
                <p className="text-xs text-slate-500">{activeSession?.email || 'No email provided'}</p>
              </div>
              <button
                onClick={() => setIsIssuingTicket(!isIssuingTicket)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> {isIssuingTicket ? 'Cancel' : 'Issue Ticket'}
              </button>
            </div>

            {/* Ticket Issue Form Overlay */}
            {isIssuingTicket && (
              <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
                <form onSubmit={handleIssueTicket} className="space-y-3 max-w-lg">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Create Support Ticket</h4>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Issue Title</label>
                    <input 
                      required
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      placeholder="E.g., Login Issue, Payment Failure"
                      className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Detailed Description (Copy from chat)</label>
                    <textarea 
                      required
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      placeholder="Paste client problem and necessary instructions..."
                      className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded min-h-[80px]" 
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded">Submit Ticket</button>
                </form>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, i) => {
                const isAgent = msg.senderType === 'OPS_AGENT';
                return (
                  <div key={msg.id || i} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                        isAgent 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {isAgent ? 'You' : activeSession?.guestName} • {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box with Quick Replies (Hide if CLOSED) */}
            {activeSession?.status !== 'CLOSED' ? (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-2">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQuickReply(reply)}
                      className="whitespace-nowrap px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a reply..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center py-6 text-center">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Chat closed at {activeSession.closedAt || 'Unknown time'}</span>
                </div>
                {activeSession.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Client Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= (activeSession.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <MessageSquare className="w-12 h-12 opacity-20" />
            <p>Select a chat from the inbox to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
