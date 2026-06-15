export interface Session {
  id: string;
  startTime: number;
  isRecording: boolean;
}

let currentSession: Session | null = null;

export function startSession(): Session {
  currentSession = {
    id: crypto.randomUUID(),
    startTime: Date.now(),
    isRecording: true
  };

  return currentSession;
}

export function getSession() {
  return currentSession;
}

export function stopSession() {
  if (currentSession) {
    currentSession.isRecording = false;
  }

  return currentSession;
}