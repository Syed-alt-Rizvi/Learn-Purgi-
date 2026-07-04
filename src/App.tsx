import React, { useState, useEffect } from "react";
import { UserProgress, Lesson, LessonStep } from "./types";
import { LESSONS, DICTIONARY } from "./data";
import VocabularyBuilder from "./components/VocabularyBuilder";
import RealtimeTranslator from "./components/RealtimeTranslator";
import AiTutorCoach from "./components/AiTutorCoach";
import DictionaryView from "./components/DictionaryView";
import GrammarExplorer from "./components/GrammarExplorer";
import GamifiedLeaderboard from "./components/GamifiedLeaderboard";
import ExternalCoursesCatalog from "./components/ExternalCoursesCatalog";
import AccountSection from "./components/AccountSection";
import DynamicWordCarousel from "./components/DynamicWordCarousel";
import BookmarksSection from "./components/BookmarksSection";
import AdSenseUnit from "./components/AdSenseUnit";
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signOut, 
  doc, 
  getDoc, 
  setDoc,
  FirebaseUser 
} from "./lib/firebase";
import LoginScreen from "./components/LoginScreen";
import { LogOut } from "lucide-react";
import {
  Trophy,
  Flame,
  BookOpen,
  Languages,
  BookMarked,
  Layers,
  GraduationCap,
  Sparkles,
  User,
  Volume2,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Clock,
  Menu,
  X,
  Bookmark,
  RefreshCw
} from "lucide-react";

const PURGI_WISDOM = [
  { text: "Chhu ma thung-pi-la, bzam ma bcho.", translation: "Don't build a bridge before reaching the river.", context: "Classic Kargili advice on patience." },
  { text: "Shes-rab kyi nor, su-is kyang khyer mi-shis.", translation: "No one can steal the wealth of knowledge.", context: "Value of learning and language preservation." },
  { text: "Skar-ma rgyas-na, nam-mkha' mdzes.", translation: "When stars shine, the sky is beautiful.", context: "Unity in diversity." },
  { text: "Sem khamzang-la, lus khamzang.", translation: "A healthy mind leads to a healthy body.", context: "Purgi wellness greeting." },
  { text: "Ka-wa ma rgyab-na, thog mi-chhag.", translation: "Without pillars, the roof will not stand.", context: "Community support and grammar prefix lesson." }
];

