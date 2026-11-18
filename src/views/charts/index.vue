<template>
  <div class="app-container">
    <div class="example-heading"><h2>{{ $route.meta.title }}</h2><el-button type="primary" size="small" @click="randomize">更新数据</el-button></div>
    <p class="example-description">图表由公共组件 AdminChart 渲染，支持容器尺寸变化、侧栏折叠和销毁清理。</p>
    <el-card shadow="never"><admin-chart :key="kind" :option="option" :label="$route.meta.title" height="460px" /></el-card>
  </div>
</template>

<script>
import { AdminChart } from '@melt-js/comps-vue2-ele-vea'

export default {
  name: 'ChartExample',
  components: { AdminChart },
  props: { kind: { type: String, default: 'line' }},
  data: () => ({ values: [120, 180, 150, 260, 220, 310, 280] }),
  computed: {
    option() {
      const common = { color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'], tooltip: { trigger: this.kind === 'pie' ? 'item' : 'axis' }, legend: { bottom: 0 }}
      if (this.kind === 'pie') return { ...common, series: [{ name: '访问来源', type: 'pie', radius: ['45%', '70%'], data: this.values.slice(0, 4).map((value, i) => ({ value, name: ['直接访问', '搜索引擎', '社交媒体', '外部链接'][i] })) }] }
      return {
        ...common, grid: { left: '5%', right: '5%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value' },
        series: [
          { name: '访问量', type: this.kind === 'mix' ? 'bar' : this.kind, smooth: true, data: this.values },
          { name: '转化量', type: 'line', smooth: true, data: this.values.map(n => Math.round(n * 0.6)) }
        ]
      }
    }
  },
  methods: { randomize() { this.values = this.values.map(() => Math.round(80 + Math.random() * 300)) } }
}
</script>
