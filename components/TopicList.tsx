"use client";

import { Topic } from "@/types/studyPlan";

interface TopicListProps {
  topics: Topic[];
  deferred?: Topic[];
  constraintMessage?: string;
}

const priorityStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

const difficultyColor = (difficulty: number) => {
  if (difficulty >= 7) return "#ef4444";
  if (difficulty >= 4) return "#f59e0b";
  return "#22c55e";
};

export default function TopicList({ topics, deferred = [], constraintMessage }: TopicListProps) {
  return (
    <div className="flex flex-col gap-3">
      {constraintMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
          {constraintMessage}
        </div>
      )}

      {topics.map((topic, index) => (
        <div
          key={topic.name}
          className="bg-white rounded-2xl border border-gray-200 p-4 card-hover fade-in"
          style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-3">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{topic.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{topic.estimated_minutes} mins total</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${priorityStyles[topic.priority] ?? "bg-gray-100 text-gray-600"}`}>
              {topic.priority}
            </span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Difficulty</span>
              <span className="text-xs font-semibold text-gray-600">{topic.difficulty}/10</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="difficulty-bar h-2 rounded-full"
                style={{
                  "--bar-width": `${topic.difficulty * 10}%`,
                  backgroundColor: difficultyColor(topic.difficulty),
                } as React.CSSProperties}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {topic.subtopics.map((subtopic) => (
              <div
                key={subtopic.name}
                className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#0047AB" }} />
                {subtopic.name}
              </div>
            ))}
          </div>
        </div>
      ))}

      {deferred.length > 0 && (
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Topics for later review</p>
          <div className="flex flex-col gap-2">
            {deferred.map((topic) => (
              <div
                key={topic.name}
                className="bg-white rounded-xl border border-dashed border-gray-200 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-500 font-medium">{topic.name}</p>
                  <p className="text-xs text-gray-400">{topic.estimated_minutes} mins estimated</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityStyles[topic.priority] ?? "bg-gray-100 text-gray-600"}`}>
                  {topic.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}