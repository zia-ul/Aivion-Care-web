'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, Send, X } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const quickReplies = [
  'Book an appointment',
  'How does video consultation work?',
  'Is my health data secure?',
  'How do I contact support?',
];

const botResponses: Record<string, string> = {
  'book an appointment': 'You can browse specialists, check real availability, and book a consultation in minutes through the patient portal. Same-day slots are available for urgent needs.',
  'how does video consultation work?': 'Video consultations connect patients and doctors through secure digital sessions with screen sharing, recording, and transcription support. You can start one from your appointments or directly from the patient portal.',
  'is my health data secure?': 'Aivion Care uses role-based access, secure authentication, encrypted sessions, and controlled data access. We never sell personal or health data.',
  'how do i contact support?': 'Reach our support team at support@aiconfidencecure.com or call +91 84493 91441. You can also start a conversation with our 24/7 chatbot right here.',
};

function getBotReply(input: string): string {
  const normalized = input.trim().toLowerCase();
  for (const [key, value] of Object.entries(botResponses)) {
    if (normalized.includes(key)) return value;
  }
  return "I'm not sure about that. Try asking about appointments, video consultations, data security, or contact support. For complex issues, email us at support@aiconfidencecure.com.";
}

export default function SupportChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hi! I'm the Aivion Care assistant. Ask me anything about appointments, consultations, security, or support." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', text: getBotReply(trimmed) }]);
      setTyping(false);
    }, 600);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-sky-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-1 hover:bg-sky-400"
        aria-label="Open support chatbot"
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[90vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-sky-500/20 bg-surface-20/95 shadow-2xl backdrop-xl sm:max-w-md">
          <div className="flex items-center gap-3 border-b border-tonal-20/70 bg-sky-500/10 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
              <Bot size={22} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-primary-light">Aivion Care Assistant</h3>
              <p className="text-xs text-success-light">Online 24/7</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-auto bg-sky-500 text-sky-950'
                    : 'bg-surface-10 text-primary-light/80'
                }`}
              >
                {message.text}
              </div>
            ))}
            {typing && (
              <div className="max-w-[85%] rounded-2xl bg-surface-10 px-4 py-3 text-sm text-muted-foreground">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-y border-tonal-20/70 px-4 py-3">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => send(reply)}
                className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20"
              >
                {reply}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-tonal-20/70 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about appointments, consultations..."
              className="flex-1 rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-2.5 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sky-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
