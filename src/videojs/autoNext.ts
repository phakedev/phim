import videojs from "video.js"
const Plugin = videojs.getPlugin("plugin")

const defaults = {
  handle: function () {},
}

export class RegisterPlugin extends Plugin {
  private options: any

  constructor(player: videojs.Player, options: any) {
    super(player, options)
    this.options = videojs.mergeOptions(defaults, options)

    const handleEnded = (): void | CallableFunction => {
      if (this.options.handle && typeof options.handle === "function") {
        return options.handle()
      }
    }

    const startInterval = () => {
      // let x = 0
      // const end = 3
      // let left = end
      // const interval = setInterval(() => {
      //   x = x + 1
      //   left = end - x
      //   if (left <= 0) {
      //     clearInterval(interval)
      //     handleEnded()
      //   }
      // }, 1000)
      handleEnded()
    }

    this.player.on("ended", startInterval)
  }
}
