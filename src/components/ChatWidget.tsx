import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Search, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

interface ChatMessage {
  id: string;
  senderType: 'GUEST' | 'OPS_AGENT';
  content: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  // Rating Mode
  const [isRatingMode, setIsRatingMode] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Tracking Mode
  const [isTrackingMode, setIsTrackingMode] = useState(false);
  const [trackTicketId, setTrackTicketId] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<any>(null);
  const [trackError, setTrackError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Only show chat widget on public home page ("/") or client portal ("/client")
  const shouldShowWidget = location.pathname === '/' || location.pathname === '/client';

  useEffect(() => {
    if (location.pathname === '/client') {
      const storedName = localStorage.getItem('crm_user_name');
      const storedEmail = localStorage.getItem('crm_user_email');
      const orgName = localStorage.getItem('crm_user_org');
      if (storedName) setGuestName(`${storedName} (${orgName})`);
      if (storedEmail) setEmail(storedEmail);
    }
  }, [location.pathname]);

  useEffect(() => {
    let newSocket: Socket | null = null;
    if (isOpen && !socket) {
      newSocket = io(
        import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')
      );
      setSocket(newSocket);

      newSocket.on('receive_message', (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on('ticket_issued', (ticketId: string) => {
        setTicketNumber(ticketId);
      });
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, ticketNumber]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/chat/session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestName, email }),
        }
      );
      const data = await res.json();
      if (!data.id) {
        throw new Error('No session ID returned');
      }
      setSessionId(data.id);
      if (data.messages) setMessages(data.messages);

      if (socket) {
        socket.emit('join_session', data.id);
      }
      setHasStarted(true);
    } catch (error) {
      console.error('Failed to start chat session:', error);
      alert('Failed to connect to the chat server. Please try again.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !sessionId) return;

    socket.emit('send_message', {
      sessionId,
      content: inputText.trim(),
      senderType: 'GUEST',
    });

    setInputText('');
  };

  const handleCloseClick = () => {
    if (hasStarted && sessionId && !isRatingMode) {
      setIsRatingMode(true);
    } else {
      setIsOpen(false);
      setIsRatingMode(false);
      // Reset state if not rated yet (meaning they cancelled out)
      if (!isRatingMode) {
        setHasStarted(false);
        setSessionId(null);
        setMessages([]);
        setTicketNumber(null);
        setGuestName('');
        setEmail('');
      }
    }
  };

  const submitRating = async (rating: number) => {
    if (!sessionId) return;
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/chat/${sessionId}/rate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating }),
        }
      );
      // Reset everything and close
      setHasStarted(false);
      setSessionId(null);
      setMessages([]);
      setTicketNumber(null);
      setIsRatingMode(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleTrackTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedTicket(null);
    if (!trackTicketId.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/chat/ticket/${trackTicketId.trim()}`
      );
      if (!res.ok) {
        setTrackError('Ticket not found.');
        return;
      }
      const data = await res.json();
      setTrackedTicket(data);
    } catch (error) {
      setTrackError('Error fetching ticket status.');
    }
  };

  if (!shouldShowWidget) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-zinc-800 p-4 border-b border-zinc-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Live Support</h3>
                <p className="text-xs text-zinc-400">CRM Support Team • 24/7</p>
              </div>
            </div>
            <button
              onClick={handleCloseClick}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-black/50 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {isRatingMode ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                  <h4 className="text-white font-medium text-lg mb-2">Rate your experience</h4>
                  <p className="text-zinc-400 text-sm">How was your support session today?</p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => submitRating(star)}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= hoveredRating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsRatingMode(false)}
                  className="text-xs text-zinc-500 hover:text-white transition-colors mt-8"
                >
                  Cancel
                </button>
              </div>
            ) : isTrackingMode ? (
              <div className="h-full flex flex-col items-center space-y-6 pt-8">
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-500">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-white font-medium text-center">Track Your Ticket</h4>

                <form onSubmit={handleTrackTicket} className="w-full max-w-[250px] space-y-3">
                  <input
                    type="text"
                    placeholder="Enter Ticket ID"
                    required
                    value={trackTicketId}
                    onChange={(e) => setTrackTicketId(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Check Status
                  </button>
                </form>

                {trackError && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {trackError}
                  </p>
                )}

                {trackedTicket && (
                  <div className="w-full max-w-[250px] bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm text-white space-y-2">
                    <p className="text-xs text-zinc-400">ID: {trackedTicket.id.split('-')[0]}...</p>
                    <p className="font-semibold">{trackedTicket.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-zinc-400">Status:</span>
                      <span className="text-cyan-400 font-bold text-xs px-2 py-0.5 bg-cyan-900/30 rounded">
                        {trackedTicket.status}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsTrackingMode(false)}
                  className="text-xs text-zinc-500 hover:text-white transition-colors mt-auto"
                >
                  &larr; Back to Chat
                </button>
              </div>
            ) : !hasStarted ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="bg-zinc-800 p-4 rounded-full">
                  <MessageSquare className="w-8 h-8 text-cyan-500" />
                </div>
                <h4 className="text-white font-medium text-center">How can we help you today?</h4>
                <p className="text-zinc-400 text-sm text-center px-4 mb-4">
                  Please provide your name to start chatting with our support team.
                </p>

                <form onSubmit={handleStartChat} className="p-4 space-y-3">
                  <p className="text-xs text-slate-500 mb-4">
                    Please provide your details to begin the secure chat session.
                  </p>

                  {location.pathname === '/client' && guestName ? (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Authenticated as:
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{guestName}</p>
                      <p className="text-xs text-slate-500">{email}</p>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your Name / Organization"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={!guestName || !email}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Start Secure Chat
                  </button>
                </form>

                <button
                  onClick={() => setIsTrackingMode(true)}
                  className="mt-6 text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                >
                  Track an existing ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 && (
                  <p className="text-center text-xs text-zinc-500 my-4">
                    Chat started. A representative will be with you shortly.
                  </p>
                )}
                {messages.map((msg, i) => {
                  const isGuest = msg.senderType === 'GUEST';
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                          isGuest
                            ? 'bg-cyan-600 text-white rounded-br-none'
                            : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-1 px-1">
                        {isGuest ? 'You' : 'Support Team'} • {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {ticketNumber && (
                  <div className="my-4 p-4 bg-blue-900/20 border border-blue-900/50 rounded-xl text-center animate-fade-in">
                    <CheckCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-300">
                      A support ticket has been created!
                    </p>
                    <p className="text-xs text-blue-400/70 mt-1 break-all">ID: {ticketNumber}</p>
                    <p className="text-xs text-blue-400/50 mt-2">
                      You can track this using the "Track Ticket" feature on the start screen.
                    </p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input */}
          {hasStarted && !isRatingMode && (
            <div className="p-3 bg-zinc-800 border-t border-zinc-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => (isOpen ? handleCloseClick() : setIsOpen(true))}
        className="w-14 h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-900/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
