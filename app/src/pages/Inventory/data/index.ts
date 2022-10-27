import { formatDecimal } from "utils";

export default function miscData() {
  return {
    tableHeaders: [
      { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
      { Header: "Description", accessor: "description", align: "left" },
      {
        Header: "Total Available",
        accessor: "availableWt",
        align: "right",
        Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
      },
      {
        Header: "Allocated Stocks",
        accessor: "allocatedWt",
        align: "right",
        Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
      },
      {
        Header: "Blocked Stocks",
        accessor: "blockedWt",
        align: "right",
        Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
      },
      {
        Header: "Restricted Stocks",
        accessor: "restrictedWt",
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
