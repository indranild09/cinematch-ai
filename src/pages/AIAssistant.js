import { useState } from "react";
import Navbar from "../components/Navbar";
import "./AIAssistant.css";

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
  placeholder="Ask CineMatch AI..."
  className="ai-input"
/>

        <button
  className="ai-btn"
  onClick={askAI}
>
  🚀 Ask AI
</button>

        {loading && (
  <div className="ai-thinking">
    🤖 CineMatch AI is thinking...
  </div>
)}

        {answer && (
  <div className="ai-response-card">
    <h2>🤖 CineMatch AI</h2>

    <div className="ai-response-text">
      {answer}
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default AIAssistant;