import { INotifyOrder, IOrderData, IFiltered } from "../types";

export default function miscData() {
  const commonHeadersAttr = {
    align: "left",
    Cell: ({ value }) => value || "",
  };

  const tableHeaders = () => [
    {
      Header: "Description",
      accessor: "description",
      ...commonHeadersAttr,
    },
    {
      Header: "Batch",
      accessor: "batch",
      ...commonHeadersAttr,
      align: "center",
    },
    {
      Header: "Expiration",
      accessor: "expiration",
      align: "left",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      ...commonHeadersAttr,
    },
    {
      Header: "Unit",
      accessor: "unit",
      ...commonHeadersAttr,
    },
    {
      Header: "Weight",
      accessor: "weight",
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

  const movementType = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "inbound",
      label: "Inbound",
    },
    {
      value: "outbound",
      label: "Outbound",
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

  const initialFiltered: IFiltered = {
    warehouseNo: "",
    type: "",
    materialCode: null,
    coverageDate: null,
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
    movementType,
    groupByData,
    initialFiltered,
    initialNotification,
    initialOrder,
  };
}
