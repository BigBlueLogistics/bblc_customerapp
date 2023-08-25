import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";

import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import Status from "pages/TrucksVans/components/Status";
import Schedule from "pages/TrucksVans/components/Schedule";
import StatusDetails from "pages/TrucksVans/components/StatusDetails";
import { trucksVansServies } from "services";
import { IListStatus, IListStatusDetails } from "pages/TrucksVans/types";
import { getValue } from "utils";

function TrucksVans() {
  const [listStatus, setListStatus] = useState<IListStatus>({
    message: null,
    data: null,
    status: "idle",
  });
  const [listStatusDetails, setListStatusDetails] = useState<IListStatusDetails>({
    message: null,
    data: null,
    status: "idle",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [searchVMR, setSearchVMR] = useState("");

  const fetchStatus = async () => {
    setListStatus((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: truckVansStatus } = await trucksVansServies.getStatus();

      setListStatus({
        status: "succeeded",
        data: truckVansStatus.data,
        message: truckVansStatus.message,
      });
    } catch (err) {
      setListStatus({ status: "failed", message: err, data: null });
    }
  };

  const fetchStatusDetails = async (vanMonitorNo: string) => {
    setListStatusDetails((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: truckVansStatus } = await trucksVansServies.getStatusDetails({
        params: { vanMonitorNo },
      });

      setListStatusDetails({
        status: "succeeded",
        data: truckVansStatus.data,
        message: truckVansStatus.message,
      });
    } catch (err) {
      setListStatusDetails({ status: "failed", message: err, data: null });
    }
  };

  const onShowStatusDetails = (vanMonitorNo: string) => {
    setShowDetails(true);
    fetchStatusDetails(vanMonitorNo);
  };

  const onCloseStatusDetails = () => {
    setShowDetails(false);
  };

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVMR(e.target.value);
  };

  const onOpenSearch = () => {
    const vmr = getValue(searchVMR);
    if (vmr) {
      setShowDetails(true);
      fetchStatusDetails(vmr);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <StatusDetails
        open={showDetails}
        data={listStatusDetails.data}
        onClose={onCloseStatusDetails}
        loadingStatus={listStatusDetails.status}
      />
      <MDBox pt={6}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Schedule />
            </Grid>
            <Grid item xs={12} md={6}>
              <Status
                data={listStatus.data}
                searchData={searchVMR}
                onOpen={onShowStatusDetails}
                onChangeSearch={onChangeSearch}
                onOpenSearch={onOpenSearch}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TrucksVans;