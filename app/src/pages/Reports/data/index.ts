import { formatDecimal } from "utils";
import { ResponseReportScheduleEntity } from "entities/reports";
import {
  INotifyDownload,
  TFiltered,
  TGroupBy,
  TGroupByKey,
  TReportType,
  TTableReports,
} from "../types";

export default function miscData() {
  const commonHeaders = [
    { Header: "Material Code", accessor: "materialCode", width: "20%", align: "left" },
    { Header: "Description", accessor: "description", align: "left" },
    { Header: "Fixed Weight", accessor: "fixedWt", align: "left" },
  ];

  const commonHeadersAttr = {
    align: "right",
    Cell: ({ value }) => (value > 0 ? formatDecimal(value, 3) : 0),
  };

  const whSnapshot = (groupBy: TGroupBy) => {
    const headers = [
      {
        Header: "Available Stocks",
        accessor: "availableQty",
        ...commonHeadersAttr,
      },
      {
        Header: "Allocated Stocks",
        accessor: "allocatedQty",
        ...commonHeadersAttr,
      },
      {
        Header: "Restricted Stocks",
        accessor: "restrictedQty",
        ...commonHeadersAttr,
      },
      {
        Header: "Total Stocks",
        accessor: "totalQty",
        ...commonHeadersAttr,
      },
    ];

    // Insert new column at specific position
    if (groupBy === "batch") {
      return [
        ...commonHeaders,
        { Header: "Batch / Lot", accessor: "batch", align: "left" },
        { Header: "Expiry date", accessor: "expiry", align: "left" },
        ...headers,
      ];
    }
    if (groupBy === "expiry") {
      return [
        ...commonHeaders,
        { Header: "Expiry date", accessor: "expiry", align: "left" },
        ...headers,
      ];
    }
    // group by material
    return [...commonHeaders, ...headers];
  };

  const aging = (groupBy: TGroupBy) => {
    if (groupBy === "expiration") {
      return [
        ...commonHeaders,
        {
          Header: "Expiring in > 120 days",
          accessor: "qty_exp_120",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in > 60 days",
          accessor: "qty_exp_60",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in > 30 days",
          accessor: "qty_exp_30",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in > 15 days",
          accessor: "qty_exp_15",
          ...commonHeadersAttr,
        },
        {
          Header: "Expiring in < 15 days",
          accessor: "qty_exp_0",
          ...commonHeadersAttr,
        },
        {
          Header: "Expired Producs",
          accessor: "qty_expired",
          ...commonHeadersAttr,
        },
        {
          Header: "Total Quantity",
          accessor: "totalQty",
          ...commonHeadersAttr,
        },
      ];
    }

    if (groupBy === "receiving") {
      return [
        ...commonHeaders,
        {
          Header: "More than 120 days",
          accessor: "qty_exp_120",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 60 days",
          accessor: "qty_exp_60",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 30 days",
          accessor: "qty_exp_30",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 15 days",
          accessor: "qty_exp_15",
          ...commonHeadersAttr,
        },
        {
          Header: "More than 1 day",
          accessor: "qty_exp_0",
          ...commonHeadersAttr,
        },
        {
          Header: "Receipts Now",
          accessor: "qty_expired",
          ...commonHeadersAttr,
        },
        {
          Header: "Total Quantity",
          accessor: "totalQty",
          ...commonHeadersAttr,
        },
      ];
    }
    // group by production
    return [];
  };

  const typeReportsData = [
    // {
    //   value: "stock-status",
    //   label: "Stock Status",
    // },
    {
      value: "wh-snapshot",
      label: "WH Snapshot",
    },
    {
      value: "aging-report",
      label: "Aging Report",
    },
  ];

  const groupByData: Record<TGroupByKey, { value: string; label: string }[]> = {
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

  const initialStateNotification: INotifyDownload = {
    key: 0,
    autoHideDuration: null,
    open: false,
    message: "",
    title: "",
    color: "primary",
  };

  const initialTableReports: TTableReports = {
    message: "",
    data: [],
    status: "idle",
  };

  const inventoryTypesOpts = [
    { value: "", label: "None" },
    { value: "Material Status", label: "Material Status" },
    { value: "WH Status-Combined", label: "WH Status-Combined" },
    { value: "WH Status-Expiry Date", label: "WH Status-Expiry Date" },
    { value: "WH Status-Receiving Date", label: "WH Status-Receiving Date" },
    { value: "WH Status-Batch", label: "WH Status-Batch" },
    { value: "WH Aging-Expiry Date", label: "WH Aging-Expiry Date" },
    { value: "WH Aging-Receiving Date", label: "WH Aging-Receiving Date" },
    { value: "Movement Report-Daily", label: "Movement Report-Daily" },
  ];

  const freqyOpts = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
  ];

  const sendingTimeOpts = () => {
    const hoursCount = 12;
    const am = [{ value: "", label: "None" }];
    const pm = [];
    let i = 1;

    while (i <= hoursCount) {
      am.push({ value: `${i} AM`, label: `${i} AM` });
      pm.push({ value: `${i} PM`, label: `${i} PM` });
      i += 1;
    }

    return am.concat(pm);
  };

  const initialFilter: TFiltered = {
    reportType: "wh-snapshot",
    groupBy: "",
    warehouse: "",
  };

  const tableHeaders: Record<TReportType, any> = {
    "wh-snapshot": whSnapshot,
    "aging-report": aging,
    "stock-status": () => [],
  };

  const initialUpdateSchedule: ResponseReportScheduleEntity = {
    message: "",
    data: null,
    status: "idle",
  };

  return {
    tableHeaders,
    typeReportsData,
    groupByData,
    initialStateNotification,
    initialTableReports,
    sendingTimeOpts,
    inventoryTypesOpts,
    freqyOpts,
    initialFilter,
    initialUpdateSchedule,
  };
}
