import { formatDecimal } from "utils";
import { CellTotal } from "../components/TableCell";
import { INotifyDownload, ITableHeaderProps, TInventory } from "../types";

export default function miscData() {
  const initialStateNotification: INotifyDownload = {
    key: 0,
    autoHideDuration: null,
    open: false,
    message: "",
    title: "",
    color: "primary",
  };

  const tableHeaders = [
    { Header: "Warehouse", accessor: "warehouse", align: "left" },
    { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
    { Header: "Description", accessor: "description", align: "left" },
    { Header: "Fixed Weight", accessor: "fixedWt", align: "left" },
    {
      id: "total_avail",
      Header: ({ globalFilteredRows }: ITableHeaderProps) => {
        return <CellTotal data={globalFilteredRows} getValueByKey="availableQty" prefix="T" />;
      },
      columns: [
        {
          id: "sub_total_avail",
          Header: "Available Stocks",
          accessor: "availableQty",
          align: "right",
          Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
        },
      ],
    },
    {
      id: "total_alloc",
      Header: ({ globalFilteredRows }: ITableHeaderProps) => {
        return <CellTotal data={globalFilteredRows} getValueByKey="allocatedQty" prefix="T" />;
      },
      columns: [
        {
          id: "sub_total_alloc",
          Header: "Allocated Stocks",
          accessor: "allocatedQty",
          align: "right",
          Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
        },
      ],
    },
    {
      id: "total_restr",
      Header: ({ globalFilteredRows }: ITableHeaderProps) => {
        return <CellTotal data={globalFilteredRows} getValueByKey="restrictedQty" prefix="T" />;
      },
      columns: [
        {
          id: "sub_total_restr",
          Header: "Restricted Stocks",
          accessor: "restrictedQty",
          align: "right",
          Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
        },
      ],
    },
    {
      id: "total_stocks",
      Header: ({ globalFilteredRows }: ITableHeaderProps) => {
        return <CellTotal data={globalFilteredRows} getValueByKey="totalQty" prefix="GT" />;
      },
      columns: [
        {
          id: "sub_total_stocks",
          Header: "Total Stocks",
          accessor: "totalQty",
          align: "right",
          Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
        },
      ],
    },
  ];

  const initialInventory: TInventory = {
    message: "",
    data: [],
    status: "idle",
  };

  const initialFilter = {
    warehouse: "",
  };

  return {
    initialStateNotification,
    tableHeaders,
    initialInventory,
    initialFilter,
  };
}
