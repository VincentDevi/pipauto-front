import { betterAuth } from "better-auth";
import { surrealAdapter } from "surrealdb-better-auth";

export const auth = betterAuth({
  // ... other Better Auth options
  emailAndPassword: {
    enabled: true,
  },
  database: surrealAdapter({
    address: process.env.SURREALDB_ADDRESS ?? "",
    username: process.env.SURREALDB_USERNAME ?? "",
    password: process.env.SURREALDB_PASSWORD ?? "",
    ns: process.env.SURREALDB_NAMESPACE ?? "",
    db: process.env.SURREALDB_DATABASE ?? "",
  }),
});
