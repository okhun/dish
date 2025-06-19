<template>
  <div class="w-[104px] bg-secondary h-full relative">
    <CurveBottom class="absolute right-0 top-0" />
    <CurveTop class="absolute -right-[1px] bottom-0" />
    <div class="flex size-[104px] items-center justify-center"><LogoSvg /></div>
    <ul class="flex flex-col justify-end pl-3">
      <li
        v-for="item in menuList"
        :key="item.name"
        class="w-[92px] h-[104px] flex items-center justify-center relative"
        @click="() => handleNavigate(item.path)"
      >
        <template v-if="route.name === item.path">
          <CurveBottom class="absolute right-0 bottom-0" />
          <CurveTop class="absolute -right-[1px] top-0" />
        </template>
        <div
          :class="[
            route.name === item.path
              ? 'bg-background'
              : 'bg-secondary cursor-pointer',
          ]"
          class="w-full h-20 flex items-center pl-3 rounded-l-xl"
        >
          <div
            class="flex flex-col items-center justify-center size-14 rounded-lg"
            :class="[
              route.name === item.path
                ? 'bg-primary text-white shadow-[0px_8px_24px_0px_rgba(234,124,105,0.32)]'
                : 'text-primary',
            ]"
          >
            <component :is="item.icon" class="size-5" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import HomeSvg from "../components/icons/HomeSvg.vue";
import MessageSvg from "../components/icons/MessageSvg.vue";
import NotificationSvg from "../components/icons/NotificationSvg.vue";
import SettingSvg from "../components/icons/SettingSvg.vue";
import CurveBottom from "./icons/CurveBottom.vue";
import CurveTop from "./icons/CurveTop.vue";
import LogoSvg from "./icons/LogoSvg.vue";

const route = useRoute();
const router = useRouter();
const menuList = [
  { name: "Home", icon: HomeSvg, path: "home" },
  { name: "Mail", icon: MessageSvg, path: "mail" },
  { name: "Notification", icon: NotificationSvg, path: "notification" },
  { name: "Settings", icon: SettingSvg, path: "settings" },
];

const handleNavigate = (name: string) => {
  router.push({ name });
};
</script>
