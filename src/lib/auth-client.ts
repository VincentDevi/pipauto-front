import { createAuthClient } from "better-auth/solid";

export const { signIn, signUp, useSession } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});
