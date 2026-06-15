import { useState } from "react";

interface Session {
  id: string;
  startTime: number;
  isRecording: boolean;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);

  async function handleStart() {
    const result = await window.capsule.startSession();
    setSession(result);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Capsule AI</h1>

      <button onClick={handleStart}>
        {session ? "Running..." : "Start Session"}
      </button>

      {session && (
        <div style={{ marginTop: 20 }}>
          <h3>Session Active</h3>

          <p>
            <strong>ID:</strong> {session.id}
          </p>

          <p>
            <strong>Started:</strong>{" "}
            {new Date(session.startTime).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;