const txvContext = requirePlugin("tencentVideo");
var observer = require('../../assist/lib/observer').observer;
import { DYSERVER } from '../../config/Config';
var app = getApp();
Page(observer({
  props: {
    UserStore: require('../../stores/UserStore').default,
  },

  data: {
		phoneNum:'',
		headimgurl:'',
		bindurl:'',
		state:''
  },

	onLoad: function (options) {
		this.setData({
			state: options.state
		})
		wx.setNavigationBarTitle({ title: '寻医问诊' })
	},

	onShow: function () {
		if (!(app.globalData.userInfo && app.globalData.userInfo.phoneNum) ) {
			wx.showModal({
				title: '提示',
				content: '请先登录并绑定手机号',
				showCancel: false,
				success(res) {
					wx.switchTab({
						url: '../mine/mine'
					})
				}
			})

			return
		}

		this.setData({
			phoneNum: app.globalData.userInfo.phoneNum,
			headimgurl: app.globalData.userInfo.avatarUrl
		});

	},

}))