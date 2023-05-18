import { INotifyDownload, IFiltered } from "../types";

export default function miscData() {
  const commonHeadersAttr = {
    align: "left",
    Cell: ({ value }) => value || "",
  };

  const tableHeaders = () => [
    {
      Header: "Date",
      accessor: "date",
      ...commonHeadersAttr,
    },
    {
      Header: "Document No.",
      accessor: "documentNo",
      ...commonHeadersAttr,
    },
    {
      Header: "Reference",
      accessor: "reference",
      ...commonHeadersAttr,
    },
    {
      Header: "Header text",
      accessor: "headerText",
      ...commonHeadersAttr,
    },
    {
      Header: "Type",
      accessor: "movementType",
      ...commonHeadersAttr,
    },
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

  const initialFiltered: IFiltered = {
    warehouseNo: "",
    type: "",
    materialCode: null,
    coverageDate: null,
    status: "",
    createdAt: null,
    lastModified: null,
  };

  const initialNotification: INotifyDownload = {
    key: 0,
    open: false,
    message: "",
    title: "",
    color: "primary",
    autoHideDuration: null,
  };

  return {
    tableHeaders,
    movementType,
    initialFiltered,
    initialNotification,
  };
}
