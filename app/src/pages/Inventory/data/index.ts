export default function miscData() {
  return {
    tableHeaders: [
      { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Total Available", accessor: "availableWt", align: "right" },
      { Header: "Allocated Stocks", accessor: "allocatedWt", align: "right" },
      { Header: "Blocked Stocks", accessor: "blockedWt", align: "right" },
      { Header: "Restricted Stocks", accessor: "restrictedWt", align: "right" },
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
