<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, ref} from "vue";
import {apiDateCount} from "@/api/stat";
import {apiUserList} from "@/api/chat";
import {gen_show_name, type User} from "@/utils/common_utils";
// https://echarts.apache.org/examples/en/editor.html


const date = ref<String[]>([]);
const data = ref<number[]>([]);
const word = ref("");
const loading = ref(false);
const user_options = ref<User[]>([]);

//初始化函数
const init = async () => {

  // 清空图表

  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("charts_main"));

  const body_data = await apiDateCount(word.value);
  // {"2024-12-20":23,...}

  date.value = Object.keys(body_data);
  data.value = Object.values(body_data);

  let option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '100%'];
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
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date.value
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10
      },
      {
        start: 0,
        end: 10
      }
    ],
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
              color: 'rgb(255, 158, 68)'
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }
          ])
        },
        data: data.value
      }
    ]
  };
  // 渲染图表
  Chart.setOption(option);
}

onMounted(() => {
  init();
});

const search_user = async (query: string) => {
  try {
    loading.value = true;
    const body_data = await apiUserList(query);
    loading.value = false;
    user_options.value = Object.values(body_data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// 监测搜索框变化


const search_change = async () => {
  try {
    console.log('search_change:', word.value);
    await init();
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