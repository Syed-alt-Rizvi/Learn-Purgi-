import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, Languages, ChevronRight, Bookmark } from "lucide-react";

interface PurgiWord {
  word: string;
  tibetanScript: string;
  persoArabicScript: string;
  ipa: string;
  meaning: string;
  definition: string;
  gradient: string;
  accentColor: string;
  example: string;
  translation: string;
}

const CAROUSEL_WORDS: PurgiWord[] = [
  {
    word: "Khamzang",
    tibetanScript: "ཁམས་བཟང་།",
    persoArabicScript: "خمزنگ",
    ipa: "/kʰam.zaŋ/",
    meaning: "Wellbeing / Greeting (How are you?)",
    definition: "The traditional Purgi greeting signifying 'May you be well and in peaceful elements'.",
    gradient: "from-rose-500 via-pink-500 to-orange-400",
    accentColor: "rose",
    example: "Khamzang ley, aba?",
    translation: "Are you well, respected father?"
  },
  {
    word: "Zan",
    tibetanScript: "ཟན།",
    persoArabicScript: "زن",
    ipa: "/zan/",
    meaning: "Roasted Barley Dough",
    definition: "The essential staple meal of Karakoram highlands, packed with slow-release nutrients.",
    gradient: "from-amber-400 via-orange-500 to-yellow-600",
    accentColor: "orange",
    example: "Nga-is zan khon-la chin.",
    translation: "I gave them roasted barley dough."
  },
  {
    word: "Ama",
    tibetanScript: "ཨ་མ།",
    persoArabicScript: "امّا",
    ipa: "/a.ma/",
    meaning: "Mother",
    definition: "A term of profound respect and affection. Retains classic phonetics across Kargil.",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    accentColor: "purple",
    example: "Ama-is la-prugs bzos.",
    translation: "Mother made hand-rolled noodles."
  },
  {
    word: "Chos",
    tibetanScript: "ཆོས།",
    persoArabicScript: "چوس",
    ipa: "/t͡ʃʰos/",
    meaning: "Truth / Spiritual Path",
    definition: "An ancient preserved word representing traditional ethical wisdom, law, or truth.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    accentColor: "teal",
    example: "Chos bshad chin khon-la.",
    translation: "Spiritual truths were explained to them."
  },
  {
    word: "Snya",
    tibetanScript: "སྙན།",
    persoArabicScript: "سنیا",
    ipa: "/sɲa/",
    meaning: "Ear",
    definition: "Famous for preserving the ancient dental-nasal cluster prefix (sn-) lost in modern dialects.",
    gradient: "from-cyan-500 via-blue-600 to-indigo-600",
    accentColor: "blue",
    example: "Khon-is snya thos chin.",
    translation: "They listened closely (with their ears)."
  },
  {
    word: "Grakpa",
    tibetanScript: "གྲགས་པ།",
    persoArabicScript: "گرقپا",
    ipa: "/grak.pa/",
    meaning: "Famous / Celebrated",
    definition: "Retains the silent historical 'g-' prefix, showing Kargil's connection to Classical Tibetan.",
    gradient: "from-violet-600 via-fuchsia-600 to-pink-500",
    accentColor: "fuchsia",
    example: "Khong kacho grakpa in.",
    translation: "He is a famous elder teacher."
  }
];

export default function DynamicWordCarousel() {
  const [index, setIndex] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_WORDS.length);
    }, 4500); // changes every 4.5 seconds

    return () => clearInterval(timer);
  }, []);

  const current = CAROUSEL_WORDS[index];

  const playSynthesizedChime = (wordName: string) => {
    setIsPlayingSound(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      const playTone = (freq: number, duration: number, time: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      // High pleasant musical chime
      playTone(523.25, 0.3, now); // C5
      playTone(659.25, 0.3, now + 0.12); // E5
      playTone(783.99, 0.5, now + 0.24); // G5
    } catch (e) {
      console.warn("Web Audio unavailable:", e);
    }
    setTimeout(() => setIsPlayingSound(false), 800);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-1" id="dynamic-carousel-container">
      {/* Dynamic Word Container - Squircle styling */}
      <div 
        className="w-full max-w-lg bg-white p-1 rounded-[2.5rem] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden"
        style={{ contentVisibility: "auto" }}
      >
        {/* Animated Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="p-6 md:p-8 flex flex-col justify-between min-h-[300px]"
          >
            {/* Upper Badge and Sparkles */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-3xs animate-pulse">
                <Languages className="w-3.5 h-3.5 text-indigo-500" /> Dialect Word Spotlight
              </span>
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            </div>

            {/* Main Word Card - High Contrast Vibrant Flashy Card with Squircle design inside */}
            <div className={`bg-gradient-to-br ${current.gradient} text-white p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
              {/* Overlay graphics */}
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start gap-4 z-10">
                <div>
                  <h4 className="text-3xl font-black font-sans tracking-tight leading-none">
                    {current.word}
                  </h4>
                  <p className="text-xs text-white/80 font-mono mt-1.5 italic">
                    IPA: {current.ipa}
                  </p>
                </div>
                
                <button
                  onClick={() => playSynthesizedChime(current.word)}
                  className="p-2 bg-white/20 hover:bg-white/35 active:scale-90 text-white rounded-xl transition-all shadow-xs shrink-0"
                  title="Play pronunciation chime"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingSound ? "animate-bounce" : ""}`} />
                </button>
              </div>

              {/* Script Previews inside Card */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/20 z-10">
                <div>
                  <span className="text-[9px] font-black uppercase text-white/75 tracking-wider block">Yige Script</span>
                  <span className="text-sm font-bold block mt-0.5">{current.tibetanScript}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase text-white/75 tracking-wider block">Arabic Script</span>
                  <span className="text-sm font-bold block mt-0.5">{current.persoArabicScript}</span>
                </div>
              </div>
            </div>

            {/* Explanation Section */}
            <div className="mt-6 space-y-3.5 text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">English Definition</span>
                <p className="text-sm font-extrabold text-slate-800 leading-snug mt-0.5">
                  {current.meaning}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linguistic Note</span>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  {current.definition}
                </p>
              </div>

              {/* Conjugation Example */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mt-2 flex flex-col gap-1">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Regional Sentence Usage</span>
                <p className="text-xs font-bold text-slate-800">"{current.example}"</p>
                <p className="text-[11px] text-slate-500">Translation: {current.translation}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic dot indicator at the bottom */}
        <div className="flex justify-center gap-1.5 pb-5">
          {CAROUSEL_WORDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-slate-900" : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
