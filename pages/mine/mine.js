var observer = require('../../assist/lib/observer').observer;
import { DYSERVER } from '../../config/Config';
var app = getApp();
Page(observer({
	props: {
		UserStore: require('../../stores/UserStore').default,
	},
  
	data: {
		userInfo: {},
		hasUserInfo: false,
		phoneNum:''
	},

	onLoad: function () {
		
	},

	onShow :function() {
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
				phoneNum: app.globalData.userInfo.phoneNum,
			})
		}
	},

	bindHandle: function () {
		if (!(app.globalData.userInfo && app.globalData.userInfo.openid)) {
			wx.showToast({
				title: '请先登录',
				image: '../../images/icon_gantanhao.png',
				icon: 'success',
				duration: 2000
			})
			return;
		}

		wx.navigateTo({
			url: './bind'
		})
	},


	logoutHandle: function(){
		// if (app.globalData.userInfo==null || app.globalData.openid==''){
		// 	return;
		// }
		this.setData({
			userInfo: null,
			hasUserInfo: false,
			phoneNum: ''
		})
		
		this.props.UserStore.logoutWxcxxUpdate()
			.then(() => {
				if (this.props.UserStore.status !== '0000') {
					wx.showToast({
						title: this.props.UserStore.errorMsg,
						image: '../../images/icon_gantanhao.png',
						icon: 'success',
						duration: 2000
					})
					return
				}
				
			})
			.catch((err) => {
				wx.showToast({
					title: '获取接口失败',
					image: '../../images/icon_gantanhao.png',
					icon: 'success',
					duration: 2000
				})
			})
	},

	loginHandle: function (e) {
		app.globalData.userInfo = e.detail.userInfo;
		wx.setStorageSync('userInfo', e.detail.userInfo);
		let that = this;
		wx.login({
			success: function (loginRes) {

				that.props.UserStore.getWxXcxSession(loginRes.code,e.detail.userInfo)
					.then(() => {
						if (that.props.UserStore.status !== '0000') {
							wx.showToast({
								title: "登录失败",
								image: '../../images/icon_gantanhao.png',
								icon: 'success',
								duration: 2000
							})
							return
						}

						that.setData({
							userInfo: e.detail.userInfo,
							hasUserInfo: true,
							phoneNum: app.globalData.userInfo.phoneNum
						})

					})
					.catch((err) => {
						wx.showToast({
							title: '获取接口失败',
							image: '../../images/icon_gantanhao.png',
							icon: 'success',
							duration: 2000
						})
					})

			},
			fail: function (loginErr) {
				console.log("loginErr=" + loginErr)
			}
		})

		

		
	}

}))