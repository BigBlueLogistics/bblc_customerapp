export default function miscData() {
  const commonHeadersAttr = {
    align: "right",
    Cell: ({ value }) => value || "",
  };

  const tableHeaders = [
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
    },
    {
      Header: "Created at",
      Cell: ({ row }) => `${row.original.created_date} ${row.original.created_time}`,
    },
    {
      Header: "Last modified",
      accessor: "updated_at",
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
