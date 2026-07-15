<template>
  <header class="app-header">
    <button
      v-if="showBack"
      type="button"
      class="icon-button"
      aria-label="返回首页"
      @click="$emit('back')"
    >
      <ArrowLeft :size="22" />
    </button>
    <span v-else class="app-logo">
      <img :src="logoUrl" alt="考夫子教评助手 Logo" />
    </span>

    <div class="header-copy">
      <strong>{{ title }}</strong>
      <span v-if="meta">{{ meta }}</span>
    </div>

    <button
      v-if="showProfileButton"
      type="button"
      class="profile-button"
      aria-label="数据与隐私"
      @click="openDataPrivacy?.()"
    >
      <UserRound :size="20" />
    </button>
    <span v-else class="header-placeholder" aria-hidden="true" />
  </header>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { ArrowLeft, UserRound } from "lucide-vue-next";
import logoUrl from "../../logo.png";

withDefaults(
  defineProps<{
    title: string;
    meta?: string;
    showBack?: boolean;
    showProfileButton?: boolean;
  }>(),
  {
    showBack: false,
    showProfileButton: true
  }
);

const openDataPrivacy = inject<() => void>("openDataPrivacy");

defineEmits<{
  back: [];
}>();
</script>
