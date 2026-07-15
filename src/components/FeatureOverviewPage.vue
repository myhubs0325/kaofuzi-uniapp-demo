<template>
  <PhoneScaffold
    :title="overview.title"
    :meta="overview.meta"
    content-class="feature-overview-content"
    show-back
    show-nav
    active-tab="home"
    @back="$emit('back')"
    @navigate="$emit('navigate', $event)"
  >
    <section :class="['feature-overview-hero', toneClass]">
      <span class="feature-overview-icon">
        <component :is="icon" :size="25" />
      </span>
      <h2>{{ overview.title }}</h2>
      <strong>{{ overview.headline }}</strong>
      <p>{{ overview.summary }}</p>
      <div class="feature-stat-grid">
        <div v-for="stat in overview.stats" :key="stat.label">
          <span>{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
        </div>
      </div>
    </section>

    <div class="feature-data-list">
      <div v-for="item in overview.items" :key="item.title" class="feature-data-row">
        <div>
          <strong>{{ item.title }}</strong>
          <span>{{ item.meta }}</span>
        </div>
        <small>{{ item.value }}</small>
      </div>
    </div>

    <button
      v-if="overview.actionLabel"
      type="button"
      class="primary-button"
      @click="$emit('primary')"
    >
      {{ overview.actionLabel }}
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import type { Component } from "vue";
import type { FeatureOverviewMode } from "../data/demoData";
import { featureOverviews } from "../data/demoData";
import PhoneScaffold from "./PhoneScaffold.vue";

const props = defineProps<{
  mode: FeatureOverviewMode;
  icon: Component;
  toneClass: string;
}>();

const overview = featureOverviews[props.mode];

defineEmits<{
  back: [];
  navigate: ["home" | "agent" | "learning" | "profile"];
  primary: [];
}>();
</script>
