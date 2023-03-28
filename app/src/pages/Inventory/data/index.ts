import { formatDecimal } from "utils";

export default function miscData() {
  return {
    tableHeaders: [
      { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Fixed Weight", accessor: "fixedWt", align: "left" },
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
  };
}
