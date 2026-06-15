// ─── Core session types ───────────────────────────────────────────────────────

export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number;       // ms since session start
  isFinal: boolean;        // deepgram final vs interim
  speaker?: "user" | "other";
}

export interface AIAnswer {
  id: string;
  triggerSegmentId: string;
  question: string;        // the detected question text
  answer: string;          // streaming answer accumulates here
  isStreaming: boolean;
  timestamp: number;
}

export interface SessionState {
  id: string;
  startTime: number;
  isRecording: boolean;
  transcript: TranscriptSegment[];
  answers: AIAnswer[];
  mode: "interview" | "meeting";
}

// ─── User context / profile ───────────────────────────────────────────────────

export interface UserProfile {
  resumeText: string;
  resumeFileName: string;
  jobDescription: string;
  jobDescriptionUrl?: string;
  companyName?: string;
  roleName?: string;
  additionalContext: string;   // free-form notes, e.g. "always mention X"
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export type LLMProvider = "anthropic" | "openai";
export type STTProvider = "deepgram" | "assemblyai";

export interface AppSettings {
  llmProvider: LLMProvider;
  llmModel: string;           // e.g. "claude-sonnet-4-20250514"
  anthropicApiKey: string;
  openaiApiKey: string;
  sttProvider: STTProvider;
  deepgramApiKey: string;
  assemblyaiApiKey: string;
  autoAnswer: boolean;         // auto-generate answer on question detect
  answerDelay: number;         // ms to wait before triggering (debounce)
  overlayOpacity: number;      // 0.0 – 1.0
  overlayPosition: "left" | "right";
}

// ─── IPC event map (main ↔ renderer) ─────────────────────────────────────────

export type IPCChannel =
  | "session:start"
  | "session:stop"
  | "session:get-state"
  | "transcript:segment"      // main → renderer: new transcript chunk
  | "answer:start"            // main → renderer: AI answer starting
  | "answer:chunk"            // main → renderer: AI answer streaming chunk
  | "answer:done"             // main → renderer: AI answer complete
  | "answer:request"          // renderer → main: manually trigger answer
  | "summary:generate"        // renderer → main: generate post-session summary
  | "summary:ready"           // main → renderer: summary text
  | "profile:save"
  | "profile:get"
  | "settings:save"
  | "settings:get"
  | "screenshot:capture"      // renderer → main: capture screen for coding help
  | "screenshot:result";      // main → renderer: base64 screenshot + AI response

export interface IPCPayload {
  "session:start": { mode: SessionState["mode"] };
  "session:stop": void;
  "session:get-state": void;
  "transcript:segment": TranscriptSegment;
  "answer:start": { answerId: string; question: string };
  "answer:chunk": { answerId: string; chunk: string };
  "answer:done": { answerId: string };
  "answer:request": { customQuestion?: string };
  "summary:generate": void;
  "summary:ready": { summary: string };
  "profile:save": UserProfile;
  "profile:get": void;
  "settings:save": Partial<AppSettings>;
  "settings:get": void;
  "screenshot:capture": void;
  "screenshot:result": { imageBase64: string; analysis: string };
}