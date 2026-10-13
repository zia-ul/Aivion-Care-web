'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Bot, HeartPulse, Send, X, Sparkles, Activity } from 'lucide-react';
import { CONTACT_EMAILS } from '@/lib/contact-emails';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const quickReplies = [
  'Book an appointment',
  'How does 24/7 monitoring work?',
  'What is Pan-Tompkins QRS?',
  'How does video consultation work?',
  'Is my health data secure?',
  'Who do I contact?',
];

const botResponses: Record<string, string> = {
  'book an appointment': 'You can browse specialists, check real availability, and book a consultation in minutes through the patient portal. Same-day slots are available for urgent needs.',
  'how does 24/7 monitoring work?': 'Aivion Care connects to your biometric sensors (ECG, SpO2, Heart Rate, Core Temp) and streams telemetry in real-time. If vital thresholds are breached, emergency alerts are dispatched instantly.',
  'what is pan-tompkins qrs?': 'The Pan-Tompkins algorithm uses digital bandpass filtering (5-15 Hz) and non-linear squaring to isolate cardiac R-peaks and detect arrhythmias with clinical precision.',
  'how does video consultation work?': 'Video consultations connect patients and doctors through secure digital sessions with screen sharing, recording, and transcription support. You can start one from your appointments or directly from the patient portal.',
  'is my health data secure?': 'Aivion Care uses role-based access, secure authentication, encrypted sessions, and controlled data access. We never sell personal or health data.',
  'who do i contact?': `General questions go to ${CONTACT_EMAILS.info}, careers and internships to ${CONTACT_EMAILS.hr}, partnerships and pricing to ${CONTACT_EMAILS.sales}, and anything about your account or appointments to ${CONTACT_EMAILS.support}.`,
  'how do i apply for a job?': `Send your CV to ${CONTACT_EMAILS.hr} with the role in the subject line, or use the Apply now link on our careers page.`,
};

function getBotReply(input: string): string {
  const normalized = input.trim().toLowerCase();
  for (const [key, value] of Object.entries(botResponses)) {
    if (normalized.includes(key)) return value;
  }
  return `I'm MediBot, your clinical assistant. You can ask me about appointments, 24/7 telemetry monitoring, ECG waveforms, data security, or support: ${CONTACT_EMAILS.support}.`;
}

export default function SupportChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      text: "Hello! I am MediBot — your Aivion Care 24/7 AI health assistant. How can I help you today? Ask me about appointments, live ECG monitoring, or doctor queues!" 
    },
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
      {/* Floating MediBot Button with Heartbeat & Moving ECG Pulse Glow */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 p-1 text-slate-950 shadow-2xl shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
        aria-label="Open MediBot support chatbot"
        aria-expanded={open}
      >
        {/* Radiant Heartbeat Ring */}
        <span className="absolute -inset-1 rounded-full bg-teal-400/40 blur-md animate-radiant-pulse" />

        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-cyan-300">
          {open ? (
            <X size={26} className="text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* MediBot Animated Heart SVG Icon */}
              <div className="relative flex items-center justify-center h-10 w-10 animate-heartbeat text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]">
                {/* Heart SVG with pulsing medical ecg cross */}
                <svg viewBox="0 0 24 24" className="h-9 w-9 fill-rose-500 stroke-rose-400 stroke-1" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>

                {/* Inner MediBot Logo or Pulse inside Heart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={15} className="text-white animate-pulse" />
                </div>
              </div>

              {/* Mini glowing heart indicator badge */}
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 items-center justify-center border border-white/20">
                  <Sparkles size={9} className="text-slate-950" />
                </span>
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Floating Chat Modal */}
      {open && (
        <div
          role="dialog"
          aria-label="MediBot Health Assistant"
          className="fixed bottom-24 right-6 z-50 flex h-[540px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-[28px] border border-cyan-400/30 bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
        >
          {/* Header with Hospital/Heart Rate Theme */}
          <div className="relative overflow-hidden border-b border-white/10 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-500/40 bg-rose-500/15 p-1 shadow-md">
                  {/* Heart SVG with Heartbeat Animation */}
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-rose-500 text-rose-400 animate-heartbeat" aria-hidden="true">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <Activity size={12} className="absolute text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-display text-sm font-bold text-white">MediBot AI</p>
                    <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[9px] font-extrabold text-teal-300 border border-teal-500/30 uppercase">
                      24/7 Clinical
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Vitals Copilot Online
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Moving ECG Line across MediBot header */}
            <div className="mt-2.5 h-6 w-full text-cyan-300 relative overflow-hidden rounded-lg bg-slate-950/60 p-0.5 border border-cyan-500/20">
              <svg viewBox="0 0 300 20" className="h-full w-full drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" preserveAspectRatio="none">
                <path
                  d="M0 10 h40 l6 -7 l5 14 l5 -10 l6 3 h40 l6 -7 l5 14 l5 -10 l6 3 h40 l6 -7 l5 14 l5 -10 l6 3 h60"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-ecg-dash"
                />
              </svg>
            </div>

          </div>

          {/* Messages Feed */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'bot' && (
                  <div className="relative h-6 w-6 shrink-0 rounded-full bg-sky-500/20 border border-sky-400/40 p-0.5">
                    <Image src="/aivion-care-logo.png" alt="" fill className="object-contain" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-slate-950 font-medium'
                      : 'border border-white/10 bg-slate-900/80 text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-2 text-cyan-400">
                <HeartPulse size={14} className="animate-heartbeat" />
                <span className="text-[11px] text-slate-400">MediBot is analyzing...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="border-t border-white/10 bg-slate-950/70 p-2.5">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Inquiries:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => send(reply)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-200 transition"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 bg-slate-900/90 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask MediBot about vitals, doctors..."
              className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-slate-950 disabled:opacity-40 transition hover:scale-105"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
