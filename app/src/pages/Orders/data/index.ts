import { CellAction, CellStatus } from "../components/TableCell";
import { TNotifyOrder, TOrderData, TStatusUpdateData } from "../types";
import { TData } from "./types";

export default function miscData() {
  const commonHeadersAttr = {
    align: "left",
    Cell: ({ value }) => value || "",
  };

  const tableHeaders = ({ onShowEdit, onShowCancelConfirmation }: TData) => [
    {
      Header: "Transaction No.",
      accessor: "transid",
      ...commonHeadersAttr,
    },
    {
      Header: "Reference No.",
      accessor: "ref_number",
      ...commonHeadersAttr,
    },
    {
      Header: "Status",
      accessor: "status",
      align: "center",
      Cell: CellStatus,
    },
    {
      Header: "Created at",
      align: "left",
      Cell: ({ row }) => `${row.original.created_date} ${row.original.created_time}`,
    },
    {
      Header: "Last modified",
      accessor: "last_modified",
      ...commonHeadersAttr,
    },
    {
      Header: "Actions",
      align: "center",
      cellProps: { onShowEdit, onShowCancelConfirmation },
      Cell: CellAction,
    },
  ];

  const typeReportsData = [
    {
      value: "stock-status",
      label: "Stock Status",
    },
    {
      value: "wh-snapshot",
      label: "WH Snapshot",
    },
    {
      value: "aging-report",
      label: "Aging Report",
    },
  ];

  const groupByData = {
    stock: [
      {
        value: "material",
        label: "Material",
      },
      {
        value: "batch",
        label: "Batch",
      },
      {
        value: "expiry",
        label: "Expiry Dates",
      },
    ],
    aging: [
      {
        value: "",
        label: "--None--",
      },
      {
        value: "expiration",
        label: "Expiration",
      },
      {
        value: "receiving",
        label: "Receiving Date",
      },
      {
        value: "production",
        label: "Production Date",
      },
    ],
  };

  const initialFiltered = {
    status: "",
    createdAt: null,
    lastModified: null,
  };

  const initialNotification: TNotifyOrder = {
    open: false,
    message: "",
    title: "",
    color: "primary",
  };

  const initialOrder: TOrderData = {
    id: "",
    pickup_date: null,
    ref_number: "",
    instruction: "",
    allow_notify: false,
    source_wh: "",
    status: { id: null, name: "" },
    requests: [
      {
        uuid: "",
        material: "",
        description: "",
        qty: "",
        units: "",
        batch: "",
        expiry: "",
        available: "",
      },
    ],
    requestsDelete: [],
  };

  const initialOutboundDetails: TStatusUpdateData = {
    message: "",
    data: null,
    status: "idle",
    action: null,
  };

  return {
    tableHeaders,
    typeReportsData,
    groupByData,
    initialFiltered,
    initialNotification,
    initialOrder,
    initialOutboundDetails,
  };
}
