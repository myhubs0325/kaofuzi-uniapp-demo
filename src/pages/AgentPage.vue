<template>
  <PhoneScaffold
    title="家长反馈"
    :meta="`${demoData.student.name} · 家长手动补充`"
    content-class="insight-content study-survey-content"
    shell-class="insight-shell"
    active-tab="agent"
    @navigate="$emit('navigate', $event)"
  >
    <section class="insight-hero-card study-survey-hero-card">
      <div class="study-survey-trust-line">
        <span>
          <ShieldCheck :size="17" />
          老师数据加上家长观察，系统会更准
        </span>
        <small>{{ demoData.teacher.syncedAt }}</small>
      </div>

      <div class="insight-hero-top">
        <div class="insight-hero-copy">
          <span class="insight-kicker">孩子近期状态反馈</span>
          <h2>家长补几条真实情况，系统更会安排</h2>
          <p>老师反馈和作答结果只能看到一部分。把孩子最近真实的学习状态补进来，系统才能更有针对性地安排题量、讲解和节奏。</p>
        </div>
        <div class="insight-hero-icon study-survey-hero-icon">
          <FileText :size="28" />
        </div>
      </div>

      <div class="insight-chip-row">
        <span class="insight-chip">家长手动补充</span>
        <span class="insight-chip">大约 1 分钟</span>
        <span class="insight-chip">用于更精准推荐</span>
      </div>

      <div class="insight-stat-grid">
        <div class="insight-stat-card study-survey-stat-card">
          <span>系统已经有</span>
          <strong>老师反馈 + 作答数据</strong>
        </div>
        <div class="insight-stat-card study-survey-stat-card">
          <span>这页要补上</span>
          <strong>家长看到的真实状态</strong>
        </div>
      </div>
    </section>

    <section class="insight-section-card">
      <div class="study-survey-guide-card">
        <div class="study-survey-guide-head">
          <strong>这一页怎么填</strong>
          <span>上面是介绍，下面这些才需要操作</span>
        </div>

        <div class="study-survey-guide-list">
          <div class="study-survey-guide-item tone-info">
            <small>介绍区</small>
            <strong>顶部卡片只用看，不用选也不用填</strong>
          </div>
          <div class="study-survey-guide-item tone-required">
            <small>必选区</small>
            <strong>下面 4 组每组都要选 1 项</strong>
          </div>
          <div class="study-survey-guide-item tone-optional">
            <small>选填区</small>
            <strong>最后文本框按需补充，不写也能提交</strong>
          </div>
        </div>
      </div>

      <div class="insight-section-head">
        <strong>请补充这些真实情况</strong>
        <span>必选 {{ surveyFields.length }} 项，已选 {{ selectedCount }} 项</span>
      </div>

      <div class="study-survey-field-list">
        <article
          v-for="field in surveyFields"
          :key="field.key"
          :class="['study-survey-field-card', { 'is-complete': selections[field.key] }]"
        >
          <div class="study-survey-field-head">
            <div class="study-survey-field-title-row">
              <strong>{{ field.title }}</strong>
              <span :class="['study-survey-field-tag', { complete: selections[field.key] }]">
                {{ selections[field.key] ? "已选" : "必选" }}
              </span>
            </div>
            <span>{{ field.summary }}</span>
            <small class="study-survey-field-tip">
              {{ selections[field.key] ? "这一项已完成，也可以重新改选" : "请在下面选择 1 项" }}
            </small>
          </div>

          <div class="study-survey-choice-grid">
            <button
              v-for="option in field.options"
              :key="option.key"
              type="button"
              :class="['study-survey-choice', { active: selections[field.key] === option.key }]"
              @click="selectOption(field.key, option.key)"
            >
              <strong>{{ option.label }}</strong>
              <small>{{ option.hint }}</small>
            </button>
          </div>
        </article>
      </div>

      <section class="study-survey-note-card">
        <div class="study-survey-note-head">
          <div class="study-survey-field-title-row">
            <strong>家长再补一句真实情况</strong>
            <span class="study-survey-field-tag optional">选填</span>
          </div>
          <span>这一项不是必须，不填也可以直接提交。</span>
        </div>

        <label class="study-survey-note-field">
          <span>补充说明</span>
          <textarea
            v-model="parentNote"
            maxlength="80"
            placeholder="比如：孩子愿意算题，但一做应用题就急，不愿意慢慢读题。"
            @input="persistDraft"
          />
          <small>如果孩子最近状态有变化，或者上面的选项不够准确，再在这里补一句最有用。</small>
        </label>
      </section>
    </section>

    <div class="study-survey-submit-note">
      <CheckCircle2 :size="18" />
      <span v-if="canSubmit">4 项必选都选完了，下面补充说明可写可不写，现在就能提交。</span>
      <span v-else>还差 {{ missingCount }} 项必选未选，带“必选”标签的题都要先选 1 项。</span>
    </div>

    <button
      type="button"
      class="primary-button insight-primary-button study-survey-primary-button"
      :disabled="!canSubmit || isSubmitting"
      @click="handleSubmit"
    >
      {{ isSubmitting ? "正在整理反馈..." : "提交这份家长反馈" }}
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck
} from "lucide-vue-next";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";
import {
  createEmptyStudySurveySelections,
  readStudySurvey,
  saveStudySurvey,
  studySurveyFields as surveyFields
} from "../data/studySurvey";
import type { StudySurveySelections, SurveyFieldKey } from "../data/studySurvey";

const selections = reactive<StudySurveySelections>(createEmptyStudySurveySelections());

const parentNote = ref("");
const isSubmitting = ref(false);
let submitTimer: number | null = null;

const emit = defineEmits<{
  navigate: ["home" | "agent" | "learning" | "profile"];
  action: [DemoEvent];
}>();

onMounted(() => {
  const savedSurvey = readStudySurvey();
  if (!savedSurvey) return;
  Object.assign(selections, savedSurvey.selections);
  parentNote.value = savedSurvey.parentNote;
});

onBeforeUnmount(() => {
  if (submitTimer !== null) window.clearTimeout(submitTimer);
});

const missingCount = computed(() => surveyFields.filter((field) => !selections[field.key]).length);
const selectedCount = computed(() => surveyFields.length - missingCount.value);
const canSubmit = computed(() => missingCount.value === 0);

const persistDraft = () => {
  saveStudySurvey({
    selections: { ...selections },
    parentNote: parentNote.value,
    submittedAt: ""
  });
};

const selectOption = (fieldKey: SurveyFieldKey, optionKey: string) => {
  selections[fieldKey] = optionKey;
  persistDraft();
};

const handleSubmit = () => {
  if (!canSubmit.value || isSubmitting.value) return;

  isSubmitting.value = true;
  saveStudySurvey({
    selections: { ...selections },
    parentNote: parentNote.value.trim(),
    submittedAt: new Date().toISOString()
  });

  submitTimer = window.setTimeout(() => {
    isSubmitting.value = false;
    submitTimer = null;
    emit("action", "SUBMIT_STUDY_SURVEY");
  }, 360);
};
</script>
