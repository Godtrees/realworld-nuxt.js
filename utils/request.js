import axios from 'axios' 

const request = axios.create({ 
  baseURL: 'https://conduit.productionready.io/' 
})

// 请求拦截器
// 任何请求都要经过请求拦截器
// 我们可以在请求拦截器中做一些公共的业务处理，例如统一设置 token
request.interceptors.request.use(function(config){
  // 请求会经过这里
  console.log("呆M大魔王");
  return config
}), function(error) {
  // 如果请求失败（此时请求还没有发出去）就会进入这里
  return Promise.reject(error)
}

export default request