<script setup lang="ts">

import * as echarts from "echarts";
import {getCurrentInstance, onMounted, ref, shallowRef, watch,} from "vue";

const props = defineProps<{
  option: any,
  update: boolean
}>();

const Chart = shallowRef<any>(null)
const init = () => {
  let t = getCurrentInstance()?.proxy?.$refs.chart_main;
  if (t instanceof HTMLElement) {
    Chart.value = echarts.init(t);
    Chart.value.clear();
    Chart.value.setOption(props.option);
  }else {
    console.error('chart_main is not HTMLElement');
  }
}

onMounted(() => {
  init();
})

watch(() => props.update, async (newVal, oldVal) => {
  Chart.value.clear();
  Chart.value.setOption(props.option);
});

</script>

<template>
  <div class="chart-div" ref="chart_main"></div>
</template>

<style scoped>
.chart-div {
  width: 100%;
  height: 100%;
}
</style>