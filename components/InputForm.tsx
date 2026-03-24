"use client";

import { useState } from "react";
import { StudyInput } from "@/types/studyPlan";

interface InputFormProps {
  onSubmit: (input: StudyInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [notes, setNotes] = useState("");
  const [examDate, setExamDate] = useState("");
  const [dateError, setDateError] = useState("");                                       // validation error for date
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [notesBlurred, setNotesBlurred] = useState(false);

  const validateDate = (value: string): string => {
    if (!value) return "";
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);                                                         // strip time making today valid                                                        
    if (isNaN(selected.getTime())) return "Please enter a valid date.";
    if (selected < today) return "Exam date cannot be in the past.";
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);                                     // typo detection
    if (selected > maxDate) return "Please enter a realistic exam date.";
    return "";
  };

  const handleDateChange = (value: string) => {
    setExamDate(value);
    setDateError(validateDate(value));
  };

  const showNotesError = (notesBlurred || submitAttempted) && notes.trim().length < 10;  // only show error after blur or submit

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (notes.trim().length < 10) return;
    const err = validateDate(examDate);
    if (err) { setDateError(err); return; }
    onSubmit({ notes: notes.trim(), exam_date: examDate || undefined });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        What do you need to study?
      </label>
      <p className="text-xs text-gray-400 mb-2">
        Paste your syllabus, describe what you are stuck on, or list your topics that you need help with!
      </p>

      <textarea
        className={`w-full h-36 p-3 border rounded-xl text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
          showNotesError ? "border-red-400 bg-red-50" : "border-gray-200"
        }`}
        placeholder="e.g. I need to revise operating systems, for a quiz on Friday, the quiz covers microkernels, monolithic, modular and..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => setNotesBlurred(true)}
      />
      {showNotesError && (
        <p className="text-xs text-red-500 mt-1">Please describe enter more detail so that Study Buddy can help.</p>
      )}

      <div className="mt-3">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Exam or deadline date <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          type="date"
          className={`p-2 border rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
            dateError ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
          value={examDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
        {dateError && <p className="text-xs text-red-500 mt-1">{dateError}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center"
        style={{ backgroundColor: isLoading ? undefined : "#0047AB" }}              // tailwind handles gray that is disbaled , overriden when active
      >
        {isLoading ? <span className="loader" /> : "Create Study Plan"}
      </button>

      <p className="mt-3 text-xs text-gray-400 text-center">
        Study Buddy plans your studying and time ONLY. Check your AI policies (Lancaster RAG) before using it to help with your university work.
      </p>
    </div>
  );
}