import { INotifyOrder, IOrderData } from "../types";

export default function miscData() {
  const commonHeadersAttr = {
    align: "left",
    Cell: ({ value }) => value || "",
  };

  const tableHeaders = () => [
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
      ...commonHeadersAttr,
      align: "center",
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

  const initialNotification: INotifyOrder = {
    open: false,
    message: "",
    title: "",
    color: "primary",
  };

  const initialOrder: IOrderData = {
    id: "",
    pickup_date: null,
    ref_number: "",
    instruction: "",
    allow_notify: false,
    source_wh: "",
    status: "",
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

  return {
    tableHeaders,
    typeReportsData,
    groupByData,
    initialFiltered,
    initialNotification,
    initialOrder,
  };
}