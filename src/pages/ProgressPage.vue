<template>
  <PhoneScaffold
    :title="`${demoData.student.name}的学习报告`"
    meta="本周成长"
    content-class="insight-content learning-report-mobile-content"
    shell-class="insight-shell"
    show-back
    active-tab="learning"
    @back="$emit('action', 'GO_HOME')"
    @navigate="$emit('navigate', $event)"
  >
    <div class="learning-report-mobile">
      <section class="learning-report-mobile-hero">
        <div class="learning-report-mobile-hero-top">
          <div>
            <span class="learning-report-mobile-kicker">学习成长</span>
            <h2>这周的进步，看得见</h2>
            <p>{{ learningReport.level.summary }}</p>
          </div>
          <div class="learning-report-mobile-level-mark">
            <strong>{{ learningReport.level.code }}</strong>
            <span>{{ learningReport.level.title }}</span>
          </div>
        </div>

        <div class="learning-report-mobile-level-progress">
          <div class="learning-report-mobile-level-label">
            <span>成长值 {{ learningReport.level.currentValue }}</span>
            <span>下一级 {{ learningReport.level.nextValue }}</span>
          </div>
          <div class="learning-report-mobile-progress-track">
            <span :style="{ width: `${learningReport.level.progress}%` }" />
          </div>
        </div>

        <div class="learning-report-mobile-hero-stats">
          <div>
            <strong>+{{ learningReport.weekly.growthValue }}</strong>
            <span>本周成长</span>
          </div>
          <div>
            <strong>{{ learningReport.weekly.activeDays }} 天</strong>
            <span>有效学习天数</span>
          </div>
          <div>
            <strong>{{ accuracyLift }}%</strong>
            <span>正确率提升</span>
          </div>
        </div>
      </section>

      <section class="learning-report-mobile-section">
        <div class="learning-report-mobile-section-head">
          <div>
            <span>进步证据</span>
            <strong>不是感觉变好，数据在变好</strong>
          </div>
          <TrendingUp :size="20" />
        </div>

        <div class="learning-report-mobile-proof-grid">
          <article>
            <small>当前正确率</small>
            <strong>{{ demoData.progress.currentAccuracy }}%</strong>
            <span>从 {{ demoData.progress.previousAccuracy }}% 提升</span>
          </article>
          <article>
            <small>已补会知识点</small>
            <strong>{{ learningReport.weekly.masteredKnowledgePoints }} 个</strong>
            <span>重点能力正在稳住</span>
          </article>
          <article>
            <small>错题回稳</small>
            <strong>{{ learningReport.weekly.stabilizedWrongQuestions }} / {{ learningReport.weekly.wrongQuestionTotal }}</strong>
            <span>经过复习再次答对</span>
          </article>
          <article>
            <small>本周有效学习</small>
            <strong>{{ learningReport.weekly.studyMinutes }} 分钟</strong>
            <span>完成 {{ learningReport.weekly.practiceCount }} 次练习</span>
          </article>
        </div>
      </section>

      <section class="learning-report-mobile-section learning-report-mobile-trend-section">
        <div class="learning-report-mobile-section-head">
          <div>
            <span>正确率趋势</span>
            <strong>{{ demoData.progress.previousAccuracy }}% → {{ demoData.progress.currentAccuracy }}%</strong>
          </div>
          <span class="learning-report-mobile-section-note">最近 4 周</span>
        </div>

        <div class="learning-report-mobile-chart" aria-label="最近四周正确率趋势">
          <svg viewBox="0 0 320 168" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="learningReportMobileFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stop-color="#5b9bff" stop-opacity=".28" />
                <stop offset="1" stop-color="#5b9bff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <line v-for="guide in trendGuides" :key="guide" x1="24" :y1="guide" x2="296" :y2="guide" class="learning-report-mobile-chart-guide" />
            <path :d="trendAreaPath" class="learning-report-mobile-chart-area" />
            <polyline :points="trendPolylinePoints" class="learning-report-mobile-chart-line" />
            <g v-for="point in trendChartPoints" :key="point.label">
              <text :x="point.x" :y="point.y - 12" text-anchor="middle" class="learning-report-mobile-chart-value">{{ point.value }}%</text>
              <circle :cx="point.x" :cy="point.y" r="5" class="learning-report-mobile-chart-dot" />
            </g>
          </svg>
        </div>

        <div class="learning-report-mobile-trend-labels">
          <div v-for="point in learningReport.accuracyTrend" :key="point.label">
            <strong>{{ point.value }}%</strong>
            <span>{{ point.label }}</span>
          </div>
        </div>
      </section>

      <section class="learning-report-mobile-section">
        <div class="learning-report-mobile-section-head">
          <div>
            <span>学习勋章</span>
            <strong>记录每一个具体的进步</strong>
          </div>
          <Award :size="20" />
        </div>

        <div class="learning-report-mobile-medal-list">
          <article v-for="badge in featuredBadges" :key="badge.key" :class="['learning-report-mobile-medal-card', { earned: badge.earned }]">
            <div class="learning-report-mobile-medal">
              <div class="learning-report-mobile-medal-art">
                <img :src="badgeAssets[badge.asset]" :alt="`${badge.title}图标`" />
              </div>
            </div>
            <div class="learning-report-mobile-medal-copy">
              <div>
                <strong>{{ badge.title }}</strong>
                <span>{{ badge.category }}</span>
              </div>
              <p>获得方式：{{ badge.detail }}</p>
                <small>{{ badge.description }}</small>
              <div v-if="!badge.earned" class="learning-report-mobile-medal-progress">
                <span><i :style="{ width: `${Math.round((badge.current / badge.total) * 100)}%` }" /></span>
                <small>{{ badge.current }} / {{ badge.total }}</small>
              </div>
            </div>
            <CheckCircle2 v-if="badge.earned" class="learning-report-mobile-medal-status" :size="19" />
            <LockKeyhole v-else class="learning-report-mobile-medal-status" :size="17" />
          </article>
        </div>
      </section>

      <section class="learning-report-mobile-focus">
        <div class="learning-report-mobile-focus-icon"><Target :size="20" /></div>
        <div>
          <span>下一步最值得练</span>
          <strong>{{ learningReport.nextStep.title }}</strong>
          <p>{{ learningReport.nextStep.summary }}</p>
        </div>
      </section>

      <button type="button" class="learning-report-mobile-primary" @click="$emit('action', 'START_TASK')">
        继续今天的学习
        <ArrowRight :size="20" />
      </button>
    </div>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Award,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Target,
  TrendingUp
} from "lucide-vue-next";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";
import { learningReport } from "../data/learningReport";

