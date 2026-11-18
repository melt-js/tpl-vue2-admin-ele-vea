<template>
  <route-tabs :views="views" :active-path="$route.path" @select="select" @close="close($event)" @refresh="refresh" @close-others="close($event, 'others')" @close-left="close($event, 'left')" @close-right="close($event, 'right')" @close-all="close($event, 'all')" />
</template>

<script>
import { RouteTabs } from '@melt-js/comps-vue2-ele-vea'

export default {
  name: 'TagsView',
  components: { RouteTabs },
  computed: {
    views() { return this.$store.state.tagsView.visitedViews }
  },
  watch: {
    $route: { immediate: true, handler(route) { this.$store.commit('tagsView/ADD_VIEW', route) } }
  },
  created() {
    const visit = (routes, base = '') => routes.forEach(route => {
      const path = route.path.startsWith('/') ? route.path : base.replace(/\/$/, '') + '/' + route.path
      if (route.meta && route.meta.affix) this.$store.commit('tagsView/ADD_VIEW', { ...route, path, fullPath: path })
      if (route.children) visit(route.children, path)
    })
    visit(this.$router.options.routes)
  },
  methods: {
    select(view) {
      if (this.$route.fullPath !== view.fullPath) return this.$router.push(view.fullPath)
    },
    async close(view, mode = 'one') {
      this.$store.commit('tagsView/CLOSE_VIEWS', { view, mode })
      if (!this.views.some(item => item.path === this.$route.path)) {
        const target = this.views[this.views.length - 1]
        await this.$router.push(target ? target.fullPath : '/dashboard')
      }
    },
    async refresh(view) {
      this.$store.commit('tagsView/REMOVE_CACHE', view)
      await this.$nextTick()
      await this.$router.replace('/redirect' + view.fullPath)
    }
  }
}
</script>
