import type {
  ChatMessage,
  MonthlyPayload,
  PurchaseResult,
  TimeFinderQuery,
  TimeFinderResult,
  User,
} from "./types";

export interface AuthService {
  startGoogleLogin(): Promise<void>;
  devMockLogin(): Promise<User>;
  logout(): Promise<void>;
}

export interface UserService {
  getUser(): Promise<User>;
}

export interface PurchaseService {
  purchasePremium(): Promise<PurchaseResult>;
  restorePurchase(): Promise<PurchaseResult>;
}

export interface ChatService {
  getHistory(): Promise<ChatMessage[]>;
  sendMessage(message: string): Promise<ChatMessage>;
}

export interface TimeFinderService {
  search(query: TimeFinderQuery): Promise<TimeFinderResult[]>;
}

export interface MonthlyService {
  getMonthly(): Promise<MonthlyPayload>;
}
