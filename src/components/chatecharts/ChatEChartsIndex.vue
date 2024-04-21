<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted} from "vue";

const dataCount = 5e5;



//初始化函数
function init() {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("charts_main"));
  // 绘制图表
  var options = {
    title: { // 标题
      text: echarts.format.addCommas(dataCount) + ' Data',
      left: 10
    },
    toolbox: { // 工具栏
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        saveAsImage: {
          pixelRatio: 2
        }
      }
    },
    tooltip: { // 提示框
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: { // 网格
      bottom: 90
    },
    dataZoom: [ // 数据区域缩放
      {
        type: 'inside' // 内置
      },
      {
        type: 'slider'  // 滑块
      }
    ],
    xAxis: { // x轴
      // data: data.categoryData,
      silent: false,  // 是否响应鼠标事件
      splitLine: {
        show: false // 是否显示分隔线
      },
      splitArea: {
        show: false // 是否显示分隔区域
      }
    },
    yAxis: { // y轴
      splitArea: {
        show: false // 是否显示分隔区域
      }
    },
    series: [ // 系列
      {
        type: 'bar',  // 柱状图
        // data: data.valueData,  // 数据
        // Set `large` for large data amount
        large: true // 是否开启大数据量优化
      }
    ]
  };
  // 渲染图表
  // Chart.setOption(options);
}

onMounted(() => {
  init();
});

</script>

<template>
  <div id="charts_main"></div>
</template>

<style scoped>
#charts_main {
  width: 100vw;
  height: 100vh;
}
</style>