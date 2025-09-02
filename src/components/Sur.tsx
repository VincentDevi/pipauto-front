import { useSurreal } from "~/libs/providers/SurrealProvider";

export default function SurTest() {
  const surreal = useSurreal();
  const isConnecting = surreal.isConnecting();
  const isConnected = surreal.isSuccess();
  const isError = surreal.isError();

  const ok = surreal.error();

  return (
    <div class="p-4 border rounded-lg bg-gray-50 my-4">
      <h3 class="font-bold text-lg mb-2">SurrealDB Connection Status</h3>
      <div class="space-y-2">
        <p>
          Is connecting: <span class="font-mono">{String(isConnecting)}</span>
        </p>
        <p>
          Is connected: <span class="font-mono">{String(isConnected)}</span>
        </p>
        <p>
          Has error: <span class="font-mono">{String(isError)}</span>
        </p>
        {String(ok)}
      </div>
    </div>
  );
}
