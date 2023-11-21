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
import { TMembers, TViewMemberDetails } from "./types";

function Members() {
  const { tableHeaders, initialMembers, initialViewMember } = miscData();
  const [action, setAction] = useState(null);
  const [showFormEdit, setShowFormEdit] = useState(false);

  const [tableMembers, setTableMembers] = useState<TMembers>(initialMembers);
  const [viewMemberDetails, setViewMemberDetails] = useState<TViewMemberDetails>(initialViewMember);

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

  const fetchMemberById = async (userId: string) => {
    setViewMemberDetails((prev) => ({ ...prev, status: "loading", action: "edit" }));

    try {
      const { data: rows } = await membersServices.getMemberById(userId);
      setViewMemberDetails((prev) => ({
        ...prev,
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      }));
    } catch (err) {
      setViewMemberDetails({ status: "failed", message: err.message, data: null, action: null });
    }
  };

  const updateMember = async (userId: string, data: any) => {
    setViewMemberDetails((prev) => ({ ...prev, status: "loading", action: "update" }));

    try {
      const { data: rows } = await membersServices.updateMember(userId, data);
      setViewMemberDetails((prev) => ({
        ...prev,
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      }));
    } catch (err) {
      setViewMemberDetails({ status: "failed", message: err.message, data: null, action: null });
    }
  };

  const refresh = () => {
    fetchMembers();
    closeAction();
  };

  const onShowEdit = (memberId: string) => {
    setShowFormEdit(true);
    fetchMemberById(memberId);
  };

  const onCloseEdit = () => {
    setViewMemberDetails(initialViewMember);
    setShowFormEdit(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const { action: actionMember, status: statusMember } = viewMemberDetails;
    if (showFormEdit && actionMember === "update" && statusMember === "succeeded") {
      fetchMembers();
    }
  }, [showFormEdit, viewMemberDetails]);

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
        open={showFormEdit}
        onClose={onCloseEdit}
        onUpdate={updateMember}
        viewData={viewMemberDetails}
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
