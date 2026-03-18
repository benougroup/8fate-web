import React, { useEffect, useMemo, useRef, useState } from "react";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";
import iconSend from "@/assets/images/general icons/submit_arrow_icon.png";

// --- SERVICES ---
import { askChat } from "@services/endpoints/chat";
import { useSession } from "@/hooks/useSession";
import { useLocalCache } from "@/hooks/useLocalCache";
import AppShell from "@/components/AppShell";

// --- TYPES ---
export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

export default function Chat() {
  const [session] = useSession();
  const { userKey, isPremium } = session || {};

  // Persist history locally
  const storageKey = useMemo(
    () => (userKey ? `chat.history.${userKey}.v1` : `chat.history.anon.v1`),
    [userKey]
  );
  const [history, setHistory] = useLocalCache<ChatMessage[]>(storageKey, []);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [history, sending]);

  async function onSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text, ts: Date.now() };
    setHistory([...(history || []), userMsg]);
    setInput("");

    try {
      const res = await askChat({ question: text });

      if (res.ok && res.data) {
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.data.answer,
          ts: Date.now(),
        };
        setHistory(prev => [...(prev || []), botMsg]);
      } else {
        throw new Error(res.error?.message || "Failed to get response");
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content: `Error: ${err.message || "Something went wrong."}`,
        ts: Date.now(),
      };
      setHistory(prev => [...(prev || []), errMsg]);
    } finally {
      setSending(false);
    }
  }

  const handleClear = () => {
    if (window.confirm("Clear chat history?")) {
      setHistory([]);
    }
  };

  const suggestions = [
    "What is my lucky element today?",
    "How is my wealth luck this month?",
    "Tell me about my Day Master.",
    "Am I compatible with a Rooster?",
  ];

  return (
    <AppShell hideNav={false}> {/* Show BottomNav for Chat */}
      <style>{`
        .chat-screen {
          height: calc(100vh - 90px); /* Minus bottom nav */
          display: flex;
          flex-direction: column;
          position: relative;
          background-color: #0B0C2A;
        }
        .chat-bg {
          position: fixed; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0; pointer-events: none;
        }
        .chat-header {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px;
          background: rgba(11, 12, 42, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .header-title { color: #fff; font-weight: 700; font-size: 16px; }
        .header-badge {
          font-size: 10px; padding: 2px 6px; border-radius: 4px;
          margin-left: 8px; text-transform: uppercase; letter-spacing: 0.5px;
          background: ${isPremium ? "#F4D73E" : "rgba(255,255,255,0.2)"};
          color: ${isPremium ? "#000" : "#fff"};
        }

        .chat-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .msg-row { display: flex; width: 100%; }
        .msg-row.user { justify-content: flex-end; }
        .msg-row.assistant { justify-content: flex-start; }
        .msg-row.system { justify-content: center; }

        .msg-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 15px;
          line-height: 1.5;
          position: relative;
        }
        .msg-bubble.user {
          background: linear-gradient(135deg, #F4D73E 0%, #c7a006 100%);
          color: #0B0C2A;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(244, 215, 62, 0.2);
        }
        .msg-bubble.assistant {
          background: rgba(29, 35, 47, 0.85);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          border-bottom-left-radius: 4px;
          backdrop-filter: blur(4px);
        }
        .msg-bubble.system {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.4);
          color: #ffcdd2;
          font-size: 13px;
          padding: 8px 12px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          opacity: 0.9;
          padding-bottom: 60px;
        }
        .suggestion-chip {
          background: rgba(29, 35, 47, 0.8);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: 12px;
          color: #fce9c7;
          font-size: 14px;
          margin-top: 10px;
          cursor: pointer;
          width: 100%;
          max-width: 300px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .suggestion-chip:active {
          background: rgba(244, 215, 62, 0.15);
          border-color: #F4D73E;
          transform: scale(0.98);
        }

        .input-area {
          position: relative; z-index: 10;
          padding: 12px 16px;
          background: rgba(11, 12, 42, 0.95);
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex; gap: 10px; align-items: center;
        }
        .chat-input {
          flex: 1;
          height: 44px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 0 16px;
          color: #fff;
          font-size: 15px;
          outline: none;
        }
        .chat-input:focus { border-color: #F4D73E; background: rgba(255,255,255,0.12); }

        .send-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: none;
          background: #F4D73E;
          display: grid; place-items: center;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #555; }
        .send-icon { width: 20px; height: 20px; object-fit: contain; }
      `}</style>

      <img src={backgroundImage} className="chat-bg" alt="bg" />

      <div className="chat-screen">
        {/* Header */}
        <div className="chat-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="header-title">Fate Assistant</span>
            <span className="header-badge">{isPremium ? "Advanced" : "Basic"}</span>
          </div>
          <button
            onClick={handleClear}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 12 }}
          >
            Clear
          </button>
        </div>

        {/* Messages */}
        <div className="chat-list" ref={listRef}>
          {(!history || history.length === 0) ? (
            <div className="empty-state">
              <p style={{ marginBottom: 20, fontSize: 14 }}>Ask me anything about your destiny...</p>
              {suggestions.map(s => (
                <div key={s} className="suggestion-chip" onClick={() => setInput(s)}>
                  {s}
                </div>
              ))}
            </div>
          ) : (
            history.map(msg => (
              <div key={msg.id} className={`msg-row ${msg.role}`}>
                <div className={`msg-bubble ${msg.role}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="msg-row assistant">
              <div className="msg-bubble assistant" style={{ fontStyle: "italic", opacity: 0.7 }}>
                Consulting the stars...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form className="input-area" onSubmit={onSend}>
          <input
            className="chat-input"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn" disabled={!input.trim() || sending}>
            <img src={iconSend} className="send-icon" alt="Send" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
