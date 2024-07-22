function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets: datasets.map((dataset) => ({
        label: dataset.label,
        tension: 0.4,
        pointRadius: 5,
        pointBorderColor: "transparent",
        pointBackgroundColor: "rgba(255, 255, 255, .8)",
        borderColor: dataset.borderColor,
        borderWidth: 3,
        backgroundColor: dataset.backgroundColor,
        fill: false,
        data: dataset.data,
        maxBarThickness: 6,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // 禁用图例显示
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
            },
          },
          bodyFont: {
            family: "Roboto",
            size: 14,
            weight: 300,
            style: "normal",
          },
          bodyColor: "#ffffff", // 设置提示框文字颜色为白色
          titleColor: "#ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "rgba(255, 255, 255, .2)",
          },
          ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  };
}

export default configs;
