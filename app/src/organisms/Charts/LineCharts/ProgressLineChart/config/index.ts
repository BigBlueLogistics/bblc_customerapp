import { InteractionMode, FontSpec } from "chart.js";
import colors from "assets/theme/base/colors";

const { gradients } = colors;

function configs(color, labels, label, data) {
  return {
    data: {
      labels,
      datasets: [
        {
          label,
          tension: 0,
          pointRadius: 3,
          pointBackgroundColor: gradients[color] ? gradients[color].main : gradients.info.main,
          borderColor: gradients[color] ? gradients[color].main : gradients.info.main,
          borderWidth: 4,
          backgroundColor: "transparent",
          maxBarThickness: 6,
          fill: true,
          data,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index" as InteractionMode,
      },
      scales: {
        y: {
          border: {
            display: false,
            dash: [5, 5],
          },
          grid: {
            display: false,
            drawOnChartArea: true,
            drawTicks: false,
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#9ca2b7",
            font: {
              size: 14,
              weight: "lighter",
              family: "Roboto",
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
            color: "#c1c4ce5c",
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#9ca2b7",
            font: {
              size: 14,
              weight: "lighter",
              family: "Roboto",
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