export default function App() {
  // 1. Core user progress state (initialized with placeholders, loaded securely from Google servers)
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    completedSteps: {},
    bookmarks: [],
    streak: 3, // starting with a nice realistic streak
    points: 120,
    badges: ["badge-first-steps"],
    name: "Learner",
    avatar: "🎓",
    dialectPreference: "purigi",
    level: 1,
    isPro: true
  });

  // Firebase auth state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeGreeting, setCurrentTimeGreeting] = useState("Salam 🏔️");
  const [wisdomIndex, setWisdomIndex] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setCurrentTimeGreeting("Sngatmo Salam (Good morning) ☀️");
    } else if (hour < 17) {
      setCurrentTimeGreeting("Piltiqi Salam (Good afternoon) 🌤️");
    } else {
      setCurrentTimeGreeting("Phitseki Salam (Good evening) 🌙");
    }
    // Select a random wisdom index on mount
    setWisdomIndex(Math.floor(Math.random() * PURGI_WISDOM.length));
  }, []);

  // Load progress on mount
  const [dictionaryEntries, setDictionaryEntries] = useState<any[]>(DICTIONARY);

  // Fetch verified entries from the server (combined DICTIONARY + approved suggestions)
  const fetchDictionary = async () => {
    try {
      const res = await fetch("/api/dictionary");
      const data = await res.json();
      if (data.success) {
        setDictionaryEntries(data.entries);
      }
    } catch (e) {
      console.error("Failed to fetch dynamic dictionary:", e);
    }
  };

  // Google servers Auth & Firestore Synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const serverProgress = userDocSnap.data() as UserProgress;
            const updated = { ...serverProgress, isPro: true };
            setProgress(updated);
            localStorage.setItem("balti_purik_learner_progress", JSON.stringify(updated));
          } else {
            // First login, initialize secure user space on Google servers
            const initialProgress: UserProgress = {
              completedLessons: [],
              completedSteps: {},
              bookmarks: [],
              streak: 3,
              points: 120,
              badges: ["badge-first-steps"],
              name: firebaseUser.displayName || "Learner",
              avatar: "🎓",
              dialectPreference: "purigi",
              level: 1,
              isPro: true
            };
            setProgress(initialProgress);
            localStorage.setItem("balti_purik_learner_progress", JSON.stringify(initialProgress));
            await setDoc(userDocRef, initialProgress);
          }
        } catch (err) {
          console.error("Failed to load user profile from Google servers:", err);
          // Try loading offline backup
          const saved = localStorage.getItem("balti_purik_learner_progress");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setProgress({ ...parsed, isPro: true });
            } catch (jsonErr) {
              console.error("Failed parsing cached local progress:", jsonErr);
            }
          }
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    fetchDictionary();
    return () => unsubscribe();
  }, []);

  // Save changes to local state, browser cache, and Google servers
  const saveProgress = async (newProgress: UserProgress) => {
    const updatedProgress = { ...newProgress, isPro: true };
    setProgress(updatedProgress);
    localStorage.setItem("balti_purik_learner_progress", JSON.stringify(updatedProgress));
    
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, updatedProgress);
      } catch (err) {
        console.error("Failed syncing progress to Google servers:", err);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSelectedLesson(null);
      setActiveTab("dashboard");
    } catch (e) {
      console.error("Sign-out failed:", e);
    }
  };

  const handleEarnPoints = (pts: number) => {
    const newPts = progress.points + pts;
    const newLevel = Math.floor(newPts / 200) + 1; // 200 points per level
    saveProgress({
      ...progress,
      points: newPts,
      level: newLevel
    });
  };

  const handleAddBadge = (badgeId: string) => {
    if (!progress.badges.includes(badgeId)) {
      saveProgress({
        ...progress,
        badges: [...progress.badges, badgeId]
      });
    }
  };

  const handleToggleBookmark = (id: string) => {
    const isBookmarked = progress.bookmarks.includes(id);
    let newBookmarks = [...progress.bookmarks];
    if (isBookmarked) {
      newBookmarks = newBookmarks.filter(bId => bId !== id);
    } else {
      newBookmarks.push(id);
    }
    saveProgress({ ...progress, bookmarks: newBookmarks });
  };

  const handleRemoveBookmark = (id: string) => {
    saveProgress({
      ...progress,
      bookmarks: progress.bookmarks.filter(bId => bId !== id)
    });
  };

  const handleClearProgress = () => {
    const defaultProgress: UserProgress = {
      completedLessons: [],
      completedSteps: {},
      bookmarks: [],
      streak: 0,
      points: 0,
      badges: [],
      name: "Learner",
      avatar: "🎓",
      dialectPreference: "purigi",
      level: 1
    };
    saveProgress(defaultProgress);
    setSelectedLesson(null);
    setActiveTab("dashboard");
  };

  // Sound generator helper
  const playStepAudio = (text: string) => {
    setSoundPlaying(text);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      const tone = (f: number, d: number, t: number) => {
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
      // Voice synthesis chime
      tone(440, 0.25, now);
      tone(554, 0.4, now + 0.15);
    } catch (e) {
      console.warn("Web audio unavailable:", e);
    }
    setTimeout(() => setSoundPlaying(null), 1200);
  };

  // Lessons view logic
  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    const savedStep = progress.completedSteps[lesson.id] || 0;
    setActiveStepIndex(savedStep);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setActiveTab("lesson-active");
  };

  const handleNextStep = () => {
    if (!selectedLesson) return;
    const totalSteps = selectedLesson.steps.length;

    if (activeStepIndex + 1 < totalSteps) {
      const nextStep = activeStepIndex + 1;
      setActiveStepIndex(nextStep);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);

      // Save completed step indexes
      saveProgress({
        ...progress,
        completedSteps: {
          ...progress.completedSteps,
          [selectedLesson.id]: nextStep
        }
      });
    } else {
      // Completed full lesson!
      const isAlreadyCompleted = progress.completedLessons.includes(selectedLesson.id);
      let newCompleted = [...progress.completedLessons];
      if (!isAlreadyCompleted) {
        newCompleted.push(selectedLesson.id);
        handleEarnPoints(selectedLesson.points);
        handleAddBadge("badge-first-steps");
      }

      saveProgress({
        ...progress,
        completedLessons: newCompleted
      });

      alert(`Congratulations! You completed: "${selectedLesson.title}"! Earned +${selectedLesson.points} XP!`);
      setSelectedLesson(null);
      setActiveTab("lessons");
    }
  };

  // Nav categories setup
  const tabs = [
    { id: "dashboard", label: "Overview", icon: Layers },
    { id: "lessons", label: "Interactive Lessons", icon: BookOpen },
    { id: "vocab", label: "Vocab Matching", icon: BookMarked },
    { id: "translator", label: "AI Translation", icon: Languages },
    { id: "dictionary", label: "Dictionary & IPA", icon: Trophy },
    { id: "grammar", label: "Grammar Workbook", icon: Trophy },
    { id: "tutor", label: "AI Conversation Tutor", icon: Sparkles },
    { id: "courses", label: "Linguistics Courses", icon: GraduationCap },
    { id: "bookmarks", label: "Saved Bookmarks", icon: Bookmark },
    { id: "profile", label: "My Account & Settings", icon: User }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold text-slate-400">Loading your profile from Google servers...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans" id="applet-viewport">
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏔️</span>
            <div>
              <h1 className="text-md font-extrabold tracking-tight font-sans leading-none">Purgi Language Portal</h1>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Kargili Purki/Purgi Focus</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "User"} 
                className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm border border-slate-850"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-2xl bg-slate-800 p-2 rounded-xl shrink-0 shadow-sm">{progress.avatar}</span>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">{progress.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  LVL {progress.level}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{progress.points} XP</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === "lessons" && activeTab === "lesson-active");

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "lesson-active") setSelectedLesson(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-950 text-white font-black shadow-xs border-l-4 border-emerald-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                id={`sidebar-link-${tab.id}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Sign Out button at the bottom */}
        <div className="p-3 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={handleSignOut}
            className="w-full py-2 bg-slate-950 hover:bg-red-950/60 hover:text-red-400 text-slate-400 font-bold text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-800/80"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Account
          </button>
          <div className="text-[9px] text-slate-600 text-center font-bold">
            Preserving Himalayan Oral Legacies
          </div>
        </div>
      </aside>

      {/* 2. Mobile Nav Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-50 px-4 flex items-center justify-between border-b border-slate-800 shadow-sm">
         <div className="flex items-center gap-2">
          <span className="text-xl">🏔️</span>
          <span className="text-xs font-extrabold tracking-tight">Purgi Language Portal</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg"
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-slate-950/95 z-40 p-6 overflow-y-auto animate-fadeIn text-white">
          <nav className="space-y-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.id === "lessons" && activeTab === "lesson-active");

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== "lesson-active") setSelectedLesson(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-950 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* 3. Main Content Viewport */}
      <main className="flex-1 p-6 lg:p-10 mt-16 lg:mt-0 max-w-7xl mx-auto overflow-y-auto">
        {/* Active view tabs */}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn" id="dashboard-view">
            {/* Elegant Welcome Banner (Compact & Concise with Dynamic Variations) */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-sm border border-emerald-900">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-5 pointer-events-none">
                <Sparkles className="w-56 h-56" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-black tracking-wider text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded uppercase">
                      Preservation Portal
                    </span>
                    <span className="text-[10px] text-emerald-200/80 font-medium">
                      {currentTimeGreeting}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight font-sans mt-1">
                    {progress.name && progress.name.trim() 
                      ? `Assalamu alaikum/ khamzang thuk ${progress.name}` 
                      : "Assalamu alaikum/ khamzang"}
                  </h2>
                  <p className="text-xs text-emerald-200/90 max-w-xl leading-relaxed">
                    Master Kargili Purgi/Purki with interactive lessons, comparative guides, and AI-powered translation tools built for regional preservation.
                  </p>
                </div>

                <div className="flex sm:flex-row md:flex-col lg:flex-row gap-2.5 self-start md:self-center shrink-0">
                  <button
                    onClick={() => handleStartLesson(LESSONS[0])}
                    className="px-4 py-2 bg-white text-emerald-950 font-extrabold rounded-lg text-[11px] shadow-sm hover:scale-102 hover:shadow-md active:scale-98 transition-all flex items-center gap-1"
                    id="dashboard-start-lesson-btn"
                  >
                    Start Lesson <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setActiveTab("translator")}
                    className="px-4 py-2 bg-emerald-900 text-white font-bold rounded-lg text-[11px] hover:bg-emerald-850 active:scale-98 transition-all"
                  >
                    AI Translator
                  </button>
                </div>
              </div>

              {/* Interactive Dynamic Wisdom Accent Box */}
              <div className="mt-4 pt-3 border-t border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-emerald-300/90">
                <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                  <span className="shrink-0 text-amber-400 mt-0.5 sm:mt-0 text-xs">💡</span>
                  <span className="leading-snug">
                    <strong className="text-white font-semibold">Purgi Wisdom:</strong> "{PURGI_WISDOM[wisdomIndex].text}" <span className="text-emerald-200/70">({PURGI_WISDOM[wisdomIndex].translation})</span>
                  </span>
                </div>
                <button
                  onClick={() => setWisdomIndex((prev) => (prev + 1) % PURGI_WISDOM.length)}
                  className="shrink-0 self-end sm:self-auto text-[10px] bg-emerald-900/40 hover:bg-emerald-900/80 hover:text-white px-2 py-1 rounded border border-emerald-800/40 transition-colors flex items-center gap-1 font-semibold"
                  title="Next Quote"
                >
                  <RefreshCw className="w-2.5 h-2.5 animate-pulse" /> Next Tip
                </button>
              </div>
            </div>

            {/* Bento Layout: Dynamic Word Carousel & Gamification Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <DynamicWordCarousel />
              </div>
              <div className="lg:col-span-7">
                <GamifiedLeaderboard
                  streak={progress.streak}
                  points={progress.points}
                  badges={progress.badges}
                  userName={progress.name}
                  userAvatar={progress.avatar}
                />
              </div>
            </div>

            {/* Quick action grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Learning Goal */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                    <Clock className="w-4 h-4 text-emerald-600" /> Daily Preservative Goal
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Practice at least 1 lesson and complete 1 matching vocabulary puzzle game every day to maintain your active streak.
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Goal Status: 85% Completed</span>
                  <span className="text-emerald-600 font-bold">Good Progress!</span>
                </div>
              </div>

              {/* Quick Dialect Compare */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                    <Languages className="w-4 h-4 text-emerald-600" /> Quick Dialect Guide
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Did you know? Balti retains complex cluster groups (like *bgyat* for 8) while Purigi retains original dental markings. Check out our comparative dictionary!
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("dictionary")}
                  className="mt-6 text-xs font-bold text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1 self-start transition-all"
                >
                  Explore Dictionary <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Google AdSense Unit */}
            <AdSenseUnit slot="dashboard-bottom" />
          </div>
        )}

        {/* TAB 2: INTERACTIVE LESSONS CATALOG */}
        {activeTab === "lessons" && (
          <div className="space-y-8 animate-fadeIn" id="lessons-catalog-view">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight font-sans">Structured Lesson Catalog</h2>
              <p className="text-slate-500 text-sm mt-1">Select structured lessons to study phonology, vocabulary, and grammar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LESSONS.map((lesson) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const stepCount = lesson.steps.length;

                return (
                  <div
                    key={lesson.id}
                    className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                      isCompleted ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100 shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 border border-slate-200/50 text-slate-500 px-2.5 py-1 rounded-md">
                          {lesson.category}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Complete (+{lesson.points} XP)
                          </span>
                        )}
                      </div>

                      <h3 className="text-md font-extrabold text-slate-800 mt-4 leading-snug">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6 text-xs">
                      <span className="text-slate-400 font-semibold">{stepCount} Steps | {lesson.difficulty}</span>
                      <button
                        onClick={() => handleStartLesson(lesson)}
                        className={`px-4 py-2 font-bold rounded-xl transition-all ${
                          isCompleted
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            : "bg-emerald-950 hover:bg-emerald-900 text-white"
                        }`}
                        id={`start-lesson-${lesson.id}`}
                      >
                        {isCompleted ? "Review Lesson" : "Start Lesson"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2.5: ACTIVE LESSON STEP WIZARD */}
        {activeTab === "lesson-active" && selectedLesson && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn" id="active-lesson-wizard">
            {/* Step Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <button
                onClick={() => {
                  setSelectedLesson(null);
                  setActiveTab("lessons");
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1 transition-all"
                id="back-to-lessons"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Catalog
              </button>
              <span className="text-xs text-slate-400 font-mono">
                Step {activeStepIndex + 1} of {selectedLesson.steps.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${((activeStepIndex + 1) / selectedLesson.steps.length) * 100}%` }}
              />
            </div>

            {/* Active Step Content */}
            {(() => {
              const step: LessonStep = selectedLesson.steps[activeStepIndex];

              return (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight font-sans border-b border-slate-100 pb-3">{step.title}</h3>

                  {/* CONTENT STEP TYPE */}
                  {step.type === "content" && step.text && (
                    <div className="space-y-4">
                      <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-sans">
                        {step.text}
                      </div>

                      {step.audioText && (
                        <div className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl mt-6">
                          <button
                            onClick={() => playStepAudio(step.audioText!)}
                            className="p-3 bg-white hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all text-slate-600"
                            title="Pronunciation audio player"
                          >
                            <Volume2 className={`w-5 h-5 ${soundPlaying === step.audioText ? "text-emerald-600 animate-bounce" : ""}`} />
                          </button>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Dialect Sound Guide</span>
                            <span className="text-xs font-bold text-slate-700 block mt-0.5">"{step.audioText}"</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* VOCAB STEP TYPE */}
                  {step.type === "vocab" && step.vocabItems && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 font-sans leading-relaxed">
                        Study these essential dialect vocabulary terms. Toggle script cards to compare Tibetan (Yige) and Perso-Arabic scripts.
                      </p>

                      <div className="grid grid-cols-1 gap-4">
                        {step.vocabItems.map((item) => (
                          <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center">
                                <span className="text-md font-extrabold text-slate-800">{item.word}</span>
                                <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                                  {item.ipa}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-3">
                                {item.tibetanScript && (
                                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Yige</span>
                                    <span className="text-sm font-bold text-slate-700 block mt-0.5">{item.tibetanScript}</span>
                                  </div>
                                )}
                                {item.persoArabicScript && (
                                  <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-right">
                                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Perso-Arabic</span>
                                    <span className="text-sm font-bold text-slate-700 block mt-0.5 dir-rtl">{item.persoArabicScript}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <p className="text-xs font-semibold text-slate-600 border-t border-slate-200/50 pt-2 mt-4">
                              Meaning: {item.meaning} {item.urduMeaning && `/ ${item.urduMeaning}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* QUIZ STEP TYPE */}
                  {step.type === "quiz" && step.quizQuestion && step.quizOptions && (
                    <div className="space-y-4" id="lesson-quiz-block">
                      <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-slate-700 leading-relaxed font-sans">
                          {step.quizQuestion}
                        </p>
                      </div>

                      <div className="space-y-2.5 mt-4">
                        {step.quizOptions.map((opt, index) => {
                          const isSelected = selectedQuizAnswer === index;
                          const showCorrect = quizSubmitted && step.quizAnswer === index;
                          const showWrong = quizSubmitted && isSelected && step.quizAnswer !== index;

                          return (
                            <button
                              key={index}
                              disabled={quizSubmitted}
                              onClick={() => setSelectedQuizAnswer(index)}
                              className={`w-full text-left p-3.5 rounded-xl text-xs border font-medium transition-all ${
                                showCorrect
                                  ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold"
                                  : showWrong
                                  ? "bg-red-50 border-red-400 text-red-800"
                                  : isSelected
                                  ? "bg-slate-900 border-slate-900 text-white scale-98"
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end pt-4">
                        {!quizSubmitted ? (
                          <button
                            disabled={selectedQuizAnswer === null}
                            onClick={() => setQuizSubmitted(true)}
                            className="px-6 py-2.5 bg-emerald-950 text-white font-bold rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
                            id="submit-quiz-btn"
                          >
                            Verify Choice
                          </button>
                        ) : (
                          <div className="w-full text-left bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
                            <span className="text-lg shrink-0">🎓</span>
                            <div>
                              <span className="text-xs font-extrabold text-slate-800 block">Explanation</span>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {step.quizExplanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation controls */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
                    <button
                      disabled={activeStepIndex === 0}
                      onClick={() => {
                        setActiveStepIndex(prev => prev - 1);
                        setSelectedQuizAnswer(null);
                        setQuizSubmitted(false);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 disabled:opacity-30 transition-all"
                    >
                      Prev Step
                    </button>

                    <button
                      disabled={step.type === "quiz" && !quizSubmitted}
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
                      id="next-step-btn"
                    >
                      {activeStepIndex + 1 === selectedLesson.steps.length ? "Finish Lesson" : "Next Step"}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: VOCAB MATCHING GAME */}
        {activeTab === "vocab" && (
          <div className="space-y-8 animate-fadeIn" id="vocab-view">
            <VocabularyBuilder
              vocabList={dictionaryEntries.map(entry => ({
                id: entry.id,
                word: entry.word,
                tibetanScript: entry.tibetanScript,
                persoArabicScript: entry.persoArabicScript,
                ipa: entry.ipa,
                meaning: entry.meaning,
                urduMeaning: entry.urduMeaning,
                category: entry.partOfSpeech,
                dialect: entry.dialect === "common" ? "both" : entry.dialect as 'balti' | 'purigi' | 'both',
                notes: entry.definition,
                exampleSentence: entry.exampleSentence,
                exampleTranslation: entry.exampleTranslation
              }))}
              onEarnPoints={handleEarnPoints}
              onAddBadge={handleAddBadge}
            />
          </div>
        )}

        {/* TAB 4: AI TRANSLATOR */}
        {activeTab === "translator" && (
          <div className="space-y-8 animate-fadeIn" id="translator-view">
            <RealtimeTranslator
              onEarnPoints={handleEarnPoints}
              dialectPreference={progress.dialectPreference}
            />
          </div>
        )}

        {/* TAB 5: COMPARATIVE DICTIONARY */}
        {activeTab === "dictionary" && (
          <div className="space-y-8 animate-fadeIn" id="dictionary-view">
            <DictionaryView
              entries={dictionaryEntries}
              bookmarks={progress.bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onRefresh={fetchDictionary}
              isPro={!!progress.isPro}
              onNavigateToUpgrade={() => setActiveTab("profile")}
            />
          </div>
        )}

        {/* TAB 6: GRAMMAR WORKBOOK */}
        {activeTab === "grammar" && (
          <div className="space-y-8 animate-fadeIn" id="grammar-view">
            <GrammarExplorer
              onEarnPoints={handleEarnPoints}
              onAddBadge={handleAddBadge}
            />
          </div>
        )}

        {/* TAB 7: AI COACH TUTOR CHAT */}
        {activeTab === "tutor" && (
          <div className="space-y-8 animate-fadeIn" id="chat-tutor-view">
            <AiTutorCoach
              onEarnPoints={handleEarnPoints}
              dialectPreference={progress.dialectPreference}
              isPro={!!progress.isPro}
              onNavigateToUpgrade={() => setActiveTab("profile")}
            />
          </div>
        )}

        {/* TAB 8: EXTERNAL COURSES CATALOG (Coursera/Khan Academy) */}
        {activeTab === "courses" && (
          <div className="space-y-8 animate-fadeIn" id="academic-courses-view">
            <ExternalCoursesCatalog />
          </div>
        )}

        {/* TAB 8.5: SAVED BOOKMARKS */}
        {activeTab === "bookmarks" && (
          <div className="space-y-8 animate-fadeIn" id="bookmarks-view">
            <BookmarksSection
              progress={progress}
              dictionary={dictionaryEntries}
              onRemoveBookmark={handleRemoveBookmark}
              onNavigateToDictionary={() => setActiveTab("dictionary")}
            />
          </div>
        )}

        {/* TAB 9: MY ACCOUNT & SETTINGS */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-fadeIn" id="profile-settings-view">
            <AccountSection
              progress={progress}
              onUpdateName={(name) => saveProgress({ ...progress, name })}
              onUpdateAvatar={(avatar) => saveProgress({ ...progress, avatar })}
              onUpdatePreference={(dialectPreference) => saveProgress({ ...progress, dialectPreference })}
              onClearProgress={handleClearProgress}
              onUpgradePro={(isPro) => saveProgress({ ...progress, isPro })}
              userEmail={user?.email || ""}
              userPhotoUrl={user?.photoURL || ""}
              onSignOut={handleSignOut}
            />
          </div>
        )}

        {/* Bottom Banner Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/60 pb-8 text-center text-xs text-slate-400 font-sans" id="applet-footer">
          <p className="font-extrabold text-slate-500 tracking-wide uppercase text-[10px]">Developed by Syed Murtaza Rizvi</p>
          <p className="mt-1 font-semibold text-slate-400">© Rizvi Educational Services</p>
        </footer>
      </main>
    </div>
  );
}
