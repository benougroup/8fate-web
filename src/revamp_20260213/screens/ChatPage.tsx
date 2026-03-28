import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { ContentPageTopBar } from "../components/ContentPageTopBar";
import { t } from "../i18n/t";
import { useServices } from "../services";
import { usePreferences } from "../stores/preferencesStore";
import type { ChatMessage } from "../services/types";

const FREE_MESSAGES_PER_WEEK = 5;

const SUGGESTED_QUESTIONS = [
  t("chat.suggestions.todayFortune"),
  t("chat.suggestions.careerAdvice"),
  t("chat.suggestions.relationshipInsight"),
  t("chat.suggestions.luckyElements"),
];

export function ChatPage() {
  const navigate = useNavigate();
  const services = useServices();
  const { isPremium } = usePreferences();
  const historyRef = React.useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [messagesThisWeek, setMessagesThisWeek] = React.useState(0);

  const remainingMessages = isPremium
    ? Infinity
    : Math.max(0, FREE_MESSAGES_PER_WEEK - messagesThisWeek);
  const canSendMessage = isPremium || remainingMessages > 0;

  React.useEffect(() => {
    let active = true;
    async function loadHistory() {
      try {
        const history = await services.chat.getHistory();
        if (active) {
          setMessages(history);
          // Count messages this week (simplified - should use actual date logic)
          const userMessages = history.filter((m) => m.role === "user");
          setMessagesThisWeek(userMessages.length);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : t("common.unknownError"));
        }
      }
    }

    void loadHistory();
    return () => {
      active = false;
    };
  }, [services.chat]);

  React.useEffect(() => {
    historyRef.current?.scrollTo({
      top: historyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || !canSendMessage) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setMessagesThisWeek((prev) => prev + 1);

    try {
      const reply = await services.chat.sendMessage(messageText);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.unknownError"));
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestedQuestion(question: string) {
    handleSend(question);
  }

  return (
    <Page>
      <PageCard className="revamp-innerPage revamp-chatPage">
        <ContentPageTopBar />

        <div className="revamp-chatLayout">
          {/* Message Limit Banner */}
          {!isPremium && (
            <div className="revamp-chatLimitBanner">
              {t("chat.messagesRemaining", { count: remainingMessages })}
            </div>
          )}

          {/* Chat History */}
          <div className="revamp-chatHistory" ref={historyRef}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "var(--s-6)", color: "var(--c-text-muted)" }}>
                <p>{t("chat.welcomeMessage")}</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`revamp-chatBubble revamp-chatBubble--${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="revamp-chatBubble revamp-chatBubble--assistant">
                <div style={{ opacity: 0.6 }}>{t("chat.thinking")}</div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "var(--s-3)",
                borderRadius: "var(--r-md)",
                background: "rgba(156, 47, 47, 0.1)",
                border: "1px solid rgba(156, 47, 47, 0.3)",
                color: "var(--c-red)",
                fontSize: "var(--fs-sm)",
              }}
            >
              {error}
            </div>
          )}

          {/* Suggested Questions (when no messages) */}
          {messages.length === 0 && (
            <div className="revamp-chatSuggestedQuestions">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  className="revamp-chatSuggestedQuestion"
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={!canSendMessage}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Upgrade Banner (when limit reached) */}
          {!isPremium && remainingMessages === 0 && (
            <div className="revamp-chatUpgradeBanner">
              <h3 className="revamp-chatUpgradeBannerTitle">
                {t("chat.limitReached.title")}
              </h3>
              <p className="revamp-chatUpgradeBannerMessage">
                {t("chat.limitReached.message")}
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/premium")}
              >
                {t("chat.limitReached.cta")}
              </Button>
            </div>
          )}

          {/* Chat Composer */}
          <div className="revamp-chatComposer">
            <input
              type="text"
              className="revamp-chatInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                canSendMessage
                  ? t("chat.inputPlaceholder")
                  : t("chat.limitReached.placeholder")
              }
              disabled={!canSendMessage || loading}
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSend()}
              disabled={!input.trim() || !canSendMessage || loading}
              className="revamp-chatSend"
            >
              {loading ? "..." : "→"}
            </Button>
          </div>
        </div>
      </PageCard>

      <FloatingRadialNav />
    </Page>
  );
}
