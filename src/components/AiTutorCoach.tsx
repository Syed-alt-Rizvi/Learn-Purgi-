import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, Loader2, ArrowUpRight, ShieldCheck, Crown } from "lucide-react";

interface AiTutorCoachProps {
  onEarnPoints: (pts: number) => void;
  dialectPreference: 'balti' | 'purigi' | 'both';
  isPro: boolean;
  onNavigateToUpgrade: () => void;
}

export default function AiTutorCoach({ 
  onEarnPoints, 
  dialectPreference,
  isPro,
  onNavigateToUpgrade
}: AiTutorCoachProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Khamzang thuk! Welcome! I am your native Kargili Purki/Purgi language tutor. While I can assist with both Balti and Purgi dialects, my lessons and guidance are highly optimized and primarily designed for learning and preserving the Kargili form of Purgi language.
      
I can help you translate phrases, master difficult archaic consonant clusters (like *skar-ma* or *zla-ba*), learn case suffixes, or hold a practice conversation! 

What would you like to learn today? You can select a quick starter prompt below or type your own question.`
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt chips
  const starterPrompts = [
    { label: "Teach me Purgi numbers 1-10", prompt: "Can you teach me how to count from one to ten in Kargili Purki/Purgi, highlighting the pronunciation?" },
    { label: "Explain Purgi noun suffixes", prompt: "Explain the four core noun suffixes in Purgi (Genitive, Dative, Ergative) with example sentences." },
    { label: "Practice Kargili conversation", prompt: "Let's practice a simple conversation in Purgi. Pretend we are meeting at a local tea shop in Kargil." },
    { label: "Why is Purgi an Old Tibetan fossil?", prompt: "Why is Purgi called a 'fossil' of Classical Tibetan? Tell me about the archaic consonant clusters." }
  ];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Gate for Free user limit (Limit to 1 message exchange, which results in assistant greeting, user first msg, assistant reply)
    if (!isPro && messages.length >= 3) {
      onNavigateToUpgrade();
      return;
    }

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          targetDialect: dialectPreference === "both" ? "Balti & Purigi" : dialectPreference
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        onEarnPoints(20); // Earn points for conversing with the tutor!
      } else {
        console.error("AI Coach Server Error:", data.error);
        setMessages(prev => [...prev, { role: 'assistant', content: "Oops, I encountered an issue speaking with the server. Please try again in a bit!" }]);
      }
    } catch (e) {
      console.error("AI Coach Network Error:", e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Please check your local connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleStarterPromptClick = (prompt: string) => {
    if (!isPro && messages.length >= 3) {
      onNavigateToUpgrade();
      return;
    }
    handleSendMessage(prompt);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col h-[600px]" id="ai-coach-section">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight font-sans">Regional Language Coach</h3>
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Server-Secured AI Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPro ? (
            <span className="text-[9px] uppercase font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <Crown className="w-3 h-3 fill-current" /> Pro Tutor
            </span>
          ) : (
            <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
              Free Trial
            </span>
          )}
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            Active Tutor: {dialectPreference === "both" ? "Dual Dialect" : dialectPreference === "balti" ? "Balti" : "Purigi"}
          </span>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-line font-sans">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm text-slate-400 rounded-tl-none italic flex items-center gap-2">
              Tutor is typing translation analysis...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Starter Prompts */}
      {messages.length === 1 && (
        <div className="pb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Practice Ideas:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {starterPrompts.map((p, index) => (
              <button
                key={index}
                onClick={() => handleStarterPromptClick(p.prompt)}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs text-slate-600 hover:text-slate-800 transition-all font-semibold flex flex-col justify-between h-18"
              >
                <span className="line-clamp-2 leading-tight">{p.label}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 self-end mt-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls / Pro banner gate */}
      {!isPro && messages.length >= 3 ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-800 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-current text-amber-500" /> Premium Conversation Coach Required
            </span>
            <p className="text-[11px] text-slate-500 max-w-sm leading-normal">
              Your free trial conversation has ended. Settle just INR 650 to unlock infinite expert AI tutoring, grammar feedback, dialect studies, and certificate prints.
            </p>
          </div>
          <button
            onClick={onNavigateToUpgrade}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all hover:opacity-90 shrink-0 cursor-pointer"
          >
            Unlock Pro Version
          </button>
        </div>
      ) : (
        <div className="border-t border-slate-100 pt-4 flex gap-2.5">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(userInput)}
            placeholder="Ask anything or practice conversational phrases..."
            className="flex-1 p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans"
            id="chat-user-input"
          />
          <button
            onClick={() => handleSendMessage(userInput)}
            disabled={!userInput.trim() || loading}
            className="p-3 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            id="chat-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
