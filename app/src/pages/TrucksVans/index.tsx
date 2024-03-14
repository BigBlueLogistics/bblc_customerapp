import { useState, useEffect, ChangeEvent, useDeferredValue } from "react";
import Grid from "@mui/material/Grid";
import { FormikHelpers } from "formik";

import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import { trucksVansServices } from "services";
import { getValue } from "utils";
import Status from "./components/Status";
import Schedule from "./components/Schedule";
import ModalStatusDetails from "./components/ModalStatusDetails";
import ModalMaintainNotices from "./components/ModalMaintainNotices";
import {
  TListStatus,
  TListStatusDetails,
  TListScheduleToday,
  TNotices,
  TSearchTrucksVans,
} from "./types";
import selector from "./selector";
import miscData from "./data";
import { TValidationNotices } from "./components/ModalMaintainNotices/validationSchema";
import { IAutoCompleteSearchData } from "./components/Status/AutoCompleteSearch/types";

function TrucksVans() {
  const { customerCode } = selector();
  const { initialNotices, initialSearchResult } = miscData();
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
  const [searchResult, setSearchResult] = useState<TSearchTrucksVans>(initialSearchResult);
  const [searchVMR, setSearchVMR] = useState("");
  const [notices, setNotices] = useState<TNotices>(initialNotices);
  const [showDetails, setShowDetails] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const deferredSearchVMR = useDeferredValue(searchVMR);

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
      setListStatus({ status: "failed", message: err?.message, data: null });
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
    } catch (err: any) {
      setListStatusDetails({ status: "failed", message: err?.message, data: null });
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
      setListScheduleToday({ status: "failed", message: err?.message, data: null });
    }
  };

  const onShowStatusDetails = (vanMonitorNo: string, action: "search" | "view") => {
    setShowDetails(true);
    fetchStatusDetails(vanMonitorNo, action);
  };

  const onCloseStatusDetails = () => {
    setShowDetails(false);
  };

  const onInputSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVMR(e?.target.value);
  };

  const onSelectSearch = (value: IAutoCompleteSearchData) => {
    const vmr = getValue(value?.vmrno);
    if (vmr) {
      // Fill the input from selected
      setSearchVMR(vmr);
      setShowDetails(true);
      fetchStatusDetails(vmr, "search");
    }
  };

  const onShowNotices = () => {
    setShowNotices(true);
  };

  const onCloseNotices = () => {
    setShowNotices(false);
    setNotices(initialNotices);
  };

  const onCreateNotices = async (
    data: TValidationNotices,
    formikHelper: FormikHelpers<TValidationNotices>
  ) => {
    setNotices((prev) => ({ ...prev, status: "loading", type: "create" }));

    try {
      const { data: noticesData } = await trucksVansServices.createNotices({
        customerCode,
        ...data,
      });

      setNotices((prev) => ({
        ...prev,
        status: "succeeded",
        data: noticesData.data,
        message: noticesData.message,
      }));
      formikHelper.resetForm();
    } catch (err) {
      setNotices((prev) => ({ ...prev, status: "failed", message: err?.message, data: null }));
      formikHelper.setSubmitting(false);
    }
  };

  const onDeleteNotices = async (
    data: TValidationNotices,
    formikHelper: FormikHelpers<TValidationNotices>
  ) => {
    setNotices((prev) => ({ ...prev, status: "loading", type: "delete" }));

    try {
      const { data: noticesData } = await trucksVansServices.deleteNotices({
        params: {
          customerCode,
          phoneNum: data.phoneNum,
        },
      });

      setNotices((prev) => ({
        ...prev,
        status: "succeeded",
        data: noticesData.data,
        message: noticesData.message,
      }));
      formikHelper.resetForm();
    } catch (err) {
      setNotices((prev) => ({ ...prev, status: "failed", message: err?.message, data: null }));
      formikHelper.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (customerCode) {
      fetchScheduleToday(customerCode);
      fetchStatus(customerCode);
      setSearchVMR("");
    }
  }, [customerCode]);

  useEffect(() => {
    async function fetchSearch(searchTerm: string) {
      setSearchResult((prev) => ({ ...prev, status: "loading" }));
      try {
        const { data: searchedData } = await trucksVansServices.searchTrucksVans({
          params: { customerCode, searchTerm },
        });

        setSearchResult({
          status: "succeeded",
          data: searchedData.data,
          message: searchedData.message,
        });
      } catch (err) {
        setSearchResult({ status: "failed", message: err?.message, data: null });
      }
    }

    if (deferredSearchVMR) {
      fetchSearch(deferredSearchVMR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearchVMR]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalStatusDetails
        open={showDetails}
        data={listStatusDetails.data}
        onClose={onCloseStatusDetails}
        loadingStatus={listStatusDetails.status}
      />
      <ModalMaintainNotices
        data={notices}
        open={showNotices}
        onClose={onCloseNotices}
        onCreateNotices={onCreateNotices}
        onDeleteNotices={onDeleteNotices}
      />
      <MDBox pt={6}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <MDButton type="button" color="info" variant="gradient" onClick={onShowNotices}>
                Maintain Notices Recipients
              </MDButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <Schedule data={listScheduleToday} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Status
                data={listStatus}
                searchTerm={searchVMR}
                onOpen={onShowStatusDetails}
                onInputSearch={onInputSearch}
                onSelectSearch={onSelectSearch}
                searchResult={searchResult}
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
