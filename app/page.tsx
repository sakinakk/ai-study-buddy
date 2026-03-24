"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import MetricCards from "@/components/MetricCards";
import TopicList from "@/components/TopicList";
import { StudyInput, StudyPlan, ProcessedStudyPlan } from "@/types/studyPlan";
import { processPlan } from "@/lib/processPlan";
import PomodoroTimer from "@/components/PomodoroTimer";

export default function Home() {
  const [studyPlan, setStudyPlan] = useState<ProcessedStudyPlan | null>(null);  // processed plan from api
  const [isLoading, setIsLoading] = useState(false);                             // tracks api request status
  const [error, setError] = useState<string | null>(null);                       // any error from the api

  const handleSubmit = async (input: StudyInput) => {
    setIsLoading(true);
    setError(null);
    setStudyPlan(null);

    try {
      const response = await fetch("/api/studyingPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data: StudyPlan = await response.json();

      if (!response.ok) {                                                                         // fall back to generic msg when api fails
        setError((data as any).error || "Something went wrong, please try again.");
        return;
      }

      setStudyPlan(processPlan(data));
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#AECADC" }}>

      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <img src="/university-svgrepo-com.svg" alt="" className="w-6 h-6" />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#0047AB" }}>Study Buddy</h1>
        </div>
        <p className="text-xs text-gray-400">  AI study planner for students</p>
      </header>

      {/* results area */}
      <div className="flex-1 px-6 py-4 max-w-7xl mx-auto w-full">

      {!studyPlan && !isLoading && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center mb-3">
            <img src="/writing-fluently-svgrepo-com.svg" alt="" className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium" style={{ color: "#0047AB" }}>Your study plan will appear here</p>
          <p className="text-xs mt-1 text-gray-800">Fill in the form below and click Generate</p>
        </div>
      )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-3">
            {error}
          </div>
        )}

        {studyPlan && (
          <div className="flex flex-col gap-3 fade-in">
            <PomodoroTimer sessions={studyPlan.pomodoro_plan} onSessionChange={() => {}}/>
            <MetricCards studyPlan={studyPlan} />
            <TopicList
              topics={studyPlan.scheduled_topics}
              deferred={studyPlan.deferred_topics}
              constraintMessage={studyPlan.is_constrained ? studyPlan.constraint_message : undefined}
            />
          </div>
        )}
      </div>

      {/* user input area towards bottom */}
      <div className="px-6 pb-6 max-w-7xl mx-auto w-full">
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

    </div>
  );
}