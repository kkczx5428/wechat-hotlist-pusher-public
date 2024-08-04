<script setup lang="ts">

const props = defineProps({
  user: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

</script>

<template>
  <div>
    wxid：{{user.wxid}}<br>
    账号：{{user.account}}<br>
    昵称：{{user.nickname}}<br>
    备注：{{user.remark}}<br>
    性别：{{user.ExtraBuf['性别[1男2女]'] == 1 ? '男' : user.ExtraBuf['性别[1男2女]'] == 2 ? '女' : ""}}<br>
    手机：{{user.ExtraBuf['手机号']}}<br>
    标签：{{user.LabelIDList.join('/')}}<br>
    描述：{{user.describe}}<br>
    个签：{{user.ExtraBuf['个性签名']}}<br>
    国家：{{user.ExtraBuf['国']}}<br>
    省份：{{user.ExtraBuf['省']}}<br>
    市名：{{user.ExtraBuf['市']}}<br>
    公司：{{user.ExtraBuf['公司名称']}}<br>
    企微：{{user.ExtraBuf['企微属性']}}<br>
    朋友圈背景：<br>
    <img v-if="user.ExtraBuf['朋友圈背景']" :src="'/api/rs/imgsrc/'+user.ExtraBuf['朋友圈背景']"
         style="width: 180px;max-height: 180px" alt="朋友圈背景"/>
  </div>
</template>

<style scoped>

</style>