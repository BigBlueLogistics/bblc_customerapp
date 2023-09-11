import Card from "@mui/material/Card";
import MDIcon from "atoms/MDIcon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import ItemStatus from "../ItemStatus";
import { TStatus } from "./types";

function Status({
  inputSearchRef,
  data,
  searchData,
  onOpen,
  onChangeSearch,
  onOpenSearch,
}: TStatus) {
  const renderSearch = () => {
    if (data?.length) {
      return (
        <MDBox>
          <MDInput
            inputRef={inputSearchRef}
            placeholder="Input search"
            size="small"
            onChange={onChangeSearch}
            value={searchData}
          />
          <MDButton variant="text" iconOnly onClick={onOpenSearch}>
            <MDIcon color="info" fontSize={25} title="Search">
              search
            </MDIcon>
          </MDButton>
        </MDBox>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={2} display="inline-flex" justifyContent="space-between">
        <MDTypography variant="h6" fontWeight="medium">
          Trucks and Vans Status
        </MDTypography>

        {renderSearch()}
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {data && data.length ? (
            data.map((item) => (
              <ItemStatus
                key={item.vmrno}
                data={item}
                onOpenStatusDetails={() => onOpen(item.vmrno, "view")}
              />
            ))
          ) : (
            <MDBox component="li" display="flex" justifyContent="center" alignItems="center">
              <MDTypography variant="body2" fontWeight="light" textAlign="center">
                No data available.
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Status;
