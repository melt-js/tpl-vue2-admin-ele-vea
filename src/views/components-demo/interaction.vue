<template>
  <div class="interaction-demo">
    <sticky :sticky-top="$store.state.settings.fixedHeader ? 88 : 0" :z-index="12" class-name="example-sticky"><strong>吸顶操作栏</strong><el-button type="primary" size="small" @click="count++">已保存 {{ count }} 次</el-button></sticky>
    <div class="app-container">
      <h2>吸顶与返回顶部</h2>
      <p>滚动页面观察操作栏。页签切换保留当前操作次数，返回顶部按钮会在滚动超过 300px 时显示。</p>
      <el-switch v-model="fixedHeader" active-text="固定导航栏" />
      <el-card v-for="n in 12" :key="n" shadow="never" style="margin-top:24px"><h3>内容区块 {{ n }}</h3><p>Sticky 和 BackToTop 从 @melt-js/comps-vue2-ele-vea 具名导入，可在其他 Vue2 项目复用。</p></el-card>
    </div>
    <back-to-top :visibility-height="300" />
  </div>
</template>
<script>
import { Sticky, BackToTop } from '@melt-js/comps-vue2-ele-vea'
export default {
  name: 'InteractionDemo',
  components: { Sticky, BackToTop },
  data: () => ({ count: 0 }),
  computed: {
    fixedHeader: {
      get() { return this.$store.state.settings.fixedHeader },
      set(value) { this.$store.dispatch('settings/changeSetting', { key: 'fixedHeader', value }) }
    }
  }
}
</script>
<style scoped>
.example-sticky { display: flex; justify-content: space-between; align-items: center; background: #eef5ff; padding: 12px 24px; border-bottom: 1px solid #d9ecff; }
</style>
