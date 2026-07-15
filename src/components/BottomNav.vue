<template>
  <nav class="bottom-nav" aria-label="家长端主导航">
    <button
      type="button"
      :class="{ active: active === 'home' }"
      :aria-current="active === 'home' ? 'page' : undefined"
      @click="emit('navigate', 'home')"
    >
      <House :size="22" />
      <span>首页</span>
    </button>
    <button
      type="button"
      :class="{ active: active === 'agent' }"
      :aria-current="active === 'agent' ? 'page' : undefined"
      @click="emit('navigate', 'agent')"
    >
      <GraduationCap :size="22" />
      <span>家长反馈</span>
    </button>
    <button
      type="button"
      :class="{ active: active === 'learning' }"
      :aria-current="active === 'learning' ? 'page' : undefined"
      @click="emit('navigate', 'learning')"
    >
      <NotebookTabs :size="22" />
      <span>学习进展</span>
    </button>
    <button
      type="button"
      :class="{ active: active === 'profile' }"
      :aria-current="active === 'profile' ? 'page' : undefined"
      @click="emit('navigate', 'profile')"
    >
      <UserRound :size="22" />
      <span>我的</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { GraduationCap, House, NotebookTabs, UserRound } from "lucide-vue-next";

defineProps<{
  active: "home" | "agent" | "learning" | "profile";
}>();

const emit = defineEmits<{
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
