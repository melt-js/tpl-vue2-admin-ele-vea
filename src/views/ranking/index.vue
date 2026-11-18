<template>
  <div class="ranking-page">
    <div class="ranking-page__header">
      <h2 class="ranking-page__title">从夯到拉排行榜</h2>
      <p class="ranking-page__desc">
        图片可拖拽到评级行，也可在评级行与图片库之间互相拖拽；拖到“-”区域删除，点击图片可放大。
        点击评级名称可改名，点击名称后右侧会出现改色和删除按钮。
      </p>
    </div>

    <!-- 组件由 comps-vue2-ele 远程加载 -->
    <tier-ranking />
  </div>
</template>

<script>
import { TierRanking } from '@melt-js/comps-vue2-ele'

export default {
  name: 'Ranking',
  components: {
    TierRanking
  }
}
</script>

<style lang="scss" scoped>
.ranking-page {
  padding: 20px;

  &__header {
    margin-bottom: 16px;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 600;
    color: #303133;
  }

  &__desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
    color: #909399;
  }
}
</style>
