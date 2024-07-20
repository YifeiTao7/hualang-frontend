import colors from "assets/theme/base/colors";

const { gradients, dark } = colors;

// Helper function to generate random colors
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function configs(labels, datasets) {
  const backgroundColors = [];

  if (datasets.backgroundColors) {
    datasets.backgroundColors.forEach(
      (color) =>
        gradients[color]
          ? backgroundColors.push(gradients[color].state)
          : backgroundColors.push(getRandomColor()) // 使用随机颜色
    );
  } else {
    // 生成与数据长度相等的随机颜色
    for (let i = 0; i < datasets.data.length; i++) {
      backgroundColors.push(getRandomColor());
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
