export default function miscData() {
  return {
    // tableHeaders: {
    //   material: [
    //     { Header: "Materials", accessor: "matnr", width: "20%", align: "left" },
    //     { Header: "Description", accessor: "makt", align: "left" },
    //     { Header: "Putaway", accessor: "clabs", align: "right" },
    //     { Header: "Allocated", accessor: "cinsm", align: "right" },
    //     { Header: "Available", accessor: "cspem", align: "right" },
    //   ],
    //   batch: [
    //     { Header: "Materials", accessor: "matnr", width: "20%", align: "left" },
    //     { Header: "Description", accessor: "makt", align: "left" },
    //     { Header: "Batch", accessor: "charg", align: "right" },
    //     { Header: "Putaway", accessor: "clabs", align: "right" },
    //     { Header: "Allocated", accessor: "cinsm", align: "right" },
    //     { Header: "Available", accessor: "cspem", align: "right" },
    //   ],
    //   expiry: [
    //     { Header: "Materials", accessor: "matnr", width: "20%", align: "left" },
    //     { Header: "Description", accessor: "makt", align: "left" },
    //     { Header: "Expiry", accessor: "vfdat", align: "right" },
    //     { Header: "Putaway", accessor: "clabs", align: "right" },
    //     { Header: "Allocated", accessor: "cinsm", align: "right" },
    //     { Header: "Available", accessor: "cspem", align: "right" },
    //   ],
    // },
    tableHeaders: [
      { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Total Available", accessor: "totalAvailable", align: "right" },
      { Header: "Allocated Stocks", accessor: "allocatedStocks", align: "right" },
      { Header: "Blocked Stocks", accessor: "blockedStocks", align: "right" },
      { Header: "Restricted Stocks", accessor: "restrictedStocks", align: "right" },
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
