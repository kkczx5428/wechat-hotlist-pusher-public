<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, ref, shallowRef} from "vue";
import {apiDateCount} from "@/api/stat";
import {apiUserList} from "@/api/chat";
import {gen_show_name, type User} from "@/utils/common_utils";
// https://echarts.apache.org/examples/en/editor.html


const date = ref<String[]>([]);
const total_count = ref<number[]>([]);
const receiver_count = ref<number[]>([]);
const sender_count = ref<number[]>([]);
const word = ref("");
const loading = ref(false);
const user_options = ref<User[]>([]);
const Chart = shallowRef<any>(null);
const chart_option = ref({
  tooltip: {
    trigger: 'axis',
    position: function (pt: any) {
      return [pt[0], '90%'];
    }
  },
  title: {
    left: 'center',
    text: '日聊天记录（不包括群聊）'
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100
    }
  ],
  legend: {
    data: ['日聊天记录数量', '日发送聊天记录数量', '日接收聊天记录数量'],
    right: '5%', // 设置图例位于右侧，距离右边边缘 5%
    top: '5%', // 设置图例位于上方
    orient: 'vertical' // 设置图例为垂直排列
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: <any>[]
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    min: 'dataMin',
    max: 'dataMax',
  },
  series: [
    {
      name: '日聊天记录数量',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {
        color: 'rgb(255, 70, 131)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(255, 70, 131, 0.3)' // 修改颜色和透明度
          },
          {
            offset: 1,
            color: 'rgba(255, 70, 131, 0)' // 设置底部透明
          }
        ])
      },
      data: <any>[]
    }, {
      name: '日发送聊天记录数量',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {
        color: 'rgba(236,218,24,0.65)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(24,236,34, 0.3)' // 修改颜色和透明度
          },
          {
            offset: 1,
            color: 'rgba(24,236,34, 0)' // 设置底部透明
          }
        ])
      },
      data: <any>[]
    }, {
      name: '日接收聊天记录数量',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {
        color: 'rgba(4,94,229,0.62)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(143,246,246, 0.3)' // 修改颜色和透明度
          },
          {
            offset: 1,
            color: 'rgba(143,246,246, 0)' // 设置底部透明
          }
        ])
      },
      data: <any>[]
    }
  ]
});


const get_data = async () => {
  const body_data = await apiDateCount(word.value);
  // {"2024-12-20":{ "sender_count": sender_count,  "receiver_count": receiver_count, "total_count": total_count  },....}
  date.value = Object.keys(body_data);
  total_count.value = Object.values(body_data).map((item: any) => item.total_count);
  receiver_count.value = Object.values(body_data).map((item: any) => item.receiver_count);
  sender_count.value = Object.values(body_data).map((item: any) => item.sender_count);

  // refreshData();
  chart_option.value.xAxis.data = date.value;
  chart_option.value.series[0].data = total_count.value;
  chart_option.value.series[1].data = sender_count.value;
  chart_option.value.series[2].data = receiver_count.value;

  // console.log(date.value.length, total_count.value.length, receiver_count.value.length, sender_count.value.length);
}

//初始化函数
const refreshChart = async () => {
  // 基于准备好的dom，初始化echarts实例
  await get_data();
  // 渲染图表
  Chart.value.setOption(chart_option.value);
}

onMounted(() => {
  Chart.value = echarts.init(document.getElementById("charts_main"))
  refreshChart();
});

const search_user = async (query: string) => {
  try {

    loading.value = true;
    if (query === '') {
      user_options.value = [];
      return;
    }
    const body_data = await apiUserList(query);
    loading.value = false;
    user_options.value = Object.values(body_data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const search_change = async () => {
  try {
    console.log('search_change:', word.value);
    // await get_data();
    await refreshChart();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

</script>

<template>
  <div class="common-layout" style="background-color: #d2d2fa;height: 100%;width: 100%;">
    <el-container style="height: 100%;width: 100%;">
      <el-header :height="'80px'" style="width: 100%;">
        <el-select
            v-model="word"
            filterable
            remote
            reserve-keyword
            placeholder="输入想查看的联系人"
            remote-show-suffix
            clearable
            :remote-method="search_user"
            :loading="loading"
            style="width: 240px"
        >
          <el-option
              v-for="item in user_options"
              :key="item.wxid"
              :label="gen_show_name(item)"
              :value="item.wxid"
          />
        </el-select>
        <el-button type="primary" @click="search_change">查看</el-button>
      </el-header>

      <el-main style="height: calc(100% - 80px);width: 100%;">
        <div id="charts_main"></div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
#charts_main {
  width: 100%;
  height: calc(100% - 80px);
}
</style>