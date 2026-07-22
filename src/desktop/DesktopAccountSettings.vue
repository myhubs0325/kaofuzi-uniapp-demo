<template>
  <section class="desktop-account-settings">
    <header class="desktop-account-settings-page-header">
      <div class="desktop-account-settings-page-leading">
        <button type="button" class="desktop-account-settings-back" aria-label="返回上一级" @click="goBack">
          <ArrowLeft :size="18" />
        </button>
        <div class="desktop-account-settings-page-copy">
          <span>账号服务</span>
          <h1>设置</h1>
          <p>调整显示、声音与账号安全，让家长使用更顺手。</p>
        </div>
      </div>
      <div class="desktop-account-settings-page-badge" aria-hidden="true"><Settings2 :size="21" /></div>
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

          <div class="desktop-account-settings-security-list">
            <button
              type="button"
              class="desktop-account-settings-security-action"
              :aria-expanded="passwordPanelOpen"
              aria-controls="desktop-password-panel"
              @click="togglePasswordPanel"
            >
              <div class="desktop-account-settings-row-icon"><KeyRound :size="18" /></div>
              <div class="desktop-account-settings-row-copy">
                <strong>修改密码</strong>
                <small>定期更新密码，保护账号安全</small>
              </div>
              <ChevronRight :size="17" :class="['desktop-account-settings-chevron', { open: passwordPanelOpen }]" />
            </button>

            <div v-if="passwordPanelOpen" id="desktop-password-panel" class="desktop-account-settings-password-panel">
              <div class="desktop-account-settings-password-grid">
                <label>
                  <span>当前密码</span>
                  <input v-model="oldPassword" type="password" autocomplete="current-password" placeholder="请输入当前密码" />
                </label>
                <label>
                  <span>新密码</span>
                  <input v-model="newPassword" type="password" autocomplete="new-password" placeholder="至少 8 位字符" />
                </label>
                <label>
                  <span>确认新密码</span>
                  <input v-model="confirmPassword" type="password" autocomplete="new-password" placeholder="再次输入新密码" />
                </label>
              </div>
              <p v-if="passwordError" class="desktop-account-settings-password-error" role="alert">{{ passwordError }}</p>
              <button type="button" class="desktop-account-settings-password-save" :disabled="!canSavePassword" @click="savePassword">
                <CheckCircle2 :size="17" />
                保存新密码
              </button>
            </div>

            <button type="button" class="desktop-account-settings-cancel-row" @click="handleAction('OPEN_ACCOUNT_CANCEL')">
              <div class="desktop-account-settings-row-icon desktop-account-settings-neutral-icon"><UserRoundX :size="18" /></div>
              <div class="desktop-account-settings-row-copy">
                <strong>注销账号</strong>
                <small>永久停用账号，进入确认页后再操作</small>
              </div>
              <ChevronRight :size="17" class="desktop-account-settings-chevron" />
            </button>
          </div>
          <p v-if="passwordSaved" class="desktop-account-settings-save-note"><CheckCircle2 :size="17" />密码修改已完成。</p>
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
import { ArrowLeft, CheckCircle2, ChevronRight, KeyRound, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Type, UserRound, UserRoundX, Volume2 } from "lucide-vue-next";
import { computed, ref } from "vue";
import type { DemoEvent } from "../composables/useDemoFlow";

const props = defineProps<{
  fontSize: string;
  fontSizes: string[];
  soundEnabled: boolean;
  setFontSize: (value: string) => void;
  setSoundEnabled: (value: boolean) => void;
  handleAction: (event: DemoEvent) => void;
  goBack: () => void;
}>();

const passwordPanelOpen = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const passwordSaved = ref(false);
const canSavePassword = computed(() => Boolean(oldPassword.value && newPassword.value && confirmPassword.value));

const togglePasswordPanel = () => {
  passwordPanelOpen.value = !passwordPanelOpen.value;
  passwordError.value = "";
  passwordSaved.value = false;
};

const savePassword = () => {
  if (newPassword.value.length < 8) {
    passwordError.value = "新密码至少需要 8 位字符。";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = "两次输入的新密码不一致。";
    return;
  }
  oldPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  passwordError.value = "";
  passwordPanelOpen.value = false;
  passwordSaved.value = true;
};

const goBack = () => props.goBack();
</script>

<style scoped>
.desktop-account-settings {
  display: grid;
  gap: 18px;
}

