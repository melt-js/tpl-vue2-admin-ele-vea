<template>
  <div class="app-container">
    <div class="example-heading"><h2>JSON 编辑器</h2><el-button type="primary" @click="format">校验并格式化</el-button></div>
    <p class="example-description">编辑配置，校验错误会显示具体信息。切换页签保留尚未保存的内容。</p>
    <el-input v-model="value" type="textarea" :rows="18" spellcheck="false" class="json-source" />
    <el-alert v-if="message" style="margin-top:16px" :title="message" :type="valid ? 'success' : 'error'" :closable="false" />
  </div>
</template>
<script>
export default {
  name: 'JsonEditorDemo',
  data: () => ({ value: JSON.stringify({ name: 'Melt Admin', tabs: true, components: ['Pagination', 'RouteTabs', 'AdminChart'] }, null, 2), message: '', valid: true }),
  methods: {
    format() {
      try { this.value = JSON.stringify(JSON.parse(this.value), null, 2); this.message = 'JSON 校验通过'; this.valid = true } catch (error) { this.message = error.message; this.valid = false }
    }
  }
}
</script>
<style scoped>
.json-source >>> textarea { font-family: Consolas, monospace; line-height: 1.7; background: #f8fafc; }
</style>
