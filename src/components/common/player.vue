<template>
  <video
    id="player"
    class="
      video-js
      vjs-theme-phake
      w-full
      md:min-h-20
      rounded
      overflow-hidden
      shadow-xl
    "
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue"
import videojs, { VideoJsPlayerOptions } from "video.js"
import { hotkeys } from "./../../videojs"
import "video.js/dist/video-js.css"
import "./../../assets/css/videojs.css"

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    let player: any | null = null
    const options: VideoJsPlayerOptions = {
      autoplay: true,
      fluid: true,
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2, 4],
    }

    onMounted(() => {
      if (videojs.getAllPlayers().length === 0) {
        player = videojs("player", options)
        videojs.registerPlugin("hotkeys", hotkeys.HotkeysPlugin)
        player.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          enableMute: true,
          enableVolumeScroll: true,
          enableModifiersForNumbers: false,
        })
      }
    })

    watch(
      () => props.data,
      (val) => {
        if (!val || !player) {
          return
        }
        player.src({
          type: "application/x-mpegURL",
          src: val.url,
        })
        player.play()
        emit("on-play")
        const $ele = document.querySelector("#current-video")
        if ($ele) {
          const y = $ele.getBoundingClientRect().top + window.pageYOffset - 60
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }
    )
    return {}
  },
})
</script>
