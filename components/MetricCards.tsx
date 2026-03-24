"use client";

import { ProcessedStudyPlan } from "@/types/studyPlan";

interface MetricCardsProps {
  studyPlan: ProcessedStudyPlan;
}

const getWorkloadColor = (score: number) => {
  if (score >= 75) return "text-red-500";   // heavy workload
  if (score >= 50) return "text-amber-500"; // moderate
  return "text-green-500";                   // light
};

export default function MetricCards({ studyPlan }: MetricCardsProps) {
  const focusSessions = studyPlan.pomodoro_plan.filter(s => s.type === "focus").length;

  const hours = Math.floor(studyPlan.total_estimated_hours);                                    // whole hours
  const mins = Math.round((studyPlan.total_estimated_hours - hours) * 60);  // the remaining mineutes

  return (
    <div className="grid grid-cols-3 gap-3 mb-3">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center card-hover">
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Workload</p>
        <p className={`text-2xl font-bold ${getWorkloadColor(studyPlan.overall_workload_score)}`}>
          {studyPlan.overall_workload_score}
          <span className="text-sm text-gray-400 font-normal">/100</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center card-hover">
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Study Time</p>
        <p className="text-2xl font-bold" style={{ color: "#0047AB" }}>
          {hours}<span className="text-sm text-gray-400 font-normal">hrs </span>
          {mins > 0 && <>{mins}<span className="text-sm text-gray-400 font-normal">mins</span></>}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center card-hover">
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Sessions</p>
        <p className="text-2xl font-bold text-purple-600">
          {focusSessions}
          <span className="text-sm text-gray-400 font-normal"> focus</span>
        </p>
      </div>
    </div>
  );
}