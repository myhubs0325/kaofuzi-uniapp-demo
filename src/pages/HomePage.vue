<template>
  <PhoneScaffold
    title="考夫子教评助手"
    :meta="`${demoData.student.name} · ${demoData.student.grade}`"
    content-class="home-dashboard-content"
    shell-class="home-dashboard-shell"
    active-tab="home"
    :show-header="false"
    @navigate="$emit('navigate', $event)"
  >
    <section class="home-dashboard-hero">
      <div class="home-dashboard-toolbar">
        <div class="home-hero-copy-mini">
          <p>{{ greetingText }}，{{ demoData.student.name }}家长</p>
        </div>

        <button type="button" class="home-class-tag">
          {{ classTagLabel }}
        </button>
      </div>
    </section>

    <div class="home-dashboard-grid">
      <section class="home-panel home-panel-task">

        <div class="home-task-inline">
          <span>
            <Flame :size="16" />
            今日任务
          </span>
          <small>{{ demoData.teacher.name }}同步 {{ demoData.teacher.wrongQuestionCount }} 道错题</small>
          <strong>
            <CheckCircle2 :size="15" />
            已安排
          </strong>
        </div>

        <div class="home-task-card">
          <div class="task-value-chips">
            <span>
              <Flame :size="15" />
              今日优先
            </span>
            <span>
              <BadgePlus :size="15" />
              提分机会 +1
            </span>
          </div>

          <div class="home-task-main">
            <div class="home-task-left">
              <h2>先练 {{ demoData.task.durationMinutes }} 分钟</h2>

              <div class="task-card-meta">
                <span>
                  <BookOpenCheck :size="18" />
                  {{ demoData.task.questionCount }} 道题
                </span>
                <span>
                  <Clock3 :size="18" />
                  约 {{ demoData.task.durationMinutes }} 分钟
                </span>
              </div>
			  
			  
            </div>

            <div class="home-task-side">
              <p>{{ demoData.task.title }}</p>
      
            </div>
          </div>

          <button type="button" class="primary-button" @click="$emit('action', 'START_TASK')">
            现在开始
            <ArrowRight :size="21" />
          </button>
        </div>
      </section>

      <section class="home-panel home-panel-actions">
        <div class="home-panel-heading">
          <strong>快捷入口</strong>
          <span>点一下就能用</span>
        </div>

        <div class="home-shortcut-grid">
          <button
            v-for="feature in shortcutFeatures"
            :key="feature.title"
            type="button"
            class="home-shortcut-card"
            @click="$emit('action', feature.event)"
          >
            <span :class="['home-shortcut-icon', feature.tone]">
              <component :is="feature.icon" :size="24" />
            </span>
            <span class="home-shortcut-copy">
              <strong>{{ feature.title }}</strong>
              <small>{{ feature.badge }}</small>
            </span>
          </button>
        </div>
      </section>
    </div>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  BadgePlus,
  BookMarked,
  BookOpenCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  MessageSquareText,
  TrendingUp
} from "lucide-vue-next";
import type { Component } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import { demoData } from "../data/demoData";
import type { DemoEvent } from "../composables/useDemoFlow";

type ShortcutFeature = {
  title: string;
  badge: string;
  tone: string;
  icon: Component;
  event: DemoEvent;
};

defineEmits<{
  navigate: ["home" | "agent" | "learning" | "profile"];
  action: [DemoEvent];
}>();

const currentHour = new Date().getHours();
const greetingText =
  currentHour < 11 ? "上午好" : currentHour < 13 ? "中午好" : currentHour < 18 ? "下午好" : "晚上好";
const classTagLabel = `${demoData.student.className}/${demoData.student.name}`;

const shortcutFeatures: ShortcutFeature[] = [
  { title: "拍照检查作业", badge: "拍照就能看", tone: "photo-card", icon: Camera, event: "OPEN_PHOTO" },
  { title: "查看孩子错题", badge: "12 道待巩固", tone: "wrong-book-card", icon: BookMarked, event: "OPEN_WRONG_BOOK" },
  { title: "考前重点提分", badge: "还有 5 天", tone: "exam-card", icon: CalendarDays, event: "OPEN_EXAM_PREP" },
  { title: "课内知识巩固", badge: "预习复习都能用", tone: "tutor-card", icon: GraduationCap, event: "OPEN_TUTOR" },
  { title: "看看学习变化", badge: "最近有进步", tone: "report-card", icon: TrendingUp, event: "VIEW_PROGRESS" },
  { title: "查看老师提醒", badge: "1 条新消息", tone: "feedback-card", icon: MessageSquareText, event: "OPEN_TEACHER_FEEDBACK" }
];
</script>
