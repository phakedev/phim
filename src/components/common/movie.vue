<template>
  <div
    v-if="data"
    class="
      relative 
      transition
      hover:transform
      hover:transition
      hover:scale-105
      cursor-pointer
    "
    @click="$emit('on-play', data)"
  >
    <div
      class="
        relative
        rounded
        overflow-hidden
        w-full
        movie__thumbnail
        shadow-lg
        h-auto
        md:h-72
      "
    >
      <div
        v-if="data.isMovieSeries"
        class="
          absolute
          bottom-0
          w-full
          text-center
          bg-pink-900 bg-opacity-80
          text-xs
          py-1
          text-white
          z-20
        "
      >
        Tập mới nhất - {{ data.lastEpisode }}
      </div>
      <img
        class="w-full h-full object-cover"
        :src="data.thumbnail"
        :alt="data.title"
      />
    </div>

    <h5
      class="
        text-center
        font-semibold
        text-gray-600 text-sm
        tracking-tight
        pt-2
        line-clamp-2
        cursor-pointer
        transition
        dark:text-gray-200
        hover:text-pink-600
        hover:transition
      "
      @click.prevent="$emit('on-play', data)"
    >
      {{ data.title }}
    </h5>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  setup() {}
})
</script>

<style lang="postcss" scoped>
.movie__thumbnail-overlay {
  @apply opacity-0 transition duration-300;
}
.movie__thumbnail:hover > .movie__thumbnail-overlay {
  @apply opacity-100 transition duration-300;
}
</style>
