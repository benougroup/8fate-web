import type { AuthService } from "../interfaces";
import type { User } from "../types";
import { selectMockUser } from "./selectMockUser";

export class MockAuthService implements AuthService {
  async startGoogleLogin(): Promise<void> {
    return;
  }

  async devMockLogin(): Promise<User> {
    return selectMockUser();
  }

  async logout(): Promise<void> {
    return;
  }
}
