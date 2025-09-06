import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { ClerkProvider } from "clerk-solidjs";
import { SurrealProvider } from "./libs/providers/SurrealProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { AuthProvider } from "./libs/providers/AuthProvider";
import { SurrealClientProvider } from "./libs/providers/SurrealClientProvider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Router
      root={(props) => (
        <ClerkProvider
          publishableKey={import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <QueryClientProvider client={queryClient}>
            <SurrealProvider
              endpoint={import.meta.env.VITE_SURREALDB_ADDRESS}
              autoConnect
              params={{
                namespace: import.meta.env.VITE_SURREALDB_NAMESPACE,
                database: import.meta.env.VITE_SURREALDB_DATABASE,
              }}
            >
              <AuthProvider>
                <SurrealClientProvider>
                  <Suspense>{props.children}</Suspense>
                </SurrealClientProvider>
              </AuthProvider>
            </SurrealProvider>
          </QueryClientProvider>
        </ClerkProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
