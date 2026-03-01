import React, { useMemo, useState } from "react";

type HistoryItem = {
  id: number;
  prompt: string;
  response: string;
  created_at: string;
};

const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE ?? "http://xxxxxxx";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const apiBase = useMemo(() => API_BASE_DEFAULT, []);

  const runGemini = async () => {
    setLoading(true);
    setOutput("");
    const res = await fetch(`${apiBase}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setOutput(data.text ?? "");
    setLoading(false);
  };

  const loadHistory = async () => {
    const res = await fetch(`${apiBase}/history`);
    const data = await res.json();
    setHistory(data.items ?? []);
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h2>Gemini Web App</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 900 }}>
        <label>
          Prompt
          <br />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            style={{ width: "100%" }}
            placeholder="ここにプロンプトを入力"
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={runGemini} disabled={loading || prompt.trim().length === 0}>
            {loading ? "Running..." : "Run Gemini"}
          </button>
          <button onClick={loadHistory}>Load History</button>
        </div>

        <label>
          Output
          <br />
          <textarea
            value={output}
            readOnly
            rows={10}
            style={{ width: "100%" }}
            placeholder="ここにレスポンスが表示されます"
          />
        </label>

        <hr />

        <h3>History</h3>
        <div style={{ overflowX: "auto" }}>
          <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Created At (UTC)</th>
                <th>Prompt</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    「Load History」を押すと履歴が表示されます
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{item.created_at}</td>
                    <td style={{ whiteSpace: "pre-wrap", minWidth: 220 }}>{item.prompt}</td>
                    <td style={{ whiteSpace: "pre-wrap", minWidth: 220 }}>{item.response}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
