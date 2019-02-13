import regeneratorRuntime from '../assist/lib/regenerator-runtime/runtime.js';
import { DYSERVER } from '../config/Config';
var extendObservable = require('../assist/lib/mobx').extendObservable;
var runInAction = require('../assist/lib/mobx').runInAction;
var app = getApp();
var UserStore = function () {
	extendObservable(this, {
		// observable data
		status:'',
		errorMsg:'',
		isLoading: false,
		adsList:[],
		yzmTime:120,
		yzmEnable:true,
		yzmText:'获取验证码'
	});

	//获取小程序session
	this.getWxXcxSession = async (code, userInfo) => {
		try {
			const resultData = await app.request(`${DYSERVER}getWxXcxSession?code=${code}&nickName=${userInfo.nickName}&gender=${userInfo.gender}&city=${userInfo.city}&province=${userInfo.province}&avatarUrl=${userInfo.avatarUrl}`)
			runInAction("update state after getWxXcxSession", () => {
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					app.globalData.userInfo.openid = resultData.data.openid;
					app.globalData.userInfo.phoneNum = resultData.data.username;
					wx.setStorageSync('userInfo', app.globalData.userInfo);
					this.errorMsg = '';
				}
			});
		} catch (error) {
			this.errorMsg = error;
		}
	}

	//获取手机验证码
	this.sendMsg = async (phone) => {
		try {
			const resultData = await app.request(`${DYSERVER}sendMsg?phone=${phone}`)
			runInAction("update state after sendMsg", () => {
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					this.errorMsg = '';
				}
			});
		} catch (error) {
			this.errorMsg = error;
		}
	}

	//退出登录
	this.logoutWxcxxUpdate = async () => {
		try {
			const resultData = await app.request(`${DYSERVER}logoutWxcxxUpdate?openid=${app.globalData.userInfo.openid}`)
			runInAction("update state after logoutWxcxxUpdate", () => {
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					this.errorMsg = '';
				}

				wx.setStorageSync('userInfo', null);
				app.globalData.userInfo = null;
			});
		} catch (error) {
			this.errorMsg = error;
		}
	}

	//绑定手机
	this.bindPhoneInWxcxx = async (phone,code) => {
		try {
			const resultData = await app.request(`${DYSERVER}bindPhoneInWxcxx?openid=${app.globalData.userInfo.openid}&phone=${phone}&code=${code}`)
			runInAction("update state after bindPhoneInWxcxx", () => {
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					app.globalData.userInfo.phoneNum = phone;
					wx.setStorageSync('userInfo', app.globalData.userInfo);
					this.errorMsg = '';
				}
			});
		} catch (error) {
			this.errorMsg = error;
		}
	}
	
	//获取广告
	this.getWxxcxAdsList = async () => {
		try {
			const resultData = await app.request(`${DYSERVER}getWxxcxAdsList`)
			runInAction("update state after getWxxcxAdsList", () => {
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data){
						this.adsList = resultData.data
					}
					this.errorMsg = '';
				}
			});
		} catch (error) {
			this.errorMsg = error;
		}
	}

}


module.exports = {
	default: new UserStore,
}