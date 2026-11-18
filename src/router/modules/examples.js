import Layout from '@/layout'

export default [
  {
    path: '/table', component: Layout, redirect: '/table/complex-table', name: 'TableExamples',
    meta: { title: '表格示例', icon: 'table' },
    children: [
      { path: 'dynamic-table', name: 'DynamicTable', component: () => import('@/views/table/dynamic-table'), meta: { title: '动态列' }},
      { path: 'drag-table', name: 'DragTable', component: () => import('@/views/table/drag-table'), meta: { title: '拖拽排序' }},
      { path: 'inline-edit-table', name: 'InlineEditTable', component: () => import('@/views/table/inline-edit-table'), meta: { title: '行内编辑' }},
      { path: 'complex-table', name: 'ComplexTable', component: () => import('@/views/table/complex-table'), meta: { title: '综合表格' }}
    ]
  },
  {
    path: '/components', component: Layout, redirect: '/components/interaction', name: 'ComponentExamples',
    meta: { title: '组件示例', icon: 'component' },
    children: [
      { path: 'interaction', name: 'InteractionDemo', component: () => import('@/views/components-demo/interaction'), meta: { title: '吸顶与返回顶部' }},
      { path: 'drag-select', name: 'DragSelectDemo', component: () => import('@/views/components-demo/drag-select'), meta: { title: '拖拽多选' }},
      { path: 'dnd-list', name: 'DndListDemo', component: () => import('@/views/components-demo/dnd-list'), meta: { title: '双列表拖拽' }},
      { path: 'drag-kanban', name: 'DragKanbanDemo', component: () => import('@/views/components-demo/drag-kanban'), meta: { title: '拖拽看板' }},
      { path: 'count-to', name: 'CountToDemo', component: () => import('@/views/components-demo/count-to'), meta: { title: '数字动画' }},
      { path: 'json-editor', name: 'JsonEditorDemo', component: () => import('@/views/components-demo/json-editor'), meta: { title: 'JSON 编辑器' }}
    ]
  },
  {
    path: '/charts', component: Layout, redirect: '/charts/line', name: 'ChartExamples',
    meta: { title: '图表示例', icon: 'chart' },
    children: [
      { path: 'line', name: 'LineChartExample', component: () => import('@/views/charts'), props: { kind: 'line' }, meta: { title: '折线图', noCache: true }},
      { path: 'bar', name: 'BarChartExample', component: () => import('@/views/charts'), props: { kind: 'bar' }, meta: { title: '柱状图', noCache: true }},
      { path: 'mix-chart', name: 'MixChartExample', component: () => import('@/views/charts'), props: { kind: 'mix' }, meta: { title: '混合图表', noCache: true }},
      { path: 'pie', name: 'PieChartExample', component: () => import('@/views/charts'), props: { kind: 'pie' }, meta: { title: '环形图', noCache: true }}
    ]
  },
  {
    path: '/excel', component: Layout, redirect: '/excel/export-excel', name: 'ExcelExamples',
    meta: { title: 'Excel', icon: 'excel' },
    children: [
      { path: 'export-excel', name: 'ExportExcel', component: () => import('@/views/excel/export-excel'), meta: { title: '导出 Excel' }},
      { path: 'select-excel', name: 'SelectExcel', component: () => import('@/views/excel/select-excel'), meta: { title: '导出选中行' }},
      { path: 'merge-header', name: 'MergeHeader', component: () => import('@/views/excel/merge-header'), meta: { title: '合并表头' }},
      { path: 'upload-excel', name: 'UploadExcel', component: () => import('@/views/excel/upload-excel'), meta: { title: '导入 Excel' }}
    ]
  },
  {
    path: '/tools', component: Layout, redirect: '/tools/tab', name: 'ToolExamples',
    meta: { title: '更多示例', icon: 'el-icon-s-tools' },
    children: [
      { path: 'tab', name: 'Tab', component: () => import('@/views/tab'), meta: { title: '页内 Tab 缓存', icon: 'tab' }},
      { path: 'clipboard', name: 'ClipboardDemo', component: () => import('@/views/clipboard'), meta: { title: '剪贴板', icon: 'clipboard' }},
      { path: 'zip', name: 'ExportZip', component: () => import('@/views/zip'), meta: { title: '导出 Zip', icon: 'zip' }},
      { path: 'editor', name: 'ArticleEditor', component: () => import('@/views/example/editor'), meta: { title: '综合表单', icon: 'form' }},
      { path: 'cache', name: 'CacheExample', component: () => import('@/views/example/cache'), meta: { title: '多页签缓存验证', icon: 'el-icon-collection' }}
    ]
  }
]
