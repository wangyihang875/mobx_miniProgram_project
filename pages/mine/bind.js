import {isPoneAvailable} from '../../utils/util.js';
var observer = require('../../assist/lib/observer').observer;
var app = getApp();
const yzmTime = 120;
const yzmText = '获取验证码';
Page(observer({
	props: {
		UserStore: require('../../stores/UserStore').default,
	},
	 
	data: {
		phoneFocus:true,
		yzmFocus:false,
		phonecolor:'#D9D9D9',
		yzmcolor:'#D9D9D9',
		phone: '',
		yzm:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
	},

	onShow: function (options) {
		this.setData({
			phone: app.globalData.userInfo.phoneNum
		});
	},

	phonetextHandle: function () {
		this.setData({
			phoneFocus:true
		})
	},

	yzmtextHandle: function () {
		this.setData({
			yzmFocus: true
		})
	},

	getYzmHandle: function (data) {
		if (!this.props.UserStore.yzmEnable) return;
		if (!isPoneAvailable(this.data.phone)){
			wx.showToast({
				title: '手机号有误',
				image: '../../images/icon_gantanhao.png',
				icon: 'success',
				duration: 2000
			})
			return;
		}

		this.props.UserStore.sendMsg(this.data.phone)
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
				
				//timer
				
				this.props.UserStore.yzmEnable = false;
				this.interval = setInterval(() => {
					this.props.UserStore.yzmTime -= 1;
					this.props.UserStore.yzmText = this.props.UserStore.yzmTime+'s';
					if (this.props.UserStore.yzmTime === 0) {
						clearInterval(this.interval);
						this.props.UserStore.yzmTime = yzmTime;
						this.props.UserStore.yzmText = yzmText;
						this.props.UserStore.yzmEnable = true;
					}
				}, 1000);

				wx.showToast({
					title: '发送成功',
					icon: 'success',
					duration: 2000
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

	submitHandle: function (e) {
		if(this.data.phone==''||this.data.yzm==''){
			wx.showToast({
				title: '请输入信息',
				image: '../../images/icon_gantanhao.png',
				icon: 'success',
				duration: 2000
			})
			return;
		}

		this.props.UserStore.bindPhoneInWxcxx(this.data.phone,this.data.yzm)
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

				wx.showModal({
					title: '提示',
					content: '绑定成功',
					showCancel:false,
					success(res) {
						if (res.confirm) {
							wx.navigateBack({
								delta: 1
							})
						} 
					}
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

	bindPhoneInput: function (e) {
		this.setData({
			phone: e.detail.value
		})
	},

	bindYzmInput: function (e) {
		this.setData({
			yzm: e.detail.value
		})
	},

	phonefocushandle: function () {
		this.setData({
			phonecolor: '#000',
			yzmcolor: '#D9D9D9',
		});
	},
	phoneblurhandle: function () {
		this.setData({
			phonecolor: '#D9D9D9',
			yzmcolor: '#D9D9D9',
		});
	},
	yzmfocushandle: function () {
		this.setData({
			phonecolor: '#D9D9D9',
			yzmcolor: '#000',
		});
	},
	yzmblurhandle: function () {
		this.setData({
			phonecolor: '#D9D9D9',
			yzmcolor: '#D9D9D9',
		});
	},
}))