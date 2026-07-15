<template>
  <div :class="['phone-app', 'standalone', shellClass]">
    <StatusBar />
    <div :class="['phone-screen', { 'without-header': !showHeader }]">
      <AppHeader
        v-if="showHeader"
        :title="title"
        :meta="meta"
        :show-back="showBack"
        :show-profile-button="showProfileButton && activeTab !== 'profile'"
        @back="$emit('back')"
      />
      <div :class="['screen-content', contentClass]">
        <slot />
      </div>
      <BottomNav
        v-if="showNav"
        :active="activeTab"
        @navigate="$emit('navigate', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
import BottomNav from "./BottomNav.vue";
import StatusBar from "./StatusBar.vue";

withDefaults(
  defineProps<{
    title: string;
    meta?: string;
    contentClass?: string;
    shellClass?: string;
    showBack?: boolean;
    showProfileButton?: boolean;
    showHeader?: boolean;
    showNav?: boolean;
    activeTab?: "home" | "agent" | "learning" | "profile";
  }>(),
  {
    contentClass: "",
    shellClass: "",
    showBack: false,
    showProfileButton: true,
    showHeader: true,
    showNav: true,
    activeTab: "home"
  }
);

defineEmits<{
  back: [];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
