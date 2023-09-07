import { useRef, useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import gradientChartLine from "assets/theme/functions/gradientChartLine";
import configs from "organisms/Charts/LineCharts/GradientLineChart/configs";
import colors from "assets/theme/base/colors";
import { TGradientLineChart } from "./types";

function GradientLineChart({
  icon,
  title,
  description,
  height,
  chart,
  status,
}: TGradientLineChart) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ data: null, options: null });
  const { data, options } = chartData;

  useEffect(() => {
    const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
          ...dataset,
          tension: 0,
          pointRadius: 0,
          borderWidth: 4,
          borderColor: colors[dataset.color]
            ? colors[dataset.color || "dark"].main
            : colors.dark.main,
          fill: true,
          maxBarThickness: 6,
          backgroundColor: gradientChartLine(
            chartRef.current.children[0],
            colors[dataset.color] ? colors[dataset.color || "dark"].main : colors.dark.main
          ),
        }))
      : [];

    setChartData(configs(chart.labels || [], chartDatasets));
  }, [chart]);

  const renderLineChart = () => {
    if (status === "failed") {
      return (
        <MDTypography
          variant="body2"
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Failed to display chart.
        </MDTypography>
      );
    }

    return <Line data={data} options={options} />;
  };

  const renderChart = (
    <MDBox py={2} pr={2} pl={icon.component ? 1 : 2}>
      {title || description ? (
        <MDBox display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
          {icon.component && (
            <MDBox
              width="4rem"
              height="4rem"
              bgColor={icon.color || "info"}
              variant="gradient"
              coloredShadow={icon.color || "info"}
              borderRadius="xl"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="white"
              mt={-5}
              mr={2}
            >
              <Icon fontSize="medium">{icon.component}</Icon>
            </MDBox>
          )}
          <MDBox mt={icon.component ? -2 : 0}>
            {title && <MDTypography variant="h6">{title}</MDTypography>}
            <MDBox mb={2}>
              <MDTypography component="div" variant="button" color="text">
                {description}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      ) : null}
      {useMemo(
        () => (
          <MDBox ref={chartRef} sx={{ height }}>
            {renderLineChart()}
          </MDBox>
        ),
        [chartData, height]
      )}
    </MDBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

GradientLineChart.defaultProps = {
  icon: { color: "info", component: "" },
  title: "",
  description: "",
  height: "19.125rem",
};

export default GradientLineChart;
