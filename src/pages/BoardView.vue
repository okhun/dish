<template>
  <div class="w-full bg-background pl-3 pr-6 py-6">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-white text-3xl font-semibold">Jaegar Resto</p>
        <p class="text-base text-light-200 font-normal">
          {{ formattedCurrentDate }}
        </p>
      </div>
      <BaseInput
        search
        :model-value="debouncedSearchTerm"
        @update:modelValue="handleSearch"
        class="!w-64"
        placeholder="Search for food, coffe, etc.."
      />
    </div>
    <BaseTab
      :tabs="tabs"
      v-model="currentTab"
      class="mt-4"
      @update:model-value="handleTabModel"
    />
    <div class="mb-20 flex items-center justify-between">
      <p class="text-xl font-semibold text-white">Choose Dishes</p>
      <BaseSelect
        :options="orderTypeList"
        v-model="orderTypeValue"
        class="w-36"
      />
    </div>
    <div
      v-if="computedDishList.length === 0"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p class="text-white text-xl font-medium">No dishes found</p>
      <p class="text-gray-200 text-base mt-2">
        {{
          debouncedSearchTerm
            ? `No results for "${debouncedSearchTerm}"`
            : `No dishes in ${currentTabLabel} category`
        }}
      </p>

      <BaseButton class="mt-4" @click="clearSearch" v-if="debouncedSearchTerm"
        >Clear search
      </BaseButton>
    </div>
    <div
      v-else
      class="mt-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
    >
      <DishCard
        v-for="dish in computedDishList"
        :key="dish.id"
        :dish="dish"
        @select="handleDishOrder"
      />
    </div>
  </div>
  <div class="w-[540px] bg-secondary h-full p-4 flex flex-col justify-between">
    <div>
      <p class="text-white text-xl font-semibold">Orders #34562</p>
      <div class="flex gap-4 my-6">
        <button
          v-for="orderType in orderTypeList"
          :key="orderType.key"
          class="text-sm font-semibold border border-dark-line p-2 rounded-lg cursor-pointer"
          :class="[
            orderType.key === orderTypeValue
              ? 'text-white bg-primary'
              : 'text-primary',
          ]"
          @click="orderTypeValue = orderType.key"
          :disabled="orderType.key === orderTypeValue"
        >
          {{ orderType.label }}
        </button>
      </div>
      <div
        class="grid grid-cols-5 mt-4 text-white text-base font-semibold gap-4 border-b border-dark-line"
      >
        <div class="col-span-4 flex justify-between items-center mb-4">
          <span>Item</span>
          <span>Qty</span>
        </div>
        <div>
          <span>Price</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 overflow-y-auto">
      <template v-if="orders.length === 0">
        <div class="flex items-center justify-center h-32">
          <p class="text-gray-200 text-base font-normal">
            No orders yet. Please select dishes to order.
          </p>
        </div>
      </template>
      <template v-else>
        <OrderItem
          v-for="order in orders"
          :key="order.id"
          :order="order"
          @delete="handleDishOrderDelete"
          @update:note="(note:string) => updateOrderNote(order, note)"
        />
      </template>
    </div>
    <div class="py-4 border-t border-dark-line">
      <div class="flex justify-between mt-4">
        <p class="text-gray-200 text-sm font-normal">Discount</p>
        <p class="text-white text-base font-medium">$0</p>
      </div>
      <div class="flex justify-between mt-4">
        <p class="text-gray-200 text-sm font-normal">Sub total</p>
        <p class="text-white text-base font-medium">
          ${{ formatPrice(orderTotalPrice) }}
        </p>
      </div>
      <BaseButton class="w-full mt-10" @click="handlePayment"
        >Continue to Payment
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import BaseTab from "../components/BaseTab.vue";
import BaseInput from "../components/BaseInput.vue";
import { useRoute, useRouter } from "vue-router";
import BaseButton from "../components/BaseButton.vue";
import { formatPrice } from "../utils";
import DishCard from "../components/DishCard.vue";
import OrderItem from "../components/OrderItem.vue";
import BaseSelect from "../components/BaseSelect.vue";

