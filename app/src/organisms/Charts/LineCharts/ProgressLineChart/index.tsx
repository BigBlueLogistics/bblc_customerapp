import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDProgress from "atoms/MDProgress";
import configs from "organisms/Charts/LineCharts/ProgressLineChart/config";
import { IProgressLineChart } from "./types";

function ProgressLineChart({
  color,
  icon,
  title,
  count,
  progress,
  height,
  chart,
}: IProgressLineChart) {
  const { data, options } = configs(color, chart.labels || [], title, chart.data || []);

  return (
    <Card>
      <MDBox display="flex" alignItems="center" pt={2} px={2}>
        <MDBox
          width="3rem"
          height="3rem"
          display="grid"
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
          shadow="md"
          color="white"
          bgColor={color}
          variant="gradient"
        >
          <Icon fontSize="medium">{icon}</Icon>
        </MDBox>
        <MDBox ml={2} lineHeight={1}>
          <MDTypography
            variant="button"
            fontWeight="regular"
            textTransform="capitalize"
            color="text"
          >
            {title}
          </MDTypography>
          {count ? (
            <MDTypography variant="h5" fontWeight="bold">
              {count}
            </MDTypography>
          ) : null}
        </MDBox>
        <MDBox width="25%" ml="auto">
          <MDTypography display="block" variant="caption" fontWeight="medium" color="text">
            {progress}%
          </MDTypography>
          <MDBox mt={0.25}>
            <MDProgress variant="gradient" color={color} value={progress} />
          </MDBox>
        </MDBox>
      </MDBox>
      {useMemo(
        () => (
          <MDBox mt={2}>
            <Line data={data} options={options} style={{ height }} />
          </MDBox>
        ),
        [chart, height]
      )}
    </Card>
  );
}

ProgressLineChart.defaultProps = {
  color: "info",
  count: 0,
  height: "6.25rem",
};

export default ProgressLineChart;