const accuracyLift = demoData.progress.currentAccuracy - demoData.progress.previousAccuracy;
const featuredBadges = learningReport.badges.slice(0, 3);
const badgeAssets = {
  effort: "/badges/medal-effort.png",
  champion: "/badges/medal-champion.png",
  knowledge: "/badges/medal-knowledge.png"
};

const accuracyTrend = learningReport.accuracyTrend;
const trendChartWidth = 320;
const trendChartHeight = 168;
const trendPaddingX = 28;
const trendPaddingTop = 26;
const trendPaddingBottom = 24;
const trendValues = accuracyTrend.map((point) => point.value);
const trendMin = Math.max(0, Math.min(...trendValues) - 8);
const trendMax = Math.min(100, Math.max(...trendValues) + 4);
const trendRange = Math.max(1, trendMax - trendMin);
const trendBaseY = trendChartHeight - trendPaddingBottom;
const trendGuides = [trendPaddingTop, (trendPaddingTop + trendBaseY) / 2, trendBaseY];
const trendChartPoints = accuracyTrend.map((point, index) => {
  const x = trendPaddingX + ((trendChartWidth - trendPaddingX * 2) * index) / (accuracyTrend.length - 1);
  const y = trendPaddingTop + ((trendMax - point.value) / trendRange) * (trendChartHeight - trendPaddingTop - trendPaddingBottom);
  return { ...point, x, y };
});
const trendPolylinePoints = computed(() => trendChartPoints.map((point) => `${point.x},${point.y}`).join(" "));
const trendAreaPath = computed(() => {
  const first = trendChartPoints[0];
  const last = trendChartPoints[trendChartPoints.length - 1];
  return `M ${first.x} ${trendBaseY} L ${trendPolylinePoints.value} L ${last.x} ${trendBaseY} Z`;
});

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>

