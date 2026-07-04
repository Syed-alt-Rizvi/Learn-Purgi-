import React, { useState, useEffect } from "react";
import { ExternalCourse } from "../types";
import { BookOpen, GraduationCap, ArrowUpRight, Loader2, Globe, Archive, Compass, ExternalLink } from "lucide-react";

export default function ExternalCoursesCatalog() {
  const [courses, setCourses] = useState<ExternalCourse[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProvider, setFilterProvider] = useState<"all" | "Coursera" | "Khan Academy">("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const coursesPromise = fetch("/api/courses").then(res => res.json());
        const resourcesPromise = fetch("/api/resources").then(res => res.json());

        const [coursesData, resourcesData] = await Promise.all([coursesPromise, resourcesPromise]);

        if (coursesData.success) {
          setCourses(coursesData.courses);
        }
        if (resourcesData.success) {
          setResources(resourcesData.resources);
        }
      } catch (e) {
        console.error("Failed to fetch external resources:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCourses = courses.filter(course => {
    return filterProvider === "all" || course.provider === filterProvider;
  });

  return (
    <div className="space-y-12">
      {/* SECTION 1: Helpful Reference Repositories */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 animate-fadeIn" id="archival-resources-section">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            Recommended Reference Repositories
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight font-sans mt-3">
            Digital Language Archives & Reference Portals
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Explore primary dictionary collections, academic pages, and preservation projects for Balti & Purigi
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/60 hover:border-emerald-200 hover:shadow-xs rounded-2xl p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/50 border border-emerald-200/30 px-2 py-0.5 rounded-md">
                      {res.category}
                    </span>
                    <Globe className="w-4 h-4 text-slate-400" />
                  </div>

                  <h3 className="text-md font-extrabold text-slate-800 tracking-tight font-sans mt-4 leading-tight">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                    {res.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {res.tags?.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/50 pt-4 mt-6">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Host: {res.provider}
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition-all"
                  >
                    Open Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Linguistics Courses */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8" id="academic-courses-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              Linguistics & Structure
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight font-sans mt-3">
              Academic Courses & Linguistic Studies
            </h2>
            <p className="text-slate-500 text-sm mt-1">Acquire certificates and master grammatical structures from Coursera & Khan Academy</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setFilterProvider("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filterProvider === "all" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Providers
            </button>
            <button
              onClick={() => setFilterProvider("Coursera")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filterProvider === "Coursera" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Coursera
            </button>
            <button
              onClick={() => setFilterProvider("Khan Academy")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filterProvider === "Khan Academy" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Khan Academy
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
            <p className="text-sm text-slate-400 font-semibold">Querying Course Catalog APIs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-50/60 border border-slate-200/60 hover:border-slate-300 rounded-2xl p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                      {course.provider}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {course.level} Level
                    </span>
                  </div>

                  <h3 className="text-md font-extrabold text-slate-800 tracking-tight font-sans mt-3.5 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                    {course.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {course.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex justify-between items-center border-t border-slate-200/50 pt-4 mt-6">
                  {course.duration && (
                    <span className="text-[10px] font-semibold text-slate-400 font-sans">
                      Duration: {course.duration}
                    </span>
                  )}
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-800 hover:text-emerald-700 inline-flex items-center gap-1 transition-all"
                  >
                    Visit Course <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
