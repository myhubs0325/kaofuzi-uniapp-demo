<template>
  <section class="desktop-site-messages">
    <header class="desktop-site-messages-header">
      <div class="desktop-site-messages-header-leading">
        <button type="button" class="desktop-site-messages-back" aria-label="返回上一级" @click="goBack">
          <ArrowLeft :size="18" />
        </button>
        <div>
          <span>消息中心</span>
          <h1>站内信</h1>
          <p>查看系统通知与任务消息，点击消息即可回到对应流程。</p>
        </div>
      </div>
      <div class="desktop-site-messages-count">
        <Mail :size="17" />
        <strong>{{ unreadCount }}</strong>
        <span>条未读</span>
      </div>
    </header>

    <div class="desktop-site-messages-layout">
      <main class="desktop-site-messages-list" aria-label="站内信列表">
        <button
          v-for="message in siteMessages"
          :key="message.id"
          type="button"
          :class="['desktop-site-message-card', { unread: message.unread }]"
          @click="openMessage(message)"
        >
          <span :class="['desktop-site-message-icon', message.tone]"><Mail :size="21" /></span>
          <span class="desktop-site-message-copy">
            <span class="desktop-site-message-title-line">
              <strong>{{ message.title }}</strong>
              <i v-if="message.unread" aria-label="未读" />
            </span>
            <small>{{ message.summary }}</small>
            <time>{{ message.time }}</time>
          </span>
          <ChevronRight :size="19" class="desktop-site-message-chevron" />
        </button>
      </main>

      <aside class="desktop-site-messages-aside">
        <div class="desktop-site-messages-aside-icon"><Mail :size="23" /></div>
        <span>消息提醒</span>
        <h2>完成一步，回来就能看到结果</h2>
        <p>系统会在练习、作业分析和老师反馈完成后，把重要进展放进站内信。</p>
        <button type="button" class="desktop-site-messages-aside-button" @click="markAllRead">全部标记为已读</button>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, ChevronRight, Mail } from "lucide-vue-next";
import { computed } from "vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { markSiteMessageRead, siteMessages, type SiteMessage } from "../data/siteMessages";

const props = defineProps<{
  goBack: () => void;
  handleAction: (event: DemoEvent) => void;
}>();

const unreadCount = computed(() => siteMessages.filter((message) => message.unread).length);

const openMessage = (message: SiteMessage) => {
  markSiteMessageRead(message.id);
  props.handleAction(message.action);
};

const markAllRead = () => {
  siteMessages.forEach((message) => markSiteMessageRead(message.id));
};
</script>

<style scoped>
.desktop-site-messages {
  display: grid;
  gap: 20px;
}

.desktop-site-messages-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(60, 60, 67, 0.1);
}

.desktop-site-messages-header-leading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.desktop-site-messages-back {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  padding: 0;
  color: #6e6e73;
  background: transparent;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

.desktop-site-messages-back:hover,
.desktop-site-messages-back:focus-visible {
  color: #007aff;
  background: rgba(0, 122, 255, 0.08);
  outline: none;
}

.desktop-site-messages-header span,
.desktop-site-messages-aside > span {
  color: #007aff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.desktop-site-messages-header h1 {
  margin: 4px 0 5px;
  color: #1d1d1f;
  font-size: 28px;
  letter-spacing: -0.04em;
}

.desktop-site-messages-header p,
.desktop-site-messages-aside p {
  margin: 0;
  color: #6e6e73;
  font-size: 13px;
  line-height: 1.6;
}

.desktop-site-messages-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  color: #007aff;
  background: rgba(0, 122, 255, 0.08);
  border: 1px solid rgba(0, 122, 255, 0.12);
  border-radius: 999px;
  white-space: nowrap;
}

.desktop-site-messages-count strong {
  font-size: 15px;
}

.desktop-site-messages-count span {
  color: #6e6e73;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
}

.desktop-site-messages-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(270px, 0.68fr);
  gap: 18px;
  align-items: start;
}

.desktop-site-messages-list {
  display: grid;
  gap: 10px;
}

.desktop-site-message-card {
  width: 100%;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 20px;
  gap: 14px;
  align-items: center;
  padding: 16px;
  color: #1d1d1f;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(171, 190, 218, 0.38);
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(52, 69, 98, 0.04);
  cursor: pointer;
  text-align: left;
  transition: 180ms ease;
}

.desktop-site-message-card:hover,
.desktop-site-message-card:focus-visible {
  border-color: rgba(0, 122, 255, 0.32);
  background: #fff;
  box-shadow: 0 12px 26px rgba(0, 122, 255, 0.08);
  outline: none;
  transform: translateY(-1px);
}

.desktop-site-message-card.unread {
  background: linear-gradient(135deg, rgba(247, 251, 255, 0.98), rgba(255, 255, 255, 0.86));
}

.desktop-site-message-icon,
.desktop-site-messages-aside-icon {
  display: grid;
  place-items: center;
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  border-radius: 14px;
}

.desktop-site-message-icon {
  width: 48px;
  height: 48px;
}

.desktop-site-message-icon.orange {
  color: #ff9f0a;
  background: rgba(255, 159, 10, 0.12);
}

.desktop-site-message-icon.green {
  color: #34c759;
  background: rgba(52, 199, 89, 0.12);
}

.desktop-site-message-copy {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.desktop-site-message-title-line {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.desktop-site-message-title-line strong {
  font-size: 15px;
}

.desktop-site-message-title-line i {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  background: #ff3b30;
  border-radius: 50%;
}

.desktop-site-message-copy small,
.desktop-site-message-copy time {
  color: #6e6e73;
  font-size: 12px;
  line-height: 1.5;
}

.desktop-site-message-copy time {
  color: #8e8e93;
  font-size: 11px;
}

.desktop-site-message-chevron {
  color: #c7c7cc;
}

.desktop-site-messages-aside {
  position: sticky;
  top: 18px;
  display: grid;
  gap: 10px;
  padding: 22px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(239, 247, 255, 0.8));
  border: 1px solid rgba(125, 179, 244, 0.28);
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(52, 69, 98, 0.05);
}

.desktop-site-messages-aside-icon {
  width: 46px;
  height: 46px;
  margin-bottom: 3px;
}

.desktop-site-messages-aside h2 {
  margin: 0;
  color: #1d1d1f;
  font-size: 19px;
  line-height: 1.35;
}

.desktop-site-messages-aside-button {
  min-height: 40px;
  margin-top: 7px;
  color: #007aff;
  background: rgba(0, 122, 255, 0.09);
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 820px) {
  .desktop-site-messages-layout {
    grid-template-columns: 1fr;
  }

  .desktop-site-messages-aside {
    position: static;
  }
}

@media (max-width: 560px) {
  .desktop-site-messages-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
