export type CopilotSignalTone = "good" | "watch" | "action";

export type CopilotSignal = {
  id: string;
  tone: CopilotSignalTone;
  text: string;
  href?: string;
};

export type CopilotBriefing = {
  happening: string;
  why: string;
  next: string;
  signals: CopilotSignal[];
};
