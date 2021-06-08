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
      px-4
      lg:px-0
      duration-300
      transition-all
    "
    :class="{
      'md:pt-40 lg:pt-56': !state.hasResults,
    }"
  >
    <div ref="appRef" class="w-full">
      <h1 class="text-2xl font-bold text-gray-600 uppercase tracking-widest">
        Phim
        <span class="text-gray-400">Phake</span>
      </h1>
      <p class="mt-2 text-gray-400 font-extralight md:text-xl">
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
          <div
            class="relative"
            :class="{
              'md:w-1/2 mx-auto': state.hasResults,
            }"
          >
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
                'md:text-left': state.hasResults,
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
                    hover:text-pink-500 hover:stroke-2 hover:transition
                    -translate-y-1/2
                  "
                />
              </div>
            </div>
          </div>
        </elements-overlay>
      </div>

      <elements-overlay type="simple" :busy="busy.loadingPlayer">
        <div v-show="state.selected" id="current-video" class="my-16">
          <p
            class="
              text-center
              font-medium
              rounded
              bg-gray-200
              inline-block
              px-4
              py-1
              text-base
              dark:bg-gray-800 dark:text-gray-400
              mb-8
            "
          >
            🍺 Time to Chill!
          </p>
          <h1
            v-if="state.selected"
            class="
              text-base
              md:text-2xl
              tracking-tight
              mb-4
              font-semibold
              text-pink-700
            "
          >
            {{ state.selected.title ? state.selected.title : "" }}
            <template v-if="state.selected.isMovieSeries">
              - Tập
              <span>
                {{
                  state.selected.isMovieSeries
                    ? state.selected.currentEpisode
                    : ""
                }}
              </span>
            </template>
          </h1>
          <common-player
            :data="state.selected"
            @on-play="show.playing = true"
          />

          <div
            v-if="
              state.selected && state.selected.isMovieSeries && state.episodes
            "
            id="list-episodes"
            class="
              mt-4
              grid
              gap-2
              max-h-36
              grid-cols-3
              md:grid-cols-8 md:max-h-72
              overflow-y-scroll
              scrollbar scrollbar-thumb-pink-600
              dark:scrollbar-track-gray-900
              scrollbar-thumb-rounded scrollbar-track-rounded
            "
          >
            <span
              v-for="episode in state.episodes"
              :key="episode.id"
              class="
                episode
                border
                transition
                cursor-pointer
                hover:bg-gray-200
                dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-600
                hover:transition
                rounded
                px-4
                py-2
              "
              :class="{
                'is-active bg-pink-800 hover:bg-pink-600 text-white dark:bg-pink-800 dark:hover:bg-pink-600':
                  parseInt(episode.label) === state.selected.currentEpisode,
              }"
              @click.prevent="setEpisode(episode)"
            >
              Tập {{ episode.label }}
            </span>
          </div>
        </div>
      </elements-overlay>

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
import ElementsOverlay from "~/components/elements/overlay.vue"
import CommonMovie from "~/components/common/movie.vue"
import CommonPlayer from "~/components/common/player.vue"
import { defineComponent, reactive, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useSearch } from "~/modules/search"
import { useMotion } from "@vueuse/motion"

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
      hasResults: false,
      episodes: [],
      episodeUrls: [],
    })
    const busy = reactive({
      searching: false,
      loadingPlayer: false,
    })
    const appRef = ref()
    const { getMovies, findEpisodeById } = useSearch()
    const route = useRoute()
    const router = useRouter()
    const show = ref({
      playing: false,
    })

    /**
     * Set input value if route param q exists
     */
    onMounted(async () => {
      if (route.query.q) {
        state.form.q = route.query.q
        await search()
      }
      initMotion()
    })

    const setEpisodeScrollPosition = () => {
      const $currentEpisode =
        document.querySelector<HTMLElement>(".episode.is-active")
      const $episodes = document.getElementById("list-episodes")

      if ($currentEpisode !== null && $currentEpisode.offsetTop && $episodes) {
        $episodes.scrollTop = $currentEpisode.offsetTop
      }
    }

    const initMotion = () => {
      useMotion(appRef, {
        initial: {
          x: 100,
          opacity: 0,
        },
        enter: {
          x: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 350,
            damping: 20,
            delay: 50,
          },
        },
      })
    }

    const setQuery = (key: string, val: any) => {
      const query = {
        [key]: val,
      }
      router.push({
        query: {
          ...query,
        },
      })
    }

    const search = async () => {
      try {
        state.errors = null
        if (!state.form.q || state.form.q === "") {
          setQuery("q", null)
          state.hasResults = false
          throw new Error("Viết đại cái gì đó cũng được mà.")
        }

        setQuery("q", state.form.q)

        busy.searching = true

        const response = await getMovies(state.form.q, state.form.smartSearch)
        const responseBody = response.data
        if (Array.isArray(responseBody) && responseBody.length === 0) {
          state.hasResults = false
          throw new Error("Kiếm thử bộ khác đi người anh em...")
        }
        state.results = responseBody
        busy.searching = false

        const $ele = document.querySelector("#results")
        if ($ele) {
          const y = $ele.getBoundingClientRect().top + window.pageYOffset - 60
          window.scrollTo({ top: y, behavior: "smooth" })
        }
        state.hasResults = true
      } catch (err) {
        busy.searching = false
        state.results = null
        if (err.response.status === 503) {
          state.errors = "Chờ chút rồi thử lại ha, đang quá tải"
        } else {
          state.errors = err.message
        }
      }
    }

    /**
     * Set selectec movie func
     */
    const setSelectedMovie = async (movie: any) => {
      if (movie) {
        const response = await findEpisodeById(movie.episodeId)
        state.selected = { ...movie, url: response.data.url }
        state.episodes = movie.episodeList
      }
    }

    const setEpisode = async (episode: any) => {
      if (episode) {
        busy.loadingPlayer = true
        const response = await findEpisodeById(episode.id)
        state.selected.currentEpisode = parseInt(episode.label)
        state.selected.url = response.data.url
        state.selected = { ...state.selected }
        busy.loadingPlayer = false
      }
    }

    return {
      state,
      show,
      busy,
      search,
      setSelectedMovie,
      appRef,
      setEpisode,
    }
  },
})
</script>

<style scoped>
.caret-pink-400 {
  caret-color: theme("colors.pink.400");
}
</style>
