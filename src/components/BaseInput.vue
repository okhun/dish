<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm text-white mb-2">{{
      label
    }}</label>
    <div class="relative">
      <div v-if="search" class="absolute left-3.5 top-3.5 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        :type="type"
        v-model="model"
        :readonly="readonly"
        :placeholder="placeholder"
        class="w-full h-12 bg-bg-input border border-dark-line rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        :class="{
          'border-red-500': error,
          'pl-10 pr-3.5': search,
          'px-3.5': !search,
        }"
        v-bind="$attrs"
      />

      <slot name="suffix" />
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
const model = defineModel();

defineProps({
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  error: {
    type: String,
    default: "",
  },
  search: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});
</script>
