import { useEffect, useState } from "react";
import { useSpeechRecognition }
from "./hooks/useSpeechRecognition";

interface Session {
  id: string;
  startTime: number;
  isRecording: boolean;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [duration, setDuration] = useState("00:00");
  const [micLevel, setMicLevel] = useState(0);

  const [transcripts, setTranscripts] =
    useState<string[]>([]);

  const [responses] = useState([
    "AI insights will appear here.",
    "Meeting summaries can be generated.",
    "Action items can be extracted."
  ]);

  useSpeechRecognition((text) => {
   setTranscripts((prev) => [
     ...prev,
     text
    ]);
  });

  async function handleStart() {
    const result =
      await window.capsule.startSession();

    console.log("SESSION:", result);

    setSession(result);
  }

  async function requestMic() {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      const audioContext =
        new AudioContext();

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      const analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 256;

      source.connect(analyser);

      const data =
        new Uint8Array(
          analyser.frequencyBinCount
        );

      setInterval(() => {
        analyser.getByteFrequencyData(data);

        const avg =
          data.reduce((a, b) => a + b, 0) /
          data.length;

        const level =
          Math.round(avg);

        setMicLevel(level);

        console.log(
          "MIC LEVEL:",
          level
        );
      }, 500);

      alert("Microphone connected");
    } catch (err) {
      console.error(err);

      alert(
        "Microphone access denied"
      );
    }
  }

  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - session.startTime) /
          1000
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
    window.capsule.onTranscript(
      (text: string) => {
        setTranscripts((prev) => [
          ...prev,
          text
        ]);
      }
    );
  }, []);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#020617)",
        minHeight: "100vh",
        color: "white",
        padding: "36px",
        fontFamily:
          "'Segoe UI', sans-serif"
      }}
    >
      <h1
        style={{
          fontSize: "54px",
          marginBottom: "24px"
        }}
      >
        🧠 Capsule AI
      </h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px"
        }}
      >
        <button
          onClick={handleStart}
          style={{
            padding:
              "12px 24px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {session
            ? "Running..."
            : "Start Session"}
        </button>

        <button
          onClick={requestMic}
          style={{
            padding:
              "12px 24px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Test Microphone
        </button>
      </div>

      {session && (
        <div
          style={{
            background: "#1e293b",
            borderRadius: 16,
            padding: "24px",
            marginBottom: "24px"
          }}
        >
          <h2>
            🟢 Session Active
          </h2>

          <p>
            <strong>ID:</strong>{" "}
            {session.id}
          </p>

          <p>
            <strong>
              Duration:
            </strong>{" "}
            {duration}
          </p>

          <div
            style={{
              marginTop: "20px"
            }}
          >
            <p>
              <strong>
                🎤 Mic Level
              </strong>
            </p>

            <div
              style={{
                width: "100%",
                height: "18px",
                background:
                  "#374151",
                borderRadius:
                  "10px",
                overflow:
                  "hidden"
              }}
            >
              <div
                style={{
                  width: `${Math.min(
                    micLevel * 2,
                    100
                  )}%`,
                  height: "100%",
                  background:
                    "#22c55e",
                  transition:
                    "0.2s"
                }}
              />
            </div>

            <p
              style={{
                marginTop: "8px"
              }}
            >
              {micLevel}
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "24px"
        }}
      >
        <div
          style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "24px",
            height: "500px",
            overflowY: "auto"
          }}
        >
          <h2>
            📝 Transcript Panel
          </h2>

          {transcripts.length ===
            0 && (
            <p>
              Waiting for
              transcript...
            </p>
          )}

          {transcripts.map(
            (line, index) => (
              <div
                key={index}
                style={{
                  background:
                    "#374151",
                  padding:
                    "12px",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "12px"
                }}
              >
                {line}
              </div>
            )
          )}
        </div>

        <div
          style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "24px",
            height: "500px",
            overflowY: "auto"
          }}
        >
          <h2>
            🤖 AI Assistant
          </h2>

          {responses.map(
            (line, index) => (
              <div
                key={index}
                style={{
                  background:
                    "#374151",
                  padding:
                    "12px",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "12px"
                }}
              >
                {line}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;