<template>
  <div class="desktop-learning-report">
    <header class="desktop-learning-report-header">
      <div>
        <span class="desktop-learning-report-kicker">学习成长 · 本周报告</span>
        <h2>这周的进步，看得见</h2>
        <p>{{ learningReport.level.summary }}</p>
      </div>
      <button type="button" class="desktop-learning-report-primary" @click="handleAction('START_TASK')">
        继续今天的学习
        <ArrowRight :size="17" />
      </button>
    </header>

    <section class="desktop-learning-report-level">
      <div class="desktop-learning-report-level-main">
        <div class="desktop-learning-report-level-mark">
          <span>当前阶段</span>
          <strong>{{ learningReport.level.code }}</strong>
          <b>{{ learningReport.level.title }}</b>
        </div>
        <div class="desktop-learning-report-level-copy">
          <span>距离下一级还差 {{ learningReport.level.nextValue - learningReport.level.currentValue }} 成长值</span>
          <div class="desktop-learning-report-level-row">
            <strong>{{ learningReport.level.currentValue }} <small>/ {{ learningReport.level.nextValue }}</small></strong>
            <em>+{{ learningReport.weekly.growthValue }} 本周成长</em>
          </div>
          <div class="desktop-learning-report-level-track"><span :style="{ width: `${learningReport.level.progress}%` }" /></div>
        </div>
      </div>
      <div class="desktop-learning-report-level-note">
        <TrendingUp :size="19" />
        <span>本周正确率较开始提升 <strong>{{ accuracyLift }} 个百分点</strong></span>
      </div>
    </section>

    <section class="desktop-learning-report-stat-grid">
      <article>
        <span>当前正确率</span>
        <strong>{{ demoData.progress.currentAccuracy }}%</strong>
        <small>从 {{ demoData.progress.previousAccuracy }}% 提升</small>
      </article>
      <article>
        <span>有效学习</span>
        <strong>{{ learningReport.weekly.activeDays }} 天</strong>
        <small>{{ learningReport.weekly.studyMinutes }} 分钟 · {{ learningReport.weekly.practiceCount }} 次练习</small>
      </article>
      <article>
        <span>错题回稳</span>
        <strong>{{ learningReport.weekly.stabilizedWrongQuestions }} / {{ learningReport.weekly.wrongQuestionTotal }}</strong>
        <small>经过间隔复习再次答对</small>
      </article>
      <article>
        <span>已补会知识点</span>
        <strong>{{ learningReport.weekly.masteredKnowledgePoints }} 个</strong>
        <small>重点能力正在稳住</small>
      </article>
    </section>

    <div class="desktop-learning-report-grid">
      <section class="desktop-learning-report-card desktop-learning-report-trend-card">
        <div class="desktop-learning-report-card-head">
          <div>
            <span>进步证据</span>
            <h3>正确率正在稳定上升</h3>
          </div>
          <b>最近 4 周</b>
        </div>
        <div class="desktop-learning-report-trend-summary">
          <strong>{{ demoData.progress.previousAccuracy }}% → {{ demoData.progress.currentAccuracy }}%</strong>
          <span>每 10 题大约多做对 {{ afterPerTen - beforePerTen }} 题</span>
        </div>
        <div class="desktop-learning-report-chart" aria-label="最近四周正确率趋势">
          <svg viewBox="0 0 560 190" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="desktopLearningReportFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stop-color="#5b9bff" stop-opacity=".32" />
                <stop offset="1" stop-color="#5b9bff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <line v-for="guide in trendGuides" :key="guide" x1="28" :y1="guide" x2="532" :y2="guide" class="desktop-learning-report-chart-guide" />
            <path :d="trendAreaPath" class="desktop-learning-report-chart-area" />
            <polyline :points="trendPolylinePoints" class="desktop-learning-report-chart-line" />
            <g v-for="point in trendChartPoints" :key="point.label">
              <text :x="point.x" :y="point.y - 14" text-anchor="middle" class="desktop-learning-report-chart-value">{{ point.value }}%</text>
              <circle :cx="point.x" :cy="point.y" r="6" class="desktop-learning-report-chart-dot" />
            </g>
          </svg>
        </div>
        <div class="desktop-learning-report-trend-labels">
          <span v-for="point in learningReport.accuracyTrend" :key="point.label">{{ point.label }}</span>
        </div>
      </section>

      <section class="desktop-learning-report-card desktop-learning-report-badges-card">
        <div class="desktop-learning-report-card-head">
          <div>
            <span>学习勋章</span>
            <h3>把具体进步记录下来</h3>
          </div>
          <Award :size="20" />
        </div>
        <div class="desktop-learning-report-badge-grid">
          <article v-for="badge in featuredBadges" :key="badge.key" :class="['desktop-learning-report-medal-card', { earned: badge.earned }]">
            <div class="desktop-learning-report-medal">
              <div class="desktop-learning-report-medal-art"><img :src="badgeAssets[badge.asset]" :alt="`${badge.title}图标`" /></div>
            </div>
            <div class="desktop-learning-report-medal-copy">
              <strong>{{ badge.title }}</strong>
              <span>{{ badge.category }}</span>
              <p>获得方式：{{ badge.detail }}</p>
              <small>{{ badge.description }}</small>
              <div v-if="!badge.earned" class="desktop-learning-report-medal-progress">
                <span><i :style="{ width: `${Math.round((badge.current / badge.total) * 100)}%` }" /></span>
                <small>{{ badge.current }} / {{ badge.total }}</small>
              </div>
            </div>
            <CheckCircle2 v-if="badge.earned" class="desktop-learning-report-medal-status" :size="18" />
            <LockKeyhole v-else class="desktop-learning-report-medal-status" :size="16" />
          </article>
        </div>
      </section>

      <section class="desktop-learning-report-card desktop-learning-report-proof-card">
        <div class="desktop-learning-report-card-head">
          <div>
            <span>能力变化</span>
            <h3>做 10 题能对几题</h3>
          </div>
          <b>{{ beforePerTen }} → {{ afterPerTen }} 题</b>
        </div>
        <div class="desktop-learning-report-ten-row">
          <div>
            <small>刚开始</small>
            <div class="desktop-learning-report-ten-cells"><i v-for="cell in 10" :key="`before-${cell}`" :class="{ filled: cell <= beforePerTen }" /></div>
          </div>
          <div>
            <small>现在</small>
            <div class="desktop-learning-report-ten-cells after"><i v-for="cell in 10" :key="`after-${cell}`" :class="{ filled: cell <= afterPerTen }" /></div>
          </div>
        </div>
        <p>同类题从平均做对 {{ beforePerTen }} 题，提升到现在的 {{ afterPerTen }} 题。</p>
      </section>

      <section class="desktop-learning-report-next-card">
        <div class="desktop-learning-report-next-icon"><Target :size="21" /></div>
        <div>
          <span>下一步最值得练</span>
          <h3>{{ learningReport.nextStep.title }}</h3>
          <p>{{ learningReport.nextStep.summary }}</p>
        </div>
        <button type="button" class="desktop-learning-report-next-button" @click="handleAction('START_TASK')">
          开始练习 <ArrowRight :size="16" />
        </button>
      </section>
    </div>
  </div>
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
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";
import { learningReport } from "../data/learningReport";

