<template>
  <div class="w-full">
    <div class="flex border-b border-gray-700 overflow-x-auto gap-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="py-3 bg-transparent border-none text-white cursor-pointer transition-all font-semibold relative text-sm"
        :class="{
          '!text-primary': activeTab === tab.key,
        }"
        @click="setActiveTab(tab.key)"
      >
        {{ tab.label }}
        <div
          v-if="activeTab === tab.key"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
        ></div>
      </button>
    </div>

    <div class="py-4">
      <slot :name="activeTab"></slot>
      <slot
        v-if="activeTab !== undefined && !$slots[activeTab]"
        name="default"
      ></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";

interface TabItem {
  key: string | number;
  label: string;
}

const props = defineProps<{
  tabs: TabItem[];
  modelValue?: string | number;
}>();

const emit = defineEmits(["update:modelValue"]);

const activeTab = ref<string | number | undefined>(props.modelValue);

onMounted(() => {
  if (activeTab.value === undefined && props.tabs.length > 0) {
    activeTab.value = props.tabs[0].key;
    emit("update:modelValue", activeTab.value);
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      activeTab.value = newValue;
    }
  }
);

const setActiveTab = (key: string | number) => {
  activeTab.value = key;
  emit("update:modelValue", key);
};
</script>