.desktop-account-settings-page-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.desktop-account-settings-back {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  padding: 0;
  color: #6e6e73;
  background: transparent;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

.desktop-account-settings-back:hover,
.desktop-account-settings-back:focus-visible {
  color: #007aff;
  background: rgba(0, 122, 255, 0.08);
  outline: none;
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

.desktop-account-settings-row {
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

.desktop-account-settings-security-list {
  display: grid;
  overflow: hidden;
  margin-top: 4px;
  border: 1px solid #edf1f6;
  border-radius: 14px;
}

.desktop-account-settings-security-action,
.desktop-account-settings-cancel-row {
  width: 100%;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 18px;
  gap: 12px;
  align-items: center;
  min-height: 68px;
  padding: 10px 13px;
  color: #16283e;
  background: #fff;
  border: 0;
  cursor: pointer;
  text-align: left;
}

.desktop-account-settings-security-action:hover,
.desktop-account-settings-cancel-row:hover {
  background: #f8fbff;
}

.desktop-account-settings-cancel-row {
  border-top: 1px solid #edf1f6;
}

.desktop-account-settings-neutral-icon {
  color: #6e6e73;
  background: #f1f1f3;
  border-color: #e5e5e7;
}

.desktop-account-settings-chevron {
  color: #c7c7cc;
  transition: transform 180ms ease;
}

.desktop-account-settings-chevron.open {
  transform: rotate(90deg);
}

.desktop-account-settings-password-panel {
  display: grid;
  gap: 12px;
  padding: 14px;
  background: #f5f7fa;
  border-top: 1px solid #edf1f6;
}

.desktop-account-settings-password-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.desktop-account-settings-password-grid label {
  display: grid;
  gap: 6px;
}

.desktop-account-settings-password-grid label span {
  color: #6e6e73;
  font-size: 11px;
  font-weight: 700;
}

.desktop-account-settings-password-grid input {
  width: 100%;
  min-height: 40px;
  padding: 0 10px;
  color: #1d1d1f;
  background: #fff;
  border: 1px solid #dfe5ed;
  border-radius: 10px;
  outline: none;
  font: inherit;
  font-size: 12px;
}

.desktop-account-settings-password-grid input:focus {
  border-color: rgba(0, 122, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.desktop-account-settings-password-error {
  margin: 0;
  color: #d70015;
  font-size: 12px;
}

.desktop-account-settings-password-save {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  justify-self: start;
  padding: 0 14px;
  color: #fff;
  background: #007aff;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
}

.desktop-account-settings-password-save:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.desktop-account-settings-save-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 0;
  color: #248a4d;
  font-size: 12px;
  font-weight: 700;
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
  .desktop-account-settings-row {
    grid-template-columns: 38px minmax(0, 1fr);
  }

  .desktop-account-settings-password-grid {
    grid-template-columns: 1fr;
  }

  .desktop-account-settings-options,
  .desktop-account-settings-switch,
  .desktop-account-settings-danger {
    grid-column: 2;
    justify-self: start;
  }
}

/* Apple-style page chrome and grouped security actions. */
.desktop-account-settings-page-header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 0 2px 18px;
  border-bottom: 1px solid rgba(60, 60, 67, 0.1);
}

.desktop-account-settings-page-leading {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.desktop-account-settings-back {
  margin-top: 2px;
  color: #6e6e73;
  border-radius: 10px;
}

.desktop-account-settings-back:hover,
.desktop-account-settings-back:focus-visible {
  color: #007aff;
  background: rgba(0, 122, 255, 0.08);
}

.desktop-account-settings-page-copy {
  display: grid;
  gap: 3px;
}

.desktop-account-settings-page-copy > span {
  color: #007aff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.desktop-account-settings-page-copy h1 {
  margin: 2px 0;
  color: #1d1d1f;
  font-size: 28px;
  letter-spacing: -0.045em;
}

.desktop-account-settings-page-copy p {
  margin: 0;
  color: #6e6e73;
  font-size: 13px;
  line-height: 1.6;
}

.desktop-account-settings-page-badge {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  flex: 0 0 48px;
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.12);
  border-radius: 14px;
}

.desktop-account-settings-card,
.desktop-account-settings-summary {
  padding: 24px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(171, 190, 218, 0.38);
  border-radius: 24px;
  box-shadow: 0 14px 38px rgba(52, 69, 98, 0.055);
  backdrop-filter: blur(18px);
}

.desktop-account-settings-card h3,
.desktop-account-settings-summary h3 {
  color: #1d1d1f;
  letter-spacing: -0.035em;
}

.desktop-account-settings-row {
  margin-top: 12px;
  padding: 14px;
  background: rgba(248, 248, 250, 0.76);
  border: 1px solid rgba(60, 60, 67, 0.1);
  border-radius: 16px;
}

.desktop-account-settings-row + .desktop-account-settings-row {
  margin-top: 10px;
}

.desktop-account-settings-security-list {
  margin-top: 12px;
  background: rgba(248, 248, 250, 0.76);
  border: 1px solid rgba(60, 60, 67, 0.1);
  border-radius: 16px;
}

.desktop-account-settings-security-action,
.desktop-account-settings-cancel-row {
  min-height: 70px;
  padding: 11px 14px;
  background: transparent;
}

.desktop-account-settings-security-action:hover,
.desktop-account-settings-security-action:focus-visible,
.desktop-account-settings-cancel-row:hover,
.desktop-account-settings-cancel-row:focus-visible {
  background: rgba(255, 255, 255, 0.84);
}

.desktop-account-settings-cancel-row .desktop-account-settings-row-copy strong,
.desktop-account-settings-cancel-row .desktop-account-settings-row-copy small {
  color: #8e8e93;
}

.desktop-account-settings-neutral-icon {
  color: #8e8e93;
  background: #f1f1f3;
  border-color: rgba(60, 60, 67, 0.08);
}

.desktop-account-settings-password-panel {
  padding: 16px;
  background: rgba(242, 242, 247, 0.86);
}

@media (max-width: 560px) {
  .desktop-account-settings-page-badge {
    display: none;
  }
}
</style>
