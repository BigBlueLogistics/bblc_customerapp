import { formatDecimal } from "utils";

export default function miscData() {
  return {
    tableHeaders: [
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
    ],
    typeReportsData: [
      {
        value: "",
        label: "--None--",
      },
      {
        value: "stock",
        label: "Stock Status",
      },
      {
        value: "wh",
        label: "WH Snapshot",
      },
      {
        value: "aging",
        label: "Aging Report",
      },
    ],
    groupByData: {
      stockWH: [
        {
          value: "",
          label: "--None--",
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
    },
  };
}
