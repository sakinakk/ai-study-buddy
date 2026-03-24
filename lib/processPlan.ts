import { StudyPlan, ProcessedStudyPlan} from "@/types/studyPlan";


const MAX_TOPICS = 4;    // max topics to show in one session
const MAX_SESSIONS = 8;  // max focus sessions before we cut off

export function processPlan(raw: StudyPlan): ProcessedStudyPlan {

  const priorityOrder: Record<string, number> = { High: 0, Intermediate: 1, Low: 2 };           // sort by priority , if the difficulty is the same then put harder one first
  const sorted = [...raw.topics].sort((a, b) => {
    const p = (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
    if (p !== 0) return p;
    return b.difficulty - a.difficulty;
  });

  const scheduled_topics = sorted.slice(0, MAX_TOPICS);   // topics for this session
  const deferred_topics = sorted.slice(MAX_TOPICS);        // topics pushed to later

  const scheduledNames = new Set(scheduled_topics.map((t) => t.name));
  const filteredSessions = raw.pomodoro_plan.filter(
    (s: typeof raw.pomodoro_plan[0]) => s.type === "break" || scheduledNames.has(s.topic)
    );

  const cappedSessions: typeof filteredSessions = [];
  let focusCount = 0;
  for (const session of filteredSessions) {
    if (session.type === "focus") {
      if (focusCount >= MAX_SESSIONS) break;
      focusCount++;
    }
    cappedSessions.push(session);
  }

  while (cappedSessions.length > 0 && cappedSessions[cappedSessions.length - 1].type === "break") { // remove breaks at the end
    cappedSessions.pop();
  }

  cappedSessions.forEach((s: typeof filteredSessions[0], i: number) => { s.session = i + 1; });

  const is_constrained = deferred_topics.length > 0;
  const constraint_message = is_constrained
    ? `You listed ${raw.topics.length} topics but only ${scheduled_topics.length} can realistically fit in one session. The remaining ${deferred_topics.length} topic${deferred_topics.length > 1 ? "s are" : " is"} listed below for later review.`
    : "";

  return {
    ...raw,
    topics: scheduled_topics,
    scheduled_topics,
    deferred_topics,
    pomodoro_plan: cappedSessions,
    is_constrained,
    constraint_message,
  };
}