defineProps<{
  handleAction: (event: DemoEvent) => void;
}>();

const accuracyLift = demoData.progress.currentAccuracy - demoData.progress.previousAccuracy;
const beforePerTen = Math.round(demoData.progress.previousAccuracy / 10);
const afterPerTen = Math.round(demoData.progress.currentAccuracy / 10);
const featuredBadges = learningReport.badges.slice(0, 3);
const badgeAssets = {
  effort: "/badges/medal-effort.png",
  champion: "/badges/medal-champion.png",
  knowledge: "/badges/medal-knowledge.png"
};

const trendChartWidth = 560;
const trendChartHeight = 190;
const trendPaddingX = 32;
const trendPaddingTop = 30;
const trendPaddingBottom = 28;
const trendValues = learningReport.accuracyTrend.map((point) => point.value);
const trendMin = Math.max(0, Math.min(...trendValues) - 8);
const trendMax = Math.min(100, Math.max(...trendValues) + 4);
const trendRange = Math.max(1, trendMax - trendMin);
const trendBaseY = trendChartHeight - trendPaddingBottom;
const trendGuides = [trendPaddingTop, (trendPaddingTop + trendBaseY) / 2, trendBaseY];
const trendChartPoints = learningReport.accuracyTrend.map((point, index) => {
  const x = trendPaddingX + ((trendChartWidth - trendPaddingX * 2) * index) / (learningReport.accuracyTrend.length - 1);
  const y = trendPaddingTop + ((trendMax - point.value) / trendRange) * (trendChartHeight - trendPaddingTop - trendPaddingBottom);
  return { ...point, x, y };
});
const trendPolylinePoints = computed(() => trendChartPoints.map((point) => `${point.x},${point.y}`).join(" "));
const trendAreaPath = computed(() => {
  const first = trendChartPoints[0];
  const last = trendChartPoints[trendChartPoints.length - 1];
  return `M ${first.x} ${trendBaseY} L ${trendPolylinePoints.value} L ${last.x} ${trendBaseY} Z`;
});
</script>

