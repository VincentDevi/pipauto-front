import { useAuth } from "clerk-solidjs";
import { Accessor, createContext, onMount, ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useSurreal } from "~/libs/providers/SurrealProvider";

interface AuthProviderState {
  user: Accessor<UserRecord | undefined>;
  status: Accessor<AuthProviderStore["status"]>;
  login: (email: string, password: string) => Promise<void>;
  authenticate: () => Promise<void>;
  register: (data: Omit<UserRecord, "id">) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderStore {
  user: UserRecord | undefined;
  status:
    | "idle"
    | "signing-in"
    | "signing-up"
    | "signing-out"
    | "signed-in"
    | "signed-up";
}

const AuthContext = createContext<AuthProviderState>();

export function AuthProvider(props: ParentProps) {
  const { client, close, connect } = useSurreal();
  const auth = useAuth();

  const [store, setStore] = createStore<AuthProviderStore>({
    user: undefined,
    status: "idle",
  });

  // Auto-authenticate on provider mount
  onMount(() => {
    authenticate();
  });

  const login = async (email: string, password: string) => {
    const db = client();

    setStore("status", "signing-in");

    await db.signin({
      access: "user",
      namespace: "surrealdb",
      database: "pollwebapp",
      variables: {
        email: email,
        pass: password,
      },
    });

    setStore("status", "signed-up");
  };

  const register = async (data: Omit<UserRecord, "id">) => {
    const db = client();

    setStore("status", "signing-up");

    await db.signup({
      access: "user",
      namespace: "surrealdb",
      database: "pollwebapp",
      variables: data,
    });

    setStore("status", "signed-up");
  };

  const logout = async () => {
    setStore("status", "signing-out");

    await close();
    await connect();

    setStore("status", "idle");
  };

  const authenticate = async () => {
    const db = client();
    console.log(`url : ${import.meta.env.VITE_SURREALDB_ADDRESS}`);
    await db.connect(import.meta.env.VITE_SURREALDB_ADDRESS, {
      namespace: import.meta.env.VITE_SURREALDB_NAMESPACE,
      database: import.meta.env.VITE_SURREALDB_DATABASE,
    });
    const token = await auth.getToken();
    await db.authenticate(token ?? "");

    try {
      let ok = await db.query("return fn::getOrCreateUser();");
      //let ok = await db.query("return $token.first_name");
      console.log({ ok });
    } catch (e: any) {
      console.error(e.message);
    }

    setStore("status", "signed-up");
  };

  const providerValue: AuthProviderState = {
    user: () => store.user,
    status: () => store.status,
    login,
    register,
    logout,
    authenticate,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useSurAuth(): AuthProviderState {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useSurAuth must be used within an AuthProvider");
  }

  return ctx;
}
