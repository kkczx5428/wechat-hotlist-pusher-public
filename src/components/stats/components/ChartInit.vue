<script setup lang="ts">

import * as echarts from "echarts";
import {onMounted, ref, shallowRef, watch,} from "vue";

const props = defineProps<{
  option: any,
  update: boolean
}>();

const Chart = shallowRef<any>(null)


onMounted(() => {
  const chartId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`
  console.log('ChartInit onMounted', chartId)
  Chart.value = echarts.init(document.getElementById('charts_main') as HTMLDivElement);
  Chart.value.clear();
  Chart.value.setOption(props.option);
})

watch(() => props.update, async (newVal, oldVal) => {
  Chart.value.clear();
  Chart.value.setOption(props.option);
});

</script>

<template>
  <div id="charts_main" class="chart-div"></div>
</template>

<style scoped>
.chart-div {
  width: 100%;
  height: 100%;
}
</style>