<style scoped>
.desktop-learning-report {
  display: grid;
  gap: 16px;
  padding-bottom: 8px;
}

.desktop-learning-report-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.desktop-learning-report-kicker,
.desktop-learning-report-card-head span,
.desktop-learning-report-level-copy > span,
.desktop-learning-report-next-card span {
  color: #2b75c6;
  font-size: 12px;
  font-weight: 800;
}

.desktop-learning-report-header h2 {
  margin: 7px 0 5px;
  color: #13253d;
  font-size: 30px;
  line-height: 1.2;
  letter-spacing: -0.04em;
}

.desktop-learning-report-header p {
  margin: 0;
  color: #66778d;
  font-size: 14px;
  line-height: 1.6;
}

.desktop-learning-report-primary,
.desktop-learning-report-next-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  cursor: pointer;
  font-weight: 800;
}

.desktop-learning-report-primary {
  min-height: 44px;
  padding: 0 17px;
  color: #fff;
  background: linear-gradient(135deg, #2f7cf6, #1769e0);
  border-radius: 13px;
  box-shadow: 0 10px 20px rgba(35, 108, 224, 0.2);
}

.desktop-learning-report-level {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  padding: 18px 20px;
  background: linear-gradient(115deg, #f5f9ff, #ffffff);
  border: 1px solid #cfe1f7;
  border-radius: 18px;
}

.desktop-learning-report-level-main {
  display: flex;
  align-items: center;
  gap: 17px;
  min-width: 0;
  flex: 1;
}

.desktop-learning-report-level-mark {
  display: grid;
  width: 84px;
  min-height: 78px;
  flex: 0 0 84px;
  place-items: center;
  align-content: center;
  gap: 3px;
  color: #1769e0;
  background: #ffffff;
  border: 1px solid #cfe1f7;
  border-radius: 17px;
}

.desktop-learning-report-level-mark span,
.desktop-learning-report-level-mark b {
  color: #547392;
  font-size: 10px;
}

.desktop-learning-report-level-mark strong {
  font-size: 25px;
  line-height: 1;
}

.desktop-learning-report-level-copy {
  display: grid;
  gap: 9px;
  min-width: 0;
  flex: 1;
}

.desktop-learning-report-level-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.desktop-learning-report-level-row strong {
  color: #16283e;
  font-size: 25px;
}

.desktop-learning-report-level-row strong small {
  color: #7c8da1;
  font-size: 12px;
  font-weight: 700;
}

.desktop-learning-report-level-row em {
  color: #238c6b;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.desktop-learning-report-level-track {
  height: 8px;
  overflow: hidden;
  background: #dceafb;
  border-radius: 999px;
}

.desktop-learning-report-level-track span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #70b8ff, #1769e0);
  border-radius: inherit;
}

.desktop-learning-report-level-note {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 235px;
  padding: 12px 14px;
  color: #2365a4;
  background: #eaf3ff;
  border: 1px solid #cfe1f7;
  border-radius: 13px;
  font-size: 12px;
  line-height: 1.5;
}

.desktop-learning-report-level-note svg {
  flex: 0 0 auto;
}

.desktop-learning-report-level-note strong {
  color: #1769e0;
}

.desktop-learning-report-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.desktop-learning-report-stat-grid article {
  display: grid;
  gap: 5px;
  padding: 15px 16px;
  background: #fff;
  border: 1px solid #e2e9f1;
  border-radius: 16px;
}

.desktop-learning-report-stat-grid span,
.desktop-learning-report-stat-grid small {
  color: #718198;
  font-size: 11px;
}

.desktop-learning-report-stat-grid strong {
  color: #16283e;
  font-size: 23px;
  line-height: 1.15;
}

.desktop-learning-report-stat-grid article:first-child strong {
  color: #1769e0;
}

.desktop-learning-report-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(275px, 0.8fr);
  gap: 14px;
}

