// Route identity follows the upstream path-based contract: changing query updates
// a tab's destination, while different named pages have independent caches.
export const createState = () => ({ visitedViews: [], cachedViews: [] })

function cacheNames(views) {
  return views.filter(view => view.name && !view.meta.noCache).map(view => view.name)
}

const mutations = {
  ADD_VIEW(state, view) {
    if (!view.name || !view.meta || !view.meta.title || view.meta.noTab) return
    const tag = { name: view.name, path: view.path, fullPath: view.fullPath, query: { ...view.query }, meta: { ...view.meta }, title: view.meta.title }
    const index = state.visitedViews.findIndex(item => item.path === tag.path)
    if (index < 0) {
      if (tag.meta.affix) state.visitedViews.unshift(tag)
      else state.visitedViews.push(tag)
    } else state.visitedViews.splice(index, 1, tag)
    state.cachedViews = cacheNames(state.visitedViews)
  },
  CLOSE_VIEWS(state, { view, mode = 'one' }) {
    const index = state.visitedViews.findIndex(item => item.path === view.path)
    state.visitedViews = state.visitedViews.filter((item, i) => {
      if (item.meta.affix) return true
      if (mode === 'all') return false
      if (mode === 'others') return item.path === view.path
      if (mode === 'left') return index < 0 || i >= index
      if (mode === 'right') return index < 0 || i <= index
      return item.path !== view.path
    })
    state.cachedViews = cacheNames(state.visitedViews)
  },
  REMOVE_CACHE(state, view) {
    state.cachedViews = state.cachedViews.filter(name => name !== view.name)
  },
  RESET(state) { Object.assign(state, createState()) }
}

export default {
  namespaced: true,
  state: createState(),
  mutations
}
