<template>
  <div class="app-container">
    <h2>多页签缓存验证</h2>
    <el-alert title="输入草稿并切换到其他页面，再返回此页。草稿与计数应保留；刷新页签或关闭后重开会重置。" type="info" :closable="false" />
    <el-card style="margin-top:24px;max-width:720px" shadow="never">
      <el-form label-position="top">
        <el-form-item label="未提交的草稿"><el-input v-model="draft" type="textarea" :rows="5" placeholder="切换页签不会丢失草稿" /></el-form-item>
        <el-form-item label="计数器"><el-button @click="count++">已点击 {{ count }} 次</el-button></el-form-item>
      </el-form>
      <p>本次页面创建时间：{{ createdAt }}</p>
      <el-button type="primary" @click="$router.push('/table/complex-table')">打开综合表格</el-button>
      <el-button @click="$router.push('/tools/editor')">打开综合表单</el-button>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'CacheExample',
  data: () => ({ draft: '', count: 0, createdAt: new Date().toLocaleTimeString() })
}
</script>
