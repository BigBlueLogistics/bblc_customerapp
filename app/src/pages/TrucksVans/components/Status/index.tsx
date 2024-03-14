import Card from "@mui/material/Card";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { useMaterialUIController } from "context";
import SkeletonList from "organisms/Skeleton/List";
import ItemStatus from "../ItemStatus";
import { TStatus } from "./types";
import AutoCompleteSearch from "./AutoCompleteSearch";

function Status({
  data,
  searchTerm,
  searchResult,
  onOpen,
  onInputSearch,
  onSelectSearch,
}: TStatus) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { data: viewStatus, status } = data;

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={2} display="inline-flex" justifyContent="space-between">
        <MDTypography variant="h6" fontWeight="medium">
          Trucks and Vans Status
        </MDTypography>
        <AutoCompleteSearch
          value={searchTerm}
          onInputSearch={onInputSearch}
          onSelectSearch={onSelectSearch}
          options={searchResult.data}
          isLoading={searchResult.status === "loading"}
        />
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
