import { useEffect, useState } from "react";

interface Session {
  id: string;
  startTime: number;
  isRecording: boolean;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [duration, setDuration] = useState("00:00");

  const [transcripts, setTranscripts] = useState<string[]>([]);

  const [responses] = useState([
    "AI insights will appear here.",
    "Meeting summaries can be generated.",
    "Action items can be extracted."
  ]);

  async function handleStart() {
    const result = await window.capsule.startSession();

    console.log("SESSION:", result);

    setSession(result);
  }

  async function requestMic() {
   try {
     const stream =
       await navigator.mediaDevices.getUserMedia({
         audio: true
       });

     console.log("MIC OK", stream);

     alert("Microphone access granted");
   } catch (err) {
     console.error(err);

     alert("Microphone access denied");
   }
 }
  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - session.startTime) / 1000
      );

      const mins = String(
        Math.floor(elapsed / 60)
      ).padStart(2, "0");

      const secs = String(
        elapsed % 60
      ).padStart(2, "0");

      setDuration(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  useEffect(() => {
    window.capsule.onTranscript((text) => {
      setTranscripts((prev) => [...prev, text]);
    });
  }, []);

  return (
    <div
      style={{
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Segoe UI"
      }}
    >
      <h1>🧠 Capsule AI</h1>

      <button
        onClick={handleStart}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer"
        }}
      >
        {session ? "Running..." : "Start Session"}
      </button>

      <button
       onClick={requestMic}
        style={{
         marginLeft: 10,
         padding: "10px 16px",
         borderRadius: 8,
         border: "none",
         cursor: "pointer"
       }}
      >
      Test Microphone
</button>

      {session && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#1f2937",
            borderRadius: 10
          }}
        >
          <h3>🟢 Session Active</h3>

          <p>
            <strong>ID:</strong> {session.id}
          </p>

          <p>
            <strong>Duration:</strong> {duration}
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 20
        }}
      >
        <div
          style={{
            background: "#1f2937",
            borderRadius: 10,
            padding: 16,
            height: 400,
            overflowY: "auto"
          }}
        >
          <h2>📝 Transcript Panel</h2>

          {transcripts.length === 0 && (
            <p>No transcript yet...</p>
          )}

          {transcripts.map((line, index) => (
            <div
              key={index}
              style={{
                marginBottom: 12,
                padding: 10,
                background: "#374151",
                borderRadius: 6
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#1f2937",
            borderRadius: 10,
            padding: 16,
            height: 400,
            overflowY: "auto"
          }}
        >
          <h2>🤖 AI Assistant</h2>

          {responses.map((line, index) => (
            <div
              key={index}
              style={{
                marginBottom: 12,
                padding: 10,
                background: "#374151",
                borderRadius: 6
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;