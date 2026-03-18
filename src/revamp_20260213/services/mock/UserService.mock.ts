import type { UserService } from "../interfaces";
import type { User } from "../types";
import { selectMockUser } from "./selectMockUser";

export class MockUserService implements UserService {
  async getUser(): Promise<User> {
    return selectMockUser();
  }
}
