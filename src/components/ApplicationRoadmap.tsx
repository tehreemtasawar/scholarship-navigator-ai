import React, { useState } from 'react';
import { useScholarship } from '../context/ScholarshipContext';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Circle,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const ApplicationRoadmap: React.FC = () => {
  const { roadmapTasks, toggleTaskStatus, removeScholarshipFromRoadmap, setActiveTab } =
    useScholarship();

  const [activeFilter, setActiveFilter] = useState<'all' | 'mandatory' | 'general'>('all');

  const totalTasks = roadmapTasks.length;
  const completedTasks = roadmapTasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = roadmapTasks.filter((t) => t.status === 'in_progress').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group by scholarship
  const scholarshipsInRoadmap = Array.from(
    new Set(roadmapTasks.map((t) => ({ id: t.scholarshipId, name: t.scholarshipName })))
  );

  const filteredTasks = roadmapTasks.filter((t) => {
    if (activeFilter === 'mandatory') return t.category === 'mandatory_official';
    if (activeFilter === 'general') return t.category === 'general_preparation';
    return true;
  });

  if (totalTasks === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-100">
          <ListTodo className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 font-['Space_Grotesk']">
          Your Application Roadmap is Empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Add any scholarship from your results dashboard to auto-generate a structured checklist of mandatory provider criteria and general preparation milestones.
        </p>
        <button
          onClick={() => setActiveTab('results')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
        >
          Explore Scholarship Matches
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Progress */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <ListTodo className="w-4 h-4" />
              <span>Personalized Preparation Plan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              Application Roadmap & Milestone Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confirmed provider requirements are strictly labeled and separated from general advisory steps.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Overall Roadmap Progress
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk'] mt-0.5">
              {progressPercent}%
            </div>
            <span className="text-xs text-slate-500">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/80">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold mr-1">Filter Tasks:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Tasks ({totalTasks})
            </button>
            <button
              onClick={() => setActiveFilter('mandatory')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeFilter === 'mandatory'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Mandatory Provider Rules
            </button>
            <button
              onClick={() => setActiveFilter('general')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeFilter === 'general'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              General Preparation
            </button>
          </div>

          <button
            onClick={() => setActiveTab('results')}
            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>+ Add More Scholarships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';
          const isInProgress = task.status === 'in_progress';
          const isMandatory = task.category === 'mandatory_official';

          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isInProgress
                  ? 'border-blue-200 bg-blue-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Interactive Status Toggle Icon */}
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition shrink-0 focus:outline-none"
                  title="Click to cycle status: Not Started → In Progress → Completed"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isInProgress ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {task.scholarshipName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isMandatory
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isMandatory ? 'Confirmed Provider Requirement' : 'General Preparation'}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-sm text-slate-900 ${
                      isDone ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Status Badge & Link */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {task.officialSourceUrl && (
                  <a
                    href={task.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-blue-600 p-1"
                    title="View official provider source"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : isInProgress
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {isDone ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
