import React from "react";

export type IDataTable = {
  entriesPerPage?:
    | {
        defaultValue: number;
        entries: number[];
      }
    | boolean; // { defaultValue: number; entries: number } | [];
  canSearch?: boolean;
  showTotalEntries?: boolean;
  table: { [key: string]: any[] };
  pagination?: {
    variant: "contained" | "gradient";
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  };
  renderRowSubComponent?: ({ row }: { row: any }) => React.ReactNode;
  isSorted?: boolean;
  isLoading?: boolean;
  noEndBorder?: boolean;
};

export type IDataTableBodyCell = {
  children: React.ReactNode;
  noBorder?: boolean;
  align?: "left" | "right" | "center";
  colSpan?: number;
  rowSpan?: number;
  isLoading?: boolean;
};

export type IDataTableHeadCell = {
  width?: string | number;
  children: React.ReactNode;
  sorted?: false | "none" | "asce" | "desc";
  align?: "left" | "right" | "center";
  colSpan?: number;
  rowSpan?: number;
};
