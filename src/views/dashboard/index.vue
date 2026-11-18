<template>
  <div class="workbench">
    <div class="workbench-header"><div><p class="workbench-eyebrow">MELT · VUE 2 + ELEMENT UI</p><h1>欢迎回来，{{ name }}</h1><p>从可运行的后台示例开始，构建你的业务应用。</p></div><el-button type="primary" icon="el-icon-collection" @click="$router.push('/tools/cache')">体验多页签</el-button></div>
    <el-row :gutter="20">
      <el-col v-for="card in cards" :key="card.path" :xs="24" :sm="12" :lg="6"><button class="workbench-card" @click="$router.push(card.path)"><i :class="card.icon" :style="{ color: card.color }" /><div><strong>{{ card.title }}</strong><p>{{ card.description }}</p></div><i class="el-icon-arrow-right" /></button></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16"><el-card shadow="never"><div slot="header" class="workbench-card-title"><strong>访问趋势</strong><el-tag size="small">演示数据</el-tag></div><admin-chart :option="chartOption" height="320px" /></el-card></el-col>
      <el-col :xs="24" :lg="8"><el-card shadow="never"><strong slot="header">示例导航</strong><router-link v-for="link in links" :key="link.path" :to="link.path" class="workbench-link"><span>{{ link.title }}</span><i class="el-icon-arrow-right" /></router-link><el-alert title="页签支持右键操作、页面刷新与缓存。首页固定保留。" type="info" :closable="false" /></el-card></el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { AdminChart } from '@melt-js/comps-vue2-ele-vea'
export default {
  name: 'Dashboard',
  components: { AdminChart },
  data: () => ({
    cards: [
      { title: '表格示例', description: '动态列 / 编辑 / 拖拽', icon: 'el-icon-s-grid', color: '#409eff', path: '/table/complex-table' },
      { title: '综合表单', description: '校验 / 草稿 / 发布', icon: 'el-icon-edit-outline', color: '#67c23a', path: '/tools/editor' },
      { title: '图表示例', description: '折线 / 柱状 / 环形', icon: 'el-icon-data-analysis', color: '#e6a23c', path: '/charts/line' },
      { title: '数据导出', description: 'Excel / 合并表头 / Zip', icon: 'el-icon-download', color: '#f56c6c', path: '/excel/export-excel' }
    ],
    links: [{ title: '拖拽看板', path: '/components/drag-kanban' }, { title: 'JSON 编辑器', path: '/components/json-editor' }, { title: 'Excel 导入预览', path: '/excel/upload-excel' }, { title: '页内 Tab 缓存', path: '/tools/tab' }, { title: '多页签缓存验证', path: '/tools/cache' }],
    chartOption: { color: ['#409eff', '#67c23a'], tooltip: { trigger: 'axis' }, legend: { data: ['访问量', '转化量'] }, grid: { left: '5%', right: '5%', bottom: '5%', containLabel: true }, xAxis: { type: 'category', boundaryGap: false, data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] }, yAxis: { type: 'value' }, series: [{ name: '访问量', type: 'line', smooth: true, areaStyle: { opacity: 0.08 }, data: [120, 180, 150, 260, 220, 310, 280] }, { name: '转化量', type: 'line', smooth: true, data: [70, 100, 90, 150, 140, 180, 160] }] }
  }),
  computed: { ...mapGetters(['name']) }
}
</script>
<style scoped>
.workbench { padding: 28px; background: #f5f7fa; min-height: calc(100vh - 88px); }
.workbench-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 28px; padding-right: 42px; }
.workbench-header h1 { font-size: 28px; margin: 8px 0; }
.workbench-header p { color: #909399; }
.workbench-header .workbench-eyebrow { color: #409eff; font-size: 11px; letter-spacing: 2px; }
.workbench-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; background: white; border: 1px solid #ebeef5; border-radius: 6px; padding: 24px 18px; width: 100%; text-align: left; cursor: pointer; margin-bottom: 20px; }
.workbench-card > i:first-child { font-size: 32px; }
.workbench-card strong { font-size: 17px; color: #303133; }
.workbench-card p { color: #909399; margin-bottom: 0; font-size: 12px; }
.workbench-card:hover { border-color: #b3d8ff; box-shadow: 0 6px 18px #409eff12; }
.workbench-card-title { display: flex; justify-content: space-between; align-items: center; }
.workbench-link { display: flex; justify-content: space-between; padding: 15px 0; color: #606266; border-bottom: 1px solid #f2f6fc; font-size: 14px; }
.workbench-link:last-of-type { margin-bottom: 20px; }
@media (max-width: 768px) { .workbench { padding: 16px; } .workbench-header { display: block; } .workbench-header > button { margin-top: 12px; } }
</style>
