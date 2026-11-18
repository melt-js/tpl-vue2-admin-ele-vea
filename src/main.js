import { preloadHelLibs } from '@melt-js/libs-core'
import { bindVueRuntime } from 'hel-micro'
import Vue from 'vue'

async function main() {
  bindVueRuntime({ Vue })

  const remotes = [
    {
      name: 'comps-vue2',
      host: process.env.VUE_APP_COMPS_VUE2_HOST,
      requiredExports: ['HelloWorld']
    },
    {
      // think-vuele 组件库（Tc*）与 App / HelloWorld / TierRanking
      name: 'comps-vue2-ele',
      host: process.env.VUE_APP_COMPS_VUE2_ELE_HOST,
      requiredExports: ['TierRanking']
    },
    {
      // vue-element-admin 来源的页面级组件与 Excel 导出工具
      name: 'comps-vue2-ele-vea',
      host: process.env.VUE_APP_COMPS_VUE2_ELE_VEA_HOST,
      requiredExports: ['RouteTabs', 'Pagination', 'AdminChart', 'UploadExcel', 'Sticky', 'BackToTop', 'DndList', 'Kanban', 'DragSelect', 'exportJsonToExcel']
    }
  ]

  await preloadHelLibs({
    deps: remotes,
    loading: { color: '#409eff' },
    loadApp: () => import('./loadApp').then(app => app.ready)
  })
}

main().catch(error => {
  console.error('[tpl-vue2-admin-ele-vea] 启动失败:', error)
  const root = document.getElementById('app')
  if (root) root.textContent = '远程依赖加载失败，请刷新重试。' + String(error)
})
