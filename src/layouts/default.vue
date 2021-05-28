<template>
  <div
    class="
      fixed
      z-50
      transition-all
      duration-500
      right-8
      cursor-pointer
      light-bulb
      top-0
    "
    :class="{
      '-top-44 hover:-top-40': !showColorPreference,
    }"
    @click.prevent.stop="toggleDark"
  >
    <icon-moon v-if="!isDark" class="w-12 relative top-40" />
    <icon-sun v-else class="w-12 relative top-40" />
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import IconMoon from "./../assets/svg/icon-moon.svg?component";
import IconSun from "./../assets/svg/icon-sun.svg?component";

export default defineComponent({
  components: { IconMoon, IconSun },

  setup() {
    const showColorPreference = ref<boolean>(false);
    const isDark = useDark();
    const toggleDark = useToggle(isDark);

    onBeforeMount((): void => {
      document.addEventListener("scroll", colorPreference);
    });

    // Show colorPreference
    const colorPreference = (): void => {
      const scrollY = window.scrollY || window.pageYOffset;
      const $element = document.querySelector("#logo");
      if ($element) {
        const elementPosition =
          $element.getBoundingClientRect().top +
          scrollY +
          $element.clientHeight;
        if (scrollY > elementPosition - 50) {
          showColorPreference.value = true;
        } else {
          showColorPreference.value = false;
        }
      }
    };

    return { isDark, showColorPreference, toggleDark };
  },
});
</script>
