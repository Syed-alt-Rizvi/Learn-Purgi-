import React, { useEffect } from "react";

interface AdSenseUnitProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

export default function AdSenseUnit({ slot = "default-slot", format = "auto", className = "" }: AdSenseUnitProps) {
  useEffect(() => {
    try {
      // Trigger adsbygoogle push when on real production domains
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silently catch if blocker is active or adsense script is not fully ready
    }
  }, []);

  return (
    <div className={`my-6 mx-auto w-full overflow-hidden text-center ${className}`} id={`adsense-unit-${slot}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
        Sponsored Academic Advertisement
      </span>
      <div className="bg-slate-50 hover:bg-slate-100/70 transition-all border border-slate-200/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[90px]">
        {/* Actual Google AdSense element as required by the tag */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-9906275833"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* Fallback elegant informative view when AdSense scripts are pending activation */}
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
            Ad
          </div>
          <div>
            <span className="text-xs font-bold text-slate-700 block">Preserve Ancient Kargili Phonology</span>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Supporting the local digital archives of Syed Murtaza Rizvi. Ads help cover high-speed database bandwidth.
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[10px] text-slate-400 font-mono block">Ad Unit: ca-pub-9906275833</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md mt-1 inline-block">
            Verified Partner
          </span>
        </div>
      </div>
    </div>
  );
}
