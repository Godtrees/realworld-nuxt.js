<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">全民老公-张连龙</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed',
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed',
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag',
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag,
                    },
                  }"
                  ># {{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>
          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page,
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab
                    },
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>
        <!-- tag -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                  },
                }"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getYourFeedArticles, addFavorite, deleteFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";

export default {
  name: "HomeIndex",
  watchQuery: ["page", "tag", "tab"], // watchQuery 为监听 page 发生的变化
  async asyncData({ query, store }) {
    // console.log("query", query);
    // console.log('store', store.state.user);
    const page = Number.parseInt(query.page || 1);
    const limit = 1;
    const tag = query.tag;
    const tab = query.tab || 'global_feed'
    // 判断使用的接口
    const loadArticles = store.state.user && tab === 'your_feed' ? getYourFeedArticles : getArticles
    // 用数组接收 promise.all 的返回值 0索引 为 getArticles 返回，1索引 为 getTags 返回
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }),
      getTags(),
    ]);
    // 用 promise.all 代替下面的两个请求，实现同步同时进行
    // const { data } = await getArticles({
    //   limit,
    //   offset: (page - 1) * limit,
    // });
    // // 请求 tag
    // const { data: tagData } = await getTags()
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;
    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      tags, // 标签列表
      limit, // 每页大小
      page, // 页码
      tag, // 数据标签
      tab
    };
    // return {
    //   articles: data.articles,
    //   articlesCount: data.articlesCount,
    //   tags: tagData.tags,
    //   limit,
    //   page,
    // };
  },
  computed: {
    // 向上取整拿到总页码
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
    // 判断登录状态
    ...mapState(["user"]),
  },
  methods: {
    async onFavorite (article) {
      console.log('asdfghjkl');
      // article.favoriteDisabled = true
      // if (article.favorited) {
      //   // 取消点赞
      //   await deleteFavorite(article.slug)
      //   article.favorited = false
      //   article.favoritesCount += -1
      // } else {
      //   // 添加点赞
      //   await addFavorite(article.slug)
      //   article.favorited = true
      //   article.favoritesCount += 1
      // }
      // article.favoriteDisabled = false
    }
  }
};
</script>

<style>
</style>