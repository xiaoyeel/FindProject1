// import 'babel-polyfill'
import Vue from 'vue'
// import Es6Promise from 'es6-promise'

// require('es6-promise').polyfill()

// Es6Promise.polyfill()

// import Vue from 'vue'
// import App from './App'
import VueRouter from 'vue-router'
// import VueLazyload from 'vue-lazyload'
import routes from './router/router'
// import bestpay from '@@/service/bestpay'
// import { getProduct, getSessionKey, system, setTopRightBar } from '@@/service/bestpay_'
// import { getUUID,animationProgress } from '@@/service/util'

import store from './store/'
import { routerMode } from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import axios from "@@/plugins/rsa/axios";
import AlertTip from '@@/components/common/alertTip'
import {getLBS, goOldPlatform, unCertain, goNewPlatform, getFreeSign, checkUtil, animationProgress, geURLParam } from "@@/service/util"
// 神策
import sa from'sa-sdk-javascript';
sa.init({
    sdk_url: 'https://static.sensorsdata.cn/sdk/1.10.9/sensorsdata.min.js',
    heatmap_url: 'https://static.sensorsdata.cn/sdk/1.10.9/heatmap.min.js',
    name: 'sa',
    //配置打通 App 与 H5 的参数
    use_app_track: true,
    use_client_time: true,
    is_single_page: true,
    web_url: 'https://hebaopay.cloud.sensorsdata.cn/',
    server_url: 'https://hebaopay.cloud.sensorsdata.cn:4006/sa?token=e852cbf8dc40a8d1',
    heatmap: {
       //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
       clickmap:'not_collect',
       //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
       scroll_notice_map:'not_collect'
    }
  });
// sa.login(user_id);
sa.quick('autoTrack', {
    platForm:'h5'
});

// Vue.use(VueLazyload)
// Vue.use(VueLazyload, {
//     preLoad: 1.3,
//     error: require('@@/images/error.png'),
//     // loading: require('@@/images/error.png'),
//     attempt: 1,
//     // listenEvents: [ 'animationend' ]
// })

// 延迟点击
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}
let isIPhone = /iP(ad|hone|od)/.test(navigator.userAgent)
// ios 防止select焦点跳动
if (/iP(ad|hone|od)/.test(navigator.userAgent)) {
    document.body.addEventListener('touchend', function (event) {
        console.log('touchend event caught and default prevented', event.target.tagName);
        // alert(event.target.tagName.toLowerCase())
        if (event.target.tagName.toLowerCase() == 'input') {
            //    return 
            // console.log(event.target)
            // document.body.focus();
            // setTimeout(()=>{},20)
            event.target.click();
            // event.preventDefault();
        }
    })
}

//注册全局组件 弹窗
Vue.component('alert-tip', AlertTip)

Vue.use(VueRouter)
// Vue.use(bestpay)

const router = new VueRouter({
    routes,
    mode: routerMode,
    strict: process.env.NODE_ENV !== 'production',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop;
            }
            return { x: 0, y: to.meta.savedPosition || 0 }
        }
    }
})

router.beforeEach((to, from, next) => {
    animationProgress(to, from, next)
    if (store.state.flag) {
        next()
        return
    }
    
    // 获取gps信息
    // latitude: '', // 当前位置纬度
    // longitude: '', // 当前位置经度
    // try {
    //     // store.commit('ISSHOWALERT',true)
    //     new BMap.Geolocation().getCurrentPosition(function (r) {
    //         if (this.getStatus() == BMAP_STATUS_SUCCESS) { //判断状态
    //             console.log('您的位置：', r);// r.point.lng + ',' + r.point.lat
    //             // try {
    //             store.commit('LATITUDE', r.latitude)
    //             store.commit('LONGITUDE', r.longitude)
    //             store.commit('CITYNAME', r.address.city)
    //             // } catch (e) {
    //             //     store.commit('LATITUDE', "31.24916171")
    //             //     store.commit('LONGITUDE', '121.48789949')
    //             //     store.commit('CITYNAME', '上海')
    //             // }

    //         } else {
    //             store.commit('ISSHOWALERT', true)
    //             // alert("请打开GPS")
    //             new BMap.LocalCity().get(function (e) {
    //                 // try{
    //                 store.commit('LATITUDE', e.center.lat)
    //                 store.commit('LONGITUDE', e.center.lng)
    //                 store.commit('CITYNAME', e.name)
    //                 // }catch(e){
    //                 //     store.commit('LATITUDE', "31.24916171")
    //                 //     store.commit('LONGITUDE', '121.48789949')
    //                 //     store.commit('CITYNAME', '上海')
    //                 // }

    //             });
    //         }
    //     })
    // } catch (e) {
    //     store.commit('ISSHOWALERT', true)
    //     store.commit('LATITUDE', "31.24916171")
    //     store.commit('LONGITUDE', '121.48789949')
    //     store.commit('CITYNAME', '上海')
    // }

    // new BMap.LocalCity().get(function (e) {
    //     alert(JSON.stringify(e))
    //     try{
    //         store.commit('LATITUDE', e.center.lat)
    //         store.commit('LONGITUDE', e.center.lng)
    //     }catch(e){
    //         store.commit('LATITUDE', "31.24916171")
    //         store.commit('LONGITUDE', '121.48789949')
    //         store.commit('CITYNAME', '上海市')
    //     }

    // });
    let slider = 0;
    let slider1 = 0;
    let slider2 = 0;
    // alert(33)
    // alert(window.location)
    // window.getLocationInfo()
    // alert(99)
    
    // alert(getLBS().longitude)
    // goActivity
    // 单点登录
    //?SERVICE=user_ssoservice&VERSION=1.0&PARTNER=80010003&SIGN_TYPE=MD5&CREDTENTIAL=1593305,1502335609,1502336209,1502335609,218.77.2.82,client.cmpay.com&SIGN_DATA=08229a7a638c243bb7ab0a0e67e6d81c&viewCode=html 
    // 测试临时添加
    // store.commit('TOKEN', {"session":"TESTSSION","productNo":'13795442667'})
    axios.post('queryAccount', {
    }).then((res) => {
        store.commit('TOKEN', res.data || {})
        if (!res.data || res.data.length <= 0) {
          
        } else {

        }
        
        // 请求banner1
        axios.post('queryMarketing', {
            "position": "TOP",
            "session": store.state.token.session.replace(/\+/g, '%2B') // 单点登录返回session
        }).then((res) => {
            store.commit('SLIDER', (res.data ? res.data : []))
            slider += 1
            // console.log(store.state.slider)
            checkUtil(slider, slider1, slider2, next)
        }).catch((res) => {
            // window.location.reload()
        })
        axios.post('queryMarketing', {
            "position": "CATALOG",
            "session": store.state.token.session.replace(/\+/g, '%2B') // 单点登录返回session
        }).then((res) => {
            store.commit('SLIDER1', (res.data ? res.data : []))
            slider1 += 1
            checkUtil(slider, slider1, slider2, next)
        }).catch(() => {
            // window.location.reload()
        })
        // 运营banner
        axios.post('queryMarketing', {
            "position": "OPERATION",
            "session": store.state.token.session.replace(/\+/g,'%2B') // 单点登录返回session
        }).then((res) => {
            store.commit('SLIDER2', (res.data ? res.data : []))
            slider2 += 1
            checkUtil(slider, slider1, slider2, next)
        }).catch(() => {
            // window.location.reload()
        })
    }).catch((res) => {
       
    })



})
new Vue({
    router,
    store,
}).$mount('#app')