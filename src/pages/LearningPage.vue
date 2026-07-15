<template>
  <PhoneScaffold
    title="学习进展"
    :meta="`${demoData.student.name} · 本周总览`"
    content-class="insight-content learning-dashboard-content"
    shell-class="insight-shell"
    active-tab="learning"
    @navigate="$emit('navigate', $event)"
  >
    <section class="insight-hero-card learning-hero-card">
      <div class="learning-trust-line">
        <span>
          <ShieldCheck :size="17" />
          已按老师反馈和练习结果更新
        </span>
        <small>{{ demoData.teacher.syncedAt }}</small>
      </div>

      <div class="insight-hero-top">
        <div class="insight-hero-copy">
          <span class="insight-kicker">学习进展总览</span>
          <h2>这周已经看见实打实的进步</h2>
          <p>连续退位减法已经开始稳住，下一步主要盯应用题读题。学习入口和先后顺序，系统已经帮你排好了。</p>
        </div>
        <div class="insight-hero-icon learning-hero-icon">
          <GraduationCap :size="28" />
        </div>
      </div>

      <div class="insight-chip-row">
        <span class="insight-chip">{{ demoData.teacher.assessmentName }}</span>
        <span class="insight-chip">今日任务 {{ demoData.task.durationMinutes }} 分钟</span>
        <span class="insight-chip">这周已练 {{ weeklyPracticeCount }} 次</span>
      </div>

      <div class="insight-stat-grid">
        <div class="insight-stat-card learning-stat-card">
          <span>本周完成</span>
          <strong>{{ weeklyPracticeCount }} 次练习</strong>
        </div>
        <div class="insight-stat-card learning-stat-card">
          <span>已补会</span>
          <strong>{{ demoData.progress.closedKnowledgePoints }} 个知识点</strong>
        </div>
        <div class="insight-stat-card learning-stat-card">
          <span>当前正确率</span>
          <strong>{{ demoData.progress.currentAccuracy }}%</strong>
        </div>
        <div class="insight-stat-card learning-stat-card">
          <span>下一步重点</span>
          <strong>{{ demoData.progress.focus.title }}</strong>
        </div>
      </div>
    </section>

    <section class="insight-section-card">
      <div class="insight-section-head">
        <strong>已经整理好的学习入口</strong>
        <span>从最值得开始的放前面</span>
      </div>

      <div class="insight-scene-grid learning-scene-grid">
        <button
          v-for="item in learningEntries"
          :key="item.title"
          type="button"
          class="insight-scene-card learning-scene-card"
          @click="$emit('action', item.event)"
        >
          <div class="insight-scene-top learning-scene-top">
            <div :class="['learning-scene-icon', item.tone]">
              <component :is="item.icon" :size="20" />
            </div>
            <small>{{ item.badge }}</small>
          </div>
          <strong>{{ item.title }}</strong>
          <p>{{ item.summary }}</p>
          <div class="learning-scene-link">
            <span>{{ item.actionLabel }}</span>
            <ArrowRight :size="16" />
          </div>
        </button>
      </div>
    </section>

    <section class="insight-section-card">
      <div class="insight-section-head">
        <strong>家长最该知道的进度</strong>
        <span>看懂这几条就够了</span>
      </div>

      <div class="learning-progress-grid">
        <article class="insight-stat-card learning-progress-card">
          <span>同类题变化</span>
          <strong>{{ demoData.progress.previousAccuracy }}% → {{ demoData.progress.currentAccuracy }}%</strong>
          <p>换成大白话，就是每 10 题大约多做对 {{ extraCorrectPerTen }} 题。</p>
        </article>
        <article class="insight-stat-card learning-progress-card">
          <span>已经稳住</span>
          <strong>{{ demoData.progress.teacherJudgement }}</strong>
          <p>{{ demoData.progress.growthItems[0]?.summary }}</p>
        </article>
        <article class="insight-stat-card learning-progress-card wide">
          <span>继续往上走的关键</span>
          <strong>{{ demoData.progress.focus.title }}</strong>
          <p>{{ demoData.progress.focus.summary }}</p>
        </article>
      </div>
    </section>

    <section class="insight-note-card learning-note-card">
      <span>老师这次提醒</span>
      <strong>{{ demoData.progress.teacherNote }}</strong>
      <button type="button" class="learning-note-button" @click="$emit('action', 'OPEN_TEACHER_FEEDBACK')">
        查看老师反馈
        <ArrowRight :size="16" />
      </button>
    </section>

    <button type="button" class="primary-button insight-primary-button learning-primary-button" @click="$emit('action', 'START_TASK')">
      先开始今天这组 {{ demoData.task.durationMinutes }} 分钟练习
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  BookMarked,
  CalendarDays,
  GraduationCap,
  MessageSquareText,
  ShieldCheck,
  TrendingUp
} from "lucide-vue-next";
import type { Component } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import { demoData, featureOverviews } from "../data/demoData";
import type { DemoEvent } from "../composables/useDemoFlow";

type LearningEntry = {
  title: string;
  badge: string;
  summary: string;
  actionLabel: string;
  tone: string;
  icon: Component;
  event: DemoEvent;
};

const weeklyPracticeCount = 4;
const extraCorrectPerTen = Math.round(demoData.progress.currentAccuracy / 10) - Math.round(demoData.progress.previousAccuracy / 10);

const learningEntries: LearningEntry[] = [
  {
    title: featureOverviews.wrongBook.title,
    badge: "优先处理",
    summary: "先练重复出错最多的 3 类错题，不用自己再找从哪道开始。",
    actionLabel: "查看错题本",
    tone: "wrong-book-card",
    icon: BookMarked,
    event: "OPEN_WRONG_BOOK"
  },
  {
    title: featureOverviews.examPrep.title,
    badge: "离测评 5 天",
    summary: "把最容易重复失分的地方往前放，适合这几天集中提分。",
    actionLabel: "进入考前冲刺",
    tone: "exam-card",
    icon: CalendarDays,
    event: "OPEN_EXAM_PREP"
  },
  {
    title: "学习报告",
    badge: "变化已整理",
    summary: `把 ${demoData.progress.previousAccuracy}% 到 ${demoData.progress.currentAccuracy}% 的变化讲清楚，家长一眼能看懂。`,
    actionLabel: "查看学习报告",
    tone: "report-card",
    icon: TrendingUp,
    event: "VIEW_PROGRESS"
  },
  {
    title: featureOverviews.teacherFeedback.title,
    badge: "老师新提醒",
    summary: "把老师这次重点提到的进步和继续关注点单独列出来。",
    actionLabel: "查看老师反馈",
    tone: "feedback-card",
    icon: MessageSquareText,
    event: "OPEN_TEACHER_FEEDBACK"
  }
];

defineEmits<{
  navigate: ["home" | "agent" | "learning" | "profile"];
  action: [DemoEvent];
}>();
</script>
