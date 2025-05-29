import { useState } from "react";
export default function LiquorChatbot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const askGPT = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      setResponse("[에러] GPT 응답을 받아오지 못했습니다.");
    }
    setLoading(false);
  };
  return (
    <div>
      <h1>주류 챗봇 (GPT 연동)</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="예: 도수 낮은 위스키 추천해줘"
      />
      <button onClick={askGPT} disabled={loading}>
        {loading ? "검색 중..." : "검색"}
      </button>
      <pre>{response}</pre>
    </div>
  );
}
