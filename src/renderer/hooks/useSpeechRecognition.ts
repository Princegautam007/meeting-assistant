import { useEffect } from "react";

export function useSpeechRecognition(
  onTranscript: (text: string) => void
) {
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    console.log(
      "SpeechRecognition:",
      SpeechRecognition
    );

    if (!SpeechRecognition) {
      console.log(
        "Speech Recognition not supported"
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log(
        "Speech Recognition Started"
      );
    };

    recognition.onerror = (event: any) => {
      console.error(
        "Speech Recognition Error:",
        event
      );
    };

    recognition.onend = () => {
      console.log(
        "Speech Recognition Ended"
      );
    };

    recognition.onresult = (event: any) => {
      const result =
        event.results[
          event.results.length - 1
        ];

      const text =
        result[0].transcript;

      console.log(
        "RECOGNIZED:",
        text
      );

      onTranscript(text);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);
}