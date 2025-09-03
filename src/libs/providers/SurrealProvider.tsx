import {
  useContext,
  createContext,
  JSX,
  createSignal,
  createEffect,
  onCleanup,
  Accessor,
  onMount,
} from "solid-js";
import Surreal from "surrealdb";
import { useMutation } from "@tanstack/solid-query";
import { createStore } from "solid-js/store";

interface SurrealProviderProps {
  children: JSX.Element;
  /** The database endpoint URL */
  endpoint: string;
  /** Optional existing Surreal client */
  client?: Surreal;
  /* Optional connection parameters */
  params?: Parameters<Surreal["connect"]>[1];
  /** Auto connect on component mount, defaults to true */
  autoConnect?: boolean;
}

interface SurrealProviderState {
  /** The Surreal instance */
  client: Accessor<Surreal>;
  /** Whether the connection is pending */
  isConnecting: Accessor<boolean>;
  /** Whether the connection was successfully established */
  isSuccess: Accessor<boolean>;
  /** Whether the connection rejected in an error */
  isError: Accessor<boolean>;
  /** The connection error, if present */
  error: Accessor<unknown | null>;
  /** Connect to the Surreal instance */
  connect: () => Promise<void>;
  /** Close the Surreal instance */
  close: () => Promise<true>;
}

// Store interface to track the Surreal instance and connection status
interface SurrealProviderStore {
  instance: Surreal;
  status: "connecting" | "connected" | "disconnected";
}

const SurrealContext = createContext<SurrealProviderState>();

export function SurrealProvider(props: SurrealProviderProps) {
  // Initialize store with either provided client or new instance
  const [store, setStore] = createStore<SurrealProviderStore>({
    instance: props.client ?? new Surreal(),
    status: "disconnected",
  });

  // Use TanStack Query's mutation hook to manage the async connection state
  const { mutateAsync, isError, error, reset } = useMutation(() => ({
    mutationFn: async () => {
      setStore("status", "connecting");
      await store.instance.connect(props.endpoint, props.params);
    },
  }));

  // Effect to handle auto-connection and cleanup
  createEffect(() => {
    // Connect automatically if autoConnect is true
    if (props.autoConnect) {
      mutateAsync();
    }

    // Cleanup function to reset mutation state and close connection
    onCleanup(() => {
      reset();
      store.instance.close();
    });
  });

  // Subscribe to connection events when component mounts
  onMount(() => {
    // Update store status when connection is established
    store.instance.emitter.subscribe("connected", () => {
      setStore("status", "connected");
    });

    // Update store status when connection is lost
    store.instance.emitter.subscribe("disconnected", () => {
      setStore("status", "disconnected");
    });
  });

  // Create the value object that will be provided through context
  const providerValue: SurrealProviderState = {
    client: () => store.instance,
    close: () => store.instance.close(),
    connect: mutateAsync,
    error: () => error,
    isConnecting: () => store.status === "connecting",
    isError: () => isError,
    isSuccess: () => store.status === "connected",
  };

  return (
    <SurrealContext.Provider value={providerValue}>
      {props.children}
    </SurrealContext.Provider>
  );
}

// Custom hook to access the SurrealDB context
export function useSurreal(): SurrealProviderState {
  const context = useContext(SurrealContext);

  // Ensure the hook is used within a provider
  if (!context) {
    throw new Error("useSurreal must be used within a SurrealProvider");
  }

  return context;
}
