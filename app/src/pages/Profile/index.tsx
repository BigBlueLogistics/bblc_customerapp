import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import ProfileInfoCard from "organisms/Cards/InfoCards/ProfileInfoCard";
import ChangePassword from "organisms/Profile/ChangePassword";
import Header from "pages/Profile/components/Header";
import { capitalizeWord } from "utils";

// Data
import profilesListData from "pages/Profile/data/profilesListData";
import selector from "./selector";

function Profile() {
  const { name, email, customerCode } = selector();
  const capitalizeName = capitalizeWord(name);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
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
              <ChangePassword title="Change password" profiles={profilesListData} shadow={false} />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Profile;
