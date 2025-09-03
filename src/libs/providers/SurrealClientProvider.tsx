import { ParentProps, Show } from "solid-js";
import { useSurAuth } from "./AuthProvider";

export function SurrealClientProvider(props: ParentProps) {
  const auth = useSurAuth();

  return (
    <Show
      when={auth.status() === "signed-up"}
      fallback={<div>Connecting to database...</div>}
    >
      {props.children}
    </Show>
  );
}