.desktop-learning-report-card,
.desktop-learning-report-next-card {
  min-width: 0;
  padding: 18px;
  background: #fff;
  border: 1px solid #e2e9f1;
  border-radius: 18px;
}

.desktop-learning-report-trend-card,
.desktop-learning-report-badges-card {
  grid-row: span 2;
}

.desktop-learning-report-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.desktop-learning-report-card-head > div {
  display: grid;
  gap: 5px;
}

.desktop-learning-report-card-head h3 {
  margin: 0;
  color: #16283e;
  font-size: 18px;
}

.desktop-learning-report-card-head > b {
  color: #73849a;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.desktop-learning-report-card-head > svg {
  color: #1769e0;
}

.desktop-learning-report-trend-summary {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 17px;
}

.desktop-learning-report-trend-summary strong {
  color: #1769e0;
  font-size: 27px;
  letter-spacing: -0.04em;
}

.desktop-learning-report-trend-summary span {
  color: #6e8096;
  font-size: 12px;
}

.desktop-learning-report-chart {
  margin: 7px -4px 0;
}

.desktop-learning-report-chart svg {
  display: block;
  width: 100%;
  height: 205px;
  overflow: visible;
}

.desktop-learning-report-chart-guide {
  stroke: #e1eaf4;
  stroke-dasharray: 4 5;
  stroke-width: 1.2;
}

.desktop-learning-report-chart-area {
  fill: url(#desktopLearningReportFill);
}

.desktop-learning-report-chart-line {
  fill: none;
  stroke: #1769e0;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.desktop-learning-report-chart-dot {
  fill: #fff;
  stroke: #1769e0;
  stroke-width: 3;
}

.desktop-learning-report-chart-value {
  fill: #16283e;
  font-size: 12px;
  font-weight: 800;
}

.desktop-learning-report-trend-labels {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
  color: #7a8ba0;
  font-size: 10px;
  text-align: center;
}

.desktop-learning-report-proof-card p {
  margin: 16px 0 0;
  color: #718198;
  font-size: 12px;
  line-height: 1.55;
}

.desktop-learning-report-badge-grid {
  display: grid;
  gap: 9px;
  margin-top: 18px;
}

.desktop-learning-report-badge {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 18px;
  gap: 10px;
  align-items: start;
  padding: 11px;
  background: #f8fafc;
  border: 1px solid #e3eaf2;
  border-radius: 14px;
}

.desktop-learning-report-badge.earned {
  background: #f2fbf7;
  border-color: #d1eee2;
}

.desktop-learning-report-badge-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  color: #1769e0;
  background: #eaf3ff;
  border: 1px solid #cfe3fb;
  border-radius: 12px;
}

.desktop-learning-report-badge.earned .desktop-learning-report-badge-icon {
  color: #238c6b;
  background: #e6f7ef;
  border-color: #c8ecde;
}

.desktop-learning-report-badge strong,
.desktop-learning-report-badge span,
.desktop-learning-report-badge p {
  display: block;
}

