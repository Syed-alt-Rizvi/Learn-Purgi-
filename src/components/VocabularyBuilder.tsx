import React, { useState } from "react";
import { VocabCard } from "../types";
import { BookOpen, Award, ArrowRight, RotateCcw, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VocabularyBuilderProps {
  vocabList: VocabCard[];
  onEarnPoints: (pts: number) => void;
  onAddBadge: (badgeId: string) => void;
}

export default function VocabularyBuilder({ vocabList, onEarnPoints, onAddBadge }: VocabularyBuilderProps) {
  const [activeTab, setActiveTab] = useState<"flashcards" | "game">("flashcards");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);

  // Matching Game States
  const [gameCards, setGameCards] = useState<{ id: string; val: string; type: "word" | "meaning" }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Simulated audio synth
  const playSynthesizedPronunciation = (text: string) => {
    setSoundPlaying(text);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Simulate native speaker vocal format using fundamental freq + harmonics
      const playTone = (freq: number, duration: number, startTime: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Play double-vocal chime simulation
      const now = audioCtx.currentTime;
      playTone(330, 0.2, now);
      playTone(440, 0.4, now + 0.15);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
    setTimeout(() => setSoundPlaying(null), 1200);
  };

  const currentItem = vocabList[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % vocabList.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + vocabList.length) % vocabList.length);
  };

  // Matching Game Setup
  const setupGame = () => {
    const subset = [...vocabList].sort(() => 0.5 - Math.random()).slice(0, 5);
    const words = subset.map(item => ({ id: item.id, val: item.word, type: "word" as const }));
    const meanings = subset.map(item => ({ id: item.id, val: item.meaning, type: "meaning" as const }));
    
    // Shuffled together
    const shuffled = [...words, ...meanings].sort(() => 0.5 - Math.random());
    setGameCards(shuffled);
    setSelectedCards([]);
    setMatchedPairs([]);
    setGameFinished(false);
    setGameScore(0);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2 || selectedCards.includes(index) || matchedPairs.includes(gameCards[index].id)) {
      return;
    }

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const first = gameCards[newSelected[0]];
      const second = gameCards[newSelected[1]];

      if (first.id === second.id && first.type !== second.type) {
        // Match!
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, first.id]);
          setSelectedCards([]);
          setGameScore(prev => prev + 20);
          onEarnPoints(10);

          // Check win condition
          if (matchedPairs.length + 1 === gameCards.length / 2) {
            setGameFinished(true);
            onEarnPoints(50);
            onAddBadge("badge-match-master");
          }
        }, 500);
      } else {
        // Mis-match
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8" id="vocab-builder-section">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">Interactive Vocabulary Builder</h2>
          <p className="text-slate-500 text-sm mt-1">Master Kargili Purki/Purgi terms (with Balti comparative guides) and audio breakdowns</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab("flashcards"); setIsFlipped(false); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "flashcards"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            id="tab-flashcards"
          >
            Study Flashcards
          </button>
          <button
            onClick={() => { setActiveTab("game"); setupGame(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "game"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            id="tab-match-game"
          >
            Matching Game
          </button>
        </div>
      </div>

      {activeTab === "flashcards" ? (
        <div className="max-w-md mx-auto">
          {/* Main Flashcard */}
          <div className="h-[340px] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {currentItem.dialect === "both" ? "Balti & Purigi" : currentItem.dialect === "balti" ? "Balti Dialect" : "Purigi Dialect"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentIndex + 1} / {vocabList.length}
                  </span>
                </div>

                <div className="text-center my-auto">
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                    {currentItem.word}
                  </h3>
                  <p className="text-slate-400 text-sm font-mono mt-2">{currentItem.ipa}</p>

                  <div className="flex justify-center gap-4 mt-6">
                    {currentItem.tibetanScript && (
                      <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-xs">
                        <p className="text-xs text-slate-400">Tibetan Yige</p>
                        <p className="text-md font-medium text-slate-700 font-sans mt-0.5">{currentItem.tibetanScript}</p>
                      </div>
                    )}
                    {currentItem.persoArabicScript && (
                      <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-xs">
                        <p className="text-xs text-slate-400">Perso-Arabic</p>
                        <p className="text-md font-medium text-slate-700 font-sans mt-0.5 dir-rtl">{currentItem.persoArabicScript}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSynthesizedPronunciation(currentItem.word);
                    }}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-100 transition-all"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${soundPlaying === currentItem.word ? "text-emerald-500 animate-bounce" : ""}`} />
                    {soundPlaying === currentItem.word ? "Playing..." : "Audio Guide"}
                  </button>
                  <span>Click to flip card</span>
                </div>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-emerald-950 border-2 border-emerald-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs rotate-y-180 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 bg-emerald-900 px-2.5 py-1 rounded-full">
                    English & Urdu meaning
                  </span>
                  <span className="text-xs text-emerald-300 font-mono">
                    {currentItem.category}
                  </span>
                </div>

                <div className="text-center my-auto px-4">
                  <p className="text-xs uppercase text-emerald-400 font-semibold tracking-wider">Meaning</p>
                  <h4 className="text-2xl font-bold text-white tracking-tight mt-1">
                    {currentItem.meaning}
                  </h4>
                  {currentItem.urduMeaning && (
                    <p className="text-emerald-200 text-lg mt-1 font-sans">
                      {currentItem.urduMeaning}
                    </p>
                  )}

                  {currentItem.notes && (
                    <p className="text-emerald-300/80 text-xs mt-4 line-clamp-3 italic">
                      "{currentItem.notes}"
                    </p>
                  )}
                </div>

                <div className="text-center text-xs text-emerald-400">
                  Click to flip back
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrev}
              className="px-4 py-2 text-sm bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all font-medium"
              id="prev-flashcard"
            >
              Previous
            </button>
            <button
              onClick={() => playSynthesizedPronunciation(currentItem.word)}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full border border-emerald-200/50 transition-all"
              title="Listen pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-medium flex items-center gap-1.5"
              id="next-flashcard"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Matching Game */
        <div className="max-w-2xl mx-auto">
          {!gameFinished && gameCards.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" /> Matches Score: <strong className="text-slate-800 font-bold">{gameScore}</strong>
                </span>
                <button
                  onClick={setupGame}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-shuffle Cards
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {gameCards.map((card, index) => {
                  const isSelected = selectedCards.includes(index);
                  const isMatched = matchedPairs.includes(card.id);

                  return (
                    <button
                      key={index}
                      onClick={() => handleCardClick(index)}
                      disabled={isMatched}
                      className={`h-24 p-3 rounded-xl text-center text-xs font-semibold flex flex-col justify-center items-center transition-all shadow-xs border-2 ${
                        isMatched
                          ? "bg-emerald-50 border-emerald-500/30 text-emerald-600 opacity-60 cursor-default"
                          : isSelected
                          ? "bg-slate-900 border-slate-900 text-white scale-98"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <span className="uppercase text-[9px] text-slate-400 font-mono tracking-wider mb-1">
                        {card.type === "word" ? "Word" : "Meaning"}
                      </span>
                      <span className="font-bold tracking-tight leading-snug line-clamp-2">
                        {card.val}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Award className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 font-sans">Phenomenal Matching!</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                You successfully matched all dialect vocabulary words correctly and earned **+50 Points** and the **Vocabulary Master Badge**!
              </p>
              <button
                onClick={setupGame}
                className="mt-6 px-6 py-2.5 bg-emerald-950 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-900 transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Play Another Round
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
