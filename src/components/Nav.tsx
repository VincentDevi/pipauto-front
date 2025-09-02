import { useLocation } from "@solidjs/router";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
} from "clerk-solidjs";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  const { userId, sessionId } = useAuth();

  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
        <ClerkLoading>
          <p>Loading...</p>
        </ClerkLoading>
        <ClerkLoaded>
          <li>
            <SignedOut>
              <SignInButton class="bg-slate-200 rounded-md px-3 py-1" />
            </SignedOut>
          </li>
          <li>
            <SignedIn>
              <UserButton />
              <p>Welcome, {userId()}</p>
              <p>session id, {sessionId()}</p>
              <SignOutButton class="bg-slate-200 rounded-md px-3 py-1" />
            </SignedIn>
          </li>
        </ClerkLoaded>
      </ul>
    </nav>
  );
}
