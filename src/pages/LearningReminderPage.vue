<template>
  <PhoneScaffold
    title="学习提醒"
    :meta="`${demoData.student.name} · 每天 1 条`"
    content-class="insight-content account-detail-content"
    shell-class="insight-shell"
    show-back
    active-tab="profile"
    @back="$emit('action', 'BACK_FROM_PROFILE_DETAIL')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="account-hero-card reminder-hero-card">
      <div class="account-hero-top">
        <div>
          <span class="account-kicker">每日提醒</span>
          <h2>每天只提醒一次，盯住当天该完成的任务</h2>
          <p>提醒内容会按系统当天安排生成，家长不用每天重新找练什么。</p>
        </div>
        <div class="account-hero-icon reminder">
          <Bell :size="28" />
        </div>
      </div>

      <button type="button" :class="['account-switch-row', { active: enabled }]" @click="enabled = !enabled">
        <span>{{ enabled ? "学习提醒已开启" : "学习提醒已关闭" }}</span>
        <b>{{ enabled ? "开" : "关" }}</b>
      </button>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>提醒时间</strong>
        <span>选一个老人也容易记的时间</span>
      </div>

      <div class="account-segment-grid">
        <button
          v-for="time in reminderTimes"
          :key="time"
          type="button"
          :class="{ active: selectedTime === time }"
          @click="selectedTime = time"
        >
          <Clock3 :size="18" />
          <span>{{ time }}</span>
        </button>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>每天提醒什么</strong>
        <span>一条消息说清楚</span>
      </div>

      <div class="reminder-preview-card">
        <MessageSquareText :size="22" />
        <div>
          <strong>今天 {{ selectedTime }} 提醒</strong>
          <p>{{ demoData.student.name }} 今天先完成 {{ demoData.task.durationMinutes }} 分钟“{{ demoData.task.title }}”练习，做完后看学习报告变化。</p>
        </div>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>完成情况</strong>
        <span>家长能一眼看到</span>
      </div>
      <div class="account-info-list">
        <div class="account-info-row">
          <span>今日任务</span>
          <strong>{{ taskDone ? "已完成" : "待完成" }}</strong>
        </div>
        <div class="account-info-row">
          <span>提醒频率</span>
          <strong>每天 1 条，不重复打扰</strong>
        </div>
      </div>
    </section>

    <button type="button" class="primary-button account-primary-button" @click="taskDone = !taskDone">
      {{ taskDone ? "标记为今天还没完成" : "标记今天已完成" }}
      <CheckCircle2 :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { Bell, CheckCircle2, Clock3, MessageSquareText } from "lucide-vue-next";
import { ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";

const enabled = ref(true);
const selectedTime = ref("晚上 7:30");
const taskDone = ref(false);
const reminderTimes = ["放学后 5:30", "晚上 7:30", "睡前 8:30"];

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
