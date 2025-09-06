import { ColumnDef } from "@tanstack/solid-table";
import { Address } from "~/libs/types/address";

type Client = {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address: Address;
};

export const columns: ColumnDef<Client>[] = [
  {
    header: "Name",
    accessorFn: (row: Client) => `${row.first_name} ${row.last_name}`,
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Address",
    accessorFn: (row: Client) =>
      `${row.address.street} ${row.address.number}, ${row.address.street} ${row.address.country}`,
  },
];
