<script setup lang="ts">
import {defineEmits, onMounted, ref} from 'vue';
import http from '@/utils/axios.js';
import {apiUserList, apiUserSessionList} from "@/api/chat";

// "wxid": strUsrName, "nOrder": nOrder, "nUnReadCount": nUnReadCount, "strNickName": strNickName,
// "nStatus": nStatus, "nIsSend": nIsSend, "strContent": strContent, "nMsgLocalID": nMsgLocalID,
// "nMsgStatus": nMsgStatus, "nTime": nTime, "nMsgType": nMsgType, "nMsgSubType": nMsgSubType,
// "nickname": NickName, "remark": Remark, "account": Alias,
// "describe": describe, "headImgUrl": bigHeadImgUrl if bigHeadImgUrl else "",
// "ExtraBuf": ExtraBuf, "LabelIDList": tuple(LabelIDList)

interface ExtraBuf {
  "个性签名": string
  "企微属性": string
  "公司名称": string
  "国": string
  "备注图片": string
  "备注图片2": string
  "市": string
  "性别[1男2女]": number
  "手机号": string
  "朋友圈背景": string
  "省": string
}

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
  ExtraBuf: ExtraBuf
  LabelIDList: string[]
}

const tableData = ref([]);


// 初始化请求session数据 START
const fetchData = async () => {
  try {
    tableData.value = await apiUserSessionList();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
onMounted(fetchData);
// END 初始化请求session数据 END

// 搜索框以及按钮 START
const search_word = ref('');
const search = async () => {
  try {
    // console.log(body_data);
    if (search_word.value === '') {
      tableData.value = await apiUserSessionList();
      return;
    }
    console.log(search_word.value);
    tableData.value = []
    const ret = await apiUserList(search_word.value);
    if (ret !== null && typeof ret === 'object') {
      Object.entries(ret).forEach(([key, value]) => {
        tableData.value.push(value);
      });
    }
    // for (const key in ret) {
    //   if (ret.hasOwnProperty(key)) {
    //     tableData.value.push(ret[key]);
    //   }
    // }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
// END 搜索框以及按钮 END

// 处理user数据 传递给父组件 START
const emits = defineEmits(['wxid']);

const handleCurrentChange = (val: User | undefined) => {
  // 触发自定义事件，并传递数据
  if (val !== undefined) {
    // 处理user数据
    // 判断val是否有wxid
    if (val.wxid !== undefined) {
      emits('wxid', val.wxid);
    }
  }
}
// END 处理user数据 传递给父组件 END

// 鼠标移动到名字上面的提示信息
const gen_tip = (row: User) => {
  `{
    "ExtraBuf": {
        "个性签名": "",
        "企微属性": "",
        "公司名称": "",
        "国": "IE",
        "备注图片": "",
        "备注图片2": "",
        "市": "",
        "性别[1男2女]": 2,
        "手机号": "",
        "朋友圈背景": "http://shmmsns.qpic.cn/mmsns/ppXZNKoLHJ5JSrsBENOFia3wyc8PXGuF9AibzyKxU8NAJKrNxaU5B9e7aRtZl7dHwzjWDqgOUbyjc/0",
        "省": "Roscommon"
    },
    "LabelIDList": [
        "网友"
    ],
    "LastReadedCreateTime": "2024-08-03 18:21:41",
    "account": "xin616806",
    "describe": "",
    "headImgUrl": "https://wx.qlogo.cn/mmhead/ver_1/av0XoGhCdAbYwIP8omcQ1NIJO2lLVwyib09hNGDGkl1sf5LesYtfibcNhvGTd9S4KNHn7xQVSaZvPd4ibGt2LibMO7AMPLSJcia0jUibtowmSTuicLZJT6opftQgyhI2J86fXwjXoJRvPpibJLHSL3C1CukqgQ/0",
    "nIsSend": 1,
    "nMsgLocalID": 22663,
    "nMsgStatus": 1,
    "nMsgSubType": 0,
    "nMsgType": 1,
    "nOrder": 1019742,
    "nStatus": 0,
    "nTime": "2024-08-03 18:21:41",
    "nUnReadCount": 0,
    "nickname": "昕",
    "remark": "昕昕-主",
    "strContent": "行",
    "strNickName": "昕",
    "wxid": "wxid_rmkzndnreo6t21"
}`
  const ExtraBuf = row.ExtraBuf;
  return `wxid：${row.wxid}<br>
账号：${row.account}<br>
昵称：${row.nickname}<br>
备注：${row.remark}<br>
性别：${ExtraBuf['性别[1男2女]'] == 1 ? '男' : ExtraBuf['性别[1男2女]'] == 2 ? '女' : ""}<br>
手机：${ExtraBuf['手机号']}<br>
标签：${row.LabelIDList.join('/')}<br>
描述：${row.describe}<br>
个签：${ExtraBuf['个性签名']}<br>
国家：${ExtraBuf['国']}<br>
省份：${ExtraBuf['省']}<br>
市名：${ExtraBuf['市']}<br>
公司：${ExtraBuf['公司名称']}<br>
企微：${ExtraBuf['企微属性']}`
}
// 生成显示的name
const gen_show_name = (row: User) => {
  return `${row.remark !== null && row.remark !== '' ? row.remark : row.nickname}`
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
          <el-avatar :size="33" :src="'/api/rs/imgsrc/'+row.headImgUrl" v-if="row.headImgUrl!==''"></el-avatar>
          <el-avatar :size="33" v-else> 群聊</el-avatar>
        </template>
      </el-table-column>
      <el-table-column width="190">
        <template v-slot="{ row }">
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content" class="tips">
              <span>{{ gen_show_name(row) }}</span> <br>
              <span v-if="row.nTime" style="color: #909399; font-size: 12px;">{{ row.nTime }}</span>
            </div>
            <template #content>
              <div v-html="gen_tip(row)"></div>
              朋友圈背景：<br><img v-if="row.ExtraBuf['朋友圈背景']" :src="'/api/rs/imgsrc/'+row.ExtraBuf['朋友圈背景']" style="width: 180px;max-height: 180px"/>
            </template>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
/* 允许提示内容换行 */
.el-tooltip__popper .popper__content {
  white-space: pre-line; /* 允许换行 */
}
</style>