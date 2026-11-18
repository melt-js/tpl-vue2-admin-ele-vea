import module, { createState } from '@/store/modules/tagsView'

const view = (path, options = {}) => ({ path, fullPath: path, name: path.slice(1), meta: { title: path, ...options } })
const { ADD_VIEW, CLOSE_VIEWS, REMOVE_CACHE, RESET } = module.mutations

describe('route tabs', () => {
  let state
  beforeEach(() => { state = createState() })

  it('affixes home first on deep entry and ignores redirect routes', () => {
    ADD_VIEW(state, view('/form'))
    ADD_VIEW(state, view('/dashboard', { affix: true }))
    ADD_VIEW(state, view('/redirect', { noTab: true }))
    expect(state.visitedViews.map(v => v.path)).toEqual(['/dashboard', '/form'])
  })

  it('updates query destinations without duplicating page caches', () => {
    ADD_VIEW(state, view('/form'))
    ADD_VIEW(state, { ...view('/form'), fullPath: '/form?id=2', query: { id: '2' } })
    expect(state.visitedViews).toHaveLength(1)
    expect(state.visitedViews[0].fullPath).toBe('/form?id=2')
    expect(state.cachedViews).toEqual(['form'])
  })

  it('removes a closed page cache while retaining affixed home', () => {
    ADD_VIEW(state, view('/dashboard', { affix: true }))
    ADD_VIEW(state, view('/form'))
    CLOSE_VIEWS(state, { view: view('/dashboard') })
    expect(state.cachedViews).toContain('dashboard')
    CLOSE_VIEWS(state, { view: view('/form') })
    expect(state.cachedViews).toEqual(['dashboard'])
  })

  it.each(['left', 'right', 'others', 'all'])('closes %s while preserving affixes and matching caches', mode => {
    const paths = ['/dashboard', '/left', '/selected', '/right']
    paths.forEach(path => ADD_VIEW(state, view(path, { affix: path === '/dashboard' })))
    CLOSE_VIEWS(state, { view: view('/selected'), mode })
    const expected = { left: ['/dashboard', '/selected', '/right'], right: ['/dashboard', '/left', '/selected'], others: ['/dashboard', '/selected'], all: ['/dashboard'] }
    expect(state.visitedViews.map(v => v.path)).toEqual(expected[mode])
    expect(state.cachedViews).toEqual(expected[mode].map(path => path.slice(1)))
  })

  it('opts out of caching, refreshes only the selected cache, resets on logout', () => {
    ADD_VIEW(state, view('/form'))
    ADD_VIEW(state, view('/chart', { noCache: true }))
    expect(state.cachedViews).toEqual(['form'])
    REMOVE_CACHE(state, view('/form'))
    expect(state.cachedViews).toEqual([])
    expect(state.visitedViews).toHaveLength(2)
    ADD_VIEW(state, view('/form'))
    expect(state.cachedViews).toEqual(['form'])
    RESET(state)
    expect(state).toEqual(createState())
  })
})
