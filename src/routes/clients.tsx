import { useQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";
import { columns } from "~/components/clients/table/columns";
import DataTable from "~/components/clients/table/data-table";
import Nav from "~/components/Nav";
import DefaultLayout from "~/components/ui/layout";
import { useSurreal } from "~/libs/providers/SurrealProvider";

export default function Clients() {
  const { client } = useSurreal();
  const query = useQuery(() => ({
    queryKey: ["clients"],
    queryFn: async () => {
      const result = await client().query("select * from client;");
      return result[0] ?? [];
    },
  }));

  return (
    <DefaultLayout nav={<Nav />}>
      <h1>Liste des clients</h1>
      <Switch>
        <Match when={query.isPending}>
          <p> loading... </p>
        </Match>
        <Match when={query.isError}>
          <p> Something went wrong</p>
        </Match>
        <Match when={query.isSuccess}>
          <DataTable columns={columns} data={query.data} />
        </Match>
      </Switch>
    </DefaultLayout>
  );
}
