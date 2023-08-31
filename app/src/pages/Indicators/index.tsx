import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import Statistics from "./components/Statistics";
import WaveChart from "./components/WaveChart";

function Indicators() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Statistics />
        <WaveChart />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Indicators;
