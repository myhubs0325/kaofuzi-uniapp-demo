<template>
  <PhoneScaffold
    title="学情分析结果"
    :meta="`${demoData.student.name} · 提交完成`"
    content-class="insight-content study-result-content"
    shell-class="insight-shell"
    active-tab="agent"
    @navigate="$emit('navigate', $event)"
  >
    <section class="insight-hero-card study-result-hero-card">
      <div class="study-result-hero-top">
        <div class="study-result-hero-copy">
          <span class="study-result-status"><CheckCircle2 :size="16" /> 提交完成</span>
          <span class="insight-kicker">系统已完成学情整理</span>
          <h2>下一次练习，会更贴近孩子现在的状态</h2>
          <p>这不是一张简单的填写记录，系统已经把家长观察和已有作答数据合在一起，生成了下一步练习重点。</p>
        </div>
        <div class="insight-hero-icon study-result-hero-icon">
          <Sparkles :size="28" />
        </div>
      </div>

      <div class="study-result-metric-grid">
        <div class="insight-stat-card study-result-metric-card">
          <span>已采集学情</span>
          <strong>{{ selectedCount }} / {{ studySurveyFields.length }}</strong>
          <small>家长观察已保存</small>
        </div>
        <div class="insight-stat-card study-result-metric-card">
          <span>首要关注</span>
          <strong>1 个</strong>
          <small>{{ focusOption.label }}</small>
        </div>
        <div class="insight-stat-card study-result-metric-card">
          <span>首轮安排</span>
          <strong>{{ demoData.task.questionCount }} 题</strong>
          <small>{{ demoData.task.durationMinutes }} 分钟完成</small>
        </div>
      </div>

      <div class="study-result-saved-line">
        <LockKeyhole :size="16" />
        <span>结果已保存，{{ submittedAtLabel }}刷新后仍可继续查看</span>
      </div>
    </section>

    <section class="insight-section-card study-result-section-card">
      <div class="insight-section-head">
        <strong>系统识别到的重点</strong>
        <span>基于本次提交</span>
      </div>

      <div class="study-result-focus-card">
        <div class="study-result-focus-icon"><Target :size="22" /></div>
        <div class="study-result-focus-copy">
          <small>优先处理的薄弱点</small>
          <strong>{{ focusOption.label }}</strong>
          <p>{{ focusOption.hint }}</p>
        </div>
        <span class="study-result-focus-tag">优先</span>
      </div>

      <div class="study-result-summary-list">
        <div v-for="item in summaryItems" :key="item.label" class="study-result-summary-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>

      <div v-if="noteText" class="study-result-parent-note">
        <small>家长补充</small>
        <p>“{{ noteText }}”</p>
      </div>
    </section>

    <section class="insight-section-card study-result-plan-card">
      <div class="insight-section-head">
        <strong>系统已经生成安排</strong>
        <span>下一步可直接开始</span>
      </div>

      <div class="study-result-plan-head">
        <div class="study-result-plan-icon"><ListChecks :size="22" /></div>
        <div>
          <small>首轮定向练习</small>
          <strong>{{ focusOption.label }}专项巩固</strong>
        </div>
      </div>
      <p class="study-result-plan-summary">
        先用 {{ demoData.task.questionCount }} 道题确认方法是否稳定，再根据结果补讲“{{ demoData.task.mistakeReason }}”。
      </p>
      <div class="study-result-plan-progress">
        <div>
          <span>任务准备度</span>
          <strong>100%</strong>
        </div>
        <div class="study-result-progress-track"><span /></div>
      </div>
    </section>

    <button type="button" class="primary-button insight-primary-button study-result-primary-button" @click="$emit('action', 'START_TASK')">
      开始针对性练习
      <ArrowRight :size="21" />
    </button>
    <button type="button" class="study-result-edit-button" @click="$emit('action', 'EDIT_STUDY_SURVEY')">
      修改这份学情信息
      <FilePenLine :size="17" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  CheckCircle2,
  FilePenLine,
  ListChecks,
  LockKeyhole,
  Sparkles,
  Target
} from "lucide-vue-next";
import { computed, ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";
import {
  createEmptyStudySurveySelections,
  readStudySurvey,
  studySurveyFields
} from "../data/studySurvey";
import type { StudySurveyRecord, SurveyFieldKey } from "../data/studySurvey";

const savedSurvey = readStudySurvey();
const survey = ref<StudySurveyRecord>(
  savedSurvey ?? {
    selections: createEmptyStudySurveySelections(),
    parentNote: "",
    submittedAt: ""
  }
);

const selectedCount = computed(
  () => Object.values(survey.value.selections).filter(Boolean).length
);

const getOption = (fieldKey: SurveyFieldKey) => {
  const field = studySurveyFields.find((item) => item.key === fieldKey);
  return field?.options.find((option) => option.key === survey.value.selections[fieldKey]) ?? {
    key: "pending",
    label: "待补充",
    hint: "提交后系统会根据这项信息生成安排"
  };
};

const focusOption = computed(() => getOption("weakness"));
const noteText = computed(() => survey.value.parentNote.trim());
const summaryItems = computed(() =>
  studySurveyFields.map((field) => ({
    label: field.title,
    value: getOption(field.key).label
  }))
);

const submittedAtLabel = computed(() => {
  if (!survey.value.submittedAt) return "刚刚提交，";
  const date = new Date(survey.value.submittedAt);
  if (Number.isNaN(date.getTime())) return "刚刚提交，";
  return `已于 ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} 保存，`;
});

defineEmits<{
  navigate: ["home" | "agent" | "learning" | "profile"];
  action: [DemoEvent];
}>();
</script>
