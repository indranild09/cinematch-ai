import { useState } from "react";
import Navbar from "../components/Navbar";

function AIAssistant() {
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const response =
        await fetch(
          "https://cinematch-api-seven.vercel.app/api/ai-recommend",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prompt: question,
            }),
          }
        );

      const data =
        await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          color: "white",
        }}
      >
        <h1>
          🤖 CineMatch AI Assistant
        </h1>

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask for movie recommendations..."
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "20px",
          }}
        />

        <button
          onClick={askAI}
          style={{
            marginTop: "15px",
            padding: "12px 20px",
          }}
        >
          Ask AI
        </button>

        {loading && (
          <p>
            🤖 Thinking...
          </p>
        )}

        {answer && (
          <div
            style={{
              marginTop: "30px",
              whiteSpace:
                "pre-wrap",
            }}
          >
            {answer}
          </div>
        )}
      </div>
    </>
  );
}

export default AIAssistant;