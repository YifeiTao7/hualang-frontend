import colors from "assets/theme/base/colors";

const { gradients, dark } = colors;

// 定义12个固定颜色
const fixedColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FFCD56",
  "#4CAF50",
  "#F44336",
  "#2196F3",
  "#3F51B5",
  "#E91E63",
];

function configs(labels, datasets) {
  const backgroundColors = [];

  if (datasets.backgroundColors) {
    datasets.backgroundColors.forEach(
      (color) =>
        gradients[color]
          ? backgroundColors.push(gradients[color].state)
          : backgroundColors.push(fixedColors[backgroundColors.length % fixedColors.length]) // 使用固定颜色
    );
  } else {
    // 使用固定的12个颜色，如果数据超过12个颜色，循环使用
    for (let i = 0; i < datasets.data.length; i++) {
      backgroundColors.push(fixedColors[i % fixedColors.length]);
    }
  }

  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          weight: 9,
          cutout: 0,
          tension: 0.9,
          pointRadius: 2,
          borderWidth: 2,
          backgroundColor: backgroundColors,
          fill: false,
          data: datasets.data,
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
        mode: "index",
      },
    },
  };
}

export default configs;
