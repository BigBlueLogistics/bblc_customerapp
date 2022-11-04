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
    ],
    groupOpts: [
      {
        value: "material",
        label: "Material Codes",
      },
      {
        value: "batch",
        label: "Batch Codes",
      },
      {
        value: "expiry",
        label: "Expiry Dates",
      },
    ],
  };
}
