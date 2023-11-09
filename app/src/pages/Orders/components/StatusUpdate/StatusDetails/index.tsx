import { Paper } from "@mui/material";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { getValue } from "utils";
import { TStatusDetails } from "../types";

function StatusDetails({ data: response }: TStatusDetails) {
  const { status, action, message, data: viewStatus } = response;

  const renderText = (
    label: string,
    value: string | number,
    defaultValue: string | number = "n/a"
  ) => {
    return (
      <MDBox
        mb={1}
        display="flex"
        alignItems={{ xs: "start", sm: "end" }}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <MDTypography component="div" variant="caption" width="50%" color="text" fontSize={13}>
          {label}
        </MDTypography>
        <MDTypography component="div" variant="caption" fontWeight="regular" fontSize={13}>
          {getValue(value, defaultValue)}
        </MDTypography>
      </MDBox>
    );
  };

  console.log("datazz", status === "succeeded" && action === "edit", response);

  return (
    <MDBox
      component={Paper}
      sx={({ palette: { grey } }) => ({
        backgroundColor: grey["200"],
        paddingY: 1,
        paddingX: 1.5,
      })}
    >
      {status === "succeeded" && action === "edit" ? (
        <>
          <MDBox mb={0.6}>
            <MDTypography
              component="div"
              variant="button"
              fontWeight="medium"
              textTransform="uppercase"
            >
              Details
            </MDTypography>
          </MDBox>

          {renderText("Customer:", viewStatus?.info?.customerCode)}
          {renderText(
            "Date created:",
            `${viewStatus?.info?.createdDate || "n/a"} ${viewStatus?.info?.createdTime || ""}`
          )}
          {renderText("Created by:", viewStatus?.info?.createdBy)}
          {renderText("Customer reference:", viewStatus?.info?.requestNum)}
          {renderText(
            "Total weight:",
            viewStatus?.info?.totalWeight ? `${viewStatus?.info?.totalWeight} KG` : null
          )}
          {renderText("SO number:", viewStatus?.info?.soNum)}
          {renderText("Status:", viewStatus?.status)}
          {renderText("Warehouse:", viewStatus?.info?.warehouse?.replace("W", "WH"))}
          <MDBox mb={0.6}>
            <MDTypography component="div" variant="caption" color="text" fontSize={13}>
              Remarks:
            </MDTypography>
            <MDTypography component="div" variant="caption" fontWeight="regular" fontSize={13}>
              {getValue(viewStatus?.remarks, "n/a")}
            </MDTypography>
          </MDBox>
        </>
      ) : (
        <MDTypography component="div" variant="caption" fontWeight="light" textAlign="center">
          {status === "failed" ? message : "No data available."}
        </MDTypography>
      )}
    </MDBox>
  );
}

export default StatusDetails;
