<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <ArticleMate :article="article" />
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>
      <hr />
      <div class="article-actions">
        <ArticleMate :article="article" />
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <ArticleComment :article="article" />
          处理顶部导航链接
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'  // 引入 markdown
import ArticleMate from './components/article-meta.vue'
import ArticleComment from './components/article-comment.vue'

export default {
  name: 'ArticleIndex',
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data  // 解构赋值
    const md = new MarkdownIt()  // 声明一个解析器
    article.body = md.render(article.body)  // 调用这个解析器
    return {
      article,
    }
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      mate: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  components: {
    ArticleMate,
    ArticleComment
  }
};
</script>

<style>
</style>