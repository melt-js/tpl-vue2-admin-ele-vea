// Stateful demo API shared by the development server and the production MockXHR.
// Changes live for this demo session; a real application should replace this API.
const articles = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  timestamp: Date.UTC(2026, 10, 1 + i % 14, 9),
  author: ['Melt', 'Alex', 'Pan', 'Taylor'][i % 4],
  reviewer: 'Admin',
  title: ['远程组件实践', '多页签与页面缓存', 'Element UI 表格指南', 'Vue2 后台示例'][i % 4] + ' ' + (i + 1),
  content_short: '示例文章摘要',
  content: '这是一篇用于综合表单、表格和导出功能的示例文章。',
  importance: i % 3 + 1,
  type: ['CN', 'US', 'JP', 'EU'][i % 4],
  status: i % 3 === 0 ? 'draft' : 'published',
  display_time: '2026-11-15 09:00:00',
  comment_disabled: false,
  pageviews: 300 + i * 37,
  platforms: ['web']
}))
let nextId = 101
const success = data => ({ code: 20000, data })
const missing = () => ({ code: 40004, message: '文章不存在' })

module.exports = [
  {
    url: '/vue-element-admin/article/list', type: 'get',
    response({ query = {} }) {
      const { importance, type, title, status, sort } = query
      const page = Math.max(1, Number(query.page) || 1)
      const limit = Math.max(1, Math.min(1000, Number(query.limit) || 20))
      const items = articles.filter(item => (!importance || item.importance === Number(importance)) && (!type || item.type === type) && (!status || item.status === status) && (!title || item.title.toLowerCase().includes(String(title).toLowerCase())))
      items.sort((a, b) => sort === '-id' ? b.id - a.id : a.id - b.id)
      return success({ total: items.length, items: items.slice((page - 1) * limit, page * limit).map(item => ({ ...item })) })
    }
  },
  {
    url: '/vue-element-admin/article/detail', type: 'get',
    response({ query }) { return articles.find(item => item.id === Number(query.id)) ? success({ ...articles.find(item => item.id === Number(query.id)) }) : missing() }
  },
  {
    url: '/vue-element-admin/article/pv', type: 'get',
    response: () => success({ pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 768 }, { key: 'ios', pv: 512 }, { key: 'android', pv: 256 }] })
  },
  {
    url: '/vue-element-admin/article/create', type: 'post',
    response({ body }) {
      const article = { author: 'Admin', pageviews: 0, reviewer: 'Admin', type: 'CN', importance: 1, ...body, id: nextId++ }
      article.timestamp = Number(new Date(article.timestamp || Date.now()))
      article.display_time = new Date(article.timestamp).toISOString().replace('T', ' ').slice(0, 19)
      articles.push(article)
      return success({ ...article })
    }
  },
  {
    url: '/vue-element-admin/article/update', type: 'post',
    response({ body }) {
      const article = articles.find(item => item.id === Number(body.id))
      if (!article) return missing()
      Object.assign(article, body, { id: article.id })
      return success({ ...article })
    }
  },
  {
    url: '/vue-element-admin/article/delete', type: 'post',
    response({ body }) {
      const index = articles.findIndex(item => item.id === Number(body.id))
      if (index < 0) return missing()
      articles.splice(index, 1)
      return success('success')
    }
  }
]
