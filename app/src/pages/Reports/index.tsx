import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormikHelpers } from "formik";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDSnackbar from "atoms/MDSnackbar";
import MDateRangePicker from "atoms/MDateRangePicker";
import MDButton from "atoms/MDButton";
import Icon from "@mui/material/Icon";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useDownloadFile, useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";

import MDImageIcon from "atoms/MDImageIcon";
import excel from "assets/images/icons/excel.png";
import miscData, { ITableHeadersKey, IGroupByKey } from "pages/Reports/data";
import { reportServices, inventoryServices } from "services";
import { AxiosError } from "axios";
import { ResponseReportScheduleEntity } from "entities/reports";
import selector from "./selector";
import { INotifyDownload, TGroupBy, TTableReports } from "./types";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import ModalSchedule from "./components/ModalSchedule";
import { TMenuAction } from "./components/MenuAction/types";
import { TPropsUpdateSchedule } from "./components/ModalSchedule/type";

function Reports() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const {
    tableHeaders,
    typeReportsData,
    groupByData,
    initialStateNotification,
    initialTableReports,
  } = miscData();
  const [showNotifyDownload, setShowNotifyDownload] =
    useState<INotifyDownload>(initialStateNotification);
  const [selectedReport, setSelectedReport] = useState<ITableHeadersKey>("wh-snapshot");
  const [selectedGroupBy, setSelectedGroupBy] = useState<TGroupBy>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [, setDateRange] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [groupByKey, setGroupByKey] = useState<IGroupByKey>("stock");
  const [action, setAction] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);

  const [tableReports, setTableReports] = useState<TTableReports>(initialTableReports);
  const [error, setError] = useState<AxiosError | null>(null);
  const [updateSchedule, setUpdateSchedule] = useState<ResponseReportScheduleEntity>({
    message: "",
    data: null,
    status: "idle",
  });

  const {
    downloadFile,
    status: downloadStatus,
    error: downloadError,
    filename,
  } = useDownloadFile();
  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotifyDownload = ({
    key,
    open,
    message,
    title,
    color,
    autoHideDuration,
  }: INotifyDownload) => {
    setShowNotifyDownload({ key, open, message, title, color, autoHideDuration });
  };
  const closeNotifyDownload = () => {
    setShowNotifyDownload((prevState) => ({ ...prevState, open: false }));
  };

  const onChangeReport = (e: ChangeEvent<HTMLInputElement>) => {
    const data = e.target.value as keyof typeof tableHeaders;
    const key = ["stock-status", "wh-snapshot"].includes(data) ? "stock" : "aging";
    setSelectedReport(data);
    setGroupByKey(key);
  };

  const onChangeGroupBy = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedGroupBy(e.target.value as TGroupBy);
  };

  const onChangeWarehouse = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedWarehouse(e.target.value);
  };

  const onChangeDateRange = (dates) => {
    setDateRange(dates);
  };

  const onToggleFilter = () => {
    setToggleFilter((prevState) => !prevState);
  };

  const fetchReports = async () => {
    setTableReports((prev) => ({ ...prev, status: "loading" }));

    try {
      const tableBody = {
        customer_code: customerCode,
        warehouse: selectedWarehouse,
        group_by: selectedGroupBy,
        report_type: selectedReport,
      };

      const { data: rows } = await reportServices.getReports({ params: tableBody });
      setTableReports({
        status: "succeeded",
        data: rows.data,
        message: rows.data.message,
      });
    } catch (err) {
      setTableReports({ status: "failed", message: err.message, data: [] });
    }
  };

  const fetchWarehouseList = async () => {
    try {
      const { data: rows } = await inventoryServices.getWarehouseList();

      setWarehouseList(rows.data);
    } catch (err) {
      setError(err);
    }
  };

  const exportFile = (format: "xlsx" | "csv") => {
    const data = {
      customer_code: customerCode,
      warehouse: selectedWarehouse,
      group_by: selectedGroupBy,
      report_type: selectedReport,
      format,
    };

    const fileName =
      `${selectedReport}-${customerCode}-${selectedGroupBy}-${selectedWarehouse}`.toUpperCase();
    downloadFile({
      url: "/reports/export-excel",
      filename: `${fileName}.${format}`,
      data,
    });
    closeAction();
  };

  const onRefresh = () => {
    fetchReports();
    closeAction();
  };

  const onFilter = () => {
    fetchReports();
  };

  const onClear = () => {
    setSelectedReport("wh-snapshot");
    setSelectedWarehouse("");
    setSelectedGroupBy("");
    setTableReports(initialTableReports);
  };

  const onShowSchedule = () => {
    setShowSchedule(true);
  };

  const onCloseSchedule = () => {
    setUpdateSchedule({
      message: "",
      data: null,
      status: "idle",
    });
    setShowSchedule(false);
  };

  const onUpdateSchedule = async (
    props: TPropsUpdateSchedule,
    resetForm: FormikHelpers<TPropsUpdateSchedule>["resetForm"]
  ) => {
    setUpdateSchedule((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await reportServices.updateSchedule({
        customer_code: customerCode,
        ...props,
      });
      setUpdateSchedule({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
      resetForm();
    } catch (err) {
      setUpdateSchedule({ status: "failed", message: err.message, data: null });
    }
  };

  useEffect(() => {
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    if (error?.response?.statusText === "Unauthorized" && error?.response?.status === 401) {
      dispatch(setIsAuthenticated(false));
    }
  }, [error, dispatch]);

  useEffect(() => {
    const { message } = downloadError || {};
    let notificationMsg = initialStateNotification;

    if (!message && downloadStatus === "loading") {
      notificationMsg = {
        key: 1,
        open: true,
        message: `Please wait exporting file [${filename}]`,
        title: "Exporting File",
        color: "info",
        autoHideDuration: null,
      };
    }
    if (!message && downloadStatus === "success") {
      notificationMsg = {
        key: 2,
        open: true,
        message: `You can now open [${filename}]`,
        title: "Export file complete!",
        color: "success",
        autoHideDuration: 5000,
      };
    }
    if (message && downloadStatus === "failed") {
      notificationMsg = {
        key: 3,
        open: true,
        message,
        title: "Failed to export file",
        color: "error",
        autoHideDuration: 5000,
      };
    }
    openNotifyDownload(notificationMsg);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadError, downloadStatus]);

  const menuItemsAction: TMenuAction["items"] = [
    {
      icon: (
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
          refresh
        </Icon>
      ),
      label: "Refresh",
      onClick: onRefresh,
    },
    {
      icon: (
        <Icon sx={{ cursor: "pointer" }} fontSize="small">
          schedule_send
        </Icon>
      ),
      label: "Schedule Auto-sending",
      onClick: onShowSchedule,
    },
    {
      icon: <MDImageIcon src={excel} alt="export-excel-icon" width={18} height={18} />,
      label: "Export as XLS file",
      onClick: () => exportFile("xlsx"),
    },
    {
      icon: (
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
          description
        </Icon>
      ),
      label: "Export as CSV file",
      onClick: () => exportFile("csv"),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {tableReports.status === "failed" && (
        <MDTypography variant="body2">{tableReports.message}</MDTypography>
      )}

      <ModalSchedule
        data={updateSchedule}
        open={showSchedule}
        onClose={onCloseSchedule}
        onUpdateSchedule={onUpdateSchedule}
      />
      <MDSnackbar
        key={showNotifyDownload.key}
        color={showNotifyDownload.color}
        icon="info"
        title={showNotifyDownload.title}
        content={showNotifyDownload.message}
        dateTime="now"
        open={showNotifyDownload.open}
        close={closeNotifyDownload}
        autoHideDuration={showNotifyDownload.autoHideDuration}
      />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={2.5}
                px={1.5}
                display="flex"
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                borderTop="2px solid #dadcde"
              >
                <MDTypography ml={3} variant="h4" color="light" textTransform="uppercase">
                  Report Details
                </MDTypography>

                <MDBox my="auto" marginLeft="auto">
                  <ActionIcon
                    title={toggleFilter ? "close filter" : "open filter"}
                    onClick={onToggleFilter}
                  >
                    {toggleFilter ? "search_off" : "search"}
                  </ActionIcon>
                  <ActionIcon title="actions" onClick={openAction}>
                    more_vert
                  </ActionIcon>
                  <MenuAction anchorEl={action} onClose={closeAction} items={menuItemsAction} />
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <MDBox
                  sx={({ palette: { grey } }) => ({
                    display: toggleFilter ? "block" : "none",
                    backgroundColor: grey[200],
                    borderTop: `2px solid ${grey[400]}`,
                    width: "100%",
                    overflowX: "auto",
                  })}
                >
                  <MDBox
                    sx={({ breakpoints }) => ({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      padding: "10px",
                      [breakpoints.down("md")]: {
                        justifyContent: "space-between",
                      },
                    })}
                  >
                    <MDSelect
                      label="Type of Reports"
                      variant="outlined"
                      onChange={onChangeReport}
                      options={typeReportsData}
                      value={selectedReport}
                      showArrowIcon
                    />

                    <MDSelect
                      label="Warehouse"
                      variant="outlined"
                      onChange={onChangeWarehouse}
                      options={warehouseList}
                      value={selectedWarehouse}
                      showArrowIcon
                      optKeyValue="PLANT"
                      optKeyLabel="NAME1"
                    />

                    <MDSelect
                      label="Group by"
                      variant="outlined"
                      onChange={onChangeGroupBy}
                      options={groupByData[groupByKey]}
                      value={selectedGroupBy as number | string}
                      showArrowIcon
                    />

                    <MDBox margin="8px">
                      <MDateRangePicker
                        label="Dates.."
                        onChange={onChangeDateRange}
                        disabled={selectedReport !== "stock-status"}
                        containerStyle={{
                          cursor: selectedReport !== "stock-status" ? "not-allowed" : "default",
                        }}
                      />
                    </MDBox>

                    <MDButton
                      disabled={tableReports.status === "loading"}
                      sx={{ margin: "8px" }}
                      size="small"
                      variant="gradient"
                      color="info"
                      onClick={onFilter}
                    >
                      Filter
                    </MDButton>
                    <MDButton
                      disabled={tableReports.status === "loading"}
                      sx={{ margin: "8px" }}
                      size="small"
                      variant="gradient"
                      color="warning"
                      onClick={onClear}
                    >
                      clear
                    </MDButton>
                  </MDBox>
                </MDBox>
                <DataTable
                  table={{
                    columns: tableHeaders[selectedReport](selectedGroupBy),
                    rows: tableReports.data,
                  }}
                  isSorted={false}
                  isLoading={tableReports.status === "loading"}
                  entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
                  showTotalEntries
                  noEndBorder
                  canSearch
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Reports;
