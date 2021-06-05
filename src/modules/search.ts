import { reactive } from "vue"
import axios from "axios"

const state = reactive<any>({
  axios: axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  }),
})

export function useSearch() {
  const getMovies = (q: string = "", smartSearch: boolean = true) => {
    return state.axios.get("/", {
      params: {
        q,
        smartSearch,
      },
    })
  }

  const findEpisodeById = (id: number) => {
    return state.axios.get("/", {
      params: {
        id,
      },
    })
  }

  return {
    ...state,
    getMovies,
    findEpisodeById,
  }
}
