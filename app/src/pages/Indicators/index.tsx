import MDBox from "atoms/MDBox";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import Statistics from "./components/Statistics";
import StackedChart from "./components/StackedChart";

function Indicators() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Statistics />
        <StackedChart />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Indicators;
