import { Paper } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import selector from "pages/Orders/selector";
import { getValue } from "utils";
import { TStatusDetails } from "../types";

function StatusDetails({ data }: TStatusDetails) {
  const { customerCode } = selector();
  const { data: viewStatus, status, action } = data;

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

  const isEditSuccess = status === "succeeded" && action === "edit";
  const isCustomerMatch =
    viewStatus?.bininfo?.at(0).KUNAG.toLowerCase() === (customerCode as string).toLowerCase();
  const isStatusPosted = viewStatus?.status.toLowerCase().includes("posted");

  return (
    <MDBox
      component={Paper}
      sx={({ palette: { grey } }) => ({
        backgroundColor: grey["200"],
        paddingY: 1,
        paddingX: 1.5,
      })}
    >
      {isEditSuccess && isCustomerMatch && !isStatusPosted ? (
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

          {renderText("Customer:", viewStatus?.bininfo?.at(0).KUNAG)}
          {renderText(
            "Date created:",
            `${viewStatus?.bininfo?.at(0)?.ERDAT || "n/a"} ${
              viewStatus?.bininfo?.at(0)?.ERZET || ""
            }`
          )}
          {renderText("Created by:", viewStatus?.bininfo?.at(0).ERNAM)}
          {renderText("Customer reference:", viewStatus?.bininfo?.at(0).BSTNK)}
          {renderText(
            "Total weight:",
            viewStatus?.bininfo?.at(0).BTGEW ? `${viewStatus?.bininfo?.at(0).BTGEW} KG` : null
          )}
          {renderText("SO number:", viewStatus?.bininfo?.at(0).SONUM)}
          {renderText("Status:", viewStatus?.status)}
          {renderText("Warehouse:", viewStatus?.bininfo?.at(0).LGNUM?.replace("W", "WH"))}
          <MDBox mb={0.6}>
            <MDTypography component="div" variant="caption" color="text" fontSize={13}>
              Remarks:
            </MDTypography>
            <MDTypography component="div" variant="caption" fontWeight="regular" fontSize={13}>
              {getValue(viewStatus?.header, "n/a")}
            </MDTypography>
          </MDBox>
        </>
      ) : (
        <MDTypography component="div" variant="caption" fontWeight="light" textAlign="center">
          {!isEditSuccess || !isCustomerMatch ? (
            "No data available."
          ) : (
            <MDBox display="flex" justifyContent="center" alignItems="center">
              <CheckCircle color="success" sx={{ marginRight: 0.5 }} />
              <span>Request completed, no further action needed</span>
            </MDBox>
          )}
        </MDTypography>
      )}
    </MDBox>
  );
}

export default StatusDetails;
