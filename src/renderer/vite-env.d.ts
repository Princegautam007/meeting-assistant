interface Session {
  id: string;
  startTime: number;
  isRecording: boolean;
}

interface Window {
  capsule: {
    startSession(): Promise<Session>;
    stopSession(): Promise<Session | null>;
    getSession(): Promise<Session | null>;
  };
}