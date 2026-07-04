import React from "react";
import { UserProgress, DictionaryEntry } from "../types";
import { Bookmark, Trash2, Volume2, ArrowRight, BookOpen } from "lucide-react";

interface BookmarksSectionProps {
  progress: UserProgress;
  dictionary: DictionaryEntry[];
  onRemoveBookmark: (id: string) => void;
  onNavigateToDictionary: () => void;
}

export default function BookmarksSection({
  progress,
  dictionary,
  onRemoveBookmark,
  onNavigateToDictionary
}: BookmarksSectionProps) {
  // Find bookmarked words
  const bookmarkedWords = dictionary.filter((item) =>
    progress.bookmarks.includes(item.id)
  );

  const playChime = (word: string) => {
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
      playFreq(440, 0.25, now);
      playFreq(554, 0.45, now + 0.15);
    } catch (e) {
      console.warn("Audio Context unavailable:", e);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100" id="bookmarks-tab-view">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            My Study Archive
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight font-sans mt-3">
            Bookmarked Vocabulary Terms
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Review your saved dialect terms, phonetics, and grammar structures for offline study
          </p>
        </div>
        <button
          onClick={onNavigateToDictionary}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
        >
          Explore Dictionary <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {bookmarkedWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedWords.map((word) => (
            <div
              key={word.id}
              className="bg-slate-50 border border-slate-200/60 hover:border-emerald-200 hover:bg-slate-50/80 rounded-2xl p-6 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md font-mono">
                    {word.partOfSpeech}
                  </span>
                  <span className="text-[9px] uppercase font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full tracking-wider">
                    {word.dialect === "common" ? "Balti & Purik" : word.dialect}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">
                    {word.word}
                  </h3>
                  <button
                    onClick={() => playChime(word.word)}
                    className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                    title="Pronounce"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 font-mono italic mt-0.5">
                  Phonetic IPA: {word.ipa}
                </p>

                {word.tibetanScript && (
                  <p className="text-sm font-bold text-slate-700 mt-2.5">
                    Tibetan: <span className="font-mono text-xs">{word.tibetanScript}</span>
                  </p>
                )}

                <p className="text-xs text-slate-600 leading-relaxed mt-3 border-t border-slate-200/40 pt-2.5">
                  <strong>Meaning:</strong> {word.meaning}
                </p>

                {word.definition && (
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 line-clamp-2">
                    {word.definition}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/50 pt-4 mt-6">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Added to study set
                </span>
                <button
                  onClick={() => onRemoveBookmark(word.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1 text-[10px] font-bold"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-slate-100 max-w-xl mx-auto">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-md font-extrabold text-slate-700 tracking-tight">No Bookmarked Terms</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            When you browse the Comparative Regional Dictionary, use the bookmark icons to pin words for concentrated review here.
          </p>
          <button
            onClick={onNavigateToDictionary}
            className="mt-6 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Open Dictionary Now
          </button>
        </div>
      )}
    </div>
  );
}
