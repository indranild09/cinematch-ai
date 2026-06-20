import { useState } from "react";
import Navbar from "../components/Navbar";
import "./AIAssistant.css";
import ReactMarkdown from "react-markdown";

function AIAssistant() {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const response = await fetch(
        "https://cinematch-api-seven.vercel.app/api/ai-recommend",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            prompt: userQuestion,
          }),
        }
      );

      const data =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            data.answer ||
            "No response received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "❌ Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      askAI();
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          color: "white",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          🤖 CineMatch AI Assistant
        </h1>

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask CineMatch AI..."
          className="ai-input"
        />

        <button
          className="ai-btn"
          onClick={askAI}
        >
          🚀 Ask AI
        </button>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          <button
            className="ai-btn"
            onClick={() =>
              setQuestion(
                "Suggest movies like Interstellar"
              )
            }
          >
            🚀 Interstellar
          </button>

          <button
            className="ai-btn"
            onClick={() =>
              setQuestion(
                "Best horror movies"
              )
            }
            style={{
              marginLeft: "10px",
            }}
          >
            👻 Horror
          </button>

          <button
            className="ai-btn"
            onClick={() =>
              setQuestion(
                "Best romantic movies"
              )
            }
            style={{
              marginLeft: "10px",
            }}
          >
            ❤️ Romance
          </button>
        </div>

        {loading && (
          <div className="ai-thinking">
            🤖 CineMatch AI is thinking...
          </div>
        )}

        <div
          style={{
            marginTop: "10px",
          }}
        >
          {messages.map(
            (message, index) => (
              <div
                key={index}
                className={
                  message.type ===
                  "user"
                    ? "user-message"
                    : "ai-message"
                }
              >
                <strong>
                  {message.type ===
                  "user"
                    ? "👤 You"
                    : "🤖 CineMatch AI"}
                </strong>

                <div className="message-content">
  <ReactMarkdown>
    {message.text}
  </ReactMarkdown>
</div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default AIAssistant;