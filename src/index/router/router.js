import App from '@@/App'
import axios from "@@/plugins/rsa/axios";
// tab
const tab = r => require.ensure([], () => r(require('../page/home/tab')), 'tab')
// 首页
const home = r => require.ensure([], () => r(require('../page/home/children/home')), 'home')
// 贷款超市
// const shop = r => require.ensure([], () => r(require('../page/home/children/shop')), 'shop')
// 我的
const mine = r => require.ensure([], () => r(require('../page/home/children/mine')), 'mine')


export default [{
    path: '/',
    component: App, //顶层路由，对应main.html
    children: [ //二级路由。对应App.vue
        // 地址为空时跳转home页面
        {
            path: '',
            component: home,
            meta:{
                keepAlive:true
            }
        },
        {
            path: 'home', // 随意借首页
            component: home,
            meta:{
                keepAlive:true
            }
            // beforeEnter: (to, from, next) => {
            //     // 请求banner1
            //     axios.post('queryMarketing',{
            //         "position":"TOP",
            //         "session":"" // 单点登录返回session
            //     }).then((res)=>{
            //         console.log(res)
            //         next()
            //         // this.bannerTop = res.data
            //     }).catch((res)=>{

            //     })
            // },
        },
       {
            path: 'mine', // 我的
            component: mine,
            meta:{
                keepAlive:false
            }
        }
       
        //常见问题模块
    ]
}]