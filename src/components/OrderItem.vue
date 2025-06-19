<template>
  <div class="grid grid-cols-5 gap-4 mt-6">
    <div class="col-span-4">
      <div class="w-full flex items-center justify-between gap-1">
        <div class="flex gap-1 items-center">
          <img
            :src="order.image"
            class="size-10 rounded-full object-cover"
            alt=""
          />
          <div>
            <p class="text-white text-sm font-medium line-clamp-1">
              {{ order.name }}
            </p>
            <p class="text-[#ABBBC2] text-xs font-medium">${{ order.price }}</p>
          </div>
        </div>
        <BaseInput class="!w-12" :model-value="order.count" readonly />
      </div>
      <BaseInput
        class="mt-2"
        placeholder="Order Note..."
        :model-value="note"
        @update:modelValue="updateNote"
      />
    </div>
    <div class="flex flex-col justify-between">
      <p class="text-base font-medium text-white">
        $ {{ formatPrice(order.price * order.count) }}
      </p>
      <button
        class="size-12 rounded-lg border border-primary text-primary flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white hover:bg-opacity-10 transition-colors"
        @click="$emit('delete', order)"
      >
        <DeleteSvg />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import BaseInput from "./BaseInput.vue";
import DeleteSvg from "./icons/DeleteSvg.vue";
import { formatPrice } from "../utils";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete", "update:note"]);

const note = ref(props.order.note || "");

watch(
  () => props.order.note,
  (newNote) => {
    note.value = newNote || "";
  }
);

const updateNote = (value: string) => {
  note.value = value;
  emit("update:note", value);
};
</script>
