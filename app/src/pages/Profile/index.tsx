import { useState } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import MDBox from "atoms/MDBox";
import MDAlert2 from "atoms/MDAlert2";
import MDTypography from "atoms/MDTypography";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import ProfileInfoCard from "organisms/Cards/InfoCards/ProfileInfoCard";
import ChangePassword from "organisms/Profile/ChangePassword";
import Header from "pages/Profile/components/Header";
import { authServices } from "services";
import { ChangePassType } from "types/authForm";
import { IStatus } from "types/status";
import { capitalizeWord } from "utils";

// Data
import selector from "./selector";

function Profile() {
  const [status, setStatus] = useState<IStatus>("idle");
  const [statusMsg, setStatusMsg] = useState(null);
  const { name, email, customerCode } = selector();
  const capitalizeName = capitalizeWord(name);

  const onChangePass = async (values: ChangePassType) => {
    setStatus("loading");
    try {
      const { data } = await authServices.changePass(values);
      setStatusMsg(data.message);
      setStatus("success");
    } catch (err) {
      setStatus("failed");
      setStatusMsg(err.message);
    }
  };

  const renderMessage = () => {
    if (status === "success" || status === "failed") {
      return (
        <MDAlert2
          severity={status === "failed" ? "error" : "success"}
          dismissible
          sx={({ typography: { pxToRem } }) => ({
            width: "90%",
            margin: `${pxToRem(15)} auto`,
          })}
        >
          <MDTypography variant="body2" fontSize={14}>
            {statusMsg}
          </MDTypography>
        </MDAlert2>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        {renderMessage()}
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <ProfileInfoCard
                title="profile information"
                description={`Hi, ${capitalizeName} , Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).`}
                info={{
                  fullName: capitalizeWord(capitalizeName),
                  code: customerCode,
                  email,
                }}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ChangePassword
                title="Change password"
                onChangePass={onChangePass}
                shadow={false}
                isLoading={status === "loading"}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Profile;
