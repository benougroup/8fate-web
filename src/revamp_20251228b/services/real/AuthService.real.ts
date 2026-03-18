import type { AuthService } from "../interfaces";
import type { User } from "../types";
import { startGoogleSignIn, signOut, getSession } from "@services/auth";
import { ensureServicesBooted } from "./boot";

export class RealAuthService implements AuthService {
  async startGoogleLogin(): Promise<void> {
    ensureServicesBooted();
    const url = await startGoogleSignIn();
    window.location.assign(url);
  }

  async devMockLogin(): Promise<User> {
    ensureServicesBooted();
    const session = await getSession();
    if (session.status === "success" && session.data) {
      return {
        id: session.data.userKey,
        name: session.data.name ?? "",
        email: "",
        isPremium: !!session.data.isPremium,
      };
    }
    throw new Error("Session not available");
  }

  async logout(): Promise<void> {
    ensureServicesBooted();
    await signOut();
  }
}
