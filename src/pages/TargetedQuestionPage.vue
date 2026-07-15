<template>
  <PhoneScaffold
    title="针对出题"
    meta="先选课，再出题"
    content-class="simple-targeted-content"
    shell-class="simple-targeted-shell"
    show-back
    :show-nav="false"
    @back="$emit('back')"
  >
    <section class="simple-start-card">
      <div class="simple-card-head">
        <div>
          <span class="simple-kicker simple-kicker-blue">第一步</span>
          <h2>先选科目和课题</h2>
          <p>先选科目，再选多个课题。选好后，系统再开始针对出题。</p>
        </div>
      </div>

      <div class="simple-picker-card">
        <small>科目选择</small>
        <button type="button" class="simple-topic-button" @click="subjectSheetOpen = true">
          <div>
            <strong>{{ selectedSubject }}</strong>
            <p>点这里选择科目</p>
          </div>
          <ChevronRight :size="18" />
        </button>
      </div>

      <div class="simple-picker-card">
        <small>课题选择（可多选）</small>
        <button type="button" class="simple-topic-button" @click="topicSheetOpen = true">
          <div>
            <strong>{{ selectedTopics.join("、") }}</strong>
            <p>点这里勾选多个课题</p>
          </div>
          <ChevronRight :size="18" />
        </button>

        <div class="simple-topic-stack">
          <article
            v-for="topic in selectedTopicItems"
            :key="topic.label"
            class="simple-multi-topic-card selected"
          >
            <div>
              <strong>{{ topic.label }}</strong>
              <p>{{ topic.meta }}</p>
            </div>
            <span>已选</span>
          </article>
        </div>
      </div>

      <button
        type="button"
        class="primary-button simple-primary-button simple-primary-button-blue"
        @click="$emit('start')"
      >
        开始针对出题
        <ArrowRight :size="21" />
      </button>
    </section>

    <section class="simple-flow-card">
      <div class="simple-section-head">
        <strong>会这样出题</strong>
        <span>看一眼就懂</span>
      </div>

      <div class="simple-flow-list">
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-blue">1</b>
          <div>
            <strong>先看薄弱点</strong>
            <p>系统先找出最容易错的地方，不会随机出题。</p>
          </div>
        </article>
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-blue">2</b>
          <div>
            <strong>再把相关课题放进来</strong>
            <p>可以一口气选多个课题，拼成一套综合测试题。</p>
          </div>
        </article>
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-blue">3</b>
          <div>
            <strong>先出基础题</strong>
            <p>先看基础稳不稳，再往后加变式题和综合题。</p>
          </div>
        </article>
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-blue">4</b>
          <div>
            <strong>最后出综合题</strong>
            <p>把几节课的内容串起来，看孩子能不能真正用出来。</p>
          </div>
        </article>
      </div>
    </section>

    <MobileSelectSheet
      :open="subjectSheetOpen"
      title="选择科目"
      :options="subjectOptions"
      :selected-value="selectedSubject"
      @close="subjectSheetOpen = false"
      @select="selectSubject"
    />

    <MobileSelectSheet
      :open="topicSheetOpen"
      title="选择课题（可多选）"
      :options="currentTopicOptions"
      multiple
      :selected-values="selectedTopics"
      @close="topicSheetOpen = false"
      @toggle="toggleTopic"
      @confirm="topicSheetOpen = false"
    />
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowRight, ChevronRight } from "lucide-vue-next";
import MobileSelectSheet from "../components/MobileSelectSheet.vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";

defineEmits<{
  back: [];
  start: [];
}>();

const subjectOptions = [
  { label: "数学", meta: "已开通知识巩固" },
  { label: "语文", meta: "已开通知识巩固" },
  { label: "英语", meta: "已开通知识巩固" }
];

const topicData: Record<string, { label: string; meta: string }[]> = {
  数学: [
    { label: "分数的初步认识", meta: "基础概念还有点薄弱" },
    { label: "平均分与图形表示", meta: "和当前薄弱点相关，系统建议一起出题" },
    { label: "几分之一的读写", meta: "适合放进综合测试一起检查" }
  ],
  语文: [
    { label: "概括段落大意", meta: "适合做综合阅读训练" },
    { label: "理解重点句子", meta: "和当前薄弱点相关，建议一起出题" },
    { label: "找中心意思", meta: "适合放进综合测试一起检查" }
  ],
  英语: [
    { label: "现在进行时句型", meta: "基础句型还不够稳" },
    { label: "一般疑问句回答", meta: "和当前薄弱点相关，建议一起出题" },
    { label: "单词拼写与运用", meta: "适合放进综合测试一起检查" }
  ]
};

const selectedSubject = ref("数学");
const selectedTopics = ref<string[]>(["分数的初步认识", "平均分与图形表示"]);
const subjectSheetOpen = ref(false);
const topicSheetOpen = ref(false);

const currentTopicOptions = computed(() => topicData[selectedSubject.value]);
const selectedTopicItems = computed(() =>
  currentTopicOptions.value.filter((item) => selectedTopics.value.includes(item.label))
);

const selectSubject = (label: string) => {
  selectedSubject.value = label;
  selectedTopics.value = topicData[label].slice(0, 2).map((item) => item.label);
  subjectSheetOpen.value = false;
};

const toggleTopic = (label: string) => {
  if (selectedTopics.value.includes(label)) {
    if (selectedTopics.value.length === 1) return;
    selectedTopics.value = selectedTopics.value.filter((item) => item !== label);
    return;
  }
  selectedTopics.value = [...selectedTopics.value, label];
};
</script>
