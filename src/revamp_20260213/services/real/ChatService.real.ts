import type { ChatService } from "../interfaces";
import type { ChatMessage } from "../types";
import { askChat } from "@services/endpoints/chat";
import { ensureServicesBooted } from "./boot";

export class RealChatService implements ChatService {
  async getHistory(): Promise<ChatMessage[]> {
    ensureServicesBooted();
    return [];
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    ensureServicesBooted();
    const response = await askChat({ question: message });
    if (response.ok && response.data) {
      return {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: response.data.answer,
        createdAt: new Date().toISOString(),
      };
    }
    throw new Error("Unable to send chat message");
  }
}
