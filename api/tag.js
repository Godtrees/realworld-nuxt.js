import { request } from '@/plugins/request'

// 获取公共文章列表
export const getTags = () => {
  return request({
    methods: 'GET',
    url: '/api/tags',
  })
}