<template>
  <button
    :disabled="disabled"
    class="flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none"
    :class="[
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:bg-opacity-90 active:bg-opacity-80',
      variant === 'primary'
        ? 'bg-primary text-white shadow-[0px_8px_24px_0px_rgba(234,124,105,0.3)]'
        : '',
      variant === 'outline'
        ? 'bg-transparent border border-primary text-primary'
        : '',
      variant === 'text' ? 'bg-transparent text-primary shadow-none' : '',
      sizeClasses,
    ]"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value: string) =>
      ["primary", "outline", "text"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value: string) => ["sm", "md", "lg"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-4 py-2 text-sm";
    case "lg":
      return "px-8 py-4 text-lg";
    default:
      return "px-6 py-3 text-base";
  }
});

defineEmits(["click"]);
</script>
