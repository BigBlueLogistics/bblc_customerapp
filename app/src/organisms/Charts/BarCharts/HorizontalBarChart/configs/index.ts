import { FontSpec } from "chart.js";

function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets: [...datasets],
    },
    options: {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
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
            color: "#c1c4ce5c",
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#9ca2b7",
            font: {
              size: 14,
              weight: "300",
              family: "Roboto",
              style: "normal",
              lineHeight: "2",
            } as FontSpec,
          },
        },
        x: {
          border: {
            display: false,
            dash: [5, 5],
          },
          grid: {
            display: false,
            drawOnChartArea: true,
            drawTicks: true,
            color: "#c1c4ce5c",
          },
          ticks: {
            display: true,
            color: "#9ca2b7",
            padding: 10,
            font: {
              size: 14,
              weight: "300",
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
