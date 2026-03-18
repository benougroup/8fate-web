import * as React from "react";
import { ENV } from "../config/env";
import type {
  AuthService,
  ChatService,
  MonthlyService,
  PurchaseService,
  TimeFinderService,
  UserService,
} from "./interfaces";
import { MockAuthService } from "./mock/AuthService.mock";
import { MockChatService } from "./mock/ChatService.mock";
import { MockMonthlyService } from "./mock/MonthlyService.mock";
import { MockPurchaseService } from "./mock/PurchaseService.mock";
import { MockTimeFinderService } from "./mock/TimeFinderService.mock";
import { MockUserService } from "./mock/UserService.mock";
import { RealAuthService } from "./real/AuthService.real";
import { RealChatService } from "./real/ChatService.real";
import { RealMonthlyService } from "./real/MonthlyService.real";
import { RealPurchaseService } from "./real/PurchaseService.real";
import { RealTimeFinderService } from "./real/TimeFinderService.real";
import { RealUserService } from "./real/UserService.real";

type Services = {
  auth: AuthService;
  user: UserService;
  purchase: PurchaseService;
  chat: ChatService;
  timeFinder: TimeFinderService;
  monthly: MonthlyService;
};

const services: Services = ENV.useMock
  ? {
      auth: new MockAuthService(),
      user: new MockUserService(),
      purchase: new MockPurchaseService(),
      chat: new MockChatService(),
      timeFinder: new MockTimeFinderService(),
      monthly: new MockMonthlyService(),
    }
  : {
      auth: new RealAuthService(),
      user: new RealUserService(),
      purchase: new RealPurchaseService(),
      chat: new RealChatService(),
      timeFinder: new RealTimeFinderService(),
      monthly: new RealMonthlyService(),
    };

const ServicesContext = React.createContext<Services | null>(null);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = React.useContext(ServicesContext);
  if (!context) {
    throw new Error("ServicesProvider is missing");
  }
  return context;
}
