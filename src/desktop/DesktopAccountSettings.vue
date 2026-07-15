<template>
  <section class="desktop-account-settings">
    <header class="desktop-account-settings-intro">
      <div class="desktop-account-settings-icon"><Settings2 :size="22" /></div>
      <div>
        <span>账号服务</span>
        <h2>设置使用习惯</h2>
        <p>字体、声音和账号安全都可以在这里调整。</p>
      </div>
    </header>

    <div class="desktop-account-settings-layout">
      <main class="desktop-account-settings-main">
        <section class="desktop-account-settings-card">
          <div class="desktop-account-settings-card-head">
            <div>
              <span>显示与声音</span>
              <h3>让学习过程更舒服</h3>
            </div>
            <SlidersHorizontal :size="20" />
          </div>

          <div class="desktop-account-settings-row">
            <div class="desktop-account-settings-row-icon"><Type :size="18" /></div>
            <div class="desktop-account-settings-row-copy">
              <strong>系统字体</strong>
              <small>根据家长和孩子的阅读习惯选择大小</small>
            </div>
            <div class="desktop-account-settings-options">
              <button v-for="size in fontSizes" :key="size" type="button" :class="{ active: fontSize === size }" @click="setFontSize(size)">
                {{ size }}
              </button>
            </div>
          </div>

          <div class="desktop-account-settings-row">
            <div class="desktop-account-settings-row-icon"><Volume2 :size="18" /></div>
            <div class="desktop-account-settings-row-copy">
              <strong>声音提醒</strong>
              <small>练习完成和提醒到达时播放提示音</small>
            </div>
            <button type="button" :class="['desktop-account-settings-switch', { active: soundEnabled }]" :aria-pressed="soundEnabled" @click="setSoundEnabled(!soundEnabled)">
              <span>{{ soundEnabled ? "开" : "关" }}</span>
            </button>
          </div>
        </section>

        <section class="desktop-account-settings-card">
          <div class="desktop-account-settings-card-head">
            <div>
              <span>账号安全</span>
              <h3>保护孩子的学习记录</h3>
            </div>
            <ShieldCheck :size="20" />
          </div>

          <div class="desktop-account-settings-security-row">
            <div class="desktop-account-settings-row-icon"><KeyRound :size="18" /></div>
            <div class="desktop-account-settings-row-copy">
              <strong>密码与账号</strong>
              <small>修改密码或结束当前账号的使用</small>
            </div>
            <button type="button" class="desktop-account-settings-danger" @click="handleAction('OPEN_ACCOUNT_CANCEL')">
              注销账号 <ChevronRight :size="16" />
            </button>
          </div>
        </section>
      </main>

      <aside class="desktop-account-settings-summary">
        <div class="desktop-account-settings-summary-head">
          <div class="desktop-account-settings-summary-icon"><UserRound :size="19" /></div>
          <div>
            <span>当前设置</span>
            <h3>使用概览</h3>
          </div>
        </div>
        <div class="desktop-account-settings-summary-list">
          <div><span>系统字体</span><strong>{{ fontSize }}</strong></div>
          <div><span>声音提醒</span><strong>{{ soundEnabled ? "已开启" : "已关闭" }}</strong></div>
          <div><span>账号操作</span><strong>密码、注销</strong></div>
        </div>
        <div class="desktop-account-settings-tip">
          <Sparkles :size="17" />
          <span>选择适合自己的设置，学习时更专注。</span>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight, KeyRound, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Type, UserRound, Volume2 } from "lucide-vue-next";
import type { DemoEvent } from "../composables/useDemoFlow";

defineProps<{
  fontSize: string;
  fontSizes: string[];
  soundEnabled: boolean;
  setFontSize: (value: string) => void;
  setSoundEnabled: (value: boolean) => void;
  handleAction: (event: DemoEvent) => void;
}>();
</script>

<style scoped>
.desktop-account-settings {
  display: grid;
  gap: 18px;
}

