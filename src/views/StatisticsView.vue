<script setup lang="ts">

import ChatStats from "@/components/stats/ChatStats.vue";
import {ref} from "vue";

const mene_selected = ref("date_chat_count");
const MeneSelect = (val: string) => {
  mene_selected.value = val;
}
</script>

<template>
  <!--    <h2 style="text-align: center">欢迎使用<a href="https://github.com/xaoyaoo/PyWxDump.git">PyWxDump</a>聊天记录查看工具!-->
  <!--    </h2>-->
  <!--    <h3 style="text-align: center">-->
  <!--      用于统计微信聊天记录，包括聊天记录数量、聊天记录总字数、聊天记录总图片数量<br>聊天记录总视频数量、聊天记录总文件数量、聊天记录总语音数量等等。-->
  <!--      行成统计报表，方便用户查看自己的聊天记录情况-->
  <!--    </h3>-->
  <div class="common-layout" style="height: 100vh;width: 100%;background-color: #d2d2fa;">
    <el-container style="height: calc(100vh);width: 100%;">
      <el-aside width="120px" style="height: 100%;">
        <el-menu style="height: 100%;background-color: #F7F7F7;color:#262626;"
                 default-active="date_chat_count"
                 class="el-menu-vertical-demo"
                 @select="MeneSelect"
        >
          <el-menu-item index="date_chat_count">
            <span>日聊天记录</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main style="height: 100%;width: 100%;margin: 0;padding: 0;">
        <chat-stats v-if="mene_selected=='date_chat_count'"/>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>