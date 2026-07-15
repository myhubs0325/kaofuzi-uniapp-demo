<template>
  <button
    type="button"
    :class="['home-feature-card', tone]"
    :aria-label="title"
    @click="$emit('click')"
  >
    <span class="feature-card-topline">
      <span class="action-icon">
        <component :is="icon" :size="22" />
      </span>
      <small>{{ badge }}</small>
    </span>
    <strong>{{ title }}</strong>
  </button>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  icon: Component;
  title: string;
  badge: string;
  tone: string;
}>();

defineEmits<{
  click: [];
}>();
</script>
