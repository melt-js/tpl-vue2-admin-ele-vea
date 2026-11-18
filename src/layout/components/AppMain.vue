<template>
  <section class="app-main">
    <screenfull
      class="app-main__screenfull"
      :target="resolveFullscreenTarget"
    />
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="$store.state.tagsView.cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import Screenfull from '@/components/Screenfull'

export default {
  name: 'AppMain',
  components: {
    Screenfull
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {
    // Only the page content goes fullscreen, the sidebar / navbar /
    // breadcrumb stay outside of the fullscreen element.
    resolveFullscreenTarget() {
      return this.$el
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 88px);
  width: 100%;
  position: relative;
  overflow: visible;

  .app-main__screenfull {
    position: absolute;
    top: 16px;
    right: 20px;
    z-index: 10;
    width: 34px;
    height: 34px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    background: #fff;
    color: #606266;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: color 0.3s, border-color 0.3s, background-color 0.3s;

    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background: #ecf5ff;
    }
  }
}
.fixed-header+.app-main {
  padding-top: 88px;
}

.app-main:fullscreen,
.app-main:-webkit-full-screen {
  min-height: 100vh;
  padding-top: 0;
  background: #fff;
  overflow: auto;

  .app-main__screenfull {
    position: fixed;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
