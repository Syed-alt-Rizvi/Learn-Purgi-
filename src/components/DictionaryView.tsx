import React, { useState, useEffect } from "react";
import { DictionaryEntry } from "../types";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Volume2,
  Info,
  BookOpen,
  PlusCircle,
  Check,
  XCircle,
  User,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface DictionaryViewProps {
  entries: DictionaryEntry[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onRefresh: () => void;
  isPro: boolean;
  onNavigateToUpgrade: () => void;
}

export default function DictionaryView({
  entries,
  bookmarks,
  onToggleBookmark,
  onRefresh,
  isPro,
  onNavigateToUpgrade
}: DictionaryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialectFilter, setDialectFilter] = useState<"all" | "balti" | "purigi">("all");
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showSuggestForm, setShowSuggestForm] = useState(false);

  // Form inputs
  const [formData, setFormData] = useState({
    word: "",
    tibetanScript: "",
    persoArabicScript: "",
    ipa: "",
    meaning: "",
    urduMeaning: "",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "",
    exampleSentence: "",
    exampleTranslation: "",
    etymology: "",
    submittedBy: ""
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync selected entry
  useEffect(() => {
    if (entries.length > 0 && !selectedEntry) {
      setSelectedEntry(entries[0]);
    }
  }, [entries]);

  // Fetch pending suggestions for admin
  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/suggestions");
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error("Failed to fetch suggestions:", e);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [isAdminMode]);

  // Filter logic
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDialect =
      dialectFilter === "all" ||
      entry.dialect === "common" ||
      entry.dialect === dialectFilter;

    return matchesSearch && matchesDialect;
  });

  const playChime = (wordName: string) => {
    setSoundPlaying(wordName);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      const playFreq = (f: number, d: number, t: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + d);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + d);
      };
      playFreq(392, 0.25, now);
      playFreq(523, 0.45, now + 0.15);
    } catch (e) {
      console.warn("Audio Context unavailable:", e);
    }
    setTimeout(() => setSoundPlaying(null), 1000);
  };

  // Submit suggestion
  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word || !formData.meaning || !formData.definition) {
      setFormError("Please fill in all required fields (Word, English Meaning, and Linguistic Definition).");
      return;
    }

    setFormError("");
    setFormSuccess(false);
    setSubmitting(true);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setFormSuccess(true);
        // Reset form
        setFormData({
          word: "",
          tibetanScript: "",
          persoArabicScript: "",
          ipa: "",
          meaning: "",
          urduMeaning: "",
          partOfSpeech: "Noun",
          dialect: "common",
          definition: "",
          exampleSentence: "",
          exampleTranslation: "",
          etymology: "",
          submittedBy: ""
        });
        fetchSuggestions();
      } else {
        setFormError(data.error || "Failed to submit suggestion.");
      }
    } catch (err) {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Approve word
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/suggestions/${id}/approve`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`Word "${data.suggestion.word}" verified and officially added to the dynamic library!`);
        onRefresh(); // fetch new dictionary list
        fetchSuggestions(); // reload suggestions lists
      }
    } catch (e) {
      console.error("Approval error:", e);
    }
  };

  // Reject word
  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject and archive this suggestion?")) return;
    try {
      const res = await fetch(`/api/suggestions/${id}/reject`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        fetchSuggestions();
      }
    } catch (e) {
      console.error("Rejection error:", e);
    }
  };

  // Check admin password
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow passless or any basic verification to keep development easy but robust
    if (adminPassword.toLowerCase() === "rizvi" || adminPassword === "admin" || adminPassword === "") {
      setAdminUnlocked(true);
    } else {
      alert("Incorrect password! Hint: Use 'rizvi' or leave empty.");
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Top Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" id="dictionary-view-section">
        <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-sans">Comparative Regional Dictionary</h2>
              <p className="text-slate-500 text-sm mt-1">Search dual dialects of Balti and Purik (Purigi) alongside Classical roots</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSuggestForm(!showSuggestForm);
                  setIsAdminMode(false);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border shadow-2xs ${
                  showSuggestForm
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Suggest Missing Word
              </button>
              
              <button
                onClick={() => {
                  setIsAdminMode(!isAdminMode);
                  setShowSuggestForm(false);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border shadow-2xs ${
                  isAdminMode
                    ? "bg-emerald-950 border-emerald-950 text-white"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Shield className="w-4 h-4" /> Verifier Panel
              </button>
            </div>
          </div>

          {/* Search controls */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search words, meanings, or definitions..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
                id="dict-search-input"
              />
            </div>

            <div className="flex bg-slate-200/60 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setDialectFilter("all")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dialectFilter === "all" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Dialects
              </button>
              <button
                onClick={() => setDialectFilter("balti")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dialectFilter === "balti" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Balti Only
              </button>
              <button
                onClick={() => setDialectFilter("purigi")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dialectFilter === "purigi" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Purigi Only
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 min-h-[450px]">
          {/* Left Side: Word List */}
          <div className="border-r border-slate-100 overflow-y-auto max-h-[500px] p-4 space-y-2 bg-slate-50/30">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id;
                const isBookmarked = bookmarks.includes(entry.id);

                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-sm tracking-tight font-sans block">{entry.word}</span>
                      <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {entry.dialect === "common" ? "Both" : entry.dialect}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className={`text-xs truncate max-w-[80%] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        {entry.meaning}
                      </p>
                      {isBookmarked && (
                        <BookmarkCheck className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-emerald-600"}`} />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No dictionary words matched your criteria.
              </div>
            )}
          </div>

          {/* Right Side: Entry Details */}
          <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between max-h-[500px] overflow-y-auto">
            {selectedEntry ? (
              <div className="space-y-6">
                {/* Header card details */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight font-sans">
                        {selectedEntry.word}
                      </h3>
                      <span className="text-xs text-slate-400 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md font-mono">
                        {selectedEntry.partOfSpeech}
                      </span>
                      <span className="text-xs uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full tracking-wider">
                        {selectedEntry.dialect === "common" ? "Balti & Purigi" : `${selectedEntry.dialect} Dialect`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1 italic">
                      Phonetic IPA: {selectedEntry.ipa}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => playChime(selectedEntry.word)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-all shadow-xs"
                      title="Audio guidance"
                    >
                      <Volume2 className={`w-4 h-4 ${soundPlaying === selectedEntry.word ? "text-emerald-600 animate-bounce" : ""}`} />
                    </button>
                    <button
                      onClick={() => onToggleBookmark(selectedEntry.id)}
                      className={`p-2.5 rounded-xl border transition-all shadow-xs ${
                        bookmarks.includes(selectedEntry.id)
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                          : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                      }`}
                      title={bookmarks.includes(selectedEntry.id) ? "Remove bookmark" : "Bookmark for offline review"}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Native Script Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedEntry.tibetanScript && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Tibetan Yige Script</span>
                      <span className="text-xl font-bold text-slate-700 tracking-tight block mt-1">
                        {selectedEntry.tibetanScript}
                      </span>
                    </div>
                  )}
                  {selectedEntry.persoArabicScript && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Perso-Arabic script</span>
                      <span className="text-xl font-bold text-slate-700 tracking-tight block mt-1 dir-rtl text-right">
                        {selectedEntry.persoArabicScript}
                      </span>
                    </div>
                  )}
                </div>

                {/* Meanings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">English definition</span>
                    <p className="text-md font-bold text-slate-800 font-sans mt-1">{selectedEntry.meaning}</p>
                  </div>
                  {selectedEntry.urduMeaning && (
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Urdu translation</span>
                      <p className="text-md font-bold text-slate-800 font-sans mt-1">{selectedEntry.urduMeaning}</p>
                    </div>
                  )}
                </div>

                {/* Definition */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Linguistic definition</span>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">{selectedEntry.definition}</p>
                </div>

                {/* Example usage */}
                {selectedEntry.exampleSentence && (
                  <div className="bg-emerald-50/20 border border-emerald-100 p-4 rounded-xl">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Conjugation Example</span>
                    <p className="text-sm font-bold text-slate-800 mt-1.5">"{selectedEntry.exampleSentence}"</p>
                    <p className="text-xs text-slate-500 mt-1">Translation: {selectedEntry.exampleTranslation}</p>
                  </div>
                )}

                {/* Etymology & Classical connections */}
                {selectedEntry.etymology && (
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/50">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-slate-400" /> Historical Etymology (Classical Tibetan)
                    </span>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed italic">
                      {selectedEntry.etymology}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto">
                <BookOpen className="w-12 h-12 text-slate-300 mb-2.5" />
                <p className="text-sm text-slate-400 font-medium">Select a dictionary term on the left side to inspect linguistic data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Collapsible Suggest Missing Word Form */}
      {showSuggestForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 animate-fadeIn" id="word-suggestion-form">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <PlusCircle className="text-emerald-700 w-5 h-5" /> Suggest a Missing Regional Term
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Contribute to the Karakoram Language library! Submit missing vocabulary terms. Admin verification is required before publishing.
            </p>
          </div>

          {formSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800">Suggestion Submitted Successfully!</h4>
                <p className="text-xs text-emerald-600 mt-1">
                  Thank you! Your word has been added to our pending verifier queue. Syed Murtaza Rizvi (Admin) will review, verify correct scripts, and officially publish it to the digital catalog.
                </p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="mt-4 px-3 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition-all"
                >
                  Suggest Another Word
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSuggestSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-2 items-center text-xs text-red-700 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Word (Romanized Spelling) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                    placeholder="e.g. Zan-thsos"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Tibetan Yige Script (Optional)</label>
                  <input
                    type="text"
                    value={formData.tibetanScript}
                    onChange={(e) => setFormData({ ...formData, tibetanScript: e.target.value })}
                    placeholder="e.g. ཟན་ཚོས།"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Perso-Arabic Script (Optional)</label>
                  <input
                    type="text"
                    value={formData.persoArabicScript}
                    onChange={(e) => setFormData({ ...formData, persoArabicScript: e.target.value })}
                    placeholder="e.g. زان ثوس"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-right focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Phonetics (IPA) (Optional)</label>
                  <input
                    type="text"
                    value={formData.ipa}
                    onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                    placeholder="e.g. /zan.tʰos/"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Part of Speech <span className="text-red-500">*</span></label>
                  <select
                    value={formData.partOfSpeech}
                    onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Noun">Noun</option>
                    <option value="Verb">Verb</option>
                    <option value="Adjective">Adjective</option>
                    <option value="Adverb">Adverb</option>
                    <option value="Pronoun">Pronoun</option>
                    <option value="Grammar Suffix">Grammar Suffix</option>
                    <option value="Interjection">Interjection</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Dialect Affiliation <span className="text-red-500">*</span></label>
                  <select
                    value={formData.dialect}
                    onChange={(e) => setFormData({ ...formData, dialect: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="common">Common (Both Balti & Purigi)</option>
                    <option value="balti">Balti Only</option>
                    <option value="purigi">Purigi Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Your Name (Submitter) (Optional)</label>
                  <input
                    type="text"
                    value={formData.submittedBy}
                    onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                    placeholder="e.g. Ali Raza"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">English Meaning <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.meaning}
                    onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                    placeholder="e.g. Vegetable barley soup"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Urdu Translation (Optional)</label>
                  <input
                    type="text"
                    value={formData.urduMeaning}
                    onChange={(e) => setFormData({ ...formData, urduMeaning: e.target.value })}
                    placeholder="e.g. سبزیوں والا دلیہ"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">Linguistic Definition & Details <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={formData.definition}
                  onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                  placeholder="Describe the usage, regional connotations, and grammar properties..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Example Sentence (Optional)</label>
                  <input
                    type="text"
                    value={formData.exampleSentence}
                    onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
                    placeholder="e.g. Nga-is vegetable zan-thsos zos."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Example Sentence Translation (Optional)</label>
                  <input
                    type="text"
                    value={formData.exampleTranslation}
                    onChange={(e) => setFormData({ ...formData, exampleTranslation: e.target.value })}
                    placeholder="e.g. I ate vegetable barley soup."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">Etymology / Classical Tibetan Connections (Optional)</label>
                <input
                  type="text"
                  value={formData.etymology}
                  onChange={(e) => setFormData({ ...formData, etymology: e.target.value })}
                  placeholder="e.g. Derived from Classical Tibetan 'zan' + 'tshal'"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuggestForm(false)}
                  className="px-5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-slate-900 text-white font-extrabold rounded-xl text-xs hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Word Suggestion"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. Dedicated Admin Verification Portal */}
      {isAdminMode && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8 animate-fadeIn" id="admin-verifier-dashboard">
          <div className="border-b border-emerald-50 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Shield className="text-emerald-700 w-5 h-5" /> Admin Verification & Library Moderation
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Moderator and Admin interface to review user word suggestions, refine IPA scripts, and approve to live registry
              </p>
            </div>

            {adminUnlocked && (
              <span className="text-[10px] uppercase font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Session: Rizvi
              </span>
            )}
          </div>

          {!adminUnlocked ? (
            <form onSubmit={handleAdminAuth} className="max-w-md mx-auto py-8 text-center space-y-4">
              <Shield className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Admin Authentication Required</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate to verify student suggestions. (Default: Leave password empty, or enter <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">rizvi</code>)
                </p>
              </div>

              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter Rizvi admin password..."
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all"
                >
                  Verify
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* suggestions list */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Pending Suggestions Queue ({suggestions.filter(s => s.status === 'pending').length})
                </h4>

                {suggestions.filter(s => s.status === 'pending').length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                    <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                    <p className="text-xs text-slate-400 font-bold">Suggestions queue is completely cleared.</p>
                    <p className="text-[10px] text-slate-400 mt-1">When students suggest regional words, they will appear here for verification.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {suggestions.filter(s => s.status === 'pending').map((sug) => (
                      <div
                        key={sug.id}
                        className="bg-slate-50/50 border border-slate-200 hover:border-emerald-200 rounded-2xl p-6 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-md font-extrabold text-slate-800 font-sans">{sug.word}</h5>
                              <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md">
                                {sug.partOfSpeech}
                              </span>
                              <span className="text-[9px] uppercase font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {sug.dialect === "common" ? "Both dialects" : `${sug.dialect} dialect`}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">Phonetics (IPA): {sug.ipa}</p>
                          </div>

                          <div className="flex gap-2 self-stretch sm:self-auto shrink-0">
                            <button
                              onClick={() => handleReject(sug.id)}
                              className="flex-1 sm:flex-none px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                            <button
                              onClick={() => handleApprove(sug.id)}
                              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" /> Verify & Add to Library
                            </button>
                          </div>
                        </div>

                        {/* Script comparisons */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Tibetan Yige Script</span>
                            <span className="font-bold text-slate-700 mt-0.5 block">{sug.tibetanScript || "Not provided"}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs text-right">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Perso-Arabic Script</span>
                            <span className="font-bold text-slate-700 mt-0.5 block dir-rtl">{sug.persoArabicScript || "Not provided"}</span>
                          </div>
                        </div>

                        {/* Translations */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Translation (EN)</span>
                            <p className="font-bold text-slate-800 mt-0.5">{sug.meaning}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Translation (UR)</span>
                            <p className="font-bold text-slate-800 mt-0.5">{sug.urduMeaning || "Not provided"}</p>
                          </div>
                        </div>

                        {/* Description details */}
                        <div className="mt-4 text-xs border-t border-slate-100 pt-3">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Linguistic Definition</span>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{sug.definition}</p>
                        </div>

                        {/* Examples */}
                        {sug.exampleSentence && (
                          <div className="mt-4 bg-emerald-50/10 border border-emerald-100/40 p-3 rounded-xl text-xs">
                            <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Suggested Conjugation</span>
                            <p className="font-bold text-slate-800 mt-1">"{sug.exampleSentence}"</p>
                            <p className="text-slate-500 mt-0.5">Translation: {sug.exampleTranslation}</p>
                          </div>
                        )}

                        {/* Submitter footer badge */}
                        <div className="mt-5 border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" /> Suggested by: <strong>{sug.submittedBy}</strong>
                          </span>
                          <span>Submitted on: {new Date(sug.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviewed / History section */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  Reviewed & Verified Log
                </h4>

                <div className="space-y-2">
                  {suggestions.filter(s => s.status !== 'pending').length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">No words reviewed yet in this session.</p>
                  ) : (
                    suggestions.filter(s => s.status !== 'pending').map(sug => (
                      <div key={sug.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-700">{sug.word}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({sug.meaning})</span>
                        </div>
                        <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${
                          sug.status === 'approved'
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {sug.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
