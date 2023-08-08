import { useState, useEffect, ChangeEvent } from "react";
import { Grid, Card, Icon } from "@mui/material";
import { addMonths } from "date-fns";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDSnackbar from "atoms/MDSnackbar";
import MDateRangePicker from "atoms/MDateRangePicker";
import MDButton from "atoms/MDButton";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useAppDispatch, useDownloadFile } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";

import { inventoryServices, movementServices } from "services";
import { AxiosError } from "axios";
import MDImageIcon from "atoms/MDImageIcon";
import excel from "assets/images/icons/excel.png";
import miscData from "./data";
import selector from "./selector";
import { INotifyDownload, ITableOrder, IFiltered } from "./types";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import AutoCompleteMaterial from "./components/AutoCompleteMaterial";
import { IAutoCompleteMaterialData } from "./components/AutoCompleteMaterial/types";
import { IMenuAction } from "./components/MenuAction/types";

function Movements() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const { tableHeaders, initialFiltered, initialNotification, movementType } = miscData();
  const [showNotifyDownload, setShowNotifyDownload] =
    useState<INotifyDownload>(initialNotification);

  const [warehouseList, setWarehouseList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [action, setAction] = useState(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [filtered, setFiltered] = useState<IFiltered>(initialFiltered);

  const {
    downloadFile,
    status: downloadStatus,
    error: downloadError,
    filename,
  } = useDownloadFile();

  const [tableOrders, setTableOrders] = useState<ITableOrder>({
    message: "",
    data: [],
    status: "idle",
  });

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

  const onMovementType = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltered((prev) => ({ ...prev, type: e.target.value }));
  };

  const onWarehouse = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltered((prev) => ({ ...prev, warehouseNo: e.target.value }));
  };

  const onMaterial = (value: IAutoCompleteMaterialData) => {
    const materialCode = value?.material || null;
    setFiltered((prev) => ({ ...prev, materialCode }));
  };

  const onCoverageDate = (date: [Date, Date]) => {
    // const from = date[0] && format(date[0], "yyyy/MM/dd");
    // const to = date[1] && format(date[1], "yyyy/MM/dd");
    // const coverageDate = [from, to] as [string, string];

    setFiltered((prev) => ({ ...prev, coverageDate: date }));
  };

  const onToggleFilter = () => {
    setToggleFilter((prevState) => !prevState);
  };

  const fetchMovement = async ({ warehouseNo, type, materialCode, coverageDate }: IFiltered) => {
    setTableOrders((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await movementServices.getMovements({
        params: {
          material_code: materialCode,
          movement_type: type,
          warehouse_no: warehouseNo,
          coverage_date: coverageDate,
        },
      });
      setTableOrders({
        status: "succeeded",
        data: rows.data,
        message: rows.data.message,
      });
    } catch (err) {
      setTableOrders({ status: "failed", message: err.message, data: [] });
    }
  };

  const fetchWarehouseList = async () => {
    try {
      const { data: rows } = await inventoryServices.getWarehouseList();

      setWarehouseList([{ PLANT: "ALL", NAME1: "ALL" }, ...rows.data]);
    } catch (err) {
      setError(err);
    }
  };

  const fetchMaterialDescription = async (ccode: string) => {
    try {
      const { data: resp } = await movementServices.getMaterialDescription({
        params: { customer_code: ccode },
      });
      if (resp) {
        const id = resp.data.length + 1 || 1;
        setMaterialList([{ id, material: "ALL", description: "" }, ...resp.data]);
      }
    } catch (err) {
      setError(err);
    }
  };

  const onRefresh = () => {
    fetchMovement(filtered);
    closeAction();
  };

  const onFilter = () => {
    fetchMovement(filtered);
  };

  const onClear = () => {
    setFiltered((prev) => ({ ...initialFiltered, coverageDate: prev.coverageDate }));

    setTableOrders({
      message: "",
      data: [],
      status: "idle",
    });
  };

  const exportFile = (format: "xlsx" | "csv") => {
    const { warehouseNo, type, materialCode, coverageDate } = filtered;
    const data = {
      customer_code: customerCode,
      movement_type: type,
      warehouse_no: warehouseNo,
      material_code: materialCode,
      coverage_date: coverageDate,
      format,
    };

    const fileName = `MOVEMENTS-${customerCode}-${warehouseNo}.${format}`;
    downloadFile({
      url: "/movements/export-excel",
      filename: fileName,
      data,
    });
    closeAction();
  };

  useEffect(() => {
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    if (customerCode) {
      fetchMaterialDescription(customerCode);
    }
  }, [customerCode]);

  useEffect(() => {
    if (error?.response?.statusText === "Unauthorized" && error?.response?.status === 401) {
      dispatch(setIsAuthenticated(false));
    }
  }, [error, dispatch]);

  useEffect(() => {
    const { message } = downloadError || {};
    let notificationMsg = initialNotification;

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

  const menuItemsAction: IMenuAction["items"] = [
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

      {tableOrders.status === "failed" && (
        <MDTypography variant="body2">{tableOrders.message}</MDTypography>
      )}

      <MDSnackbar
        key={showNotifyDownload.key}
        color={showNotifyDownload.color}
        icon="info"
        title={showNotifyDownload.title}
        content={showNotifyDownload.message}
        dateTime="now"
        open={showNotifyDownload.open}
        autoHideDuration={showNotifyDownload.autoHideDuration}
        close={closeNotifyDownload}
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
                  Movements Details
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
                  sx={({ palette: { grey, searchFilter } }) => ({
                    display: toggleFilter ? "block" : "none",
                    backgroundColor: searchFilter.container.default,
                    borderTop: `2px solid ${grey[400]}`,
                    width: "100%",
                    overflowX: "auto",
                  })}
                >
                  <MDBox
                    sx={({ breakpoints }) => ({
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "start",
                      padding: "10px",
                      [breakpoints.down("md")]: {
                        justifyContent: "space-between",
                      },
                    })}
                  >
                    <MDSelect
                      label="Warehouse"
                      variant="outlined"
                      onChange={onWarehouse}
                      options={warehouseList}
                      value={filtered.warehouseNo}
                      showArrowIcon
                      itemStyle={{
                        textTransform: "uppercase",
                      }}
                      sx={({ palette }) => ({
                        "& .MuiInputBase-root": {
                          backgroundColor: `${palette.searchFilter.input.main} !important`,
                        },
                      })}
                      optKeyValue="PLANT"
                      optKeyLabel="NAME1"
                    />

                    <MDSelect
                      label="Movement Type"
                      variant="outlined"
                      onChange={onMovementType}
                      options={movementType}
                      value={filtered.type}
                      showArrowIcon
                      itemStyle={{
                        textTransform: "uppercase",
                      }}
                      sx={({ palette }) => ({
                        "& .MuiInputBase-root": {
                          backgroundColor: `${palette.searchFilter.input.main} !important`,
                        },
                      })}
                    />

                    <AutoCompleteMaterial
                      options={materialList}
                      value={filtered.materialCode}
                      onChange={onMaterial}
                      sx={{ minWidth: "300px" }}
                    />

                    <MDBox margin="8px">
                      <MDateRangePicker
                        label="Coverage Date"
                        onChange={onCoverageDate}
                        buttonStyle={({ palette }) => ({
                          backgroundColor: `${palette.searchFilter.input.main} !important`,
                        })}
                        maxDate={
                          filtered.coverageDate && filtered.coverageDate[0] != null
                            ? addMonths(new Date(filtered.coverageDate[0]), 3)
                            : null
                        } /* up to 3 months can select */

                        // value={
                        //   filtered.coverageDate &&
                        //   filtered.coverageDate.some((value) => value != null)
                        //     ? filtered.coverageDate.join(" - ")
                        //     : ""
                        // }
                      />
                    </MDBox>

                    <MDButton
                      sx={{ margin: "8px" }}
                      size="small"
                      variant="gradient"
                      color="info"
                      onClick={onFilter}
                    >
                      Filter
                    </MDButton>
                    <MDButton
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
                    columns: tableHeaders(),
                    rows: tableOrders.data,
                  }}
                  isSorted={false}
                  isLoading={tableOrders.status === "loading"}
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

export default Movements;
