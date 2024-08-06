<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, ref, shallowRef} from "vue";
import {apiDateCount, apiTalkerCount} from "@/api/stat";
import {apiUserList} from "@/api/chat";
import {gen_show_name, type User} from "@/utils/common_utils";

// https://echarts.apache.org/examples/en/editor.html

interface CountData {
  sender_count: number
  receiver_count: number
  total_count: number
}

const date_count_data = ref({});

const word = ref("");
const loading = ref(false);
const user_options = ref<User[]>([]);

const top_user = ref<{ [key: string]: User }>({});
const top_user_count = ref<{ [key: string]: CountData }>({});

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
      start: 90,
      end: 100
    },
    {
      start: 90,
      end: 100
    }
  ],
  legend: {
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


const get_date_count_data = async () => {
  // {"2024-12-20":{ "sender_count": sender_count,  "receiver_count": receiver_count, "total_count": total_count  },....}
  date_count_data.value = await apiDateCount(word.value);

  // refreshData();
  chart_option.value.xAxis.data = Object.keys(date_count_data.value);
  chart_option.value.series[0].data = Object.values(date_count_data.value).map((item: any) => item.total_count);
  chart_option.value.series[1].data = Object.values(date_count_data.value).map((item: any) => item.sender_count);
  chart_option.value.series[2].data = Object.values(date_count_data.value).map((item: any) => item.receiver_count);
}

const get_top_user_count = async () => {
  // {"wxid":{ "sender_count": sender_count,  "receiver_count": receiver_count, "total_count": total_count  },....}
  const body_data = await apiTalkerCount();

  top_user.value = await apiUserList("", Object.keys(body_data));
  top_user_count.value = body_data;
}

// 刷新图表 START
const refreshChart = async () => {
  await get_date_count_data();
  // 渲染图表
  Chart.value.setOption(chart_option.value);
}
// 刷新图表 END

onMounted(() => {
  Chart.value = echarts.init(document.getElementById("charts_main"))
  refreshChart();
  get_top_user_count();
});


// 搜索联系人相关 START
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

const set_top_user = async (wxid: string) => {
  try {
    word.value = wxid;
    await search_change();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
// 搜索联系人相关 END
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

        top10：
        <template v-for="wxid in Object.keys(top_user_count)" :key="wxid">
          <el-button type="primary" plain @click="set_top_user(wxid)">
            {{ gen_show_name(top_user[wxid]) }}({{ top_user_count[wxid]?.total_count }})
          </el-button>
        </template>

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