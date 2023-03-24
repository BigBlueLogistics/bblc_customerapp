import { formatDecimal } from "utils";
import { IGroupBy } from "../types";

export default function miscData() {
  const commonHeaders = [
    { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
    { Header: "Description", accessor: "description", align: "left" },
    { Header: "Fixed Weight", accessor: "fixedWt", align: "left" },
    { Header: "Unit", accessor: "unit", align: "left" },
  ];

  const commonHeadersAttr = {
    align: "right",
    Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
  };

  const whSnapshot = (groupBy: IGroupBy) => {
    const headers = [
      {
        Header: "Available Stocks",
        accessor: "availableQty",
        ...commonHeadersAttr,
      },
      {
        Header: "Allocated Stocks",
        accessor: "allocatedQty",
        ...commonHeadersAttr,
      },
      {
        Header: "Restricted Stocks",
        accessor: "restrictedQty",
        ...commonHeadersAttr,
      },
      {
        Header: "Total Stocks",
        accessor: "totalQty",
        ...commonHeadersAttr,
      },
    ];

    // Insert new column at specific position
    if (groupBy === "batch") {
      return [
        ...commonHeaders,
        { Header: "Batch / Lot", accessor: "batch", align: "left" },
        ...headers,
      ];
    }
    if (groupBy === "expiry") {
      return [
        ...commonHeaders,
        { Header: "Expiry date", accessor: "expiry", align: "left" },
        ...headers,
      ];
    }
    // group by material
    return [...commonHeaders, ...headers];
  };

  const aging = (groupBy: IGroupBy) => {
    if (groupBy === "expiration") {
      return [
        ...commonHeaders,
        {
          Header: "Expiring in > 120 days",
          accessor: "qty_exp_120",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in > 60 days",
          accessor: "qty_exp_60",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in > 30 days",
          accessor: "qty_exp_30",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in > 15 days",
          accessor: "qty_exp_15",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in < 15 days",
          accessor: "qty_exp_0",
          ...commonHeadersAttr,
        },
        {
          Header: "Expired Producs",
          accessor: "qty_expired",
          ...commonHeadersAttr,
        },
        {
          Header: "Total Quantity",
          accessor: "totalQty",
          ...commonHeadersAttr,
        },
      ];
    }

    if (groupBy === "receiving") {
      return [
        ...commonHeaders,
        {
          Header: "More than 120 days",
          accessor: "qty_exp_120",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 60 days",
          accessor: "qty_exp_60",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 30 days",
          accessor: "qty_exp_30",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 15 days",
          accessor: "qty_exp_15",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 1 day",
          accessor: "qty_exp_0",
          ...commonHeadersAttr,
        },
        {
          Header: "Receipts Now",
          accessor: "qty_expired",
          ...commonHeadersAttr,
        },
        {
          Header: "Total Quantity",
          accessor: "totalQty",
          ...commonHeadersAttr,
        },
      ];
    }
    // group by production
    return [];
  };

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

  return {
    tableHeaders: {
      "wh-snapshot": whSnapshot,
      "aging-report": aging,
      "stock-status": () => [],
    },
    typeReportsData,
    groupByData,
  };
}

const { groupByData, tableHeaders } = miscData();

export type ITableHeadersKey = keyof typeof tableHeaders;
export type IGroupByKey = keyof typeof groupByData;
