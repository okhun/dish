<template>
  <div class="w-fill">
    <label v-if="label" class="block text-sm text-white mb-2">{{
      label
    }}</label>
    <div class="relative">
      <div
        @click="toggleDropdown"
        class="w-full h-12 bg-secondary border border-dark-line rounded-lg flex items-center justify-between px-4 cursor-pointer"
        :class="{ 'border-primary': isOpen }"
      >
        <span class="text-white">{{ selectedLabel }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-white transition-transform"
          :class="{ 'transform rotate-180': isOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 mt-2 bg-bg-input border border-dark-line rounded-lg shadow-lg z-10"
      >
        <div
          v-for="option in options"
          :key="option.key"
          @click="selectOption(option.key)"
          class="px-4 py-3 cursor-pointer hover:bg-dark-line first:rounded-t-lg last:rounded-b-lg flex items-center"
          :class="{ 'bg-primary bg-opacity-10': modelValue === option.key }"
        >
          <div
            v-if="modelValue === option.key"
            class="w-2 h-2 bg-primary rounded-full mr-2"
          ></div>
          <span
            class="text-white"
            :class="{ 'ml-4': modelValue !== option.key }"
            >{{ option.label }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

interface SelectOption {
  key: string | number;
  label: string;
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array as () => SelectOption[],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Select option",
  },
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const isOpen = ref(false);
const selectedLabel = computed(() => {
  const found = props.options.find(
    (option: SelectOption) => option.key === props.modelValue
  );
  return found ? found.label : props.placeholder;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (key: string | number) => {
  emit("update:modelValue", key);
  isOpen.value = false;
};

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
