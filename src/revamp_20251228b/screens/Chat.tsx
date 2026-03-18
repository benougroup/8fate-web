import * as React from "react";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { useServices } from "../services";
import type { ChatMessage } from "../services/types";

export function Chat() {
  const services = useServices();
  const historyRef = React.useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function loadHistory() {
      try {
        const history = await services.chat.getHistory();
        if (active) {
          setMessages(history);
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

  async function handleSend() {
    if (!input.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await services.chat.sendMessage(userMessage.text);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.unknownError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="md" className="revamp-chatLayout">
            <h1 className="title">{t("chat.title")}</h1>
            <div className="revamp-chatHistory" ref={historyRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`revamp-chatBubble revamp-chatBubble--${message.role}`}
                >
                  <Text>{message.text}</Text>
                </div>
              ))}
            </div>
            {error ? <Text>{error}</Text> : null}
            <div className="revamp-chatComposer">
              <input
                type="text"
                className="revamp-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t("chat.inputPlaceholder")}
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleSend}
                disabled={loading}
              >
                {t("chat.send")}
              </Button>
            </div>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
