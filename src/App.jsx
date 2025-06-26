import { useState } from "react";
import { motion } from "framer-motion";
import Linkify from "linkify-react";

export default function GitHubBotApp() {
  const [input, setInput] = useState("");
  const [repo, setRepo] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const sendCommand = async (inputText = input) => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: inputText,
          repo,
          github_token: githubToken,
          gemini_key: geminiKey,
        }),
      });

      const data = await res.json();
      setResponse(data.response ?? "🤖 No response received from Gemini.");
    } catch (error) {
      setResponse(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("❌ Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      sendCommand(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("❌ Microphone error occurred.");
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 shadow-xl p-8 space-y-6"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-bold text-center text-teal-300"
        >
          👨‍💼 GitHub Manager
        </motion.h1>

        <div className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="e.g. username/repo"
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />

          <input
            type="text"
            placeholder="GitHub Token"
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
          />

          <input
            type="text"
            placeholder="Gemini API Key"
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
          />

          <textarea
            rows={3}
            placeholder="e.g. Create an issue about..."
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={handleVoice}
            className="relative bg-pink-500 hover:bg-pink-600 rounded-full px-6 py-2 font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 border-solid border-amber-50 border-1"
          >
            {listening ? "🎤 Listening..." : "🎙️ Speak "}
            {listening && (
              <span className="absolute -right-3 -top-3 h-3 w-3 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => sendCommand()}
            className="bg-teal-500 hover:bg-teal-600 rounded-xl px-6 py-2 font-semibold  transition-all duration-300 shadow-2xl border-solid border-amber-50 border-1"
          >
            💬 Run
          </button>
        </div>

        {loading ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-teal-300 text-center mt-4"
          >
            🤖 SOLO is thinking...
          </motion.div>
        ) : (
          response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm whitespace-pre-wrap mt-4"
            >
              <h2 className="text-lg font-semibold mb-2 text-teal-300">
                Response
              </h2>
              <Linkify
                options={{
                  target: "_blank",
                  className: "text-teal-400 underline hover:text-teal-200",
                }}
              >
                {response}
              </Linkify>
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  );
}
