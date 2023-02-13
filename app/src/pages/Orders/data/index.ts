import { formatDecimal } from "utils";

export default function miscData() {
  const commonHeadersAttr = {
    align: "right",
    Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
  };

  const tableHeaders = [
    {
      Header: "Transaction No.",
      accessor: "transactionNo",
      ...commonHeadersAttr,
    },
    {
      Header: "Reference No.",
      accessor: "refNo",
      ...commonHeadersAttr,
    },
    {
      Header: "Status",
      accessor: "status",
      ...commonHeadersAttr,
    },
    {
      Header: "Created at",
      accessor: "createdAt",
      ...commonHeadersAttr,
    },
    {
      Header: "Last modified",
      accessor: "updatedAt",
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

  return {
    tableHeaders,
    typeReportsData,
    groupByData,
  };
}
