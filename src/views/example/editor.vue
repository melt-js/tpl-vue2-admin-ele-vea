<template>
  <div v-loading="loading" class="app-container">
    <div class="example-heading"><h2>综合表单</h2><el-tag :type="form.status === 'published' ? 'success' : 'info'">{{ form.status }}</el-tag></div>
    <el-alert title="表单使用本包的演示 API。可保存、发布，再按文章 ID 重新加载；数据保留至演示会话结束。" type="info" :closable="false" />
    <div class="filter-container" style="margin-top:20px"><el-input-number v-model="loadId" :min="1" /><el-button @click="load">按 ID 加载</el-button><el-button @click="reset">新建文章</el-button></div>
    <el-form ref="form" :model="form" :rules="rules" label-width="90px" style="max-width:900px">
      <el-form-item label="标题" prop="title"><el-input v-model="form.title" maxlength="100" show-word-limit /></el-form-item>
      <el-form-item label="作者" prop="author"><el-input v-model="form.author" /></el-form-item>
      <el-form-item label="发布日期" prop="timestamp"><el-date-picker v-model="form.timestamp" type="datetime" value-format="timestamp" /></el-form-item>
      <el-form-item label="地区"><el-select v-model="form.type"><el-option v-for="item in ['CN', 'US', 'JP', 'EU']" :key="item" :label="item" :value="item" /></el-select></el-form-item>
      <el-form-item label="重要程度"><el-rate v-model="form.importance" :max="3" /></el-form-item>
      <el-form-item label="摘要"><el-input v-model="form.content_short" type="textarea" :rows="2" /></el-form-item>
      <el-form-item label="正文" prop="content"><el-input v-model="form.content" type="textarea" :rows="10" /></el-form-item>
      <el-form-item label="关闭评论"><el-switch v-model="form.comment_disabled" /></el-form-item>
      <el-form-item><el-button :loading="saving" @click="save('draft')">保存草稿</el-button><el-button type="primary" :loading="saving" @click="save('published')">发布文章</el-button><el-button @click="preview = true">预览</el-button></el-form-item>
    </el-form>
    <el-dialog title="文章预览" :visible.sync="preview"><h2>{{ form.title }}</h2><p>{{ form.author }} · {{ form.type }}</p><p style="white-space:pre-wrap">{{ form.content }}</p></el-dialog>
  </div>
</template>
<script>
import { createArticle, updateArticle, fetchArticle } from '@/api/article'
const empty = () => ({ title: '', author: 'Admin', timestamp: Date.now(), type: 'CN', importance: 1, content_short: '', content: '', comment_disabled: false, status: 'draft' })
export default {
  name: 'ArticleEditor',
  data: () => ({ form: empty(), loadId: 1, loading: false, saving: false, preview: false, rules: { title: [{ required: true, message: '请输入标题', trigger: 'blur' }], author: [{ required: true, message: '请输入作者', trigger: 'blur' }], content: [{ required: true, message: '请输入正文', trigger: 'blur' }], timestamp: [{ required: true, message: '请选择日期', trigger: 'change' }] }}),
  methods: {
    reset() { this.form = empty(); this.$nextTick(() => this.$refs.form.clearValidate()) },
    async load() {
      this.loading = true
      try { const { data } = await fetchArticle(this.loadId); this.form = data } catch (error) { console.error(error) } finally { this.loading = false }
    },
    save(status) {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          const payload = { ...this.form, status }
          const { data } = await (payload.id ? updateArticle(payload) : createArticle(payload))
          this.form = data
          this.loadId = data.id
          this.$message.success('文章已保存，ID：' + data.id)
        } catch (error) { console.error(error) } finally { this.saving = false }
      })
    }
  }
}
</script>
