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

    <section class="account-section">
      <div class="account-section-head">
        <strong>修改密码</strong>
        <span>安全操作</span>
      </div>
      <div class="account-form-list">
        <label class="account-input-field">
          <span>当前密码</span>
          <input v-model="oldPassword" type="password" placeholder="请输入当前密码" />
        </label>
        <label class="account-input-field">
          <span>新密码</span>
          <input v-model="newPassword" type="password" placeholder="请输入新密码" />
        </label>
      </div>
      <button type="button" class="account-secondary-button" @click="passwordSaved = true">
        <KeyRound :size="18" />
        保存新密码
      </button>
      <section v-if="passwordSaved" class="account-save-strip">
        <CheckCircle2 :size="18" />
        <span>密码修改已完成。</span>
      </section>
    </section>

    <section class="account-section danger">
      <div class="account-section-head">
        <strong>账号操作</strong>
        <span>谨慎处理</span>
      </div>
      <div class="settings-danger-list">
        <button type="button" @click="accountAction = '已退出登录'">
          <LogOut :size="19" />
          <span>退出登录</span>
        </button>
        <button type="button" class="settings-danger-nav" @click="$emit('action', 'OPEN_ACCOUNT_CANCEL')">
          <Trash2 :size="19" />
          <span>注销账号</span>
          <ChevronRight :size="19" />
        </button>
      </div>
      <section v-if="accountAction" class="account-save-strip warning">
        <CircleAlert :size="18" />
        <span>{{ accountAction }}</span>
      </section>
    </section>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  CheckCircle2,
  CircleAlert,
  ChevronRight,
  KeyRound,
  LogOut,
  Settings,
  Trash2,
  Type
} from "lucide-vue-next";
import { computed, ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";

const fontSizes = ["标准", "大号", "超大"];
const fontSize = ref("大号");
const soundEnabled = ref(true);
const oldPassword = ref("");
const newPassword = ref("");
const passwordSaved = ref(false);
const accountAction = ref("");

const fontPreviewClass = computed(() => ({
  "is-large": fontSize.value === "大号",
  "is-extra-large": fontSize.value === "超大"
}));

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
