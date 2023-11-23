import Card from "@mui/material/Card";
import MDIcon from "atoms/MDIcon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import { useMaterialUIController } from "context";
import SkeletonList from "organisms/Skeleton/List";
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
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { data: viewStatus, status } = data;

  const renderSearch = () => {
    if (viewStatus?.length) {
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
        {status === "loading" ? (
          <SkeletonList darkMode={darkMode} noOfItems={5} width="100%" height="98px" />
        ) : (
          <ItemStatus data={viewStatus} darkMode={darkMode} onOpenStatusDetails={onOpen} />
        )}
      </MDBox>
    </Card>
  );
}

export default Status;
