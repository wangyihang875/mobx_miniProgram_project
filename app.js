//app.js
import regeneratorRuntime from './assist/lib/regenerator-runtime/runtime.js';
import { DYSERVER } from './config/Config';
let app = require("./assist/index.js")
App(Object.assign(app, {

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

		this.globalData.userInfo = wx.getStorageSync('userInfo');
		
		// 登录
		// app.login().then((res)=>{
		// 	console.log(JSON.stringify(res))

		// }).catch((error)=>{
		// 	console.log("error="+JSON.stringify(error))
		// })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })


  },
  globalData: {
    userInfo: null,
  }
  
})) 