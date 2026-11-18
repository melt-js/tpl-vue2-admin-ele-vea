const routes = require('../../../mock/article')
const call = (suffix, input = {}) => routes.find(route => route.url.endsWith('/' + suffix)).response(input)

describe('article demonstration API', () => {
  it('filters, sorts and paginates records', () => {
    const { data } = call('list', { query: { type: 'CN', page: 2, limit: 3, sort: '-id' } })
    expect(data.total).toBe(25)
    expect(data.items).toHaveLength(3)
    expect(data.items.every(item => item.type === 'CN')).toBe(true)
    expect(data.items[0].id).toBeGreaterThan(data.items[1].id)
  })

  it('retains create, update and delete results on subsequent reads', () => {
    const { data: article } = call('create', { body: { title: 'unit-test-article', timestamp: Date.now(), status: 'draft' } })
    expect(article.id).toBeGreaterThan(100)
    call('update', { body: { id: article.id, title: 'updated-article', status: 'published' } })
    expect(call('detail', { query: { id: article.id } }).data.title).toBe('updated-article')
    const result = call('list', { query: { title: 'updated-article' } })
    expect(result.data.total).toBe(1)
    call('delete', { body: { id: article.id } })
    expect(call('detail', { query: { id: article.id } }).code).toBe(40004)
    expect(call('list', { query: { title: 'updated-article' } }).data.total).toBe(0)
  })
})