<style>
.learning-report-mobile-content {
  gap: 14px;
  padding-top: 12px;
}

.learning-report-mobile {
  display: grid;
  gap: 14px;
}

.learning-report-mobile-hero,
.learning-report-mobile-section,
.learning-report-mobile-focus {
  padding: 17px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(224, 229, 236, 0.96);
  border-radius: 24px;
  box-shadow: 0 10px 28px rgba(25, 59, 105, 0.06);
}

.learning-report-mobile-hero {
  background:
    radial-gradient(circle at 96% 0, rgba(58, 139, 255, 0.2), transparent 38%),
    linear-gradient(145deg, #ffffff 0%, #f1f7ff 100%);
  border-color: rgba(190, 217, 249, 0.92);
}

.learning-report-mobile-hero-top,
.learning-report-mobile-section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.learning-report-mobile-kicker,
.learning-report-mobile-section-head span,
.learning-report-mobile-focus span {
  display: block;
  color: #2e76c8;
  font-size: 12px;
  font-weight: 800;
}

.learning-report-mobile-hero h2 {
  margin: 7px 0 6px;
  color: #182230;
  font-size: 24px;
  line-height: 1.2;
}

.learning-report-mobile-hero p {
  max-width: 235px;
  margin: 0;
  color: #607089;
  font-size: 13px;
  line-height: 1.65;
}

.learning-report-mobile-level-mark {
  display: grid;
  width: 66px;
  height: 66px;
  flex: 0 0 66px;
  place-items: center;
  align-content: center;
  gap: 2px;
  color: #1769e0;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(180, 213, 250, 0.98);
  border-radius: 21px;
}

.learning-report-mobile-level-mark strong {
  font-size: 20px;
  line-height: 1;
}

.learning-report-mobile-level-mark span {
  color: #52739a;
  font-size: 10px;
  font-weight: 700;
}

.learning-report-mobile-level-progress {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.learning-report-mobile-level-label {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #52739a;
  font-size: 11px;
  font-weight: 700;
}

.learning-report-mobile-progress-track {
  height: 9px;
  overflow: hidden;
  background: rgba(208, 224, 243, 0.92);
  border-radius: 999px;
}

.learning-report-mobile-progress-track span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #67b0ff, #1769e0);
  border-radius: inherit;
}

.learning-report-mobile-hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 15px;
}

.learning-report-mobile-hero-stats div,
.learning-report-mobile-proof-grid article {
  display: grid;
  gap: 3px;
  padding: 11px 8px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(221, 231, 242, 0.96);
  border-radius: 16px;
}

.learning-report-mobile-hero-stats strong {
  color: #1769e0;
  font-size: 18px;
  line-height: 1.2;
}

.learning-report-mobile-hero-stats span,
.learning-report-mobile-proof-grid small,
.learning-report-mobile-proof-grid span {
  color: #6b7b91;
  font-size: 10px;
  line-height: 1.4;
}

.learning-report-mobile-section-head {
  align-items: center;
  margin-bottom: 13px;
}

.learning-report-mobile-section-head > div {
  display: grid;
  gap: 4px;
}

.learning-report-mobile-section-head > svg {
  color: #1769e0;
}

.learning-report-mobile-section-head strong {
  color: #182230;
  font-size: 17px;
  line-height: 1.35;
}

.learning-report-mobile-section-note {
  color: #70839c !important;
  font-size: 11px !important;
  white-space: nowrap;
}

.learning-report-mobile-proof-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.learning-report-mobile-proof-grid strong {
  color: #182230;
  font-size: 20px;
  line-height: 1.25;
}

.learning-report-mobile-proof-grid article:first-child strong {
  color: #1769e0;
}

.learning-report-mobile-chart {
  margin: 1px -3px 0;
}

.learning-report-mobile-chart svg {
  display: block;
  width: 100%;
  height: 170px;
  overflow: visible;
}

.learning-report-mobile-chart-guide {
  stroke: #d8e3f0;
  stroke-dasharray: 4 5;
  stroke-width: 1.2;
}

