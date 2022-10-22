import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import bgConstruction from "assets/images/bg-construction.png";

import ImgBackground from "./components/ImgBackground";
import { MessageTitle, MessageDescription } from "./components/Message";

function UnderConstruction() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flex="100%"
      >
        <MDBox>
          <ImgBackground src={bgConstruction} alt="under-construction-bg" />
        </MDBox>
        <MessageTitle>This page is under construction</MessageTitle>
        <MessageDescription>We&apos;re working on it!</MessageDescription>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UnderConstruction;
