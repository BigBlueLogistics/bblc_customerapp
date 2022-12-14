import { formatDecimal } from "utils";
import { IGroupBy } from "../types";

export default function miscData() {
  const whSnapshot = (groupBy: IGroupBy) => {
    const headers = [
      { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Fixed Weight", accessor: "fixedWt", align: "left" },
      { Header: "Unit", accessor: "unit", align: "left" },
      {
        Header: "Available Stocks",
        accessor: "availableQty",
        align: "right",
        Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
      },
      {
        Header: "Allocated Stocks",
        accessor: "allocatedQty",
        align: "right",
        Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
      },
      {
        Header: "Restricted Stocks",
        accessor: "restrictedQty",
        align: "right",
        Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
      },
      {
        Header: "Total Stocks",
        accessor: "totalQty",
        align: "right",
        Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
      },
    ];

    // Insert new column at specific index position
    if (groupBy === "batch") {
      headers.splice(4, 0, { Header: "Batch / Lot", accessor: "batch", align: "left" });
    }
    if (groupBy === "expiry") {
      headers.splice(4, 0, { Header: "Expiry date", accessor: "expiry", align: "left" });
    }

    return headers;
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
      whSnapshot,
    },
    typeReportsData,
    groupByData,
  };
}
