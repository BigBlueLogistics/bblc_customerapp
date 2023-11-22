import { useState, useEffect, ChangeEvent, useRef } from "react";
import Grid from "@mui/material/Grid";

import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import Status from "pages/TrucksVans/components/Status";
import Schedule from "pages/TrucksVans/components/Schedule";
import StatusDetails from "pages/TrucksVans/components/StatusDetails";
import { trucksVansServices } from "services";
import { TListStatus, TListStatusDetails, TListScheduleToday } from "pages/TrucksVans/types";
import { getValue } from "utils";
import selector from "./selector";

function TrucksVans() {
  const { customerCode } = selector();
  const [listStatus, setListStatus] = useState<TListStatus>({
    message: null,
    data: null,
    status: "idle",
  });
  const [listStatusDetails, setListStatusDetails] = useState<TListStatusDetails>({
    message: null,
    data: null,
    status: "idle",
  });
  const [listScheduleToday, setListScheduleToday] = useState<TListScheduleToday>({
    message: null,
    data: null,
    status: "idle",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [searchVMR, setSearchVMR] = useState("");
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const fetchStatus = async (customer: string) => {
    setListStatus((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: truckVansStatus } = await trucksVansServices.getStatus({
        params: { customerCode: customer },
      });

      setListStatus({
        status: "succeeded",
        data: truckVansStatus.data,
        message: truckVansStatus.message,
      });
    } catch (err) {
      setListStatus({ status: "failed", message: err, data: null });
    }
  };

  const fetchStatusDetails = async (vanMonitorNo: string, action: "search" | "view") => {
    setListStatusDetails((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: truckVansStatus } = await trucksVansServices.getStatusDetails({
        params: { vanMonitorNo, action, customerCode },
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

  const fetchScheduleToday = async (customer: string) => {
    setListScheduleToday((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: truckVansSchedule } = await trucksVansServices.getScheduleToday({
        params: { customerCode: customer },
      });

      setListScheduleToday({
        status: "succeeded",
        data: truckVansSchedule.data,
        message: truckVansSchedule.message,
      });
    } catch (err) {
      setListScheduleToday({ status: "failed", message: err, data: null });
    }
  };

  const onShowStatusDetails = (vanMonitorNo: string, action: "search" | "view") => {
    setShowDetails(true);
    fetchStatusDetails(vanMonitorNo, action);
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
      fetchStatusDetails(vmr, "search");
    } else {
      inputSearchRef.current.focus();
    }
  };

  useEffect(() => {
    if (customerCode) {
      fetchStatus(customerCode);
      fetchScheduleToday(customerCode);
    }
  }, [customerCode]);

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
              <Schedule data={listScheduleToday.data} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Status
                inputSearchRef={inputSearchRef}
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
