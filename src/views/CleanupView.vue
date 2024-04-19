<script setup lang="ts">
import {ref} from "vue";
import HomeView from "@/views/HomeView.vue";
import ContactsList from "@/components/messages/ContactsList.vue";
import ChatExportMain from "@/components/chatBackup/ChatExportMain.vue";

</script>

<template>
  <div style="background-color: #d2d2fa; height: 100vh; display: grid; place-items: center; ">
    <h2 style="text-align: center">欢迎使用<a href="https://github.com/xaoyaoo/PyWxDump.git">PyWxDump</a>聊天记录查看工具!
    </h2>
    <h3 style="text-align: center">
      微信存储空间清理，减少微信占用空间<br>通过选择某个人或群，把这群里的聊天记录中涉及的图片、视频、文件、语音等的媒体文件找出来<br>
      以群对话为单位有选择性的（比如时间段）或按群会话批量从电脑的缓存中清除。
    </h3>
    <p>如需提前体验更多功能，请多多支持，多多鼓励！</p>
  </div>
</template>

<style scoped>

</style>