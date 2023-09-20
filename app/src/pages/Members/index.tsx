import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import Icon from "@mui/material/Icon";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { membersServices } from "services";
import miscData from "./data";
import FormEdit from "./components/FormEdit";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import { TMenuAction } from "./components/MenuAction/types";
import { TMembers, TViewMemberDetails, TUpdateMemberDetails } from "./types";

function Members() {
  const { tableHeaders } = miscData();
  const [action, setAction] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [tableMembers, setTableMembers] = useState<TMembers>({
    message: "",
    data: [],
    status: "idle",
  });
  const [viewMemberDetails, setViewMemberDetails] = useState<TViewMemberDetails>({
    message: "",
    data: null,
    status: "idle",
  });
  const [updateMemberDetails, setUpdateMemberDetails] = useState<TUpdateMemberDetails>({
    message: "",
    data: null,
    status: "idle",
  });

  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const fetchMembers = async () => {
    setTableMembers((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await membersServices.getMembers();
      setTableMembers({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
    } catch (err) {
      setTableMembers({ status: "failed", message: err.message, data: [] });
    }
  };

  const fetchMemberById = async (userId: number) => {
    setViewMemberDetails((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await membersServices.getMemberById(userId);
      setViewMemberDetails({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
    } catch (err) {
      setViewMemberDetails({ status: "failed", message: err.message, data: null });
    }
  };

  const updateMember = async (userId: number, data: any) => {
    setUpdateMemberDetails((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await membersServices.updateMember(userId, data);
      setUpdateMemberDetails({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
    } catch (err) {
      setUpdateMemberDetails({ status: "failed", message: err.message, data: null });
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
    if (updateMemberDetails.status === "succeeded") {
      fetchMembers();
    }
  }, [updateMemberDetails]);

  const menuItemsAction: TMenuAction["items"] = [
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

      {tableMembers.status === "failed" && (
        <MDTypography variant="body2">{tableMembers.message}</MDTypography>
      )}

      <FormEdit
        open={showEdit}
        onClose={onCloseEdit}
        onUpdate={updateMember}
        viewData={viewMemberDetails}
        updateData={updateMemberDetails}
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
                    rows: tableMembers.data,
                  }}
                  isSorted={false}
                  isLoading={tableMembers.status === "loading"}
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
