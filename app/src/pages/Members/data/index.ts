import { format, parseISO } from "date-fns";
import { TTableCellProps } from "types/reactTable";
import { CellName, CellStatus, CellAction } from "../components/TableCell";
import { TData } from "./types";

export default function miscData() {
  return {
    tableHeaders: ({ onShowEdit }: TData) => [
      { Header: "Customer code", accessor: "company.customer_code", width: "20%", align: "left" },
      {
        Header: "Name",
        align: "left",
        Cell: CellName,
      },
      { Header: "Email", accessor: "email", align: "left" },
      {
        Header: "Status",
        accessor: "active",
        align: "center",
        Cell: CellStatus,
      },
      {
        Header: "Verified at ",
        accessor: "email_verified_at",
        align: "center",
        Cell: ({ value }: TTableCellProps) =>
          value ? format(parseISO(value), "MMM. dd, RR hh:mm aaa") : null,
      },
      {
        Header: "Last modified",
        accessor: "updated_at",
        align: "center",
        Cell: ({ value }: TTableCellProps) =>
          value ? format(parseISO(value), "MMM. dd, RR hh:mm aaa") : null,
      },
      {
        Header: "Actions",
        accessor: "",
        align: "center",
        cellProps: { onShowEdit },
        Cell: CellAction,
      },
    ],
  };
}
