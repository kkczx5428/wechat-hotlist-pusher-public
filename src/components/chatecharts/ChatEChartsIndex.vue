<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, ref, shallowRef} from "vue";
import {apiDateCount, apiTalkerCount} from "@/api/stat";
import {apiUserList} from "@/api/chat";
import {gen_show_name, type User} from "@/utils/common_utils";
import DateTimeSelect from "@/components/utils/DateTimeSelect.vue";
import ColorSelect from "@/components/utils/ColorSelect.vue";

// https://echarts.apache.org/examples/en/editor.html

interface CountData {
  sender_count: number
  receiver_count: number
  total_count: number
}

const date_count_data = ref({});

const datetime = ref([0, 0]);
const word = ref("");
const loading = ref(false);
const user_options = ref<User[]>([]);

const top_user = ref<{ [key: string]: User }>({});
const top_user_count = ref<{ [key: string]: CountData }>({});

const Chart = shallowRef<any>(null)
const colors = [
  {
    "color": '#ffeab6',
    "areaStyle": new echarts.graphic.LinearGradient(0, 0, 0, 1,
        [{offset: 0, color: "rgba(255,234,182,0)"},
          {offset: 1, color: "rgba(255,234,182,0)"}])
  }, {
    "color": '#c0ffc2',
    "areaStyle": new echarts.graphic.LinearGradient(0, 0, 0, 1,
        [{offset: 0, color: "rgba(192,255,194,0)"},
          {offset: 1, color: "rgba(192,255,194,0)"}])
  }, {
    "color": '#a1d9ff',
    "areaStyle": new echarts.graphic.LinearGradient(0, 0, 0, 1,
        [{offset: 0, color: "rgba(161,217,255,0)"},
          {offset: 1, color: "rgba(161,217,255,0)"}])
  }
];
const bg_color = ref("");

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
    {type: 'inside', start: 0, end: 100},
    {start: 0, end: 100}
  ],
  legend: {
    right: '5%', // 设置图例位于右侧，距离右边边缘 5%
    top: '5%', // 设置图例位于上方
    orient: 'vertical' // 设置图例为垂直排列
  },
  xAxis: {
    type: 'category', // x 轴类型为分类
    boundaryGap: false, // x 轴两端不留空白间隙
    data: <any>[], // x 轴的数据，这里使用了 TypeScript 的泛型表示尚未填充数据
  },
  yAxis: {
    type: 'value', // y 轴类型为数值
    boundaryGap: [0, '10%'], // y 轴两端留白,下端留白0，上端留白10%
  },
  series: [
    {
      name: '日聊天记录数量',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {color: colors[0].color},
      areaStyle: {color: colors[0].areaStyle},
      data: <any>[]
    }, {
      name: '日发送聊天记录数量',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {color: colors[1].color},
      areaStyle: {color: colors[1].areaStyle},
      data: <any>[]
    }, {
      name: '日接收聊天记录数量',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {color: colors[2].color},
      areaStyle: {color: colors[2].areaStyle},
      data: <any>[]
    }
  ]
});

const update_chart_option = () => {
  chart_option.value.series[0].itemStyle.color = colors[0].color;
  chart_option.value.series[0].areaStyle.color = colors[0].areaStyle;
  chart_option.value.series[1].itemStyle.color = colors[1].color;
  chart_option.value.series[1].areaStyle.color = colors[1].areaStyle;
  chart_option.value.series[2].itemStyle.color = colors[2].color;
  chart_option.value.series[2].areaStyle.color = colors[2].areaStyle;
}

const get_date_count_data = async () => {
  console.log("datetime:", datetime.value);
  // {"2024-12-20":{ "sender_count": sender_count,  "receiver_count": receiver_count, "total_count": total_count  },....}
  date_count_data.value = await apiDateCount(word.value, datetime.value[0] / 1000, datetime.value[1] / 1000);

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
const refreshChart = async (is_get_data: boolean = true) => {
  update_chart_option();
  if (is_get_data) {
    await get_date_count_data();
  }
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
        <strong>时间(默认全部)：</strong>
        <DateTimeSelect @datetime="(val: any) => {datetime = val;}"/> &nbsp;
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
          <el-option v-for="item in user_options" :key="item.wxid" :label="gen_show_name(item)" :value="item.wxid"/>
        </el-select>&nbsp;
        <el-button type="primary" @click="search_change">查看</el-button>
        &nbsp;
        <strong>颜色设置：</strong>
        bg:
        <color-select @updateColors="(val:any)=>{bg_color=val}"></color-select>
        c1:
        <color-select @updateColors="(val:any)=>{colors[0].color=val;refreshChart(false)}"></color-select>
        c2:
        <color-select @updateColors="(val:any)=>{colors[1].color=val;refreshChart(false)}"></color-select>
        c3:
        <color-select @updateColors="(val:any)=>{colors[2].color=val;refreshChart(false)}"></color-select>
        <br>
        <strong>top10：</strong>
        <template v-for="wxid in Object.keys(top_user_count)" :key="wxid">
          <el-button type="primary" plain @click="set_top_user(wxid)" size="small">
            {{ gen_show_name(top_user[wxid]) }}({{ top_user_count[wxid]?.total_count }})
          </el-button>
        </template>
      </el-header>

      <el-main style="height: calc(100% - 100px);width: 100%;">
        <div id="charts_main" :style="'width: 100%;height: calc(100% - 100px);background-color:'+bg_color "></div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>