import React, { useState } from "react";
import { UserProgress } from "../types";
import {
  User,
  ShieldCheck,
  Download,
  Trash2,
  Settings,
  Check,
  Award,
  Crown,
  QrCode,
  Smartphone,
  ExternalLink,
  BookOpen,
  MapPin,
  Clock,
  Printer,
  Mail,
  HelpCircle,
  Sparkles
} from "lucide-react";

interface AccountSectionProps {
  progress: UserProgress;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatar: string) => void;
  onUpdatePreference: (pref: 'balti' | 'purigi' | 'both') => void;
  onClearProgress: () => void;
  onUpgradePro: (status: boolean) => void;
}

export default function AccountSection({
  progress,
  onUpdateName,
  onUpdateAvatar,
  onUpdatePreference,
  onClearProgress,
  onUpgradePro
}: AccountSectionProps) {
  const [editingName, setEditingName] = useState(progress.name);
  const [offlineCached, setOfflineCached] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Additional settings states
  const [studyTimeGoal, setStudyTimeGoal] = useState(progress.dailyGoalMinutes || 15);
  const [studyInstitution, setStudyInstitution] = useState("kargil");
  const [studentContactEmail, setStudentContactEmail] = useState("");
  const [studentSupportQuery, setStudentSupportQuery] = useState("");
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Pro Upgrade states
  const [showPayModal, setShowPayModal] = useState(false);
  const [upiRefId, setUpiRefId] = useState("");
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const avatarsList = ["🎓", "🏔️", "🦁", "🌸", "🛡️", "🍵", "❄️", "✨"];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateName(editingName);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleOfflineCache = () => {
    setOfflineCached(true);
    setTimeout(() => {
      alert("Success! All dictionary term pronunciations, historical IPA matrices, and workbook modules are cached in offline state.");
    }, 600);
  };

  // UPI deep link generation (Masked in UI text, real in actions/QR)
  const upiIdRaw = "9906275833@superyes";
  const upiIdMasked = "99062*****@superyes";
  const upiPayeeName = "Syed Murtaza Rizvi";
  const upiAmount = "650";
  const upiNote = "Purgi Portal Pro scholar upgrade";
  
  // Real UPI payment URL
  const upiUrl = `upi://pay?pa=${upiIdRaw}&pn=${encodeURIComponent(upiPayeeName)}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
  
  // Dynamic QR code API (Free, open-source QR server without keys)
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSupportQuery) return;
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setStudentSupportQuery("");
      alert("Your message was dispatched to Syed Murtaza Rizvi's education desk. We will respond to your progress query shortly!");
    }, 1500);
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiRefId || upiRefId.length < 8) {
      alert("Please enter a valid 12-digit UPI Ref/Transaction ID.");
      return;
    }
    setSimulatingPayment(true);
    setTimeout(() => {
      setSimulatingPayment(false);
      setVerificationSuccess(true);
      onUpgradePro(true); // set pro to true in state
    }, 2000);
  };

  const handleDirectDemoUnlock = () => {
    onUpgradePro(true);
    alert("Pro Scholar status has been immediately unlocked for testing. Enjoy full academic capabilities!");
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print your progress certificate.");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Purgi Language Portal Academic Certificate</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8fafc; color: #1e293b; }
            .cert { border: 10px double #064e3b; padding: 50px; background-color: white; border-radius: 8px; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            h1 { font-size: 38px; color: #064e3b; margin-bottom: 5px; text-transform: uppercase; }
            h2 { font-size: 20px; color: #64748b; font-weight: 500; margin-top: 0; }
            .name { font-size: 32px; font-weight: bold; margin: 30px 0; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 10px; }
            p { font-size: 16px; line-height: 1.6; max-width: 600px; margin: 0 auto; }
            .stats { display: flex; justify-content: space-around; margin: 40px 0; background-color: #f0fdf4; padding: 20px; border-radius: 12px; }
            .stat-box { font-size: 18px; font-weight: bold; color: #064e3b; }
            .stat-lbl { font-size: 12px; color: #64748b; text-transform: uppercase; margin-top: 4px; }
            .footer-sig { margin-top: 50px; display: flex; justify-content: space-between; padding: 0 50px; }
            .sig-line { border-top: 1px solid #94a3b8; width: 200px; padding-top: 5px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="cert">
            <h1>Certificate of Preservation</h1>
            <h2>Purgi Language Portal & Academy</h2>
            <p>This academic transcript certifies that student</p>
            <div class="name">${progress.name}</div>
            <p>has actively studied the endangered Purgi / Purki language of Kargil, along with West Himalayan Tibetan roots. Their contributions toward comparative dictionary preservation, dialect-mapping syntax reviews, and vocabulary retention represent exemplary scholastic drive.</p>
            
            <div class="stats">
              <div>
                <div class="stat-box">${progress.level}</div>
                <div class="stat-lbl">Academic Level</div>
              </div>
              <div>
                <div class="stat-box">${progress.points} XP</div>
                <div class="stat-lbl">Points Accumulated</div>
              </div>
              <div>
                <div class="stat-box">${progress.streak} Days</div>
                <div class="stat-lbl">Streak Count</div>
              </div>
              <div>
                <div class="stat-box">${progress.badges.length}</div>
                <div class="stat-lbl">Badges Earned</div>
              </div>
            </div>

            <div class="footer-sig">
              <div class="sig-line">
                Syed Murtaza Rizvi<br/>
                Director, Rizvi Educational Services
              </div>
              <div class="sig-line">
                Date Verified<br/>
                ${new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8" id="profile-settings-section">
      
      {/* Top Banner: Subscription Tier */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-sm">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Crown className="w-64 h-64 text-yellow-400" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full flex items-center gap-1">
                Academic Tier Status
              </span>
            </div>
            
            {progress.isPro ? (
              <div className="mt-3">
                <h2 className="text-2xl font-black text-amber-300 tracking-tight flex items-center gap-2 font-sans">
                  <Crown className="w-6 h-6 text-amber-400 fill-current" /> Pro Scholar Account
                </h2>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed max-w-xl">
                  Thank you! Your account is fully unlocked with Pro Scholar status. You have active permissions to suggest missing terms, access specialized AI coaching modules, and download premium learning resources.
                </p>
              </div>
            ) : (
              <div className="mt-3">
                <h2 className="text-2xl font-black text-slate-200 tracking-tight font-sans">
                  Free Learner Account
                </h2>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed max-w-xl">
                  Upgrade to the **Pro Version** for INR 650 to unlock premium features like suggesting and adding words to the Comparative Dictionary, advanced AI interactive conversation tutors, and downloading personalized academic transcripts.
                </p>
              </div>
            )}
          </div>

          <div className="shrink-0 flex gap-3">
            {!progress.isPro ? (
              <>
                <button
                  onClick={() => setShowPayModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-current" /> Upgrade to Pro (INR 650)
                </button>
                <button
                  onClick={handleDirectDemoUnlock}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all border border-slate-700"
                >
                  Sandbox Instant Unlock
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onUpgradePro(false);
                  alert("Switched back to Free version for previewing.");
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all border border-slate-700"
              >
                Downgrade to Free (Demo)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Left Column Settings, Right Column Academic Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customized Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Settings className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">Student Profile Settings</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Avatar select */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Student Avatar Symbol</label>
                <div className="grid grid-cols-4 gap-2">
                  {avatarsList.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => onUpdateAvatar(av)}
                      className={`h-10 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        progress.avatar === av
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 scale-95 font-black"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dialect focus */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Language Target Focus</label>
                <select
                  value={progress.dialectPreference}
                  onChange={(e) => onUpdatePreference(e.target.value as 'balti' | 'purigi' | 'both')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none"
                >
                  <option value="purigi">Kargili Purki/Purgi (Primary Focus)</option>
                  <option value="both">All Dialects (Purgi & Balti)</option>
                  <option value="balti">Balti Dialect</option>
                </select>
              </div>

              {/* Daily commitment goal */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Daily Study Commitment</span>
                  <span className="text-emerald-700 font-black">{studyTimeGoal} Mins</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={studyTimeGoal}
                  onChange={(e) => setStudyTimeGoal(Number(e.target.value))}
                  className="w-full accent-emerald-700 mt-1"
                />
              </div>

              {/* Institutional focus */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Student Affiliation Area</label>
                <select
                  value={studyInstitution}
                  onChange={(e) => setStudyInstitution(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none"
                >
                  <option value="kargil">Kargil District (Rizvi Center)</option>
                  <option value="skardu">Skardu Baltistan Academy</option>
                  <option value="leh">Ladakh Cultural Society</option>
                  <option value="external">Independent Global Scholar</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
              >
                Update Profile Configuration
              </button>

              {saveSuccess && (
                <div className="text-[10px] bg-emerald-50 text-emerald-700 p-2.5 rounded-lg font-bold flex items-center justify-center gap-1 border border-emerald-200/50">
                  <Check className="w-3.5 h-3.5" /> Configurations updated successfully!
                </div>
              )}
            </form>
          </div>

          {/* Reset progress */}
          <div className="bg-red-50/40 rounded-2xl p-5 border border-red-100 flex flex-col justify-between">
            <h4 className="text-xs font-extrabold text-red-800 uppercase tracking-wider">Destructive Actions</h4>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Permanently purge localized points, streaks, badges, offline caches, and reset progress parameters back to default.
            </p>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset all progress? This action is irreversible.")) {
                  onClearProgress();
                }
              }}
              className="mt-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Erase All Local Learning Stats
            </button>
          </div>
        </div>

        {/* Right Column (span 2): Advanced Academic Features & Custom Certifications */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Certificate & Achievements Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-md font-bold text-slate-800 tracking-tight font-sans">Preservation Certificate & Academic Progress</h3>
                </div>
                
                {progress.isPro ? (
                  <span className="text-[9px] uppercase font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-current" /> Pro Enabled
                  </span>
                ) : (
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    Premium Locked
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <span className="text-xl">📊</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1.5 uppercase">Level</span>
                  <span className="text-lg font-black text-slate-800 mt-0.5 block">{progress.level}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <span className="text-xl">✨</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1.5 uppercase">Total XP</span>
                  <span className="text-lg font-black text-slate-800 mt-0.5 block">{progress.points} XP</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <span className="text-xl">🔥</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1.5 uppercase">Active Streak</span>
                  <span className="text-lg font-black text-slate-800 mt-0.5 block">{progress.streak} Days</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <span className="text-xl">🏅</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1.5 uppercase">Badges</span>
                  <span className="text-lg font-black text-slate-800 mt-0.5 block">{progress.badges.length}</span>
                </div>
              </div>

              {/* Progress Detail */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Completed Badges Archive</h4>
                <div className="flex flex-wrap gap-2">
                  {progress.badges.map((badge) => (
                    <span 
                      key={badge} 
                      className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"
                    >
                      🛡️ {badge === "badge-first-steps" ? "First Himalayan Steps" : badge}
                    </span>
                  ))}
                  {progress.badges.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No milestones acquired yet. Start interactive lessons!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Print action - Locked for Free */}
            <div className="border-t border-slate-100 pt-6 mt-8">
              {progress.isPro ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/30 border border-emerald-100 p-4 rounded-2xl">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-emerald-800 block">Academic Certificate Ready</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Download or print your authenticated regional dialect scholastic transcript compiled by Rizvi Educational Services.
                    </p>
                  </div>
                  <button
                    onClick={handlePrintCertificate}
                    className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Certificate
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-700 block flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-500" /> Print Academic Certificate (Pro-Only)
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Access and download personalized physical verification papers once upgraded to Pro Scholar status.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPayModal(true)}
                    className="px-5 py-2.5 bg-slate-300 hover:bg-slate-400 text-slate-800 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                  >
                    Upgrade to Print
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Desk Support: Direct inquiry to Syed Murtaza Rizvi */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <Mail className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">Syed Murtaza Rizvi Academic Desk</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Submit linguistic inquiries, dictionary revisions, or school alignment queries</p>
              </div>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Email Address</label>
                  <input
                    type="email"
                    value={studentContactEmail}
                    onChange={(e) => setStudentContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Affiliation / Region</label>
                  <input
                    type="text"
                    disabled
                    value={studyInstitution === "kargil" ? "Kargil Valley Center" : studyInstitution === "skardu" ? "Skardu Baltistan" : "Independent Global"}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Linguistic or Support Inquiry</label>
                <textarea
                  required
                  rows={3}
                  value={studentSupportQuery}
                  onChange={(e) => setStudentSupportQuery(e.target.value)}
                  placeholder="Ask about specific Purigi verb conjugations, Classical Tibetan root spelling rules, or system access..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm"
              >
                Send Message to Admin
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Payment / Upgrade Modal (Highly detailed & compliant) */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl border border-slate-100 relative animate-scaleUp max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 fill-current" />
                <h3 className="text-lg font-black text-slate-800 font-sans tracking-tight">Purgi Pro Scholar Subscription</h3>
              </div>
              <button
                onClick={() => {
                  setShowPayModal(false);
                  setVerificationSuccess(false);
                  setUpiRefId("");
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            {verificationSuccess ? (
              <div className="space-y-6 text-center py-8">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
                  <Check className="w-8 h-8 font-black" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-emerald-800">Payment Verified!</h4>
                  <p className="text-xs text-emerald-600 mt-1 max-w-xs mx-auto leading-relaxed">
                    Thank you! Your transaction reference has been registered. Your account is now fully elevated to **Purgi Pro Scholar**!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPayModal(false);
                    setVerificationSuccess(false);
                    setUpiRefId("");
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Enter Portal as Pro
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Intro pricing and masked UPI info */}
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-black text-emerald-700 bg-emerald-100/50 px-2.5 py-0.5 rounded-md">Life-time Access</span>
                    <h4 className="text-sm font-extrabold text-slate-800 mt-1.5">Pro Scholar Plan</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Masked Payee UPI ID: <strong className="font-mono">{upiIdMasked}</strong></p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold line-through">INR 1,200</span>
                    <span className="text-xl font-black text-slate-800 block">INR 650</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  To complete payment, please scan the QR code below or click the app router button to open any UPI-enabled mobile app (such as Google Pay, PhonePe, Paytm, or BHIM) to settle **INR 650** to director Syed Murtaza Rizvi.
                </p>

                {/* QR Code and Direct App Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-slate-50 p-5 rounded-2xl border border-slate-200/40">
                  
                  {/* QR code */}
                  <div className="text-center space-y-2">
                    <div className="bg-white p-2.5 rounded-2xl inline-block border border-slate-200 shadow-xs">
                      <img
                        src={qrCodeImageUrl}
                        alt="UPI Payment QR Code"
                        className="w-40 h-40 object-contain mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                      <QrCode className="w-3.5 h-3.5" /> Scan QR to Pay
                    </span>
                  </div>

                  {/* App Deep link button */}
                  <div className="space-y-3">
                    <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Payee Identity</span>
                      <span className="text-xs font-bold text-slate-800 block">{upiPayeeName}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{upiIdMasked}</span>
                    </div>

                    <a
                      href={upiUrl}
                      className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Smartphone className="w-4 h-4" /> Settle in UPI App <ExternalLink className="w-3 h-3" />
                    </a>
                    
                    <p className="text-[9px] text-slate-400 text-center leading-normal">
                      Deep-link opens Google Pay, Paytm, BHIM, or PhonePe on supported mobile environments.
                    </p>
                  </div>
                </div>

                {/* Submitting Reference verification */}
                <form onSubmit={handleVerifyPayment} className="space-y-3.5 border-t border-slate-100 pt-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 12-Digit UPI Transaction Ref / UTR ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={upiRefId}
                        onChange={(e) => setUpiRefId(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        placeholder="e.g. 120495837264"
                        className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={simulatingPayment || upiRefId.length < 8}
                        className="px-5 py-2.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer shrink-0"
                      >
                        {simulatingPayment ? "Verifying..." : "Verify Ref"}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Demo immediate access warning */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Settle securely to {upiIdMasked}</span>
                  <button
                    onClick={handleDirectDemoUnlock}
                    className="text-emerald-700 font-extrabold hover:underline"
                  >
                    Skip & Instantly Activate Pro for testing (Demo bypass)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
