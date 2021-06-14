import videojs from "video.js"
const Plugin = videojs.getPlugin("plugin")

export class RegisterPlugin extends Plugin {
  private options: any

  private volumeStep
  private seekStep
  private enableMute
  private enableVolumeScroll
  private enableHoverScroll
  private enableFull
  private enableNumbers
  private enableJogStyle
  private alwaysCaptureHotkeys
  private captureDocumentHotkeys
  private documentHotkeysFocusElementFilter
  private enableModifiersForNumbers
  private enableInactiveFocus
  private skipInitialFocus
  private videojsVer

  private cPlay = 1
  private cRewind = 2
  private cForward = 3
  private cVolumeUp = 4
  private cVolumeDown = 5
  private cMute = 6
  private cFullscreen = 7

  private volumeHover = false

  constructor(player: any, options: any) {
    super(player, options)

    // FUNCTIONS
    const playPauseKey = (e: any) => {
      return e.which === 32 || e.which === 179
    }

    const rewindKey = (e: any) => {
      return e.which === 37 || e.which === 177
    }

    const forwardKey = (e: any) => {
      return e.which === 39 || e.which === 176
    }

    const volumeUpKey = (e: any) => {
      return e.which === 38
    }

    const volumeDownKey = (e: any) => {
      return e.which === 40
    }

    const muteKey = (e: any) => {
      return e.which === 77
    }

    const fullscreenKey = (e: any) => {
      return e.which === 70
    }

    const seekStepD = (e: any) => {
      return typeof this.seekStep === "function"
        ? this.seekStep(e)
        : this.seekStep
    }

    const silencePromise = (value: any) => {
      if (value != null && typeof value.then === "function") {
        value.then(null, function (e: any) {})
      }
    }

    const checkKeys = (e: any, player: any) => {
      // Allow some modularity in defining custom hotkeys

      // Play/Pause check
      if (playPauseKey(e)) {
        return this.cPlay
      }

      // Seek Backward check
      if (rewindKey(e)) {
        return this.cRewind
      }

      // Seek Forward check
      if (forwardKey(e)) {
        return this.cForward
      }

      // Volume Up check
      if (volumeUpKey(e)) {
        return this.cVolumeUp
      }

      // Volume Down check
      if (volumeDownKey(e)) {
        return this.cVolumeDown
      }

      // Mute check
      if (muteKey(e)) {
        return this.cMute
      }

      // Fullscreen check
      if (fullscreenKey(e)) {
        return this.cFullscreen
      }
    }

    const doubleClick = (event: any) => {
      // Video.js added double-click fullscreen in 7.1.0
      if (this.videojsVer != null && this.videojsVer <= "7.1.0") {
        // When controls are disabled, hotkeys will be disabled as well
        if (this.player.controls()) {
          // Don't catch clicks if any control buttons are focused
          const activeEl =
            event.relatedTarget || event.toElement || document.activeElement
          if (
            activeEl == this.player.el() ||
            activeEl == this.player.el().querySelector(".vjs-tech") ||
            activeEl == this.player.el().querySelector(".iframeblocker")
          ) {
            if (this.enableFull) {
              if (this.player.isFullscreen()) {
                this.player.exitFullscreen()
              } else {
                this.player.requestFullscreen()
              }
            }
          }
        }
      }
    }

    const mouseScroll = (event: any) => {
      let activeEl
      if (this.enableHoverScroll) {
        // If we leave this undefined then it can match non-existent elements below
        activeEl = 0
      } else {
        activeEl = document.activeElement
      }

      // When controls are disabled, hotkeys will be disabled as well
      if (this.player.controls()) {
        if (
          this.alwaysCaptureHotkeys ||
          activeEl == this.player.el() ||
          activeEl == this.player.el().querySelector(".vjs-tech") ||
          activeEl == this.player.el().querySelector(".iframeblocker") ||
          activeEl == this.player.el().querySelector(".vjs-control-bar") ||
          this.volumeHover
        ) {
          if (this.enableVolumeScroll) {
            event = window.event || event
            const delta = Math.max(
              -1,
              Math.min(1, event.wheelDelta || -event.detail)
            )
            event.preventDefault()

            if (delta == 1) {
              this.player.volume(this.player.volume() + this.volumeStep)
            } else if (delta == -1) {
              this.player.volume(this.player.volume() - this.volumeStep)
            }
          }
        }
      }
    }

    const keyDown = (event: any) => {
      const ewhich = event.which
      let wasPlaying: boolean
      let seekTime: number
      const ePreventDefault = event.preventDefault.bind(event)

      const duration = this.player.duration()
      // When controls are disabled, hotkeys will be disabled as well
      if (this.player.controls()) {
        // Don't catch keys if any control buttons are focused, unless alwaysCaptureHotkeys is true
        const activeEl = document.activeElement
        if (
          this.alwaysCaptureHotkeys ||
          (this.captureDocumentHotkeys &&
            this.documentHotkeysFocusElementFilter(activeEl)) ||
          activeEl == this.player.el() ||
          activeEl == this.player.el().querySelector(".vjs-tech") ||
          activeEl == this.player.el().querySelector(".vjs-control-bar") ||
          activeEl == this.player.el().querySelector(".iframeblocker")
        ) {
          switch (checkKeys(event, this.player)) {
            // Spacebar toggles play/pause
            case this.cPlay:
              ePreventDefault()
              if (this.alwaysCaptureHotkeys || this.captureDocumentHotkeys) {
                // Prevent control activation with space
                event.stopPropagation()
              }

              if (this.player.paused()) {
                silencePromise(this.player.play())
              } else {
                this.player.pause()
              }
              break

            // Seeking with the left/right arrow keys
            case this.cRewind: // Seek Backward
              wasPlaying = !this.player.paused()
              ePreventDefault()
              if (wasPlaying) {
                this.player.pause()
              }
              seekTime = this.player.currentTime() - seekStepD(event)
              // The flash player tech will allow you to seek into negative
              // numbers and break the seekbar, so try to prevent that.
              if (seekTime <= 0) {
                seekTime = 0
              }
              this.player.currentTime(seekTime)
              if (wasPlaying) {
                silencePromise(this.player.play())
              }
              break
            case this.cForward: // Seek Forward
              wasPlaying = !this.player.paused()
              ePreventDefault()
              if (wasPlaying) {
                this.player.pause()
              }
              seekTime = this.player.currentTime() + seekStepD(event)
              // Fixes the player not sending the end event if you
              // try to seek past the duration on the seekbar.
              if (seekTime >= duration) {
                seekTime = wasPlaying ? duration - 0.001 : duration
              }
              this.player.currentTime(seekTime)
              if (wasPlaying) {
                silencePromise(this.player.play())
              }
              break

            // Volume control with the up/down arrow keys
            case this.cVolumeDown:
              ePreventDefault()
              if (!this.enableJogStyle) {
                this.player.volume(this.player.volume() - this.volumeStep)
              } else {
                seekTime = this.player.currentTime() - 1
                if (this.player.currentTime() <= 1) {
                  seekTime = 0
                }
                this.player.currentTime(seekTime)
              }
              break
            case this.cVolumeUp:
              ePreventDefault()
              if (!this.enableJogStyle) {
                this.player.volume(this.player.volume() + this.volumeStep)
              } else {
                seekTime = this.player.currentTime() + 1
                if (seekTime >= duration) {
                  seekTime = duration
                }
                this.player.currentTime(seekTime)
              }
              break

            // Toggle Mute with the M key
            case this.cMute:
              if (this.enableMute) {
                this.player.muted(!this.player.muted())
              }
              break

            // Toggle Fullscreen with the F key
            case this.cFullscreen:
              if (this.enableFull) {
                if (this.player.isFullscreen()) {
                  this.player.exitFullscreen()
                } else {
                  this.player.requestFullscreen()
                }
              }
              break

            default:
              // Number keys from 0-9 skip to a percentage of the video. 0 is 0% and 9 is 90%
              if (
                (ewhich > 47 && ewhich < 59) ||
                (ewhich > 95 && ewhich < 106)
              ) {
                // Do not handle if enableModifiersForNumbers set to false and keys are Ctrl, Cmd or Alt
                if (
                  this.enableModifiersForNumbers ||
                  !(event.metaKey || event.ctrlKey || event.altKey)
                ) {
                  if (this.enableNumbers) {
                    let sub = 48
                    if (ewhich > 95) {
                      sub = 96
                    }
                    const number = ewhich - sub
                    ePreventDefault()
                    this.player.currentTime(
                      this.player.duration() * number * 0.1
                    )
                  }
                }
              }

              // Handle any custom hotkeys
              for (const customKey in this.options.customKeys) {
                const customHotkey = this.options.customKeys[customKey]
                // Check for well formed custom keys
                if (customHotkey && customHotkey.key && customHotkey.handler) {
                  // Check if the custom key's condition matches
                  if (customHotkey.key(event)) {
                    ePreventDefault()
                    customHotkey.handler(this.player, this.options, event)
                  }
                }
              }
          }
        }
      }
    }

    // Default options
    const defaultOptions = {
      volumeStep: 0.1,
      seekStep: 5,
      enableMute: true,
      enableVolumeScroll: true,
      enableHoverScroll: false,
      enableFullscreen: true,
      enableNumbers: true,
      enableJogStyle: false,
      alwaysCaptureHotkeys: false,
      captureDocumentHotkeys: false,
      documentHotkeysFocusElementFilter: function () {
        return false
      },
      enableModifiersForNumbers: true,
      enableInactiveFocus: true,
      skipInitialFocus: false,
      playPauseKey: playPauseKey,
      rewindKey: rewindKey,
      forwardKey: forwardKey,
      volumeUpKey: volumeUpKey,
      volumeDownKey: volumeDownKey,
      muteKey: muteKey,
      fullscreenKey: fullscreenKey,
      customKeys: {},
    }

    this.videojsVer = videojs.VERSION

    // Fill options
    const mergeOptions = videojs.mergeOptions
    this.options = mergeOptions(defaultOptions, options || {})
    this.volumeStep = options?.volumeStep || undefined
    this.seekStep = options?.seekStep || undefined
    this.enableMute = options?.enableMute || undefined
    this.enableVolumeScroll = options?.enableVolumeScroll || undefined
    this.enableHoverScroll = options?.enableHoverScroll || undefined
    this.enableFull = options?.enableFullscreen || undefined
    this.enableNumbers = options?.enableNumbers || undefined
    this.enableJogStyle = options?.enableJogStyle || undefined
    this.alwaysCaptureHotkeys = options?.alwaysCaptureHotkeys || undefined
    this.captureDocumentHotkeys = options?.captureDocumentHotkeys || undefined
    this.documentHotkeysFocusElementFilter =
      options?.documentHotkeysFocusElementFilter || undefined
    this.enableModifiersForNumbers =
      options?.enableModifiersForNumbers || undefined
    this.enableInactiveFocus = options?.enableInactiveFocus || undefined
    this.skipInitialFocus = options?.skipInitialFocus || undefined

    // Set default player tabindex to handle keydown and doubleclick events
    if (!player.el().hasAttribute("tabIndex")) {
      player.el().setAttribute("tabIndex", "-1")
    }

    // Remove player outline to fix video performance issue
    player.el().style.outline = "none"

    if (this.alwaysCaptureHotkeys || !player.autoplay()) {
      if (!this.skipInitialFocus) {
        player.one("play", function () {
          player.el().focus() // Fixes the .vjs-big-play-button handing focus back to body instead of the player
        })
      }
    }

    if (this.enableInactiveFocus) {
      player.on("userinactive", function () {
        // When the control bar fades, re-apply focus to the player if last focus was a control button
        const cancelFocusingPlayer = function () {
          clearTimeout(focusingPlayerTimeout)
        }
        const focusingPlayerTimeout = setTimeout(function () {
          player.off("useractive", cancelFocusingPlayer)
          const activeElement = document.activeElement
          const controlBar = player.el().querySelector(".vjs-control-bar")
          if (activeElement && activeElement.parentElement == controlBar) {
            player.el().focus()
          }
        }, 10)

        player.one("useractive", cancelFocusingPlayer)
      })
    }

    player.on("play", function () {
      // Fix allowing the YouTube plugin to have hotkey support.
      const ifblocker = player.el().querySelector(".iframeblocker")
      if (ifblocker && ifblocker.style.display === "") {
        ifblocker.style.display = "block"
        ifblocker.style.bottom = "39px"
      }
    })

    const volumeSelector =
      player.el().querySelector(".vjs-volume-menu-button") ||
      player.el().querySelector(".vjs-volume-panel")
    if (volumeSelector != null) {
      volumeSelector.onmouseover = function () {
        this.volumeHover = true
      }
      volumeSelector.onmouseout = function () {
        this.volumeHover = false
      }
    }

    player.on("keydown", keyDown)
    player.on("dblclick", doubleClick)
    player.on("mousewheel", mouseScroll)
    player.on("DOMMouseScroll", mouseScroll)

    if (this.captureDocumentHotkeys) {
      document.addEventListener("keydown", (event) => {
        keyDown(event)
      })
    }
  }
}
