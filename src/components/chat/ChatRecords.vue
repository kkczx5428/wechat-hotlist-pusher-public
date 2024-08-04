<script setup lang="ts">
import ChatRecprdsHeader from '@/components/chat/ChatRecprdsHeader.vue';
import ChatRecordsMain from '@/components/chat/ChatRecordsMain.vue';
import {ref, defineProps, nextTick, onMounted, watch} from 'vue';
import http from "@/utils/axios.js";
import ChatExportMain from "@/components/chatBackup/ChatExportMain.vue";
import {apiMsgCount} from "@/api/chat";

// start 关于滚动条的操作

const scrollbarRef = ref(null);
const chatRecordsMainRef = ref(null);
const scrollTop = ref(0);
const scrollHeight = ref(0);

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      // 假设el-scrollbar在DOM中是一个具体的元素
      const target = scrollbarRef.value.$el.children[0];
      if (target) {
        target.scrollTop = target.scrollHeight;
        scrollHeight.value = target.scrollHeight;
      }
    }
  });
};

const updateScrollTop = () => {
  const target = scrollbarRef.value.$el.children[0];
  if (target) {
    const lastScrollHeight = scrollHeight.value;
    const heightDiff = target.scrollHeight - lastScrollHeight;
    target.scrollTop = target.scrollTop + heightDiff;
    scrollHeight.value = target.scrollHeight;
  }
}

function handleScroll({scrollTop}) {
  if (scrollTop === 0) {
    if (chatRecordsMainRef.value) {
      chatRecordsMainRef.value.loadMore()
    }
  }
}

// end 关于滚动条的操作

const props = defineProps({
  wxid: {
    type: String,
    required: true,
  }
});

// 导出聊天记录页面是否显示
const is_export = ref(false);
const onExport = (exporting: boolean) => {
  is_export.value = exporting;
}
// end 导出聊天记录页面是否显示

// start 监测wxid变化，初始化数据
const init = () => {
  is_export.value = false;
  // 等待数据加载完成后，再滚动到底部
 nextTick(() => {
    scrollToBottom();
  });
}
watch(() => props.wxid, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    init();
  }
});
onMounted(() => {
  init();
});
// end 监测wxid变化，初始化数据
</script>

<template>
  <el-container>
    <el-header style="height: 40px; max-height: 40px; width: 100%;background-color: #d2d2fa;padding-top: 5px;">
      <ChatRecprdsHeader :wxid="wxid" @exporting="onExport"/>
    </el-header>

    <el-main style="overflow-y: auto; height: calc(100vh - 65px);padding: 0">
      <el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
        <ChatExportMain v-if="is_export" :wxid="wxid"/>
        <ChatRecordsMain v-else
                         ref="chatRecordsMainRef"
                         :wxid="wxid"
                         :setScrollTop="scrollToBottom"
                         :updateScrollTop="updateScrollTop"
        />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
