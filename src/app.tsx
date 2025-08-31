import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { ClerkProvider } from "clerk-solidjs";

export default function App() {
  return (
    <Router
      root={(props) => (
        <ClerkProvider
          publishableKey={import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <Nav />
          <Suspense>{props.children}</Suspense>
        </ClerkProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
