import { createSignal, For, Match, Switch } from "solid-js";
import { RecordId } from "surrealdb";
import Nav from "~/components/Nav";
import DefaultLayout from "~/components/ui/layout";
import { useSurreal } from "~/libs/providers/SurrealProvider";
import {
  createSolidTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/solid-table";
import { useQuery } from "@tanstack/solid-query";
import { Pagination } from "~/components/ui/pagination";
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

type Car = {
  id: RecordId;
  brand: string;
  client_id: Client;
  model: string;
  fuel: string;
  year: number;
};
type CountResult = {
  count: number;
};

type Client = {
  first_name: string;
  last_name: string;
};
const columns: ColumnDef<Car>[] = [
  {
    id: "brand",
    header: "Brand",
    accessorKey: "brand",
  },
  {
    id: "model",
    header: "Model",
    accessorKey: "model",
  },
  {
    id: "client",
    header: "Client",
    accessorFn: (row: Car) =>
      `${row.client_id.first_name} ${row.client_id.last_name}`,
  },
  {
    id: "fuel",
    header: "Fuel",
    accessorKey: "fuel",
  },
  {
    id: "year",
    header: "Year",
    accessorKey: "year",
  },
];

export default function Cars() {
  const { client } = useSurreal();
  const [pagination, setPagination] = createSignal({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = createSignal([]);
  const [columnFilters, setColumnFilters] = createSignal([]);
  const repo = useQuery(() => ({
    queryKey: ["cars", pagination, columnFilters, sorting],
    queryFn: async () => {
      const result = await client().query<Car[]>(
        `
	select *,client_id.first_name, client_id.last_name from car limit ${pagination().pageSize} start ${pagination().pageIndex};
        ;`,
      );
      const countResult = await client().query<CountResult[]>(
        "select count() from car group by count",
      );
      return {
        result: result[0] ?? [],
        count: countResult[0]?.[0].count ?? 0,
      };
    },
    enabled: !!client(),
  }));

  const table = createSolidTable({
    columns: columns,
    get data() {
      return repo.data?.result || [];
    },
    state: {
      get pagination() {
        return pagination();
      },
      get sorting() {
        return sorting();
      },
      get columnFilters() {
        return columnFilters();
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  });

  return (
    <DefaultLayout nav={<Nav />}>
      <h2 class="p-4 font-bold text-xl">
        liste des voitures de l'organisation{" "}
      </h2>
      <Switch>
        <Match when={repo.isPending}>
          <p> loading... </p>
        </Match>
        <Match when={repo.isError}>
          <p> Something went wrong </p>
        </Match>
        <Match when={repo.isSuccess}>
          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
                <For each={table.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr>
                      <For each={headerGroup.headers}>
                        {(header) => (
                          <th class="border border-gray-300 px-4 py-2 bg-gray-100 text-left">
                            {header.isPlaceholder
                              ? null
                              : typeof header.column.columnDef.header ===
                                  "function"
                                ? header.column.columnDef.header(
                                    header.getContext(),
                                  )
                                : header.column.columnDef.header}
                          </th>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </thead>
              <tbody>
                <For each={table.getRowModel().rows}>
                  {(row) => (
                    <tr>
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <td class="border border-gray-300 px-4 py-2">
                            {cell.getValue()}
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <Pagination
            count={Math.ceil((repo.data?.count ?? 0) / pagination().pageSize)}
            itemComponent={(props) => (
              <PaginationItem page={props.page}>{props.page}</PaginationItem>
            )}
            ellipsisComponent={() => <PaginationEllipsis />}
          >
            <PaginationPrevious />
            <PaginationItems />
            <PaginationNext />
          </Pagination>
        </Match>
      </Switch>
    </DefaultLayout>
  );
}
