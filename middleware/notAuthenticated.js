/**
 * 验证是否登录的中间件（如果登录不可进入登录页面）
 */

 export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  // console.log('store.state.user',store);
  if (store.state.user) {
    return redirect('/')
  }
}