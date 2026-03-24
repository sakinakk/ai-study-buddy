"use client";

import { useState, useEffect, useCallback } from "react";
import { PomodoroSession } from "@/types/studyPlan";

interface PomodoroTimerProps {
  sessions: PomodoroSession[];
  onSessionChange: (index: number) => void;
}

export default function PomodoroTimer({ sessions, onSessionChange }: PomodoroTimerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const currentSession = sessions[currentIndex];
  const totalSeconds = currentSession.duration_minutes * 60;

  useEffect(() => {
    setSecondsLeft(currentSession.duration_minutes * 60);  // reset to full duration upon user vent session change
    setIsRunning(false);
  }, [currentIndex, currentSession.duration_minutes]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);                  // clear when paused
  }, [isRunning, secondsLeft]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    onSessionChange(index);
  }, [onSessionChange]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;  // 0-100 for the svg ring
  const isBreak = currentSession.type === "break";
  const circumference = 2 * Math.PI * 44;                                // matches the svg circle

  return (
    <div className="rounded-2xl border border-blue-100 p-4" style={{ backgroundColor: "#EEF4FB" }}>
        <p className="text-sm font-bold text-blue-400 mb-3">
        Pomodoro Timer
        </p>

      <div className="text-center mb-3">
        <p className="text-xs text-gray-400">
          Session {currentSession.session} of {sessions.length}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-tight">
          {isBreak ? "Break" : currentSession.topic}
        </p>
        {!isBreak && (
          <p className="text-xs text-gray-400 mt-0.5 leading-tight">
            {currentSession.subtopic}
          </p>
        )}
      </div>

      <div className="flex justify-center mb-3">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#dbeafe" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke={isBreak ? "#10b981" : "#0047AB"}   // green for breaks,  blue for focus
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-900 tabular-nums">
              {minutes}:{seconds}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="flex-1 py-2 text-xs border border-blue-200 rounded-xl text-gray-500 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Prev
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: "#0047AB" }}
        >
          {isRunning ? "Pause" : secondsLeft === totalSeconds ? "Start" : "Resume"}
        </button>
        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === sessions.length - 1}
          className="flex-1 py-2 text-xs border border-blue-200 rounded-xl text-gray-500 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>

      <button
        onClick={() => setSecondsLeft(totalSeconds)}
        className="w-full py-1.5 text-xs text-blue-300 hover:text-blue-500 transition-colors"
      >
        Reset session
      </button>
    </div>
  );
}