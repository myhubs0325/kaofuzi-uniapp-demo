<template>
  <main :class="['desktop-demo-root', { 'desktop-elder-mode': isElderMode }]">
    <header class="desktop-global-header">
      <div class="desktop-brand">
        <span class="desktop-brand-kicker">Kaofuzi Demo</span>
        <strong>考夫子教评助手</strong>
        <small>家长学习空间</small>
      </div>

      <div class="desktop-global-title" aria-live="polite">
        <span>{{ sectionLabel }}</span>
        <strong>{{ title }}</strong>
      </div>

      <div class="desktop-global-tools">
        <button type="button" class="desktop-notification-button" aria-label="学习提醒" @click="$emit('feature-navigate', 'OPEN_LEARNING_REMINDER')">
          <Bell :size="18" />
          <span class="desktop-notification-badge">1</span>
        </button>
        <button type="button" class="desktop-topbar-elder" :aria-pressed="isElderMode" @click="setElderMode(!isElderMode)">
          <span />{{ isElderMode ? "长者模式" : "普通模式" }}
        </button>
        <div class="desktop-child-selector">
        <button type="button" class="desktop-student-chip" :aria-expanded="childMenuOpen" @click="childMenuOpen = !childMenuOpen">
          <span class="desktop-student-avatar">{{ studentName.slice(-1) }}</span>
          <span><strong>{{ gradeLabel }}</strong><small>{{ studentName }}</small></span>
        </button>
        <div v-if="childMenuOpen" class="desktop-child-menu">
          <button v-for="child in childOptions" :key="child.id" type="button" :class="['desktop-child-option', { active: child.id === activeChildId }]" @click="selectChild(child.id)">
            <span class="desktop-child-option-avatar">{{ child.student.name.slice(-1) }}</span>
            <span><strong>{{ child.student.name }}</strong><small>{{ child.student.className.replace(/\s/g, '') }}</small></span>
            <span v-if="child.id === activeChildId" class="desktop-child-check">✓</span>
          </button>
          <button type="button" class="desktop-child-manage" @click="$emit('open-privacy'); childMenuOpen = false">信息管理 <span>›</span></button>
        </div>
        </div>
      </div>
    </header>

    <div class="desktop-workspace">
      <aside class="desktop-rail">
        <nav class="desktop-primary-nav" aria-label="首页导航">
        <span class="desktop-nav-section-label">工作台</span>
        <button
          v-for="item in primaryNavLead"
          :key="item.key"
          type="button"
          :class="['desktop-nav-button', { active: activeTab === item.key && !activeFeatureKey }]"
          @click="$emit('navigate', item.key)"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </button>
        </nav>
        <nav class="desktop-feature-nav" aria-label="常用功能">
          <span class="desktop-nav-section-label">学习工具</span>
          <button
            v-for="item in featureNav"
            :key="item.key"
            type="button"
            :class="['desktop-nav-button', { active: activeFeatureKey === item.key }]"
            @click="$emit('feature-navigate', item.event)"
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.label }}</span>
          </button>
        </nav>
        <nav class="desktop-primary-nav desktop-secondary-nav" aria-label="主导航">
          <span class="desktop-nav-section-label">账户</span>
          <button
            v-for="item in primaryNavSecondary"
            :key="item.key"
            type="button"
            :class="['desktop-nav-button', { active: activeTab === item.key && !activeFeatureKey }]"
            @click="$emit('navigate', item.key)"
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.label }}</span>
          </button>
        </nav>

      </aside>

      <div class="desktop-stage">
      <header v-if="showTopbar" class="desktop-topbar">
        <div class="desktop-topbar-copy">
          <span>{{ sectionLabel }}</span>
          <h1>{{ title }}</h1>
          <p>{{ summary }}</p>
        </div>
        <div class="desktop-topbar-meta">
          <div class="desktop-topbar-student">
            <span class="desktop-student-avatar">{{ studentName.slice(-1) }}</span>
            <span><strong>{{ studentName }}</strong><small>{{ gradeLabel }}</small></span>
          </div>
          <button type="button" class="desktop-topbar-elder" :aria-pressed="isElderMode" @click="setElderMode(!isElderMode)">
            <span />{{ isElderMode ? "长者模式" : "普通模式" }}
          </button>
        </div>
      </header>

      <section class="desktop-content">
        <slot />
      </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Bell, BookMarked, BookOpenCheck, CalendarDays, Camera, GraduationCap, House, MessageSquareText, TrendingUp, UserRound } from "lucide-vue-next";
import type { DemoChild } from "../data/demoData";
import type { DemoEvent } from "../composables/useDemoFlow";

const props = defineProps<{
  activeTab: "home" | "agent" | "learning" | "profile";
  activeChildId: string;
  childOptions: DemoChild[];
  activeFeatureKey?: string;
  gradeLabel: string;
  sectionLabel: string;
  studentName: string;
  summary: string;
  title: string;
  showTopbar?: boolean;
  isElderMode: boolean;
  setElderMode: (enabled: boolean) => void;
  switchChild: (childId: string) => void;
}>();

defineEmits<{
  navigate: ["home" | "agent" | "learning" | "profile"];
  "feature-navigate": [DemoEvent];
  "open-privacy": [];
  reset: [];
}>();

const primaryNavLead = [
  { key: "home", label: "首页", icon: House },
] as const;

const primaryNavSecondary = [
  { key: "agent", label: "家长反馈", icon: GraduationCap },
  { key: "learning", label: "学习进展", icon: BookOpenCheck },
  { key: "profile", label: "我的", icon: UserRound }
] as const;

const featureNav = [
  { key: "photo", label: "拍照检查", icon: Camera, event: "OPEN_PHOTO" as DemoEvent },
  { key: "wrongBook", label: "错题本", icon: BookMarked, event: "OPEN_WRONG_BOOK" as DemoEvent },
  { key: "examPrep", label: "考前冲刺", icon: CalendarDays, event: "OPEN_EXAM_PREP" as DemoEvent },
  { key: "tutorExplain", label: "课内巩固", icon: BookOpenCheck, event: "OPEN_TUTOR" as DemoEvent },
  { key: "progress", label: "学习报告", icon: TrendingUp, event: "VIEW_PROGRESS" as DemoEvent },
  { key: "teacherFeedback", label: "老师反馈", icon: MessageSquareText, event: "OPEN_TEACHER_FEEDBACK" as DemoEvent }
] as const;

const childMenuOpen = ref(false);
const selectChild = (childId: string) => {
  childMenuOpen.value = false;
  props.switchChild(childId);
};
</script>
