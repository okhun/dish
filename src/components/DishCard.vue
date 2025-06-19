<template>
  <div
    class="bg-secondary px-6 pb-6 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
    @click="$emit('select', dish)"
  >
    <div class="flex justify-center -mt-8">
      <img
        :src="dish.image"
        :alt="dish.name"
        class="w-32 h-32 rounded-full object-cover"
      />
    </div>
    <div class="flex-1 text-center mt-4">
      <p class="text-white text-sm font-medium">{{ dish.name }}</p>
      <p class="text-sm text-white font-normal my-2">
        ${{ formatPrice(dish.price) }}
      </p>
      <p
        class="text-sm text-gray-200 font-normal"
        :class="{ 'text-red-500': dish.count === 0 }"
      >
        {{ dish.count }} Bowls available
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatPrice } from "../utils";

defineProps({
  dish: {
    type: Object,
    required: true,
  },
});

defineEmits(["select"]);
</script>
