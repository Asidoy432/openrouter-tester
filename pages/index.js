import { useState } from "react";

const MODELS = [
  { id: "openai/gpt-oss-120b:free", label: "GPT-OSS 120B (free)" },
  { id: "openai/gpt-oss-20b:free",  label: "GPT-OSS 20B (free)"  },
  { id: "qwen/qwen3-coder:free",    label: "Qwen3 Coder (free)"  },
  { id: "deepseek/deepseek-r1:free","label": "DeepSeek R1 (free)" },
];

export default function Home() {
  const [model, setModel]       = useState(MODELS[0].id);
  const [message, setMessage]   = useState("How many r's are in the word 'strawberry'?");
  const [reasoning, setReasoning] = useState(true);
  const [response, setResponse] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [tab, setTab]           = useState("answer");

  async function send() {
    if (!message.trim()) return;
    setError(null); setResponse(null); setLoading(true); setTab("answer");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, model, reasoning }),
      });
      const data = await res.json();
      if (data.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      setResponse(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const answer        = response?.choices?.[0]?.message?.content;
  const reasoningText = response?.choices?.[0]?.message?.reasoning_details?.map(d => d.content).join("\n");
  const usage         = response?.usage;
  const tabs          = ["answer", ...(reasoningText ? ["reasoning"] : []), "raw"];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Courier New',monospace", color:"#e2e8f0" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0f172a,#1e1b4b)", borderBottom:"1px solid #334155", padding:"16px 20px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
          <div>
            <div style={{ fontSize:16, fontWeight:"bold", color:"#a5b4fc", letterSpacing:1 }}>OPENROUTER TESTER</div>
            <div style={{ fontSize:10, color:"#64748b", letterSpacing:2 }}>VERCEL EDITION</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 16px", maxWidth:620, margin:"0 auto" }}>

        {/* Model */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:10, color:"#6366f1", letterSpacing:2, display:"block", marginBottom:6 }}>MODEL</label>
          <select value={model} onChange={e => setModel(e.target.value)}
            style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"12px", color:"#e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none" }}>
            {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>

        {/* Message */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:10, color:"#6366f1", letterSpacing:2, display:"block", marginBottom:6 }}>MESSAGE</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
            style={{ width:"100%", boxSizing:"border-box", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"12px", color:"#e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical" }} />
        </div>

        {/* Reasoning toggle */}
        <div style={{ marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"12px 14px" }}>
          <div>
            <div style={{ fontSize:13 }}>Enable Reasoning</div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>Chain-of-thought tokens</div>
          </div>
          <div onClick={() => setReasoning(v => !v)}
            style={{ width:44, height:24, borderRadius:12, cursor:"pointer", background:reasoning?"#6366f1":"#334155", position:"relative", transition:"background 0.2s" }}>
            <div style={{ position:"absolute", top:2, left:reasoning?22:2, width:20, height:20, borderRadius:10, background:"#fff", transition:"left 0.2s" }} />
          </div>
        </div>

        {/* Send */}
        <button onClick={send} disabled={loading}
          style={{ width:"100%", padding:"14px", background:loading?"#334155":"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:10, color:"#fff", fontSize:14, fontWeight:"bold", letterSpacing:1, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>
          {loading ? "⏳ SENDING..." : "▶  SEND REQUEST"}
        </button>

        {/* Error */}
        {error && (
          <div style={{ marginTop:16, padding:"12px 14px", background:"#450a0a", border:"1px solid #7f1d1d", borderRadius:8, color:"#fca5a5", fontSize:13 }}>
            ❌ {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div style={{ marginTop:20 }}>
            {/* Tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding:"6px 14px", borderRadius:6, background:tab===t?"#6366f1":"#0f172a", border:`1px solid ${tab===t?"#6366f1":"#334155"}`, color:tab===t?"#fff":"#94a3b8", fontSize:11, fontFamily:"inherit", cursor:"pointer", letterSpacing:1, textTransform:"uppercase" }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Token usage */}
            {usage && (
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                {[["PROMPT",usage.prompt_tokens],["OUTPUT",usage.completion_tokens],["REASONING",usage.reasoning_tokens||"—"]].map(([l,v]) => (
                  <div key={l} style={{ flex:1, background:"#0f172a", border:"1px solid #1e293b", borderRadius:6, padding:"8px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:9, color:"#6366f1", letterSpacing:1 }}>{l}</div>
                    <div style={{ fontSize:15, fontWeight:"bold", marginTop:2 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:10, padding:"14px", fontSize:13, lineHeight:1.8, color:"#cbd5e1", whiteSpace:"pre-wrap", wordBreak:"break-word", maxHeight:400, overflowY:"auto" }}>
              {tab === "answer"    && (answer        || "No content returned.")}
              {tab === "reasoning" && (reasoningText || "No reasoning details.")}
              {tab === "raw"       && JSON.stringify(response, null, 2)}
            </div>

            <div style={{ marginTop:10, textAlign:"center", fontSize:11, color:"#4ade80", letterSpacing:1 }}>
              ✅ MODEL IS WORKING ON FREE TIER
            </div>
          </div>
        )}

        <div style={{ height:40 }} />
      </div>
    </div>
  );
}
