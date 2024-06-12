<script setup lang="ts">
import {defineEmits, defineProps, onMounted, ref} from 'vue';
import http from '@/router/axios.js';

interface User {
  wxid: string
  nickname: string
  remark: string
  account: string
  describe: string
  headImgUrl: string
  LastReadedCreateTime: string
  LastReadedSvrId: number
}

const tableData = ref([]);
const userLabelDict = ref({});

// 请求数据
const req = async () => {
  try {
    const body_data = await http.post('/api/recent_user_list', {});
    return body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const search_user = async (word: string = '') => {
  try {
    return await http.post('/api/user_list', {
      'word': word,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const get_user_label_dict = async () => {
  try {
    return await http.post('/api/user_labels_dict', {});
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// END 请求数据

// 显示tooltip
const showTooltipValue = (LabelIDList: string[]) => {
  // console.log(LabelIDList)
  let value = "";
  if (LabelIDList.length === 0) {
    return "";
  }
  for (let i = 0; i < LabelIDList.length; i++) {
    value += userLabelDict.value[LabelIDList[i]] + " ";
  }
  return value;
}
// END 显示tooltip

const fetchData = async () => {
  try {
    tableData.value = await req();
    userLabelDict.value = await get_user_label_dict();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

onMounted(fetchData);

const search_word = ref('');

const search = async () => {
  try {
    // console.log(body_data);
    if (search_word.value === '') {
      tableData.value = await req();
      return;
    }
    tableData.value = await search_user(search_word.value);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const emits = defineEmits(['wxid']);

const handleCurrentChange = (val: User | undefined) => {
  // 触发自定义事件，并传递数据
  if (val !== undefined) {
    // 处理user数据
    emits('wxid', val.wxid);
  }
}

</script>

<template>
  <div>
    <!-- 搜索框以及按钮   -->
    <div style="padding: 10px 10px;">
      <el-input placeholder="请输入关键字" v-model="search_word" @keyup.enter="search"
                style="width: 170px;margin-left: 15px;"></el-input>
      <el-button type="primary" @click="search" style="width: 50px;">搜索</el-button>
    </div>
    <!--  这是联系人的list    -->
    <el-table :data="tableData" stripe style="width: 100%" max-height="100%" height="100%" highlight-current-row
              @current-change="handleCurrentChange">
      <el-table-column width="57">
        <template v-slot="{ row }">
          <el-avatar :size="33" :src="'/api/imgsrc/'+row.headImgUrl" v-if="row.headImgUrl!==''">
          </el-avatar>
          <el-avatar :size="33" v-else>
            群聊
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column width="190">
        <template v-slot="{ row }">
          <el-tooltip class="item" effect="light" v-if="row.LabelIDList.length>0"
                      :content="showTooltipValue(row.LabelIDList)" placement="right">
            <span v-if="row.remark !== null && row.remark !== ''">{{ row.remark }}</span>
            <span v-else>{{ row.nickname }}</span>
          </el-tooltip>
          <template v-else>
            <span v-if="row.remark !== null && row.remark !== ''">{{ row.remark }}</span>
            <span v-else>{{ row.nickname }}</span>
          </template>

          <br>
          <span v-if="row.LastReadedCreateTime"
                style="color: #909399;font-size: 12px;">{{ row.LastReadedCreateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>