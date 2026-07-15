<template>
  <PhoneScaffold
    title="预习讲解"
    meta="生成课件和教案"
    content-class="preview-lesson-content"
    shell-class="preview-lesson-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'OPEN_TUTOR')"
  >
    <section class="preview-lesson-hero-card">
      <div class="preview-lesson-hero-top">
        <div class="preview-lesson-hero-copy">
          <span class="preview-lesson-kicker">三年级预习课件</span>
          <h2>选择学科和课题，生成可讲解的互动课件</h2>
          <p>支持课件预览、语音讲解、下载课件和下载文字教案。</p>
        </div>
        <div class="preview-lesson-hero-icon">
          <Presentation :size="28" />
        </div>
      </div>
    </section>

    <section class="preview-lesson-builder-card">
      <div class="preview-lesson-section-head">
        <strong>先选内容</strong>
        <span>数据来源于人教版教材</span>
      </div>

      <div class="preview-lesson-select-group">
        <small>选择学科</small>
        <div class="preview-lesson-select-field">
          <select
            :value="selectedSubjectKey"
            @change="selectSubject(($event.target as HTMLSelectElement).value as LessonSubjectKey)"
          >
            <option
              v-for="subject in subjectOptions"
              :key="subject.key"
              :value="subject.key"
            >
              {{ subject.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="preview-lesson-select-group">
        <small>选择课题</small>
        <div class="preview-lesson-select-field">
          <select v-model="selectedTopicKey">
            <option
              v-for="topic in currentSubjectTopics"
              :key="topic.key"
              :value="topic.key"
            >
              {{ topic.topic }}
            </option>
          </select>
        </div>
      </div>

      <button type="button" class="primary-button preview-lesson-primary-button" @click="generateLesson">
        <WandSparkles :size="20" />
        生成预习课件
      </button>
    </section>

    <template v-if="generatedLesson">
      <section class="preview-lesson-ppt-card">
        <div class="preview-lesson-section-head">
          <strong>PPT 预览</strong>
          <span>{{ generatedLesson.topic }} · 第 {{ currentSlideIndex + 1 }} / {{ generatedLesson.slides.length }} 页</span>
        </div>

        <div class="preview-lesson-toolbar">
          <button type="button" class="preview-lesson-tool-button" @click="toggleSpeak">
            <component :is="isSpeaking ? VolumeX : Volume2" :size="17" />
            {{ isSpeaking ? "停止讲解" : "语音讲解本页" }}
          </button>
          <button type="button" class="preview-lesson-tool-button" @click="downloadDeck">
            <Download :size="17" />
            下载课件
          </button>
        </div>

        <div class="preview-slide-card">
          <div class="preview-slide-top">
            <span>{{ currentSlide.kicker }}</span>
            <strong>{{ currentSlide.title }}</strong>
          </div>

          <ul class="preview-slide-bullets">
            <li v-for="point in currentSlide.bullets" :key="point">{{ point }}</li>
          </ul>

          <div class="preview-slide-interaction">
            <div class="preview-slide-interaction-head">
              <strong>{{ currentSlide.interactionTitle }}</strong>
              <span>点击查看</span>
            </div>
            <div class="preview-slide-interaction-tabs">
              <button
                v-for="(item, index) in currentSlide.interactions"
                :key="item.label"
                type="button"
                :class="{ active: selectedInteractionIndex === index }"
                @click="selectedInteractionIndex = index"
              >
                {{ item.label }}
              </button>
            </div>
            <div class="preview-slide-interaction-detail">
              {{ currentInteraction.detail }}
            </div>
          </div>
        </div>

        <div class="preview-slide-nav">
          <button type="button" class="preview-lesson-tool-button" :disabled="currentSlideIndex === 0" @click="previousSlide">
            上一页
          </button>
          <button
            type="button"
            class="preview-lesson-tool-button"
            :disabled="currentSlideIndex === generatedLesson.slides.length - 1"
            @click="nextSlide"
          >
            下一页
          </button>
        </div>
      </section>

      <section class="preview-lesson-plan-card">
        <div class="preview-lesson-section-head">
          <strong>文字教案</strong>
          <span>点击展开查看</span>
        </div>

        <div class="preview-lesson-toolbar">
          <button type="button" class="preview-lesson-tool-button" @click="toggleAllPlans">
            <ListCollapse :size="17" />
            {{ allExpanded ? "全部收起" : "全部展开" }}
          </button>
          <button type="button" class="preview-lesson-tool-button" @click="downloadLessonPlan">
            <FileDown :size="17" />
            下载教案
          </button>
        </div>

        <div class="preview-plan-list">
          <article v-for="(section, index) in generatedLesson.lessonPlan" :key="section.title" class="preview-plan-item">
            <button type="button" class="preview-plan-head" @click="togglePlan(index)">
              <div>
                <strong>{{ section.title }}</strong>
                <span>{{ section.duration }}</span>
              </div>
              <ChevronDown :size="18" :class="{ expanded: expandedPlanIndices.includes(index) }" />
            </button>
            <div v-if="expandedPlanIndices.includes(index)" class="preview-plan-body">
              <p>{{ section.summary }}</p>
              <ul>
                <li v-for="point in section.content" :key="point">{{ point }}</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <button
        type="button"
        class="primary-button preview-lesson-primary-button"
        @click="$emit('openPractice')"
      >
        <WandSparkles :size="20" />
        根据当前课题出题练习
      </button>
    </template>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  ChevronDown,
  Download,
  FileDown,
  ListCollapse,
  Presentation,
  Volume2,
  VolumeX,
  WandSparkles
} from "lucide-vue-next";
import { computed, onBeforeUnmount, ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";

type LessonSubjectKey = "math" | "chinese" | "english";

type LessonSlide = {
  kicker: string;
  title: string;
  bullets: string[];
  interactionTitle: string;
  interactions: Array<{ label: string; detail: string }>;
};

type LessonPlanSection = {
  title: string;
  duration: string;
  summary: string;
  content: string[];
};

type LessonTemplate = {
  key: string;
  subject: LessonSubjectKey;
  subjectLabel: string;
  topic: string;
  summary: string;
  slides: LessonSlide[];
  lessonPlan: LessonPlanSection[];
};

const lessonTemplates: LessonTemplate[] = [
  {
    key: "math_borrow",
    subject: "math",
    subjectLabel: "数学",
    topic: "三位数连续退位减法",
    summary: "先认识借位顺序，再看每一位为什么要变化。",
    slides: [
      {
        kicker: "第 1 页",
        title: "连续退位减法先看哪里",
        bullets: ["先看个位够不够减。", "不够减时，要向前一位借 1。", "借过以后，前一位会变小。"],
        interactionTitle: "点击看重点",
        interactions: [
          { label: "个位", detail: "个位不够减，就从十位借 1，再把个位看成 12 去减。" },
          { label: "十位", detail: "十位被借走 1 以后，要先减 1，再继续跟减数比较。" }
        ]
      },
      {
        kicker: "第 2 页",
        title: "例题：502 - 178",
        bullets: ["个位：2 不够减 8，先借 1，变成 12 - 8 = 4。", "十位被借走后变成 9，再算 9 - 7 = 2。", "百位 5 借给十位后变成 4，再算 4 - 1 = 3。"],
        interactionTitle: "点击看步骤",
        interactions: [
          { label: "第一步", detail: "个位先借位，不能直接拿 2 去减 8。" },
          { label: "第二步", detail: "十位不是原来的 0，而是借位后的 9。" }
        ]
      },
      {
        kicker: "第 3 页",
        title: "容易错在哪里",
        bullets: ["最容易错的是借位后还按原来的数字算。", "只要记住“借过以后先变小”，就不容易错。", "先做一步，再看下一步，不要跳。"],
        interactionTitle: "点击看提醒",
        interactions: [
          { label: "常错点", detail: "把十位还当成 0 来减，就会多算 10。" },
          { label: "方法", detail: "每借一次，就先把被借走的那一位改掉，再继续算。" }
        ]
      }
    ],
    lessonPlan: [
      {
        title: "导入",
        duration: "约 2 分钟",
        summary: "先让孩子回忆两位数借位减法，再过渡到三位数。",
        content: ["先提问：42 - 18 为什么要借位？", "再说明三位数只是多了一位，但顺序一样。"]
      },
      {
        title: "新知讲解",
        duration: "约 4 分钟",
        summary: "用 502 - 178 讲清楚连续退位的三步。",
        content: ["先讲个位借位。", "再讲十位借位后变成 9。", "最后讲百位借出去后变成 4。"]
      },
      {
        title: "互动提问",
        duration: "约 2 分钟",
        summary: "用口头问答检查孩子是否真正听懂。",
        content: ["问：十位原来是 0，为什么后来能减 7？", "问：百位为什么会从 5 变成 4？"]
      }
    ]
  },
  {
    key: "math_perimeter",
    subject: "math",
    subjectLabel: "数学",
    topic: "长方形和正方形的周长",
    summary: "先认识周长是什么意思，再学会用边长求周长。",
    slides: [
      {
        kicker: "第 1 页",
        title: "周长是什么意思",
        bullets: ["围成一个图形一圈的长度，就是周长。", "可以把周长理解为沿着边走一圈。", "求周长就是把四条边加起来。"],
        interactionTitle: "点击看理解",
        interactions: [
          { label: "一圈", detail: "从一个点出发，沿着边走回原点，就是一圈。" },
          { label: "长度", detail: "周长看的是所有边的总长度，不是里面的面积。" }
        ]
      },
      {
        kicker: "第 2 页",
        title: "长方形怎么求周长",
        bullets: ["长方形有 2 条长边、2 条宽边。", "周长 = 长 + 长 + 宽 + 宽。", "也可以写成 周长 = （长 + 宽）× 2。"],
        interactionTitle: "点击看公式",
        interactions: [
          { label: "直接相加", detail: "一条一条加起来，更适合第一次理解。" },
          { label: "简便公式", detail: "会了以后可以用（长 + 宽）× 2 更快。" }
        ]
      },
      {
        kicker: "第 3 页",
        title: "正方形怎么求周长",
        bullets: ["正方形四条边一样长。", "周长 = 边长 × 4。", "先看清边长是多少，再乘 4。"],
        interactionTitle: "点击看提醒",
        interactions: [
          { label: "关键点", detail: "正方形四条边都一样，所以不用分长和宽。" },
          { label: "常错点", detail: "有的孩子会把周长和面积弄混，要先分清。 " }
        ]
      }
    ],
    lessonPlan: [
      {
        title: "导入",
        duration: "约 2 分钟",
        summary: "先从“围操场走一圈”引出周长的概念。",
        content: ["让孩子想象沿着操场边线走一圈。", "说明一圈的长度就是周长。"]
      },
      {
        title: "长方形讲解",
        duration: "约 3 分钟",
        summary: "先看长边和宽边各有几条，再讲公式。",
        content: ["数一数有几条长边、几条宽边。", "再把四条边全部加起来。"]
      },
      {
        title: "正方形讲解",
        duration: "约 2 分钟",
        summary: "强调四条边都一样长。",
        content: ["先确认正方形四条边一样。", "再讲边长乘 4。"]
      }
    ]
  },
  {
    key: "chinese_waiting",
    subject: "chinese",
    subjectLabel: "语文",
    topic: "《守株待兔》预习讲解",
    summary: "先认识故事内容，再明白寓意，不死记硬背。",
    slides: [
      {
        kicker: "第 1 页",
        title: "这篇课文讲了什么",
        bullets: ["一个农夫偶然捡到撞树的兔子。", "后来他天天守在树边等兔子。", "结果田荒了，也没有再等到兔子。"],
        interactionTitle: "点击看情节",
        interactions: [
          { label: "开始", detail: "农夫一开始是偶然捡到兔子，并不是靠自己的劳动。" },
          { label: "后来", detail: "他把偶然发生的事，当成每天都会发生的事。 " }
        ]
      },
      {
        kicker: "第 2 页",
        title: "课文里的重点词",
        bullets: ["守：守在一个地方不走。", "株：树桩。", "待：等待。"],
        interactionTitle: "点击看词义",
        interactions: [
          { label: "守株", detail: "不是守整棵树，而是守着树桩等兔子。" },
          { label: "待兔", detail: "意思是等兔子自己再来，不主动劳动。 " }
        ]
      },
      {
        kicker: "第 3 页",
        title: "这则寓言告诉我们什么",
        bullets: ["不能把偶然得到的东西当成天天都会有。", "不能不劳动，只想着靠运气。", "做事要踏实，不能只等好事自己来。"],
        interactionTitle: "点击看寓意",
        interactions: [
          { label: "做人", detail: "做人做事不能偷懒，靠运气不可靠。" },
          { label: "学习", detail: "学习也一样，不能想着不复习就能考好。 " }
        ]
      }
    ],
    lessonPlan: [
      {
        title: "导入故事",
        duration: "约 2 分钟",
        summary: "先讲一个农夫等兔子的故事，引起兴趣。",
        content: ["先问孩子：如果捡到一只兔子，会不会天天等下一只？", "再引出课文题目。"]
      },
      {
        title: "词语预习",
        duration: "约 3 分钟",
        summary: "重点理解守、株、待这三个词。",
        content: ["结合插图解释树桩。", "让孩子说说“守株待兔”字面是什么意思。"]
      },
      {
        title: "寓意理解",
        duration: "约 3 分钟",
        summary: "把故事和现实生活联系起来。",
        content: ["引导孩子说说为什么不能只靠运气。", "联系学习：要靠努力，不靠碰运气。"]
      }
    ]
  },
  {
    key: "english_at_zoo",
    subject: "english",
    subjectLabel: "英语",
    topic: "Unit 3 At the zoo",
    summary: "先认识动物特征表达，再能用简单句描述。",
    slides: [
      {
        kicker: "第 1 页",
        title: "这节课要认识哪些单词",
        bullets: ["long, short, big, small", "tail, eyes, nose", "monkey, elephant, giraffe"],
        interactionTitle: "点击看词义",
        interactions: [
          { label: "形容词", detail: "long 是长，short 是短，big 是大，small 是小。" },
          { label: "身体部位", detail: "tail 是尾巴，eyes 是眼睛，nose 是鼻子。" }
        ]
      },
      {
        kicker: "第 2 页",
        title: "怎么描述动物",
        bullets: ["It has a long nose.", "It has small eyes.", "It has a short tail."],
        interactionTitle: "点击看句型",
        interactions: [
          { label: "It has...", detail: "描述动物特征时，可以用 It has... 这个句型。" },
          { label: "替换练习", detail: "把 long nose 换成 short tail、big eyes，都可以继续说。" }
        ]
      },
      {
        kicker: "第 3 页",
        title: "课堂小互动",
        bullets: ["看图片，说出动物的一个特征。", "试着用 It has... 说完整。", "先说对一个特征，再慢慢扩展。"],
        interactionTitle: "点击看互动方式",
        interactions: [
          { label: "看图说词", detail: "先看到图片，先说出 long nose、short tail 这样的词组。" },
          { label: "说完整句", detail: "再把词组放进 It has... 里，说成完整句子。 " }
        ]
      }
    ],
    lessonPlan: [
      {
        title: "热身导入",
        duration: "约 2 分钟",
        summary: "先看动物图片，复习 monkey、elephant。",
        content: ["先让孩子说认识的动物。", "再引出这节课要说动物特征。"]
      },
      {
        title: "新词讲解",
        duration: "约 3 分钟",
        summary: "先讲形容词，再讲身体部位。",
        content: ["long / short / big / small", "tail / eyes / nose"]
      },
      {
        title: "句型练习",
        duration: "约 3 分钟",
        summary: "用 It has... 描述动物。",
        content: ["先读句型。", "再看图替换成不同特征。"]
      }
    ]
  }
];

defineEmits<{
  action: [DemoEvent];
  openPractice: [];
}>();

const subjectOptions = [
  { key: "math" as const, label: "数学" },
  { key: "chinese" as const, label: "语文" },
  { key: "english" as const, label: "英语" }
];

const randomTemplate = lessonTemplates[Math.floor(Math.random() * lessonTemplates.length)];
const selectedSubjectKey = ref<LessonSubjectKey>(randomTemplate.subject);
const selectedTopicKey = ref(randomTemplate.key);
const generatedLesson = ref<LessonTemplate | null>(lessonTemplates.find((item) => item.key === randomTemplate.key) ?? null);
const currentSlideIndex = ref(0);
const selectedInteractionIndex = ref(0);
const expandedPlanIndices = ref<number[]>([0]);
const isSpeaking = ref(false);

const currentSubjectTopics = computed(() =>
  lessonTemplates.filter((item) => item.subject === selectedSubjectKey.value)
);

const currentSlide = computed(() => generatedLesson.value?.slides[currentSlideIndex.value] ?? lessonTemplates[0].slides[0]);
const currentInteraction = computed(
  () => currentSlide.value.interactions[selectedInteractionIndex.value] ?? currentSlide.value.interactions[0]
);
const allExpanded = computed(
  () => generatedLesson.value !== null && expandedPlanIndices.value.length === generatedLesson.value.lessonPlan.length
);

const selectSubject = (subjectKey: LessonSubjectKey) => {
  selectedSubjectKey.value = subjectKey;
  const nextTopic = lessonTemplates.find((item) => item.subject === subjectKey);
  if (nextTopic) selectedTopicKey.value = nextTopic.key;
};

const generateLesson = () => {
  const lesson = lessonTemplates.find((item) => item.key === selectedTopicKey.value);
  if (!lesson) return;
  generatedLesson.value = lesson;
  currentSlideIndex.value = 0;
  selectedInteractionIndex.value = 0;
  expandedPlanIndices.value = [0];
  stopSpeaking();
};

const previousSlide = () => {
  if (!generatedLesson.value || currentSlideIndex.value === 0) return;
  currentSlideIndex.value -= 1;
  selectedInteractionIndex.value = 0;
  stopSpeaking();
};

const nextSlide = () => {
  if (!generatedLesson.value || currentSlideIndex.value >= generatedLesson.value.slides.length - 1) return;
  currentSlideIndex.value += 1;
  selectedInteractionIndex.value = 0;
  stopSpeaking();
};

const togglePlan = (index: number) => {
  if (expandedPlanIndices.value.includes(index)) {
    expandedPlanIndices.value = expandedPlanIndices.value.filter((item) => item !== index);
    return;
  }
  expandedPlanIndices.value = [...expandedPlanIndices.value, index];
};

const toggleAllPlans = () => {
  if (!generatedLesson.value) return;
  expandedPlanIndices.value = allExpanded.value
    ? []
    : generatedLesson.value.lessonPlan.map((_, index) => index);
};

const stopSpeaking = () => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  isSpeaking.value = false;
};

const toggleSpeak = () => {
  if (!generatedLesson.value || !("speechSynthesis" in window)) return;
  if (isSpeaking.value) {
    stopSpeaking();
    return;
  }

  const planSection = generatedLesson.value.lessonPlan[currentSlideIndex.value] ?? generatedLesson.value.lessonPlan[0];
  const text = [
    `${generatedLesson.value.subjectLabel}，${generatedLesson.value.topic}。`,
    currentSlide.value.title,
    ...currentSlide.value.bullets,
    planSection.title,
    ...planSection.content
  ].join("。");

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.95;
  utterance.onend = () => {
    isSpeaking.value = false;
  };
  utterance.onerror = () => {
    isSpeaking.value = false;
  };
  isSpeaking.value = true;
  window.speechSynthesis.speak(utterance);
};

const downloadDeck = () => {
  if (!generatedLesson.value) return;
  const html = `
  <html lang="zh-CN">
    <head><meta charset="utf-8"><title>${generatedLesson.value.topic}课件</title></head>
    <body style="font-family: Arial, 'Microsoft YaHei', sans-serif; padding: 24px;">
      <h1>${generatedLesson.value.subjectLabel} · ${generatedLesson.value.topic}</h1>
      ${generatedLesson.value.slides
        .map(
          (slide, index) => `
            <section style="margin-bottom: 24px; padding: 20px; border: 1px solid #d7e0f0; border-radius: 16px;">
              <small>第 ${index + 1} 页</small>
              <h2>${slide.title}</h2>
              <ul>${slide.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
            </section>
          `
        )
        .join("")}
    </body>
  </html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${generatedLesson.value.topic}-课件.html`;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadLessonPlan = () => {
  if (!generatedLesson.value) return;
  const text = [
    `${generatedLesson.value.subjectLabel} · ${generatedLesson.value.topic}`,
    "",
    ...generatedLesson.value.lessonPlan.flatMap((section, index) => [
      `${index + 1}. ${section.title}（${section.duration}）`,
      section.summary,
      ...section.content.map((item) => `- ${item}`),
      ""
    ])
  ].join("\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${generatedLesson.value.topic}-教案.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

onBeforeUnmount(stopSpeaking);
</script>