.desktop-learning-report-badge strong {
  color: #16283e;
  font-size: 13px;
}

.desktop-learning-report-badge span {
  margin-top: 2px;
  color: #70839a;
  font-size: 10px;
}

.desktop-learning-report-badge p {
  margin: 5px 0 0;
  color: #728197;
  font-size: 11px;
  line-height: 1.4;
}

.desktop-learning-report-badge-status {
  margin-top: 2px;
  color: #a8b6c6;
}

.desktop-learning-report-badge.earned .desktop-learning-report-badge-status {
  color: #238c6b;
}

.desktop-learning-report-badge-progress {
  display: flex !important;
  align-items: center;
  gap: 7px;
  margin-top: 7px;
}

.desktop-learning-report-badge-progress > span {
  height: 5px;
  flex: 1;
  overflow: hidden;
  background: #e1e8f1;
  border-radius: 999px;
}

.desktop-learning-report-badge-progress > span i {
  display: block;
  height: 100%;
  background: #5aa4f7;
  border-radius: inherit;
}

.desktop-learning-report-badge-progress small {
  color: #557293;
  font-size: 10px;
  font-weight: 800;
}

.desktop-learning-report-medal-card {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr) 18px;
  gap: 13px;
  align-items: center;
  min-height: 94px;
  min-width: 0;
  overflow: hidden;
  padding: 10px 0;
  border-bottom: 1px solid #edf1f6;
}

.desktop-learning-report-medal-card:last-child {
  border-bottom: 0;
}

.desktop-learning-report-medal {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 3px;
  min-height: 86px;
}

.desktop-learning-report-medal-art {
  width: 70px;
  height: 76px;
  display: grid;
  place-items: center;
}

.desktop-learning-report-medal-art img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 6px 8px rgba(117, 87, 29, 0.16));
}

.desktop-learning-report-medal-card:not(.earned) .desktop-learning-report-medal-art img {
  filter: grayscale(1) saturate(0) opacity(0.56);
}

.desktop-learning-report-medal-ribbon {
  position: absolute;
  top: 0;
  display: flex;
  gap: 2px;
  z-index: 0;
}