.learning-report-mobile-chart-area {
  fill: url(#learningReportMobileFill);
}

.learning-report-mobile-chart-line {
  fill: none;
  stroke: #1769e0;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.learning-report-mobile-chart-dot {
  fill: #ffffff;
  stroke: #1769e0;
  stroke-width: 3;
}

.learning-report-mobile-chart-value {
  fill: #182230;
  font-size: 11px;
  font-weight: 800;
}

.learning-report-mobile-trend-labels {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.learning-report-mobile-trend-labels div {
  display: grid;
  justify-items: center;
  gap: 2px;
  padding: 8px 4px;
  background: #f7faff;
  border: 1px solid #e2eaf4;
  border-radius: 13px;
}

.learning-report-mobile-trend-labels strong {
  color: #182230;
  font-size: 14px;
}

.learning-report-mobile-trend-labels span {
  color: #73839a;
  font-size: 9px;
}

.learning-report-mobile-badge-list {
  display: grid;
  gap: 9px;
}

.learning-report-mobile-badge {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 19px;
  gap: 10px;
  align-items: start;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e3eaf2;
  border-radius: 17px;
}

.learning-report-mobile-badge.earned {
  background: #f2fbf7;
  border-color: #d1eee2;
}

.learning-report-mobile-badge-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: #1769e0;
  background: #eaf3ff;
  border: 1px solid #cfe3fb;
  border-radius: 14px;
}

.learning-report-mobile-badge.earned .learning-report-mobile-badge-icon {
  color: #238c6b;
  background: #e6f7ef;
  border-color: #c7ebdd;
}

.learning-report-mobile-badge-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.learning-report-mobile-badge-copy > div:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.learning-report-mobile-badge-copy strong {
  color: #182230;
  font-size: 14px;
}

.learning-report-mobile-badge-copy span {
  color: #70839c;
  font-size: 10px;
}

.learning-report-mobile-badge-copy p {
  margin: 0;
  color: #708098;
  font-size: 11px;
  line-height: 1.45;
}

.learning-report-mobile-badge-status {
  color: #a7b5c5;
  margin-top: 2px;
}

.learning-report-mobile-badge.earned .learning-report-mobile-badge-status {
  color: #238c6b;
}

.learning-report-mobile-badge-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.learning-report-mobile-badge-progress > span {
  display: block;
  height: 5px;
  flex: 1;
  overflow: hidden;
  background: #e1e8f1;
  border-radius: 999px;
}

.learning-report-mobile-badge-progress > span i {
  display: block;
  height: 100%;
  background: #5aa4f7;
  border-radius: inherit;
}

.learning-report-mobile-badge-progress small {
  color: #557293;
  font-size: 10px;
  font-weight: 800;
}

.learning-report-mobile-medal-list {
  display: grid;
  gap: 2px;
}

.learning-report-mobile-medal-card {
  position: relative;
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: 11px;
  align-items: start;
  min-height: 94px;
  padding: 10px 25px 10px 0;
  border-bottom: 1px solid #edf1f6;
}

.learning-report-mobile-medal-card:last-child {
  border-bottom: 0;
}

.learning-report-mobile-medal {
  display: grid;
  justify-items: center;
  min-height: 82px;
}

.learning-report-mobile-medal-art {
  /* width: 74px;
  height: 82px;
  display: grid; */
    display: block;
    width: 80px;
    height: 95px;
  place-items: center;
}

.learning-report-mobile-medal-art img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 5px 7px rgba(117, 87, 29, 0.16));
}

.learning-report-mobile-medal-card:not(.earned) .learning-report-mobile-medal-art img {
  opacity: 0.62;
  filter: grayscale(1) saturate(0.2) drop-shadow(0 4px 7px rgba(91, 104, 121, 0.14));
}

.learning-report-mobile-medal-ribbon {
  position: absolute;
  top: 0;
  display: flex;
  gap: 2px;
  z-index: 0;
}

