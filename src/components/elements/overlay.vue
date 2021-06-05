<template>
  <div class="relative">
    <div
      v-if="busy"
      class="
        flex
        absolute
        w-full
        h-full
        top-1/2
        left-0
        pl-4
        transform
        -translate-y-1/2
        items-center
        py-1
        px-2
        rounded
        cursor-not-allowed
        select-none
        transition
        z-10
        dark:transition
      "
      :class="{
        'border border-gray-300 bg-gray-200 dark:bg-gray-700':
          type === 'search',
        'bg-opacity-80 bg-black justify-center': type === 'simple',
      }"
    >
      <i-ri-loader-4-line
        class="
          animate-spin
          h-6
          w-6
          text-gray-400
          mr-4
          loading-spin
          transition
          dark:transition
        "
      />
      <span
        class="
          tracking-wide
          font-light font-mono
          text-gray-700
          transition
          dark:transition
          dark:text-gray-300
        "
      >
        Đang "<span class="font-bold">mượn</span>" link...
      </span>
    </div>

    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "search",
    },
  },
  setup() {},
})
</script>

<style scoped>
.loading-spin circle {
  opacity: 0.25;
}
</style>
