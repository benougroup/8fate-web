import type { ChatService } from "../interfaces";
import type { ChatMessage } from "../types";
import mockChat from "@assets/data/mock/mock_chat.json";
import { getActiveScenario } from "./mockScenario";

type MockReplyTemplate = {
  id: string;
  text: string;
};

type MockChatScenario = {
  error?: {
    code: string;
    message: string;
  };
};

type MockChatPayload = {
  messages: ChatMessage[];
  replyTemplates: MockReplyTemplate[];
  scenarios?: Record<string, MockChatScenario>;
};

const payload = mockChat as MockChatPayload;
const baseMessages = payload.messages ?? [];

export class MockChatService implements ChatService {
  private messages: ChatMessage[] = [...baseMessages];
  private replyIndex = 0;

  async getHistory(): Promise<ChatMessage[]> {
    return [...this.messages];
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    const activeScenario = getActiveScenario();
    const scenarioError = payload.scenarios?.[activeScenario]?.error;
    if (scenarioError) {
      throw new Error(scenarioError.message);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: message,
      createdAt: new Date().toISOString(),
    };
    const templates = payload.replyTemplates ?? [];
    const template = templates[this.replyIndex % templates.length];
    this.replyIndex += 1;
    const reply: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: template?.text ?? baseMessages.at(-1)?.text ?? "",
      createdAt: new Date().toISOString(),
    };
    this.messages = [...this.messages, userMessage, reply];
    return reply;
  }
}
