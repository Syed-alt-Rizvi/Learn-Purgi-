import React, { useState } from "react";
import { Languages, HelpCircle, Loader2, Sparkles, Send, Check } from "lucide-react";
import { CommunityTranslation } from "../types";

interface RealtimeTranslatorProps {
  onEarnPoints: (pts: number) => void;
  dialectPreference: 'balti' | 'purigi' | 'both';
}

export default function RealtimeTranslator({ onEarnPoints, dialectPreference }: RealtimeTranslatorProps) {
  const [sourceText, setSourceText] = useState("");
  const [targetDialect, setTargetDialect] = useState<'balti' | 'purigi'>(
    dialectPreference === "purigi" ? "purigi" : "balti"
  );
  const [loading, setLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState<{
    translation: string;
    tibetanScript?: string;
    persoArabicScript?: string;
    phoneticBreakdown?: string;
    grammarNotes?: string;
    isSimulated?: boolean;
  } | null>(null);

  // Community Translations state (simulated community tool)
  const [communityTranslations, setCommunityTranslations] = useState<CommunityTranslation[]>([
    {
      id: "comm-1",
      sourceText: "What is your name?",
      targetDialect: "balti",
      translation: "Nyeri ming-la chi in? (Polite) / Nyer-la chi in?",
      phoneticBreakdown: "Nye-ri (your) ming-la (name-to) chi (what) in (is)?",
      grammarNotes: "Uses honorific genitive pronoun 'nyer'. Suffix -la functions as dative respect marker.",
      author: "Syed Murtaza",
      timestamp: "2026-07-03",
      upvotes: 14,
      isAiAssisted: true
    },
    {
      id: "comm-2",
      sourceText: "I am fine.",
      targetDialect: "purigi",
      translation: "Salamath yod.",
      phoneticBreakdown: "Salamath (safe/well) yod (am).",
      grammarNotes: "Common Tibeto-Burman auxiliary state marker 'yod'.",
      author: "Fatima Kargili",
      timestamp: "2026-07-02",
      upvotes: 9
    }
  ]);

  const [suggestSource, setSuggestSource] = useState("");
  const [suggestTranslation, setSuggestTranslation] = useState("");
  const [suggestDialect, setSuggestDialect] = useState<'balti' | 'purigi'>("balti");
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setTranslationResult(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          targetDialect,
          context: `Dialect Preference is ${targetDialect}`
        })
      });

      const data = await response.json();
      if (data.success) {
        setTranslationResult(data);
        onEarnPoints(15);
      } else {
        console.error("Translation server error:", data.error);
      }
    } catch (e) {
      console.error("Translation network error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunitySuggest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestSource.trim() || !suggestTranslation.trim()) return;

    const newSuggest: CommunityTranslation = {
      id: `comm-user-${Date.now()}`,
      sourceText: suggestSource,
      targetDialect: suggestDialect,
      translation: suggestTranslation,
      author: "You (Native Student)",
      timestamp: new Date().toISOString().split("T")[0],
      upvotes: 1,
      isAiAssisted: false
    };

    setCommunityTranslations(prev => [newSuggest, ...prev]);
    setSuggestSource("");
    setSuggestTranslation("");
    setSuggestSuccess(true);
    onEarnPoints(30); // Higher points for contributing local vocabulary!

    setTimeout(() => setSuggestSuccess(false), 3000);
  };

  const handleUpvote = (id: string) => {
    setCommunityTranslations(prev =>
      prev.map(item => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="translator-component">
      {/* Left Columns - Translator Interface */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Languages className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight font-sans">AI Real-Time Language Translator</h2>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 font-semibold tracking-wide uppercase rounded-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Gemini Powered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Source Phrase (English or Urdu)</label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="e.g. Where are you going? or Thank you"
              className="w-full h-28 p-3 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans text-sm resize-none"
              id="translator-input-area"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Dialect / Language</label>
            <div className="flex bg-slate-100 p-1.5 rounded-xl mb-4">
              <button
                onClick={() => setTargetDialect("balti")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  targetDialect === "balti" ? "bg-white text-emerald-950 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Balti (Schene/Khar)
              </button>
              <button
                onClick={() => setTargetDialect("purigi")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  targetDialect === "purigi" ? "bg-white text-emerald-950 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Purigi / Purik (Kargil)
              </button>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {targetDialect === "balti"
                ? "Balti is spoken in Skardu, Khaplu, and parts of Kargil. Retains many bgy- or rgy- initial stops."
                : "Purigi (Purik) is spoken predominantly in Kargil and Suru valleys, preserving standard rgy- and dative structures."}
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleTranslate}
            disabled={loading || !sourceText.trim()}
            className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            id="translate-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Translating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Translate Sentence
              </>
            )}
          </button>
        </div>

        {/* Translation Results card */}
        {translationResult && (
          <div className="mt-8 bg-emerald-50/30 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden" id="translation-result-card">
            {translationResult.isSimulated && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-3 py-1 uppercase rounded-bl-xl tracking-wide flex items-center gap-1 shadow-xs">
                Offline Mode
              </div>
            )}
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-800">Translation result</h3>

            <div className="mt-4">
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight font-sans block">
                {translationResult.translation}
              </span>
              {translationResult.phoneticBreakdown && (
                <p className="text-xs text-slate-500 font-mono mt-1 italic">
                  IPA/Pronunciation: {translationResult.phoneticBreakdown}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {translationResult.tibetanScript && (
                <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Tibetan Yige Script</span>
                  <span className="text-xl font-bold text-slate-700 tracking-tight block mt-1">
                    {translationResult.tibetanScript}
                  </span>
                </div>
              )}
              {translationResult.persoArabicScript && (
                <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Perso-Arabic Alphabet</span>
                  <span className="text-xl font-bold text-slate-700 tracking-tight block mt-1 dir-rtl text-right">
                    {translationResult.persoArabicScript}
                  </span>
                </div>
              )}
            </div>

            {translationResult.grammarNotes && (
              <div className="mt-6 border-t border-emerald-100 pt-4">
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Linguistic & Grammatical Insight
                </span>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">
                  {translationResult.grammarNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column - Community translation hub */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight font-sans">Community translation forum</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-6 font-sans">
            Validate and suggest regional translations. Your input builds the crowdsourced dictionary prioritizing Kargili Purgi/Purki and Balti dialects.
          </p>

          <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-1">
            {communityTranslations.map((item) => (
              <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-slate-700">{item.sourceText}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                    {item.targetDialect}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-semibold mt-1 bg-white p-1.5 rounded-md border border-slate-100">
                  {item.translation}
                </p>
                <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-400 font-sans">
                  <span>By {item.author}</span>
                  <button
                    onClick={() => handleUpvote(item.id)}
                    className="text-amber-600 hover:text-amber-800 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1 transition-all"
                  >
                    ▲ Upvote ({item.upvotes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggest Translation Form */}
        <form onSubmit={handleCommunitySuggest} className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Suggest local vocabulary</h4>

          <div className="space-y-3">
            <input
              type="text"
              value={suggestSource}
              onChange={(e) => setSuggestSource(e.target.value)}
              placeholder="English/Urdu word or sentence"
              required
              className="w-full p-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={suggestTranslation}
              onChange={(e) => setSuggestTranslation(e.target.value)}
              placeholder="Balti/Purigi Translation spelling"
              required
              className="w-full p-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <select
                value={suggestDialect}
                onChange={(e) => setSuggestDialect(e.target.value as 'balti' | 'purigi')}
                className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
              >
                <option value="balti">Balti</option>
                <option value="purigi">Purigi</option>
              </select>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
              >
                <Send className="w-3 h-3" /> Submit entry
              </button>
            </div>
          </div>

          {suggestSuccess && (
            <div className="mt-3 text-[11px] bg-emerald-50 text-emerald-600 p-2 rounded-lg font-bold flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" /> Crowdsourced item added (+30 Points!)
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