.desktop-learning-report-medal-ribbon i {
  width: 17px;
  height: 31px;
  display: block;
  background: linear-gradient(180deg, #f1c86c, #c48a25);
  border: 1px solid #b77a1c;
  clip-path: polygon(0 0, 100% 0, 82% 100%, 50% 82%, 18% 100%);
}

.desktop-learning-report-medal-ribbon i:last-child {
  transform: scaleX(-1);
}

.desktop-learning-report-medal-face {
  position: relative;
  z-index: 1;
  width: 63px;
  height: 63px;
  display: grid;
  place-items: center;
  margin-top: 16px;
  color: #ffffff;
  background: radial-gradient(circle at 34% 26%, #64d9d2 0, #1d9f9e 38%, #116a7d 100%);
  border: 4px solid #e5b854;
  border-radius: 50%;
  box-shadow: 0 5px 0 #b67a1e, 0 8px 15px rgba(111, 88, 26, 0.18), inset 0 0 0 2px rgba(255, 245, 192, 0.58);
}

.desktop-learning-report-medal-face::after {
  content: "";
  position: absolute;
  top: 8px;
  left: 13px;
  width: 16px;
  height: 8px;
  background: rgba(255, 255, 255, 0.54);
  border-radius: 50%;
  transform: rotate(-28deg);
}

.desktop-learning-report-medal-card:not(.earned) .desktop-learning-report-medal-face {
  color: #8e9dad;
  background: radial-gradient(circle at 35% 25%, #f6f8fa, #cbd5df 55%, #9eacba 100%);
  border-color: #c7a55e;
  filter: saturate(0.45);
  box-shadow: 0 5px 0 #9e8250, 0 7px 14px rgba(91, 104, 121, 0.14), inset 0 0 0 2px rgba(255, 255, 255, 0.65);
}

.desktop-learning-report-medal > span {
  position: relative;
  z-index: 1;
  color: #a26b16;
  font-size: 10px;
  font-weight: 800;
}

.desktop-learning-report-medal-card.earned .desktop-learning-report-medal > span {
  color: #238c6b;
}

.desktop-learning-report-medal-copy {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.desktop-learning-report-medal-copy strong,
.desktop-learning-report-medal-copy span,
.desktop-learning-report-medal-copy p {
  display: block;
}

.desktop-learning-report-medal-copy strong {
  color: #16283e;
  font-size: 15px;
}

.desktop-learning-report-medal-copy span {
  color: #70839a;
  font-size: 10px;
}

.desktop-learning-report-medal-copy p {
  margin: 0;
  color: #728197;
  font-size: 11px;
  line-height: 1.45;
}

.desktop-learning-report-medal-copy small {
  color: #8a765d;
  font-size: 10px;
  line-height: 1.4;
}

.desktop-learning-report-medal-status {
  color: #a8b6c6;
}

.desktop-learning-report-medal-card.earned .desktop-learning-report-medal-status {
  color: #238c6b;
}

.desktop-learning-report-medal-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.desktop-learning-report-medal-progress > span {
  height: 5px;
  flex: 1;
  overflow: hidden;
  background: #e1e8f1;
  border-radius: 999px;
}

.desktop-learning-report-medal-progress > span i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #e3b653, #a87420);
  border-radius: inherit;
}

.desktop-learning-report-medal-progress small {
  color: #557293;
  font-size: 10px;
  font-weight: 800;
}

.desktop-learning-report-ten-row {
  display: grid;
  gap: 12px;
  margin-top: 19px;
}

.desktop-learning-report-ten-row > div {
  display: grid;
  gap: 6px;
}

.desktop-learning-report-ten-row small {
  color: #72839a;
  font-size: 11px;
  font-weight: 700;
}

.desktop-learning-report-ten-cells {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 5px;
}

.desktop-learning-report-ten-cells i {
  height: 20px;
  background: #edf2f7;
  border: 1px solid #e1e8f0;
  border-radius: 6px;
}

.desktop-learning-report-ten-cells i.filled {
  background: #a7b7c9;
  border-color: #91a6bd;
}

.desktop-learning-report-ten-cells.after i.filled {
  background: linear-gradient(180deg, #5fb0ff, #1769e0);
  border-color: #3b8ce9;
}

.desktop-learning-report-next-card {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 13px;
  align-items: center;
  background: linear-gradient(115deg, #f5faff, #e8f3ff);
  border-color: #cfe3fb;
}

.desktop-learning-report-next-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: #1769e0;
  background: #eaf3ff;
  border: 1px solid #cfe3fb;
  border-radius: 13px;
}

.desktop-learning-report-next-card h3 {
  margin: 4px 0;
  color: #16283e;
  font-size: 17px;
}

.desktop-learning-report-next-card p {
  max-width: 550px;
  margin: 0;
  color: #506f93;
  font-size: 12px;
  line-height: 1.55;
}

.desktop-learning-report-next-button {
  min-height: 38px;
  padding: 0 13px;
  color: #1769e0;
  background: #eaf3ff;
  border: 1px solid #cfe1f7;
  border-radius: 11px;
  white-space: nowrap;
}

@media (max-width: 1120px) {
  .desktop-learning-report-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .desktop-learning-report-grid {
    grid-template-columns: 1fr;
  }

  .desktop-learning-report-trend-card,
  .desktop-learning-report-badges-card {
    grid-row: auto;
  }
}

@media (max-width: 760px) {
  .desktop-learning-report-header,
  .desktop-learning-report-level,
  .desktop-learning-report-next-card {
    align-items: stretch;
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .desktop-learning-report-header h2 {
    font-size: 25px;
  }

  .desktop-learning-report-primary {
    align-self: flex-start;
  }

  .desktop-learning-report-level-main {
    align-items: flex-start;
  }

  .desktop-learning-report-level-note {
    max-width: none;
  }

  .desktop-learning-report-next-card {
    display: grid;
  }

  .desktop-learning-report-next-button {
    justify-self: start;
  }
}
</style>
