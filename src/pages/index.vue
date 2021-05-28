<template>
  <div
    class="
      w-full
      max-w-5xl
      text-center
      flex
      min-h-screen
      mx-auto
      pt-8
      md:pt-40
      lg:pt-56
      px-4
      lg:px-0
      transition-all
    "
  >
    <div
      v-motion
      :initial="{
        x: 100,
        opacity: 0.25,
      }"
      :enter="{
        x: 0,
        opacity: 1,
      }"
      class="w-full"
    >
      <h1 class="text-2xl font-bold text-gray-600 uppercase tracking-widest">
        Phim <span class="text-gray-400">Phake</span>
      </h1>
      <p class="mt-2 text-gray-400 font-extralight text-xl">
        The free "<span class="font-normal">forever</span>" movie search engine
      </p>

      <div class="mt-8 max-w-3xl mx-auto">
        <div
          v-if="state.errors"
          class="
            mb-4
            border border-red-400
            bg-red-50
            text-red-600
            rounded
            pl-1.5
            pr-4
            py-2
            text-left
            relative
            transition
            dark:transition
            dark:bg-red-900
            dark:border-transparent
            dark:text-white
          "
        >
          <span
            class="
              tracking-tight
              font-bold
              mr-4
              text-sm
              bg-red-600
              text-white
              px-1.5
              py-1.5
              rounded
            "
          >
            🐛 Error!
          </span>
          {{ state.errors }} <b>(￣ ￣|||)</b>
        </div>

        <elements-overlay :busy="busy.searching">
          <div class="relative">
            <input
              id="search-input"
              v-model="state.form.q"
              type="text"
              placeholder="tên phim"
              class="input"
              :class="{
                'ring-red-600 ring-2 border-transparent':
                  state.errors &&
                  (state.form.q === null || state.form.q === ''),
              }"
              :disabled="busy.searching"
              @keyup.enter="search"
            />

            <div
              class="
                absolute
                right-6
                top-1/2
                transform
                -translate-y-1/2
                flex
                items-center
              "
            >
              <div
                :class="{
                  'cursor-not-allowed pointer-events-none': busy.searching,
                }"
                @click.prevent.stop="search"
              >
                <i-bx-bx-search-alt
                  class="
                    w-8
                    h-8
                    text-gray-400
                    absolute
                    right-0
                    top-1/2
                    transform
                    transition
                    cursor-pointer
                    hover:text-pink-500
                    hover:stroke-2
                    hover:transition
                    -translate-y-1/2
                  "
                />
              </div>
            </div>
          </div>
        </elements-overlay>
      </div>

      <div v-show="state.selected" id="current-video" class="my-8">
        <p class="text-center font-bold text-sm uppercase text-gray-500 mb-4">
          ヽ(￣～￣)ノ Yolo!
        </p>
        <h1 class="text-xl tracking-tight mb-4 font-semibold text-pink-700">
          {{ state.selected ? "" : "" }}
        </h1>
        <common-player :data="state.selected" @on-play="show.playing = true" />
      </div>

      <div v-if="state.results" id="results" class="my-8">
        <p
          class="
            font-medium font-mono
            text-2xl text-gray-700
            dark:text-gray-300
            text-center
            mb-6
            mt-16
          "
        >
          Kết quả
          <span class="font-bold dark:text-white">
            ({{ state.results.length }})
          </span>
        </p>
        <div
          class="
            grid
            gap-4
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            items-stretch
          "
        >
          <div
            v-for="(movie, index) in state.results"
            :key="`result-${String(index)}`"
          >
            <common-movie :data="movie" @on-play="setSelectedMovie" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ElementsOverlay from "./../components/elements/overlay.vue";
import CommonMovie from "./../components/common/movie.vue";
import CommonPlayer from "./../components/common/player.vue";
import { defineComponent, reactive, onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearch } from "../modules/search";

export default defineComponent({
  components: { ElementsOverlay, CommonMovie, CommonPlayer },

  setup() {
    const state = reactive<any>({
      form: {
        q: null,
        smartSearch: true,
      },
      errors: null,
      results: null,
      selected: null,
    });
    const busy = reactive({
      searching: false,
    });
    const { getMovies } = useSearch();
    const route = useRoute();
    const router = useRouter();
    const show = ref({
      playing: false,
    });

    /**
     * Set input value if route param q exists
     */
    onMounted(async () => {
      if (route.query.smartSearch) {
        state.form.smartSearch = route.query.smartSearch;
      }

      if (route.query.q) {
        state.form.q = route.query.q;
        await search();
      }
    });

    watch(
      () => state.form.smartSearch,
      (val) => {
        setQuery("smartSearch", val === true || val === "true" ? 1 : null);
      }
    );

    const setQuery = (key: string, val: any) => {
      const query = {
        [key]: val,
      };
      router.push({
        query: {
          ...query,
        },
      });
    };

    const search = async () => {
      try {
        state.errors = null;
        if (!state.form.q || state.form.q === "") {
          setQuery("q", null);
          throw new Error("Viết đại cái gì đó cũng được mà.");
        }

        setQuery("q", state.form.q);

        busy.searching = true;

        const response = await getMovies(state.form.q, state.form.smartSearch);
        const responseBody = response.data;
        if (Array.isArray(responseBody) && responseBody.length === 0) {
          throw new Error(
            "Kiếm thử bộ khác đi người anh em, bộ này kiếm hoài không ra..."
          );
        }
        state.results = responseBody;
        busy.searching = false;

        const $ele = document.querySelector("#results");
        if ($ele) {
          const y = $ele.getBoundingClientRect().top + window.pageYOffset - 60;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } catch (err) {
        busy.searching = false;
        state.results = null;
        state.errors = err.message;
      }
    };

    /**
     * Set selectec movie func
     */
    const setSelectedMovie = (movie: string) => {
      if (movie) state.selected = movie;
    };

    return {
      state,
      show,
      busy,
      search,
      setSelectedMovie,
    };
  },
});
</script>

<style scoped>
.caret-pink-400 {
  caret-color: theme("colors.pink.400");
}
</style>
