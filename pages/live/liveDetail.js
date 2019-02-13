// pages/live/liveDetail.js
import { DYSERVER } from '../../config/Config';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		linkurl: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中',
		})
		this.setData({
			linkurl: DYSERVER +'zhibo/detail/'+options.id
		})
	},

	loadSuccess() {
		wx.hideLoading()
	}

})