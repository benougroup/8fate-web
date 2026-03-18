import type { UserService } from "../interfaces";
import type { User } from "../types";
import { getSession } from "@services/auth";
import { ensureServicesBooted } from "./boot";

export class RealUserService implements UserService {
  async getUser(): Promise<User> {
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
    throw new Error("Unable to load user session");
  }
}
