import React, { useState } from "react";
import { Award, BookOpen, Check, HelpCircle, ArrowRight, RefreshCw } from "lucide-react";

interface GrammarExplorerProps {
  onEarnPoints: (pts: number) => void;
  onAddBadge: (badgeId: string) => void;
}

export default function GrammarExplorer({ onEarnPoints, onAddBadge }: GrammarExplorerProps) {
  const [activeTab, setActiveTab] = useState<"suffixes" | "consonants" | "verbs" | "builder">("suffixes");
  
  // Interactive Sentence Builder Game State
  const [builderStep, setBuilderStep] = useState(0); // 0: Idle, 1: Success, 2: Error
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  // Available words for: "Aba-is khambir zos" (Father ate bread)
  const sentenceWords = [
    { text: "khambir", description: "traditional bread (Direct Object)" },
    { text: "Aba-is", description: "Father + Ergative agent suffix (Subject)" },
    { text: "zos", description: "ate (Transitive Past Verb)" }
  ];

  const handleWordSelect = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else {
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const checkSentence = () => {
    // Correct order: Subject + Object + Verb (SOV structure, very typical Tibeto-Burman!)
    // "Aba-is khambir zos"
    const isCorrect = 
      selectedWords.length === 3 &&
      selectedWords[0] === "Aba-is" &&
      selectedWords[1] === "khambir" &&
      selectedWords[2] === "zos";

    if (isCorrect) {
      setBuilderStep(1);
      if (!pointsAwarded) {
        onEarnPoints(40);
        onAddBadge("badge-grammar-master");
        setPointsAwarded(true);
      }
    } else {
      setBuilderStep(2);
    }
  };

  const resetBuilder = () => {
    setSelectedWords([]);
    setBuilderStep(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8" id="grammar-explorer-section">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-sans">Comparative Grammar Masterclass</h2>
          <p className="text-slate-500 text-sm mt-1">Study morphosyntax, case structures, and Old Tibetan grammatical alignments</p>
        </div>

        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("suffixes")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "suffixes" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Nouns & Suffixes
          </button>
          <button
            onClick={() => setActiveTab("consonants")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "consonants" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Archaic Phonology
          </button>
          <button
            onClick={() => setActiveTab("verbs")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "verbs" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Verb Negatives
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "builder" ? "bg-emerald-950 text-white shadow-xs" : "text-emerald-700 hover:text-emerald-900"
            }`}
          >
            Sentence Builder Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main lesson content panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "suffixes" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 font-sans">1. Postpositional Case Suffixes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Balti and Purigi belong to the active-ergative morphosyntactic alignment group. Relations between nouns and verbs are managed via postpositional markers. Unlike Western prepositions (e.g. *in* the house), these are placed directly after or suffixed to the noun.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs uppercase font-bold text-slate-400 font-mono">The Genitive (Possessive)</span>
                  <p className="text-md font-bold text-slate-800 mt-1">Suffix: -i or -gi</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Indicates possession. For nouns ending in a vowel, **-i** is directly added. For consonants, **-gi** is used.
                    <br />
                    *Example:* **Aba-i** (Father's), **Nang-gi** (Of the house).
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs uppercase font-bold text-slate-400 font-mono">The Dative / Locative</span>
                  <p className="text-md font-bold text-slate-800 mt-1">Suffix: -la</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Functions as 'to', 'at', or 'in'. Identical to Classic Tibetan postpositions.
                    <br />
                    *Example:* **Kargil-la** (In/to Kargil), **nga-la** (to me).
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs uppercase font-bold text-slate-400 font-mono">The Ergative (Agentive)</span>
                  <p className="text-md font-bold text-slate-800 mt-1">Suffix: -is or -gis</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Marks the active subject (agent) performing a past transitive action. This is the most complex concept for English/Urdu learners!
                    <br />
                    *Example:* **Aba-is** (by Father), **Ama-is** (by Mother).
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs uppercase font-bold text-slate-400 font-mono">The Ablative (Origin)</span>
                  <p className="text-md font-bold text-slate-800 mt-1">Suffix: -ne or -ba</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Specifies origin or starting point ('from').
                    <br />
                    *Example:* **Skardu-ne** (from Skardu), **khaye-ba** (from where).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "consonants" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 font-sans">2. Living Phonological Fossils</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Historically, Classical Tibetan featured complex initial consonant clusters written in the scripts of the 7th-century Tibetan empire. As Central Tibetan languages evolved into Lhasa Tibetan, these clusters were dropped in speech and turned into pitch variations or tones instead.
              </p>
              <div className="bg-emerald-50/20 border border-emerald-100 p-5 rounded-2xl space-y-3.5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Balti and Purigi, protected by the steep valleys of the Karakoram and Himalayan ranges, remained isolated and **retained these pronunciation clusters fully in modern speech** while completely avoiding tonal development!
                </p>

                <div className="border-t border-emerald-100 pt-3 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Classical Spelling</span>
                    <span className="font-bold text-slate-700">Modern Lhasa (Tonal)</span>
                    <span className="font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded">Balti & Purik (Preserved cluster)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-1.5">
                    <span className="font-mono">སྐར་མ (skar-ma)</span>
                    <span>/kar.ma/ (High tone)</span>
                    <span className="font-semibold text-slate-800">Skarma / Karma (Pronounced sk-)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-1.5">
                    <span className="font-mono">ཟླ་བ (zla-ba)</span>
                    <span>/da.wa/ (Low tone)</span>
                    <span className="font-semibold text-slate-800">Hlaba / Laba (Pronounced hl- voiceless lateral)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span className="font-mono">བརྒྱད (brgyad)</span>
                    <span>/gjeː/ (Low falling tone)</span>
                    <span className="font-semibold text-slate-800">Rgyat / Bgyat (Pronounced rgy-/bgy- clusters!)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "verbs" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 font-sans">3. Verb Infinitives & Negatives</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verbs in Balti and Purigi are placed strictly at the end of the sentence (SOV: Subject-Object-Verb). Let's review the infinite stems and negative particles:
              </p>

              <div className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Infinitive Suffix (-ches or -chas)</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Equivalent to 'to' + verb (e.g., *to eat*, *to go*). Balti dialects prefer ending in **-ches**, while Purigi dialects often end in **-chas**.
                    <br />
                    *Examples:* **zo-ches / zo-chas** (to eat), **cha-ches / cha-chas** (to go), **ong-ches / ong-chas** (to come).
                  </p>
                </div>

                <div className="border-t border-slate-200/60 pt-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Negative Prefix markers (mi- and ma-)</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Unlike English where we add 'not' after, Balti/Purik prefixes negative markers directly to the verb stem:
                    <br />
                    1. **mi-** is prefixed for Present/Future negative actions.
                    <br />
                    *Example:* **nga mi-cha** = I will not go (present/future).
                    <br />
                    2. **ma-** is prefixed for Past negative actions.
                    <br />
                    *Example:* **nga ma-song** = I did not go (past).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "builder" && (
            <div className="space-y-5 bg-emerald-50/10 border border-emerald-200/50 p-6 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold text-emerald-950 font-sans">Sentence Puzzle: "Father ate the traditional bread"</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Arrange the word cards below in the correct SOV (Subject - Object - Verb) order, taking care to use the Ergative suffix on the active subject!
                </p>
              </div>

              {/* Selected Slots */}
              <div className="flex gap-3 justify-center bg-white border border-slate-200 p-4 rounded-xl min-h-16 items-center">
                {selectedWords.length > 0 ? (
                  selectedWords.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => handleWordSelect(word)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
                    >
                      {word} <span className="text-[9px] text-slate-400">×</span>
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-sans italic">Select cards below to compose sentence</span>
                )}
              </div>

              {/* Word choices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sentenceWords.map((word) => {
                  const isSelected = selectedWords.includes(word.text);
                  return (
                    <button
                      key={word.text}
                      onClick={() => handleWordSelect(word.text)}
                      disabled={isSelected}
                      className={`p-3 border rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-slate-50 border-slate-200 opacity-40 cursor-default"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:bg-slate-50/50"
                      }`}
                    >
                      <span className="font-extrabold text-xs text-slate-800 block">{word.text}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">{word.description}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action and feedback */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={resetBuilder}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Clear selections
                </button>

                <button
                  onClick={checkSentence}
                  disabled={selectedWords.length !== 3}
                  className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  Verify Suffix Order <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {builderStep === 1 && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-4 rounded-xl flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Flawless Assembly! (+40 Points)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      **"Aba-is khambir zos"** is perfectly structured. **Aba-is** holds the active agent marker, **khambir** is the patient bread, and **zos** sits as final verb (Subject-Object-Verb). You earned the Grammar Master badge!
                    </p>
                  </div>
                </div>
              )}

              {builderStep === 2 && (
                <div className="bg-amber-50 text-amber-800 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Word Order Mismatch</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Tibeto-Burman languages are strictly **Subject-Object-Verb (SOV)**. Please re-arrange the cards so the Subject with the ergative suffix (*Aba-is*) comes first, followed by the Object (*khambir*), and the action verb (*zos*) at the very end.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar helper panels */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-bold text-slate-800 tracking-tight font-sans">Sino-Tibetan Typology</h4>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-600">
            <div>
              <span className="font-bold text-slate-700 block">Dialect Divergences</span>
              <p className="mt-1">
                Balti retains voiceless and voiced prefixes (e.g. *bgyat* for eight). Purigi (Purik) spoken in Kargil maintains dental suffixes and slightly different pronoun structures.
              </p>
            </div>

            <div className="border-t border-slate-200/60 pt-3">
              <span className="font-bold text-slate-700 block">Non-tonal preservation</span>
              <p className="mt-1">
                Because there are no tones, meanings depend entirely on accurate pronunciation of dental and retroflex consonants, and initial prefixes like *r-*, *s-*, *b-*, etc.
              </p>
            </div>

            <div className="border-t border-slate-200/60 pt-3">
              <span className="font-bold text-slate-700 block">Honorific particles</span>
              <p className="mt-1">
                Always use **-le** after names or pronouns when speaking to monks, teachers, parents or elders to show high honorific respect (e.g., *Ama-le*, *Aba-le*, *Joo-le*).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
