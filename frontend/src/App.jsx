import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  ingestVideos,
  chatWithVideos,
} from "./api";

function App() {
  const [youtubeUrl, setYoutubeUrl] =
    useState("");

  const [instagramUrl, setInstagramUrl] =
    useState("");

  const [videoA, setVideoA] =
    useState(null);

  const [videoB, setVideoB] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);
  
  const [sessionId, setSessionId] =
    useState("");  

  useEffect(() => {

    const existing =
      localStorage.getItem(
        "session_id"
      );

    if (existing) {

      setSessionId(existing);

    } else {

      const newId =
        crypto.randomUUID();

      localStorage.setItem(
        "session_id",
        newId
      );

      setSessionId(newId);
    }

    }, []);

  const handleIngest = async () => {
    try {
      setLoading(true);

      const res =
        await ingestVideos({
          youtube_url: youtubeUrl,
          instagram_url: instagramUrl,
        });

      setVideoA(res.data.video_a);
      setVideoB(res.data.video_b);

      alert("Videos analyzed");
    } catch (err) {
      console.log(err);
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    try {
      const res =
        await chatWithVideos({
          session_id: sessionId,
          question,
        });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
        },
      ]);

      setQuestion("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h1 className="title">
        Social Media RAG Analyzer
      </h1>

      {/* URL SECTION */}

      <div className="card">

        <h2>
          Analyze Videos
        </h2>

        <input
          placeholder="YouTube Short URL"
          value={youtubeUrl}
          onChange={(e) =>
            setYoutubeUrl(
              e.target.value
            )
          }
        />

        <input
          placeholder="Instagram Reel URL"
          value={instagramUrl}
          onChange={(e) =>
            setInstagramUrl(
              e.target.value
            )
          }
        />

        <button
          onClick={handleIngest}
        >
          {
            loading
              ? "Analyzing..."
              : "Analyze Videos"
          }
        </button>

      </div>

      {/* VIDEO CARDS */}

      {(videoA || videoB) && (

        <div className="video-grid">

          <div className="card">

            <h2>Video A</h2>

            <p>
              Platform:
              {" "}
              {videoA?.platform}
            </p>

            <p>
              Creator:
              {" "}
              {videoA?.creator}
            </p>

            <p>
              Title:
              {" "}
              {videoA?.title}
            </p>

            <p>
              Views:
              {" "}
              {videoA?.views}
            </p>

            <p>
              Likes:
              {" "}
              {videoA?.likes}
            </p>

          </div>

          <div className="card">

            <h2>Video B</h2>

            <p>
              Platform:
              {" "}
              {videoB?.platform}
            </p>

            <p>
              Creator:
              {" "}
              {videoB?.creator}
            </p>

            <p>
              Views:
              {" "}
              {videoB?.views}
            </p>

            <p>
              Likes:
              {" "}
              {videoB?.likes}
            </p>

          </div>

        </div>

      )}

      {/* CHAT */}

      <div className="card">

        <h2>
          AI Analyst Chat
        </h2>

        <div className="chat-box">

          {messages.map(
            (msg, idx) => (

              <div
                key={idx}
                className={
                  msg.role === "user"
                    ? "user-msg"
                    : "bot-msg"
                }
              >
                <strong>
                  {
                    msg.role === "user"
                      ? "You"
                      : "AI"
                  }
                  :
                </strong>

                <br />

                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>

              </div>
            )
          )}

        </div>

        <div className="chat-row">

          <input
            placeholder="Ask about the videos..."
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
          />

          <button
            onClick={handleChat}
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;