/**
 * 验证是否登录的中间件（路由守卫）
 */
export default function({ store, redirect }) {
  console.log('store.state.auth', store.state.auth);
  if (!store.state.auth) {
    return redirect('/login')
  }
}