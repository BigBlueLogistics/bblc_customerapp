/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import { INotifyDownload, TFiltered, ITableHeader, TTableMovements } from "../types";

export default function miscData() {
  const commonHeadersAttr = {
    align: "left",
    Cell: ({ value }) => value || "",
  };

  const tableHeaders = ({ onUpdateSubRow }: ITableHeader) => [
    {
      id: "expander", // Make sure it has an ID
      Header: () => null,
      Cell: ({ row, isLoading, isExpanded }) => {
        const toggleRowExpandedProps = row.getToggleRowExpandedProps();

        const onClick = async (event) => {
          if (!isLoading) {
            if (!isExpanded) {
              await onUpdateSubRow(row);
            }

            toggleRowExpandedProps.onClick(event);
          }
        };

        if (isLoading) {
          return <span>🔄</span>;
        }

        return (
          <button
            type="button"
            {...row.getToggleRowExpandedProps({
              style: {
                background: "transparent",
                border: "none",
                // paddingLeft: `${row.depth}rem`,
              },
            })}
            onClick={onClick}
          >
            {row.isExpanded ? "🔽" : "▶️"}
          </button>
        );
      },
    },
    {
      Header: "Warehouse",
      accessor: "warehouse",
      ...commonHeadersAttr,
    },
    {
      Header: "Date",
      accessor: "date",
      ...commonHeadersAttr,
    },
    {
      Header: "Material Code",
      accessor: "materialCode",
      ...commonHeadersAttr,
    },
    {
      Header: "Document No.",
      accessor: "documentNo",
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

  const subTableHeaders = [
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
  ];

  const movementType = [
    {
      value: "all",
      label: "ALL MOVEMENT",
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

  const initialFilter: TFiltered = {
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

  const initialMovements: TTableMovements = {
    message: "",
    data: [],
    status: "idle",
  };

  return {
    tableHeaders,
    subTableHeaders,
    movementType,
    initialFilter,
    initialNotification,
    initialMovements,
  };
}
