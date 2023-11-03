import { useEffect, useState } from "react";
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
import Main from "organisms/Profile/Main";
import Header from "pages/Profile/components/Header";
import { profileServices } from "services";
import { ChangePassType } from "types/authForm";
import { capitalizeWord } from "utils";

import { TProfileData } from "organisms/Profile/Main/types";
import { TProfile, TProfileChangePass } from "./types";
import selector from "./selector";

function Profile() {
  const [viewChangePass, setChangePass] = useState<TProfileChangePass>({
    message: "",
    data: null,
    status: "idle",
  });
  const [viewProfileDetails, setProfileDetails] = useState<TProfile>({
    message: "",
    data: null,
    status: "idle",
  });
  const { name, email, roleName } = selector();
  const capitalizeName = capitalizeWord(name);

  const onChangePass = async (values: ChangePassType) => {
    setChangePass((prev) => ({ ...prev, status: "loading" }));
    try {
      const { data: rows } = await profileServices.changePass(values);
      setChangePass({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
    } catch (err) {
      setChangePass({ status: "failed", message: err.message, data: null });
    }
  };

  const fetchProfile = async () => {
    setProfileDetails((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await profileServices.getProfile();
      setProfileDetails({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
    } catch (err) {
      setProfileDetails({ status: "failed", message: err.message, data: null });
    }
  };

  const onUpdateProfile = async (values: TProfileData) => {
    setProfileDetails((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await profileServices.updateProfile(values);
      setProfileDetails({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
    } catch (err) {
      setProfileDetails({ status: "failed", message: err.message, data: null });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const renderMessage = () => {
    if (
      (viewChangePass.status === "succeeded" || viewChangePass.status === "failed") &&
      viewChangePass.message
    ) {
      return (
        <MDAlert2
          severity={viewChangePass.status === "failed" ? "error" : "success"}
          dismissible
          sx={({ typography: { pxToRem } }) => ({
            width: "90%",
            margin: `${pxToRem(15)} auto`,
          })}
        >
          <MDTypography variant="body2" fontSize={14}>
            {viewChangePass.message}
          </MDTypography>
        </MDAlert2>
      );
    }

    if (
      (viewProfileDetails.status === "succeeded" || viewProfileDetails.status === "failed") &&
      viewProfileDetails.message
    ) {
      return (
        <MDAlert2
          severity={viewProfileDetails.status === "failed" ? "error" : "success"}
          dismissible
          sx={({ typography: { pxToRem } }) => ({
            width: "90%",
            margin: `${pxToRem(15)} auto`,
          })}
        >
          <MDTypography variant="body2" fontSize={14}>
            {viewProfileDetails.message}
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
                  role: capitalizeWord(roleName),
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
                data={viewChangePass}
                onChangePass={onChangePass}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <Main
                title="Profile"
                data={viewProfileDetails}
                onUpdateProfile={onUpdateProfile}
                shadow={false}
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