.desktop-account-settings-intro {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 22px;
  background: linear-gradient(135deg, #f5faff 0%, #e8f3ff 100%);
  border: 1px solid #cfe3fb;
  border-radius: 20px;
}

.desktop-account-settings-icon,
.desktop-account-settings-row-icon,
.desktop-account-settings-summary-icon {
  display: grid;
  place-items: center;
  color: #1769e0;
  background: #ffffff;
  border: 1px solid #cfe3fb;
  border-radius: 13px;
}

.desktop-account-settings-icon {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
}

.desktop-account-settings-intro span,
.desktop-account-settings-card-head span,
.desktop-account-settings-summary-head span {
  color: #2b75c6;
  font-size: 11px;
  font-weight: 800;
}

.desktop-account-settings-intro h2 {
  margin: 5px 0 4px;
  color: #16283e;
  font-size: 25px;
  line-height: 1.2;
}

.desktop-account-settings-intro p {
  margin: 0;
  color: #6d7d91;
  font-size: 13px;
}

.desktop-account-settings-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(250px, 0.75fr);
  gap: 16px;
  align-items: start;
}

.desktop-account-settings-main {
  display: grid;
  gap: 14px;
}

.desktop-account-settings-card,
.desktop-account-settings-summary {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e1e9f3;
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(52, 79, 115, 0.045);
}

.desktop-account-settings-card-head,
.desktop-account-settings-summary-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.desktop-account-settings-card-head > div,
.desktop-account-settings-summary-head > div:last-child {
  display: grid;
  gap: 4px;
}

.desktop-account-settings-card-head > svg {
  color: #1769e0;
}

.desktop-account-settings-card h3,
.desktop-account-settings-summary h3 {
  margin: 0;
  color: #16283e;
  font-size: 18px;
}

.desktop-account-settings-row,
.desktop-account-settings-security-row {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  min-height: 76px;
  margin-top: 15px;
  padding: 13px 0;
  border-top: 1px solid #edf1f6;
}

.desktop-account-settings-row-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #edf5ff;
}

.desktop-account-settings-row-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.desktop-account-settings-row-copy strong {
  color: #16283e;
  font-size: 14px;
}

.desktop-account-settings-row-copy small {
  color: #748399;
  font-size: 11px;
  line-height: 1.5;
}

.desktop-account-settings-options {
  display: inline-flex;
  gap: 5px;
  padding: 4px;
  background: #f3f7fc;
  border: 1px solid #e0e8f2;
  border-radius: 12px;
}

.desktop-account-settings-options button {
  min-width: 60px;
  min-height: 32px;
  padding: 0 10px;
  color: #718198;
  background: transparent;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
}

.desktop-account-settings-options button.active {
  color: #1769e0;
  background: #ffffff;
  box-shadow: 0 3px 9px rgba(64, 107, 157, 0.12);
}

.desktop-account-settings-switch {
  min-width: 54px;
  min-height: 32px;
  padding: 3px;
  color: #ffffff;
  background: #b5c1cf;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  text-align: right;
}

.desktop-account-settings-switch span {
  display: inline-grid;
  min-width: 26px;
  min-height: 26px;
  place-items: center;
  color: #6d7b8c;
  background: #ffffff;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
}

.desktop-account-settings-switch.active {
  background: #2f7cf6;
  text-align: left;
}

.desktop-account-settings-danger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 36px;
  padding: 0 12px;
  color: #c34b5b;
  background: #fff4f5;
  border: 1px solid #f3cbd0;
  border-radius: 11px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
}

.desktop-account-settings-summary {
  position: sticky;
  top: 18px;
}

.desktop-account-settings-summary-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
}

.desktop-account-settings-summary-list {
  display: grid;
  margin-top: 17px;
}

.desktop-account-settings-summary-list div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #edf1f6;
}

.desktop-account-settings-summary-list span {
  color: #738198;
  font-size: 12px;
}

.desktop-account-settings-summary-list strong {
  color: #16283e;
  font-size: 13px;
}

.desktop-account-settings-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 18px;
  padding: 12px;
  color: #36658f;
  background: linear-gradient(135deg, #f3f9ff, #e8f3ff);
  border: 1px solid #d4e7fb;
  border-radius: 13px;
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 820px) {
  .desktop-account-settings-layout {
    grid-template-columns: 1fr;
  }

  .desktop-account-settings-summary {
    position: static;
  }
}

@media (max-width: 560px) {
  .desktop-account-settings-row,
  .desktop-account-settings-security-row {
    grid-template-columns: 38px minmax(0, 1fr);
  }

  .desktop-account-settings-options,
  .desktop-account-settings-switch,
  .desktop-account-settings-danger {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
