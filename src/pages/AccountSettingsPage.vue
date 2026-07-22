<template>
  <PhoneScaffold
    title="设置"
    meta="字体、声音与账号"
    content-class="insight-content account-detail-content"
    shell-class="insight-shell"
    show-back
    active-tab="profile"
    @back="$emit('action', 'BACK_FROM_PROFILE_DETAIL')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="account-hero-card settings-hero-card">
      <div class="account-hero-top">
        <div>
          <span class="account-kicker">使用习惯</span>
          <h2>字体、声音和账号操作都放在这里</h2>
          <p>字号选大一点、保留提示音，更适合家里老人帮忙看孩子学习。</p>
        </div>
        <div class="account-hero-icon settings">
          <Settings :size="28" />
        </div>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>系统字体</strong>
        <span>当前：{{ fontSize }}</span>
      </div>
      <div class="account-segment-grid">
        <button
          v-for="size in fontSizes"
          :key="size"
          type="button"
          :class="{ active: fontSize === size }"
          @click="fontSize = size"
        >
          <Type :size="18" />
          <span>{{ size }}</span>
        </button>
      </div>
      <p class="settings-preview" :class="fontPreviewClass">{{ demoData.student.name }}今天先完成 8 分钟练习，做完后看学习报告。</p>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>声音提醒</strong>
        <span>{{ soundEnabled ? "已开启" : "已关闭" }}</span>
      </div>
      <button type="button" :class="['account-switch-row', { active: soundEnabled }]" @click="soundEnabled = !soundEnabled">
        <span>练习完成、提醒到达时播放提示音</span>
        <b>{{ soundEnabled ? "开" : "关" }}</b>
      </button>
    </section>

    <section class="account-section account-operation-section">
      <div class="account-section-head">
        <strong>账号与安全</strong>
        <span>账号操作</span>
      </div>
      <div class="settings-account-list">
        <button
          type="button"
          class="settings-account-row"
          :aria-expanded="passwordPanelOpen"
          aria-controls="password-panel"
          @click="togglePasswordPanel"
        >
          <span class="settings-row-icon password"><KeyRound :size="18" /></span>
          <span class="settings-row-copy">
            <strong>修改密码</strong>
            <small>定期更新密码，保护账号安全</small>
          </span>
          <ChevronRight :size="18" :class="['settings-row-chevron', { open: passwordPanelOpen }]" />
        </button>

        <div v-if="passwordPanelOpen" id="password-panel" class="settings-password-panel">
          <div class="account-form-list">
            <label class="account-input-field">
              <span>当前密码</span>
              <input v-model="oldPassword" type="password" autocomplete="current-password" placeholder="请输入当前密码" />
            </label>
            <label class="account-input-field">
              <span>新密码</span>
              <input v-model="newPassword" type="password" autocomplete="new-password" placeholder="至少 8 位字符" />
            </label>
            <label class="account-input-field">
              <span>确认新密码</span>
              <input v-model="confirmPassword" type="password" autocomplete="new-password" placeholder="再次输入新密码" />
            </label>
          </div>
          <p v-if="passwordError" class="settings-password-error" role="alert">{{ passwordError }}</p>
          <button type="button" class="settings-password-save" :disabled="!canSavePassword" @click="savePassword">
            保存新密码
          </button>
        </div>

        <button type="button" class="settings-account-row settings-cancel-row" @click="$emit('action', 'OPEN_ACCOUNT_CANCEL')">
          <span class="settings-row-icon neutral"><UserRoundX :size="18" /></span>
          <span class="settings-row-copy">
            <strong>注销账号</strong>
            <small>永久停用账号并处理相关数据</small>
          </span>
          <ChevronRight :size="18" class="settings-row-chevron" />
        </button>
      </div>
      <section v-if="passwordSaved" class="account-save-strip">
        <CheckCircle2 :size="18" />
        <span>密码修改已完成。</span>
      </section>
    </section>

    <section class="settings-logout-area">
      <button type="button" class="settings-logout-button" @click="accountAction = '已退出登录'">
        <LogOut :size="19" />
        <span>退出登录</span>
      </button>
      <section v-if="accountAction" class="account-save-strip">
        <CheckCircle2 :size="18" />
        <span>{{ accountAction }}</span>
      </section>
    </section>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  CheckCircle2,
  ChevronRight,
  KeyRound,
  LogOut,
  Settings,
  Type,
  UserRoundX
} from "lucide-vue-next";
import { computed, ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";

const fontSizes = ["标准", "大号", "超大"];
const fontSize = ref("大号");
const soundEnabled = ref(true);
const passwordPanelOpen = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordSaved = ref(false);
const passwordError = ref("");
const accountAction = ref("");

const canSavePassword = computed(() => Boolean(oldPassword.value && newPassword.value && confirmPassword.value));

function togglePasswordPanel() {
  passwordPanelOpen.value = !passwordPanelOpen.value;
  passwordSaved.value = false;
  passwordError.value = "";
}

function savePassword() {
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
}

const fontPreviewClass = computed(() => ({
  "is-large": fontSize.value === "大号",
  "is-extra-large": fontSize.value === "超大"
}));

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>

<style scoped>
.settings-account-list {
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(60, 60, 67, 0.1);
  border-radius: 18px;
}

.settings-account-row {
  width: 100%;
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  color: #1d1d1f;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
}

.settings-cancel-row {
  border-top: 1px solid rgba(60, 60, 67, 0.1);
}

.settings-row-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  color: #fff;
  background: #0a84ff;
  border-radius: 9px;
}

.settings-row-icon.neutral {
  color: #6e6e73;
  background: #e9e9eb;
}

.settings-row-copy {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 3px;
}

.settings-row-copy strong {
  font-size: 16px;
  font-weight: 600;
}

.settings-row-copy small {
  color: #8e8e93;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}

.settings-cancel-row .settings-row-copy strong {
  color: #6e6e73;
}

.settings-row-chevron {
  flex: 0 0 auto;
  color: #c7c7cc;
  transition: transform 180ms ease;
}

.settings-row-chevron.open {
  transform: rotate(90deg);
}

.settings-password-panel {
  display: grid;
  gap: 12px;
  padding: 14px;
  background: #f2f2f7;
  border-top: 1px solid rgba(60, 60, 67, 0.1);
}

.settings-password-panel :deep(.account-input-field input) {
  background: #fff;
  border-color: rgba(60, 60, 67, 0.12);
  border-radius: 12px;
}

.settings-password-error {
  margin: 0;
  color: #d70015;
  font-size: 13px;
  line-height: 1.5;
}

.settings-password-save {
  min-height: 46px;
  color: #fff;
  background: #007aff;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.settings-password-save:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.settings-logout-area {
  display: grid;
  gap: 12px;
  padding: 2px 0 8px;
}

.settings-logout-button {
  width: 100%;
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ff3b30;
  background: #fff;
  border: 1px solid rgba(60, 60, 67, 0.1);
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}
</style>
