<template>
  <Teleport to="body">
    <div v-if="open" class="mobile-select-sheet">
      <button type="button" class="mobile-select-mask" @click="$emit('close')" />
      <section class="mobile-select-panel">
        <div class="mobile-select-head">
          <strong>{{ title }}</strong>
          <button type="button" class="mobile-select-close" @click="$emit('close')">
            关闭
          </button>
        </div>

        <div class="mobile-select-list">
          <button
            v-for="option in options"
            :key="option.label"
            type="button"
            :class="['mobile-select-option', { selected: isSelected(option.label) }]"
            @click="handleOptionClick(option.label)"
          >
            <div class="mobile-select-copy">
              <strong>{{ option.label }}</strong>
              <small v-if="option.meta">{{ option.meta }}</small>
            </div>
            <Check v-if="isSelected(option.label)" :size="18" />
          </button>
        </div>

        <div v-if="multiple" class="mobile-select-actions">
          <button type="button" class="mobile-select-cancel" @click="$emit('close')">
            取消
          </button>
          <button type="button" class="mobile-select-confirm" @click="$emit('confirm')">
            确定
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Check } from "lucide-vue-next";

type SelectOption = {
  label: string;
  meta?: string;
};

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    options: SelectOption[];
    multiple?: boolean;
    selectedValue?: string;
    selectedValues?: string[];
  }>(),
  {
    multiple: false,
    selectedValue: "",
    selectedValues: () => []
  }
);

const emit = defineEmits<{
  close: [];
  select: [string];
  toggle: [string];
  confirm: [];
}>();

const isSelected = (label: string) => {
  return props.multiple
    ? props.selectedValues.includes(label)
    : props.selectedValue === label;
};

const handleOptionClick = (label: string) => {
  if (props.multiple) {
    emit("toggle", label);
    return;
  }
  emit("select", label);
};
</script>
