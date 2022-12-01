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
import ActionIcon from "./components/ActionIcon";
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
  const [updateStatus, setUpdateStatus] = useState<IStatus>("idle");
  const [error, setError] = useState<AxiosError | null>(null);
  const [formMessage, setFormMessage] = useState("");

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
      setTableStatus("succeeded");
    } catch (err) {
      setError(err);
      setTableStatus("failed");
    }
  };

  const fetchMemberById = async (userId: number) => {
    setEditStatus("loading");
    setUpdateStatus("idle");

    try {
      const { data: rows } = await membersServices.getMemberById(userId);
      setMemberDetails(rows.data);
      setEditStatus("succeeded");
    } catch (err) {
      setError(err);
      setEditStatus("failed");
    }
  };

  const updateMember = async (userId: number, data: any) => {
    setUpdateStatus("loading");

    try {
      const { data: rows } = await membersServices.updateMember(userId, data);
      setMemberDetails(rows.data);
      setUpdateStatus("succeeded");
      setFormMessage(rows.message);
    } catch (err) {
      setFormMessage(err.message);
      setUpdateStatus("failed");
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

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      fetchMembers();
    }
  }, [updateStatus]);

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
        onUpdate={updateMember}
        data={memberDetails}
        status={updateStatus}
        message={formMessage}
        isLoadingEdit={editStatus === "loading"}
        isLoadingUpdate={updateStatus === "loading"}
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
              >
                <MDTypography ml={3} variant="h4" color="light" textTransform="uppercase">
                  Members Details
                </MDTypography>

                <MDBox my="auto" marginLeft="auto">
                  <ActionIcon title="actions" onClick={openAction}>
                    more_vert
                  </ActionIcon>
                  <MenuAction anchorEl={action} onClose={closeAction} items={menuItemsAction} />
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: tableHeaders({ onShowEdit }),
                    rows: rowsMembers,
                  }}
                  isSorted={false}
                  isLoading={tableStatus === "loading"}
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
