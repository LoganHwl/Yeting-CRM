// 全局 G2 设置
import { track, setTheme } from 'bizcharts';

track(false);

const config = {
  defaultColor: '#1089ff',
  shape: {
    interval: {
      fillOpacity: 1,
    },
  },
  axis: {
    left: {
      label: {
        textStyle: {
          fill: '#FFFFFF',
        },
      },
    },
    bottom: {
      label: {
        textStyle: {
          fill: '#91F6E8',
        },
      },
    },
  },
};

setTheme(config);
