export default function miscData() {
  return {
    tableHeaders: {
      material: [
        { Header: "Materials", accessor: "matnr", width: "20%", align: "left" },
        { Header: "Description", accessor: "makt", align: "left" },
        { Header: "Putaway", accessor: "clabs", align: "right" },
        { Header: "Allocated", accessor: "cinsm", align: "right" },
        { Header: "Available", accessor: "cspem", align: "right" },
      ],
      batch: [
        { Header: "Materials", accessor: "matnr", width: "20%", align: "left" },
        { Header: "Description", accessor: "makt", align: "left" },
        { Header: "Batch", accessor: "charg", align: "right" },
        { Header: "Putaway", accessor: "clabs", align: "right" },
        { Header: "Allocated", accessor: "cinsm", align: "right" },
        { Header: "Available", accessor: "cspem", align: "right" },
      ],
      expiry: [
        { Header: "Materials", accessor: "matnr", width: "20%", align: "left" },
        { Header: "Description", accessor: "makt", align: "left" },
        { Header: "Expiry", accessor: "vfdat", align: "right" },
        { Header: "Putaway", accessor: "clabs", align: "right" },
        { Header: "Allocated", accessor: "cinsm", align: "right" },
        { Header: "Available", accessor: "cspem", align: "right" },
      ],
    },
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
