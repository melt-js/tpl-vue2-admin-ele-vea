<template>
  <el-tooltip
    :content="tooltipText"
    effect="dark"
    placement="bottom"
    :open-delay="300"
  >
    <button
      type="button"
      class="screenfull-btn"
      :class="{ 'is-fullscreen': isFullscreen, 'is-disabled': !isSupported }"
      :aria-label="tooltipText"
      :aria-pressed="isFullscreen ? 'true' : 'false'"
      :aria-disabled="isSupported ? 'false' : 'true'"
      @click="toggle"
    >
      <svg
        class="screenfull-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path
          v-if="isFullscreen"
          d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
        />
        <path
          v-else
          d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
        />
      </svg>
      <span v-if="showText" class="screenfull-text">{{ buttonText }}</span>
    </button>
  </el-tooltip>
</template>

<script>
import {
  FULLSCREEN_CHANGE_EVENTS,
  exitFullscreen,
  getFullscreenElement,
  isFullscreenSupported,
  requestFullscreen
} from '../../utils/fullscreen'

/**
 * Page fullscreen toggle.
 *
 * Usage:
 *   <screenfull />                          // fullscreen the whole page
 *   <screenfull target="#chart-panel" />    // fullscreen one page area
 *   <screenfull show-text />                // icon + label
 */
export default {
  name: 'Screenfull',
  props: {
    /**
     * Fullscreen target: a CSS selector, an element or a function returning
     * an element. Defaults to `document.documentElement`.
     */
    target: {
      type: [String, Object, Function],
      default: null
    },
    enterText: {
      type: String,
      default: 'Fullscreen'
    },
    exitText: {
      type: String,
      default: 'Exit fullscreen'
    },
    unsupportedText: {
      type: String,
      default: 'Fullscreen is not supported by this browser'
    },
    showText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  computed: {
    isSupported() {
      return isFullscreenSupported()
    },
    buttonText() {
      return this.isFullscreen ? this.exitText : this.enterText
    },
    tooltipText() {
      return this.isSupported ? this.buttonText : this.unsupportedText
    }
  },
  mounted() {
    this.isFullscreen = !!getFullscreenElement()
    FULLSCREEN_CHANGE_EVENTS.forEach(event => {
      document.addEventListener(event, this.handleFullscreenChange)
    })
  },
  beforeDestroy() {
    FULLSCREEN_CHANGE_EVENTS.forEach(event => {
      document.removeEventListener(event, this.handleFullscreenChange)
    })
  },
  methods: {
    handleFullscreenChange() {
      const isFullscreen = !!getFullscreenElement()
      if (isFullscreen === this.isFullscreen) return

      this.isFullscreen = isFullscreen
      this.$emit('change', isFullscreen)
    },
    resolveTarget() {
      const { target } = this
      if (!target) return document.documentElement
      if (typeof target === 'function') return target()
      if (typeof target === 'string') return document.querySelector(target)
      return target
    },
    notify(message) {
      this.$emit('error', message)
      if (this.$message) this.$message.warning(message)
    },
    async toggle() {
      if (!this.isSupported) {
        this.notify(this.unsupportedText)
        return
      }

      const target = this.resolveTarget()
      if (!target || target.nodeType !== 1) {
        this.notify(`Fullscreen target "${this.target}" was not found`)
        return
      }

      try {
        if (getFullscreenElement()) {
          await exitFullscreen()
        } else {
          await requestFullscreen(target)
        }
      } catch (error) {
        console.warn('[Screenfull] Failed to toggle fullscreen:', error)
        this.notify('Unable to toggle fullscreen mode')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.screenfull-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }

  &:focus-visible {
    outline: 2px solid #409eff;
    outline-offset: -2px;
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.screenfull-icon {
  flex: none;
  width: 20px;
  height: 20px;
}

.screenfull-text {
  margin-left: 6px;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
}
</style>
