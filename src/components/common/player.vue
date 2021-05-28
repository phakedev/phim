<template>
  <video
    id="player"
    class="
      video-js
      vjs-default-skin
      w-full
      md:min-h-20
      rounded
      overflow-hidden
      shadow-xl
    "
  ></video>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    let player: VideoJsPlayer | null = null;
    const options: VideoJsPlayerOptions = {
      autoplay: true,
      fluid: true,
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2, 4],
    };

    onMounted(() => {
      player = videojs("player", options);
    });

    watch(
      () => props.data,
      (val) => {
        if (!val || !player) {
          return;
        }
        player.src({
          type: "application/x-mpegURL",
          src: val.url,
        });
        player.play();
        emit("on-play");
        const $ele = document.querySelector("#current-video");
        if ($ele) {
          const y = $ele.getBoundingClientRect().top + window.pageYOffset - 60;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    );
    return {};
  },
});
</script>
