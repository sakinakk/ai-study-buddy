"use client";

import { useState } from "react";

export default function Home() {                              // for storing user input fromt text area, json response from api
  const [notes, setNotes] = useState(""); 
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);          // api status tracker whether we are wating or not

  const handleSubmit = async () => {                          // call when student clicks generate, send input to api to get resp
    setIsLoading(true);
    setResult(null);
    const response = await fetch("/api/studyingPlan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));               // test to see if api sends back response in json
    setIsLoading(false);
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Study Buddy</h1>
      <textarea
        className="w-full h-32 p-3 border rounded-lg text-sm mb-3"
        placeholder="Type here content you need to revise..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
      >
        {isLoading ? "Loading..." : "Generate"}
      </button>

      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
          {result}
        </pre>
      )}
    </main>
  );
}