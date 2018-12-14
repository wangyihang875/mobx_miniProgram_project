// pages/article/articleDetail.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		linkurl:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中',
		})
		this.setData({
			linkurl: options.linkurl
		})
	},

	loadSuccess(){
		wx.hideLoading()
	}

})