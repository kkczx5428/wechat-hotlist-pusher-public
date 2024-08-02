<script setup lang="ts">
import {defineEmits, defineProps, nextTick, onMounted, ref, watch} from 'vue';
import http from "@/utils/axios.js";
import {ElTable, ElNotification, ElMessage, ElMessageBox} from "element-plus";
import {apiMsgCount, apiRealTime, apiUserList} from "@/api/chat";

interface User {
  wxid: string
  nOrder: number
  nUnReadCount: number
  strNickName: string
  nStatus: number
  nIsSend: number
  strContent: string
  nMsgLocalID: number
  nMsgStatus: number
  nTime: string
  nMsgType: number
  nMsgSubType: number
  nickname: string
  remark: string
  account: string
  describe: string
  headImgUrl: string
  ExtraBuf: string
  LabelIDList: string[]
}

const props = defineProps({
  wxid: {
    type: String,
    required: true,
  }
});

const userinfo = ref<User>({
  wxid: '',
  nOrder: 0,
  nUnReadCount: 0,
  strNickName: '',
  nStatus: 0,
  nIsSend: 0,
  strContent: '',
  nMsgLocalID: 0,
  nMsgStatus: 0,
  nTime: '',
  nMsgType: 0,
  nMsgSubType: 0,
  nickname: '',
  remark: '',
  account: '',
  describe: '',
  headImgUrl: '',
  ExtraBuf: '',
  LabelIDList: []
});
const msg_count = ref<number>(0);

// 请求数据，赋值 START
const req_user_info = async () => {
  // 请求数据 用户信息
  try {
    const body_data = await apiUserList("", [props.wxid]);
    userinfo.value.wxid = props.wxid;
    userinfo.value.account = body_data[props.wxid].account;
    userinfo.value.describe = body_data[props.wxid].describe;
    userinfo.value.headImgUrl = body_data[props.wxid].headImgUrl;
    userinfo.value.nickname = body_data[props.wxid].nickname;
    userinfo.value.remark = body_data[props.wxid].remark;
    return body_data;
  } catch (error) {
    console.error('Error fetching data wxid2user :', error);
    return [];
  }
}

const req_msg_count = async () => {
  try {
    const body_data = await apiMsgCount([props.wxid]);
    msg_count.value = body_data[props.wxid];
    return body_data;
  } catch (error) {
    console.error('Error fetching data msg_count:', error);
    return [];
  }
}
// 请求数据，赋值 END

// 初始调用函数 START
const init = async () => {
  is_export.value = false;
  await req_user_info();
  await req_msg_count();
}
onMounted(() => {
  init();
});

watch(() => props.wxid, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await init();
  }
});
// 初始调用函数 END

// 获取实时消息 START
const is_getting_real_time_msg = ref(false);
const get_real_time_msg = async () => {
  if (is_getting_real_time_msg.value) {
    console.log("正在获取实时消息，请稍后再试!")
    return;
  }
  is_getting_real_time_msg.value = true;
  try {
    const body_data = await apiRealTime();
    is_getting_real_time_msg.value = false;
    return body_data;
  } catch (error) {
    is_getting_real_time_msg.value = false;
    return [];
  }
}
// 获取实时消息 END

// 导出消息按钮，并传递是否导出给父组件 START
const is_export = ref(false);
const emits = defineEmits(['exporting']);
const export_button = (val: boolean) => {
// 提交参数 is_export 给父组件
  emits('exporting', val);
  is_export.value = val;
}
// 导出消息按钮，并传递是否导出给父组件 END


</script>

<template>

  <el-row :gutter="5" style="width: 100%;">
    <el-col :span="6" style="white-space: nowrap;">
      <el-text class="label_color mx-1" truncated>wxid:</el-text>&ensp;
      <el-text class="data_color mx-1" truncated :title="userinfo.wxid">{{ userinfo.wxid }}</el-text>
    </el-col>
    <el-col :span="6" style="white-space: nowrap;">
      <el-text class="label_color mx-1" truncated>账号:</el-text>&ensp;
      <el-text class="data_color mx-1" truncated :title="userinfo.account">{{ userinfo.account }}</el-text>
    </el-col>
    <el-col :span="6" style="white-space: nowrap;">
      <el-text class="label_color mx-1" truncated>昵称:</el-text>&ensp;
      <el-text class="data_color mx-1" truncated :title="userinfo.nickname">{{ userinfo.nickname }}</el-text>
    </el-col>
    <el-col :span="6" style="white-space: nowrap;">
      <el-text class="label_color mx-1" truncated>备注:</el-text>&ensp;
      <el-text class="data_color mx-1" truncated :title="userinfo.remark">{{ userinfo.remark }}</el-text>
    </el-col>
  </el-row>

  <el-row :gutter="5" style="width: 100%;">
    <el-col :span="3" style="white-space: nowrap;">
      <el-text class="label_color mx-1" truncated>数量:</el-text>&ensp;
      <el-text class="data_color mx-1" truncated :title="msg_count">{{ msg_count }}</el-text>
    </el-col>
    <el-col :span="15" style="white-space: nowrap;">
      <el-text class="label_color mx-1" truncated>描述:</el-text>&ensp;
      <el-text class="data_color mx-1" truncated :title="userinfo.describe">{{ userinfo.describe }}</el-text>
    </el-col>
    <el-col :span="3" style="white-space: nowrap;">
      <el-text class="button_color mx-1 underline" truncated @click="get_real_time_msg();">实时消息
        <template v-if="is_getting_real_time_msg" style="color: #00bd7e">(获取中)</template>
      </el-text>
    </el-col>
    <el-col :span="3" style="white-space: nowrap;">
      <el-text v-if="!is_export" class="button_color mx-1 underline" truncated @click="export_button(true);">导出备份
      </el-text>
      <el-text v-if="is_export" class="button_color mx-1 underline" truncated @click="export_button(false);">聊天查看
      </el-text>
    </el-col>
  </el-row>

</template>

<style scoped>
.label_color {
  color: #333; /* 调整字体颜色 */
  font-size: 15px;
  padding-left: 15px;
  padding-right: 0;
}

.data_color {
  color: #08488c;
  background-color: #f4f4f4; /* 调整背景颜色 */
  font-size: 15px;
  padding-left: 6px;
  padding-right: 6px;
  font-weight: bold; /* 使用 bold 表示加粗 */
  white-space: nowrap;
  max-width: 80%;
}

.button_color {
  color: #0048ff; /* 调整字体颜色 */
  font-size: 15px;
  padding-left: 15px;
  padding-right: 0;
  text-decoration: underline;
}

</style>