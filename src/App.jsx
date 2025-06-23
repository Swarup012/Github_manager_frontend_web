import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Linkify from "linkify-react";
export default function GitHubBotApp() {
  const [input, setInput] = useState("");
  const [repo, setRepo] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);


const sendCommand = async () => {
  setLoading(true);         // show "Gemini is thinking..."
  setResponse("");          // clear old response

  try {
    const res = await fetch("https://github-manager-backend.onrender.com/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        repo,
        github_token: githubToken,
        gemini_key: geminiKey,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    setResponse(data.response ?? "🤖 No response received from Gemini.");
  } catch (error) {
    console.error("Fetch error:", error);
    setResponse(`❌ Error: ${error.message}`);
  } finally {
    setLoading(false);      // hide loader
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-2 text-teal-400">
          🤖 GitHub SOLO
        </h1>

        <input
          type="text"
          placeholder="Enter repo (e.g. username/repo)"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />

        <input
          type="text"
          placeholder="GitHub Token"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
        />

        <input
          type="text"
          placeholder="Gemini API Key"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={geminiKey}
          onChange={(e) => setGeminiKey(e.target.value)}
        />

        <textarea
          rows={3}
          placeholder="Ask Gemini to manage your repo (e.g. 'Create an issue about...')"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="text-right">
          <button
            onClick={sendCommand}
            className="bg-teal-500 hover:bg-teal-600 rounded-lg px-4 py-2 font-semibold shadow-md transition"
          >
            🤖 Run
          </button>
        </div>

        {loading ? (
  <div className="text-teal-400 animate-pulse mt-4">
    🤖 SOLO is thinking...
  </div>
) : response && (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm whitespace-pre-wrap mt-4">
    <h2 className="text-lg font-semibold mb-2 text-teal-300">Response</h2>
    <Linkify
      options={{
        target: "_blank",
        className: "text-teal-400 underline hover:text-teal-200",
      }}
    >
      {response}
    </Linkify>
  </div>
)}

      </div>
    </div>
  );
}