.learning-report-mobile-medal-ribbon i {
  width: 15px;
  height: 26px;
  display: block;
  background: linear-gradient(180deg, #f1c86c, #c48a25);
  border: 1px solid #b77a1c;
  clip-path: polygon(0 0, 100% 0, 82% 100%, 50% 82%, 18% 100%);
}

.learning-report-mobile-medal-ribbon i:last-child {
  transform: scaleX(-1);
}

.learning-report-mobile-medal-face {
  position: relative;
  z-index: 1;
  width: 57px;
  height: 57px;
  display: grid;
  place-items: center;
  margin-top: 13px;
  color: #ffffff;
  background: radial-gradient(circle at 34% 26%, #64d9d2 0, #1d9f9e 38%, #116a7d 100%);
  border: 4px solid #e5b854;
  border-radius: 50%;
  box-shadow: 0 5px 0 #b67a1e, 0 8px 15px rgba(111, 88, 26, 0.18), inset 0 0 0 2px rgba(255, 245, 192, 0.58);
}

.learning-report-mobile-medal-face::after {
  content: "";
  position: absolute;
  top: 7px;
  left: 11px;
  width: 14px;
  height: 7px;
  background: rgba(255, 255, 255, 0.54);
  border-radius: 50%;
  transform: rotate(-28deg);
}

.learning-report-mobile-medal-face img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.26);
}

.learning-report-mobile-medal-card:not(.earned) .learning-report-mobile-medal-face {
  color: #8e9dad;
  background: radial-gradient(circle at 35% 25%, #f6f8fa, #cbd5df 55%, #9eacba 100%);
  border-color: #c7a55e;
  filter: saturate(0.45);
  box-shadow: 0 5px 0 #9e8250, 0 7px 14px rgba(91, 104, 121, 0.14), inset 0 0 0 2px rgba(255, 255, 255, 0.65);
}

.learning-report-mobile-medal-copy {
  display: grid;
  gap: 5px;
  min-width: 0;
  padding-top: 4px;
}

.learning-report-mobile-medal-copy > div:first-child {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.learning-report-mobile-medal-copy strong {
  color: #182230;
  font-size: 15px;
}

.learning-report-mobile-medal-copy > div:first-child span {
  color: #73839a;
  font-size: 10px;
}

.learning-report-mobile-medal-copy p {
  margin: 0;
  color: #708098;
  font-size: 11px;
  line-height: 1.5;
}

.learning-report-mobile-medal-copy small {
  color: #8a765d;
  font-size: 10px;
  line-height: 1.45;
}

.learning-report-mobile-medal-status {
  position: absolute;
  top: 14px;
  right: 1px;
  color: #a7b5c5;
}

.learning-report-mobile-medal-card.earned .learning-report-mobile-medal-status {
  color: #238c6b;
}

.learning-report-mobile-medal-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.learning-report-mobile-medal-progress > span {
  display: block;
  height: 5px;
  flex: 1;
  overflow: hidden;
  background: #e1e8f1;
  border-radius: 999px;
}

.learning-report-mobile-medal-progress > span i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #e3b653, #a87420);
  border-radius: inherit;
}

.learning-report-mobile-medal-progress small {
  color: #557293;
  font-size: 10px;
  font-weight: 800;
}

.learning-report-mobile-focus {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 11px;
  background: linear-gradient(145deg, #f5faff, #e8f3ff);
  border-color: #cfe3fb;
}

.learning-report-mobile-focus-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: #1769e0;
  background: #eaf3ff;
  border: 1px solid #cfe3fb;
  border-radius: 14px;
}

.learning-report-mobile-focus strong {
  display: block;
  margin: 4px 0 4px;
  color: #182230;
  font-size: 17px;
}

.learning-report-mobile-focus p {
  margin: 0;
  color: #506f93;
  font-size: 12px;
  line-height: 1.55;
}

.learning-report-mobile-primary {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 0 18px;
  color: #ffffff;
  background: linear-gradient(135deg, #2f7cf6, #1769e0);
  border: 0;
  border-radius: 17px;
  box-shadow: 0 12px 24px rgba(31, 104, 222, 0.2);
  font-size: 17px;
  font-weight: 800;
}

@media (max-width: 360px) {
  .learning-report-mobile-hero-stats,
  .learning-report-mobile-proof-grid {
    grid-template-columns: 1fr;
  }

  .learning-report-mobile-hero-stats div {
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .learning-report-mobile-hero-stats span {
    justify-self: end;
  }
}
</style>
