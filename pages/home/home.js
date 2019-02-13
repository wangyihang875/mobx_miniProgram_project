// pages/home/home.js
var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		VideoStore: require('../../stores/VideoStore').default,
		ArticleStore: require('../../stores/ArticleStore').default,
		RecordStore: require('../../stores/RecordStore').default,
		UserStore: require('../../stores/UserStore').default,
	},
  /**
   * 页面的初始数据
   */
  data: {
		winHeight: 150,//窗口高度
		currentTab: 0, //预设当前项的值
		scrollLeft: 0, //tab标题的滚动条位置
		
  },

	// 滚动切换标签样式
	switchTab: function (e) {

		this.setData({
			currentTab: e.detail.current
		});
		this.checkCor();

		if (e.detail.current == 0) {
			this.props.RecordStore.recordList = [];
			this.props.RecordStore.zhiboListOfXcxMainPage()
				.then(() => {
					if (this.props.RecordStore.status !== '0000') {
						wx.showToast({
							title: this.props.RecordStore.errorMsg,
							image: '../../images/icon_gantanhao.png',
							icon: 'success',
							duration: 2000
						})
						return
					}
					let winHeight = 498 * this.props.RecordStore.total;
					this.setData({
						winHeight: winHeight
					});
				})
				.catch((err) => {
					wx.showToast({
						title: '获取接口失败',
						image: '../../images/icon_gantanhao.png',
						icon: 'success',
						duration: 2000
					})
				})

		} else if (e.detail.current == 1) {
			this.props.VideoStore.videoList = [];
			this.props.VideoStore.shortVideoListOfXcxMainPage()
				.then(() => {
					if (this.props.VideoStore.status !== '0000') {
						wx.showToast({
							title: this.props.VideoStore.errorMsg,
							image: '../../images/icon_gantanhao.png',
							icon: 'success',
							duration: 2000
						})
						return
					}
					let winHeight = 430 * Math.ceil(this.props.VideoStore.total / 2);
					this.setData({
						winHeight: winHeight
					});
				})
				.catch((err) => {
					wx.showToast({
						title: '获取接口失败',
						image: '../../images/icon_gantanhao.png',
						icon: 'success',
						duration: 2000
					})
				})
		} else if (e.detail.current == 2) {
			this.props.ArticleStore.articleList=[];
			this.props.ArticleStore.articleListOfXcxMainPage()
				.then(() => {
					if (this.props.ArticleStore.status !== '0000') {
						
						wx.showToast({
							title: this.props.ArticleStore.errorMsg,
							image: '../../images/icon_gantanhao.png',
							icon: 'success',
							duration: 2000
						})
						return
					}
					let winHeight = 223 * this.props.ArticleStore.total;
					this.setData({
						winHeight: winHeight
					});
				})
				.catch((err) => {
					wx.showToast({
						title: '获取接口失败',
						image: '../../images/icon_gantanhao.png',
						icon: 'success',
						duration: 2000
					})
				})

		}

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.setData({
			currentTab:0
		})
	},

	// 点击标题切换当前页时改变样式
	swichNav: function (e) {
		var cur = e.target.dataset.current;
		if (this.data.currentTaB == cur) { return false; }
		else {
			this.setData({
				currentTab: cur
			})
		}
	},
	//判断当前滚动超过一屏时，设置tab标题滚动条。
	checkCor: function () {
		if (this.data.currentTab > 4) {
			this.setData({
				scrollLeft: 300
			})
		} else {
			this.setData({
				scrollLeft: 0
			})
		}
	},
	onLoad: function () {
		this.props.RecordStore.recordList = [];
		this.props.RecordStore.zhiboListOfXcxMainPage()
			.then(() => {
				if (this.props.RecordStore.status !== '0000') {
					wx.showToast({
						title: this.props.RecordStore.errorMsg,
						image: '../../images/icon_gantanhao.png',
						icon: 'success',
						duration: 2000
					})
					//return
				}
				let winHeight = this.props.RecordStore.total==0 ? 298 : this.props.RecordStore.total*498 ;
				this.setData({
					winHeight: winHeight
				});


				this.props.UserStore.getWxxcxAdsList()
				.then(() => {
					
				})
				.catch((err) => {
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
	footerTap: app.footerTap,

	xywzHandle:function(){
		wx.switchTab({
			url: '/pages/question/question'
		})
	},

	stopTouchMove: function () {
		return false;
	},

	changeIndicatorDots: function (e) {
		this.setData({
			indicatorDots: !this.data.indicatorDots
		})
	},
	changeAutoplay: function (e) {
		this.setData({
			autoplay: !this.data.autoplay
		})
	},
	intervalChange: function (e) {
		this.setData({
			interval: e.detail.value
		})
	},
	durationChange: function (e) {
		this.setData({
			duration: e.detail.value
		})
	},


}))