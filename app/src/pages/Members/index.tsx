/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSnackbar from "atoms/MDSnackbar";
import Icon from "@mui/material/Icon";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";

import { membersServices } from "services";
import { AxiosError } from "axios";
import { IStatus } from "types/status";
import miscData from "./data";
import { INotifyDownload } from "./types";
import FormEdit from "./components/FormEdit";
import MenuAction from "./components/MenuAction";
import { IMenuAction } from "./components/MenuAction/types";

function Members() {
  const dispatch = useAppDispatch();
  const { tableHeaders } = miscData();
  const [showNotifyDownload, setShowNotifyDownload] = useState<INotifyDownload>({
    open: false,
    message: "",
    title: "",
    color: "primary",
  });

  const [rowsMembers, setRowsMembers] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [action, setAction] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [tableStatus, setTableStatus] = useState<IStatus>("idle");
  const [editStatus, setEditStatus] = useState<IStatus>("idle");
  const [error, setError] = useState<AxiosError | null>(null);

  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openNotifyDownload = ({ message, title, color }: Omit<INotifyDownload, "open">) => {
    setShowNotifyDownload({ open: true, message, title, color });
  };
  const closeNotifyDownload = () => {
    setShowNotifyDownload({ open: false });
  };

  const fetchMembers = async () => {
    setTableStatus("loading");

    try {
      const { data: rows } = await membersServices.getMembers();
      setRowsMembers(rows.data);
      setTableStatus("success");
    } catch (err) {
      setError(err);
      setTableStatus("failed");
    }
  };

  const fetchMemberById = async (memberId: number) => {
    setEditStatus("loading");

    try {
      const { data: rows } = await membersServices.getMemberById(memberId);
      setMemberDetails(rows.data);
      setEditStatus("success");
    } catch (err) {
      setError(err);
      setEditStatus("failed");
    }
  };

  const refresh = () => {
    fetchMembers();
    closeAction();
  };

  const onShowEdit = (memberId: number) => {
    setShowEdit(true);
    fetchMemberById(memberId);
  };

  const onCloseEdit = () => {
    setShowEdit(false);
  };

  const onShowDelete = () => {
    setShowEdit(true);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (error?.response?.statusText === "Unauthorized" && error?.response?.status === 401) {
      dispatch(setIsAuthenticated(false));
    }
  }, [error, dispatch]);

  const menuItemsAction: IMenuAction["items"] = [
    {
      icon: (
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
          refresh
        </Icon>
      ),
      label: "Refresh",
      onClick: refresh,
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {tableStatus === "loading" && <MDTypography variant="body2">Loading...</MDTypography>}
      {tableStatus === "failed" && <MDTypography variant="body2">{error.message}</MDTypography>}

      <MDSnackbar
        color={showNotifyDownload.color}
        icon="info"
        title={showNotifyDownload.title}
        content={showNotifyDownload.message}
        dateTime="now"
        open={showNotifyDownload.open}
        close={closeNotifyDownload}
      />
      <FormEdit
        open={showEdit}
        onClose={onCloseEdit}
        data={memberDetails}
        isLoading={editStatus === "loading"}
      />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={1}
                px={1}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox display="flex">
                  <MDBox my="auto" marginLeft="auto">
                    <Icon
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                      fontSize="small"
                      onClick={openAction}
                    >
                      more_vert
                    </Icon>
                  </MDBox>
                  <MenuAction anchorEl={action} onClose={closeAction} items={menuItemsAction} />
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <MDTypography ml={3} variant="h4" color="dark" textTransform="uppercase">
                  Members Details
                </MDTypography>
                <DataTable
                  table={{
                    columns: tableHeaders({ onShowEdit, onShowDelete }),
                    rows: rowsMembers,
                  }}
                  isSorted={false}
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

export default Members;
