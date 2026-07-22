<template>
  <PhoneScaffold
    title="站内信"
    meta="系统通知与任务消息"
    content-class="insight-content site-messages-content"
    shell-class="insight-shell"
    show-back
    active-tab="profile"
    @back="$emit('action', 'BACK_FROM_PROFILE_DETAIL')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="site-messages-hero">
      <div class="site-messages-hero-icon"><Mail :size="28" /></div>
      <div>
        <span>消息中心</span>
        <h2>重要的学习进展，都在这里</h2>
        <p>查看系统通知与任务消息，点击消息即可回到对应流程。</p>
      </div>
      <strong v-if="unreadCount" class="site-messages-unread-count">{{ unreadCount }} 条未读</strong>
    </section>

    <section class="site-messages-list" aria-label="站内信列表">
      <button
        v-for="message in siteMessages"
        :key="message.id"
        type="button"
        :class="['site-message-card', { unread: message.unread }]"
        @click="openMessage(message)"
      >
        <span :class="['site-message-icon', message.tone]"><Mail :size="20" /></span>
        <span class="site-message-copy">
          <span class="site-message-title-line">
            <strong>{{ message.title }}</strong>
            <i v-if="message.unread" aria-label="未读" />
          </span>
          <small>{{ message.summary }}</small>
          <time>{{ message.time }}</time>
        </span>
        <ChevronRight :size="19" class="site-message-chevron" />
      </button>

      <div v-if="siteMessages.length === 0" class="site-messages-empty">
        <Mail :size="28" />
        <strong>暂时没有新消息</strong>
        <span>完成学习任务后，相关通知会出现在这里。</span>
      </div>
    </section>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ChevronRight, Mail } from "lucide-vue-next";
import { computed } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { markSiteMessageRead, siteMessages, type SiteMessage } from "../data/siteMessages";

const unreadCount = computed(() => siteMessages.filter((message) => message.unread).length);

const openMessage = (message: SiteMessage) => {
  markSiteMessageRead(message.id);
  emit("action", message.action);
};

const emit = defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>

<style scoped>
.site-messages-content {
  gap: 14px;
}

.site-messages-hero {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 18px;
  color: #1d1d1f;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(239, 247, 255, 0.88));
  border: 1px solid rgba(10, 132, 255, 0.14);
  border-radius: 24px;
  box-shadow: 0 14px 32px rgba(73, 89, 108, 0.08);
}

.site-messages-hero-icon,
.site-message-icon {
  display: grid;
  place-items: center;
  color: #0a84ff;
  background: rgba(10, 132, 255, 0.11);
}

.site-messages-hero-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
}

.site-messages-hero span {
  color: #0a84ff;
  font-size: 12px;
  font-weight: 700;
}

.site-messages-hero h2 {
  margin: 4px 0 3px;
  font-size: 20px;
  line-height: 1.3;
}

.site-messages-hero p {
  margin: 0;
  color: #6e6e73;
  font-size: 12px;
  line-height: 1.5;
}

.site-messages-unread-count {
  align-self: start;
  padding: 6px 9px;
  color: #0a84ff;
  background: rgba(10, 132, 255, 0.1);
  border-radius: 999px;
  font-size: 11px;
  white-space: nowrap;
}

.site-messages-list {
  display: grid;
  gap: 10px;
}

.site-message-card {
  width: 100%;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 20px;
  gap: 12px;
  align-items: center;
  padding: 14px;
  color: #1d1d1f;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(224, 229, 236, 0.96);
  border-radius: 20px;
  cursor: pointer;
  text-align: left;
  transition: 180ms ease;
}

.site-message-card:hover,
.site-message-card:focus-visible {
  border-color: rgba(10, 132, 255, 0.32);
  box-shadow: 0 10px 24px rgba(10, 132, 255, 0.08);
  outline: none;
  transform: translateY(-1px);
}

.site-message-card.unread {
  background: rgba(247, 251, 255, 0.98);
}

.site-message-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
}

.site-message-icon.orange {
  color: #ff9f0a;
  background: rgba(255, 159, 10, 0.12);
}

.site-message-icon.green {
  color: #34c759;
  background: rgba(52, 199, 89, 0.12);
}

.site-message-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.site-message-title-line {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.site-message-title-line strong {
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-message-title-line i {
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  background: #ff3b30;
  border-radius: 50%;
}

.site-message-copy small,
.site-message-copy time {
  color: #6e6e73;
  font-size: 12px;
  line-height: 1.5;
}

.site-message-copy time {
  color: #8e8e93;
  font-size: 11px;
}

.site-message-chevron {
  color: #c7c7cc;
}

.site-messages-empty {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 42px 20px;
  color: #8e8e93;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(224, 229, 236, 0.96);
  border-radius: 22px;
  text-align: center;
}

.site-messages-empty strong {
  color: #1d1d1f;
}

.site-messages-empty span {
  font-size: 12px;
}

@media (max-width: 390px) {
  .site-messages-hero {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .site-messages-hero-icon {
    width: 48px;
    height: 48px;
  }

  .site-messages-unread-count {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
