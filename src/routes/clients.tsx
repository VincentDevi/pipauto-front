import { createResource, For, Show } from "solid-js";
import { useSurreal } from "~/libs/providers/SurrealProvider";

type Client = {
  first_name: string;
};

export default function Clients() {
  const { client } = useSurreal();

  const [clients] = createResource(async () => {
    const result = await client().query<Client[]>("SELECT * FROM client;");
    return result[0] ?? [];
  });

  console.log("okokok");
  return (
    <div>
      <h1>Liste des clients</h1>
      <Show when={!clients.loading} fallback={<p>Chargement...</p>}>
        <Show when={!clients.error} fallback={<p>{clients.error.message}</p>}>
          <Show
            when={clients() && clients()!.length > 0}
            fallback={<p>Aucun client trouvé</p>}
          >
            <ul>
              a
              <For each={clients()}>
                {(client) => <li>{client.first_name}</li>}
              </For>
            </ul>
          </Show>
        </Show>
      </Show>
    </div>
  );
}
