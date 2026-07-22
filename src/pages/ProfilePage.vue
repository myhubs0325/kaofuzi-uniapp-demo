<template>
  <PhoneScaffold
    title="我的"
    :meta="`${demoData.guardian.name} · 家长账号`"
    content-class="insight-content profile-account-content"
    shell-class="insight-shell"
    :show-profile-button="false"
    active-tab="profile"
    @navigate="$emit('navigate', $event)"
  >
    <section class="profile-hero-panel">
      <div class="profile-guardian-row">
        <span class="profile-child-avatar">{{ demoData.guardian.name.slice(0, 1) }}</span>
        <div>
          <span>当前账号</span>
          <strong>{{ demoData.guardian.name }}</strong>
          <small>{{ demoData.guardian.relation }} · {{ demoData.guardian.phone }}</small>
        </div>
      </div>

      <button type="button" class="bound-child-card" :aria-expanded="childSelectOpen" @click="childSelectOpen = true">
        <span class="profile-child-avatar child">{{ demoData.student.name.slice(-1) }}</span>
        <div>
          <strong>已绑定 {{ demoData.student.name }}</strong>
          <span>{{ demoData.student.grade }} · {{ demoData.student.className }}</span>
        </div>
        <ChevronRight :size="20" />
      </button>
    </section>

    <section class="profile-mode-panel">
      <div>
        <strong>长者模式</strong>
        <span>{{ elderMode ? "已开启，大字大按钮" : "已关闭，普通清爽比例" }}</span>
      </div>
      <button
        type="button"
        :class="['profile-mode-switch', { active: elderMode }]"
        :aria-pressed="elderMode"
        @click="$emit('toggleElderMode', !elderMode)"
      >
        <span>{{ elderMode ? "开" : "关" }}</span>
      </button>
    </section>

    <section class="insight-section-card profile-menu-section">
      <div class="insight-section-head">
        <strong>账号与服务</strong>
        <span>常用功能放在这里</span>
      </div>

      <div class="profile-menu-list">
        <button
          v-for="item in profileMenu"
          :key="item.title"
          type="button"
          class="profile-menu-card"
          @click="openProfileDetail(item.event)"
        >
          <span :class="['profile-menu-icon', item.tone]">
            <component :is="item.icon" :size="22" />
          </span>
          <span class="profile-menu-copy">
            <strong>{{ item.title }}</strong>
            <small>{{ item.summary }}</small>
          </span>
          <ChevronRight :size="20" />
        </button>
      </div>
    </section>

    <section class="insight-note-card profile-note-card">
      <span>给家长看的重点</span>
      <strong>家校绑定、提醒和隐私信息都放在“我的”里，字体和声音也可以按老人使用习惯调整。</strong>
    </section>
  </PhoneScaffold>

  <MobileSelectSheet
    :open="childSelectOpen"
    title="选择学生"
    :options="childSelectOptions"
    :selected-value="demoData.student.name"
    @close="childSelectOpen = false"
    @select="selectChild"
  />
</template>

<script setup lang="ts">
import {
  Bell,
  ChevronRight,
  Link2,
  Mail,
  Settings,
  Shield
} from "lucide-vue-next";
import { computed, ref, type Component } from "vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData, type DemoChild } from "../data/demoData";
import MobileSelectSheet from "../components/MobileSelectSheet.vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";

type ProfileMenuItem = {
  title: string;
  summary: string;
  tone: string;
  icon: Component;
  event: DemoEvent;
};

const profileMenu: ProfileMenuItem[] = [
  {
    title: "家校绑定",
    summary: `${demoData.teacher.name} · 已确认，可新增或取消绑定`,
    tone: "binding",
    icon: Link2,
    event: "OPEN_SCHOOL_BINDING"
  },
  {
    title: "站内信",
    summary: "查看系统通知与任务消息",
    tone: "messages",
    icon: Mail,
    event: "OPEN_MESSAGES"
  },
  {
    title: "学习提醒",
    summary: "每天 1 条消息，提醒完成对应学习任务",
    tone: "reminder",
    icon: Bell,
    event: "OPEN_LEARNING_REMINDER"
  },
  {
    title: "账号与数据",
    summary: "查看和修改账号、孩子姓名、班级等信息",
    tone: "privacy",
    icon: Shield,
    event: "OPEN_DATA_PRIVACY"
  },
  {
    title: "设置",
    summary: "字体、声音、密码修改、退出与注销",
    tone: "settings",
    icon: Settings,
    event: "OPEN_ACCOUNT_SETTINGS"
  }
];

const props = defineProps<{
  activeChildId: string;
  childOptions: DemoChild[];
  elderMode: boolean;
  switchChild: (childId: string, returnHome?: boolean) => void;
}>();

const childSelectOpen = ref(false);
const childSelectOptions = computed(() => props.childOptions.map((child) => ({
  label: child.student.name,
  meta: `${child.student.grade} · ${child.student.className}`
})));

const selectChild = (studentName: string) => {
  const child = props.childOptions.find((item) => item.student.name === studentName);
  if (!child) return;
  childSelectOpen.value = false;
  props.switchChild(child.id, false);
};

const emit = defineEmits<{
  navigate: ["home" | "agent" | "learning" | "profile"];
  action: [DemoEvent];
  toggleElderMode: [boolean];
}>();

const openProfileDetail = (event: DemoEvent) => {
  emit("action", event);
};
</script>
