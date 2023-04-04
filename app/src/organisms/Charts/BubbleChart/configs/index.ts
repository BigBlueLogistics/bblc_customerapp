import { FontSpec } from "chart.js";
import typography from "assets/theme/base/typography";

function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets: [...datasets],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          border: {
            display: false,
            dash: [5, 5],
          },
          grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 11,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 2,
            } as FontSpec,
          },
        },
        x: {
          border: {
            display: false,
            dash: [5, 5],
          },
          grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 10,
            font: {
              size: 11,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 2,
            } as FontSpec,
          },
        },
      },
    },
  };
}

export default configs;