interface Dish {
  id: number;
  name: string;
  price: number;
  count: number;
  image: string;
  type: string;
  note?: string;
}
const route = useRoute();
const router = useRouter();
const currentTab = ref<string | number>("hot-dishes");
const debouncedSearchTerm = ref("");
const orderTypeValue = ref("dine-in");
const formattedCurrentDate = computed(() => {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    now
  );
  const day = now.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    now
  );
  const year = now.getFullYear();

  return `${weekday}, ${day} ${month} ${year}`;
});
const currentTabLabel = computed(() => {
  const tab = tabs.find((tab) => tab.key === currentTab.value);
  return tab ? tab.label : "";
});
const computedDishList = computed(() => {
  let filteredList = dishList.filter((el) => el.type === currentTab.value);

  if (debouncedSearchTerm.value.trim()) {
    filteredList = filteredList.filter((dish) =>
      dish.name.toLowerCase().includes(debouncedSearchTerm.value.toLowerCase())
    );
  }

  return filteredList;
});

const orderTotalPrice = computed(() => {
  return orders.reduce((total, order) => total + order.price * order.count, 0);
});
const debounce = (fn: Function, delay: number) => {
  let timeout: number | undefined;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
const clearSearch = () => {
  debouncedSearchTerm.value = "";
  router.push({
    name: route.name as string,
    query: { ...route.query, search: "" },
  });
};
const handleSearch = debounce((value: string) => {
  debouncedSearchTerm.value = value;
  router.push({ name: route.name, query: { ...route.query, search: value } });
}, 300);
const updateOrderNote = (order: Dish, note: string) => {
  order.note = note;
};
const handleTabModel = (value: string | number) => {
  currentTab.value = value;
  debouncedSearchTerm.value = "";
  router.push({
    name: route.name as string,
    query: { dishType: value },
  });
};
const handleDishOrder = (dish: any) => {
  if (dish.count <= 0) return;
  const existingOrder = orders.find((order) => order.id === dish.id);
  if (existingOrder) {
    existingOrder.count++;
  } else {
    orders.push({ ...dish, count: 1, note: "" });
  }
  dish.count--;
};
const handleDishOrderDelete = (order: Dish) => {
  const existingOrder = orders.find((o) => o.id === order.id);
  if (existingOrder) {
    existingOrder.count--;
    if (existingOrder.count <= 0) {
      orders.splice(orders.indexOf(existingOrder), 1);
    }
    const dish = dishList.find((d) => d.id === order.id);
    if (dish) {
      dish.count++;
    }
  }
};

const handlePayment = () => {
  if (orders.length === 0) {
    alert("Please add at least one dish to your order.");
    return;
  }
  alert(
    `Total amount: $${formatPrice(
      orderTotalPrice.value
    )}. Proceeding to payment...`
  );
};
onMounted(() => {
  const dishType = route.query.dishType as string;
  const searchTerm = route.query.search as string;
  if (dishType && tabs.map((el) => el.key).includes(dishType)) {
    currentTab.value = dishType;
  }
  if (searchTerm) {
    debouncedSearchTerm.value = searchTerm;
  }
});
const orderTypeList = [
  { key: "dine-in", label: "Dine in" },
  { key: "take-away", label: "To go" },
  { key: "delivery", label: "Delivery" },
];
const tabs = [
  { key: "hot-dishes", label: "Hot Dishes" },
  { key: "cold-dishes", label: "Cold Dishes" },
  { key: "soup", label: "Soup" },
  { key: "grill", label: "Grill" },
  { key: "appetizer", label: "Appetizer" },
  { key: "dessert", label: "Dessert" },
];
const orders = reactive<Dish[]>([]);
const dishList = reactive<Dish[]>([
  // Hot Dishes
  {
    id: 1,
    name: "Spicy seasoned seafood noodles",
    price: 2.29,
    count: 20,
    image:
      "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&h=350&auto=format&fit=crop",
    type: "hot-dishes",
  },
  {
    id: 2,
    name: "Salted Pasta with mushroom sauce",
    price: 2.69,
    count: 11,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=350&auto=format&fit=crop",
    type: "hot-dishes",
  },
  {
    id: 3,
    name: "Beef dumpling in hot and sour soup",
    price: 2.99,
    count: 16,
    image:
      "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=500&h=350&auto=format&fit=crop",
    type: "hot-dishes",
  },
  {
    id: 4,
    name: "Spicy chicken curry rice",
    price: 3.49,
    count: 8,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=350&auto=format&fit=crop",
    type: "hot-dishes",
  },

  // Cold Dishes
  {
    id: 5,
    name: "Fresh Vietnamese Spring Rolls",
    price: 2.19,
    count: 14,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=350&auto=format&fit=crop",
    type: "cold-dishes",
  },
  {
    id: 6,
    name: "Chilled Cucumber Gazpacho",
    price: 1.89,
    count: 9,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=350&auto=format&fit=crop",
    type: "cold-dishes",
  },
  {
    id: 7,
    name: "Mediterranean Chickpea Salad",
    price: 2.49,
    count: 12,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=350&auto=format&fit=crop",
    type: "cold-dishes",
  },

  // Soup
  {
    id: 8,
    name: "Creamy Tomato Basil Soup",
    price: 2.29,
    count: 16,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=350&auto=format&fit=crop",
    type: "soup",
  },
  {
    id: 9,
    name: "French Onion Soup",
    price: 2.89,
    count: 7,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=350&auto=format&fit=crop",
    type: "soup",
  },
  {
    id: 10,
    name: "Hearty Vegetable Minestrone",
    price: 2.59,
    count: 11,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=350&auto=format&fit=crop",
    type: "soup",
  },

  // Grill
  {
    id: 11,
    name: "BBQ Ribeye Steak",
    price: 6.99,
    count: 5,
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=350&auto=format&fit=crop",
    type: "grill",
  },
  {
    id: 12,
    name: "Grilled Atlantic Salmon",
    price: 5.89,
    count: 8,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=350&auto=format&fit=crop",
    type: "grill",
  },
  {
    id: 13,
    name: "Mixed Grill Skewers",
    price: 4.99,
    count: 9,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=350&auto=format&fit=crop",
    type: "grill",
  },

  // Appetizer
  {
    id: 14,
    name: "Crispy Calamari Rings",
    price: 3.29,
    count: 15,
    image:
      "https://images.unsplash.com/photo-1533162507191-d90c625b2640?w=500&h=350&auto=format&fit=crop",
    type: "appetizer",
  },
  {
    id: 15,
    name: "Spinach Artichoke Dip",
    price: 2.79,
    count: 12,
    image:
      "https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=500&h=350&auto=format&fit=crop",
    type: "appetizer",
  },
  {
    id: 16,
    name: "Bruschetta with Tomato & Basil",
    price: 2.39,
    count: 14,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=350&auto=format&fit=crop",
    type: "appetizer",
  },

  // Dessert
  {
    id: 17,
    name: "New York Cheesecake",
    price: 3.49,
    count: 10,
    image:
      "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?w=500&h=350&auto=format&fit=crop",
    type: "dessert",
  },
  {
    id: 18,
    name: "Chocolate Lava Cake",
    price: 3.29,
    count: 8,
    image:
      "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=500&h=350&auto=format&fit=crop",
    type: "dessert",
  },
  {
    id: 19,
    name: "Tiramisu Cup",
    price: 2.99,
    count: 6,
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=350&auto=format&fit=crop",
    type: "dessert",
  },
  {
    id: 20,
    name: "Crème Brûlée",
    price: 3.19,
    count: 9,
    image:
      "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=500&h=350&auto=format&fit=crop",
    type: "dessert",
  },
]);
</script>
