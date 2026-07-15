<template>
  <div class="status-bar" aria-label="设备状态栏">
    <span>9:41</span>
    <div class="status-icons">
      <Signal :size="14" />
      <Wifi :size="14" />
      <BatteryMedium :size="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BatteryMedium, Signal, Wifi } from "lucide-vue-next";
</script>
