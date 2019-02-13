var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		LiveStore: require('../../stores/LiveStore').default,
	},
  /**
   * 页面的初始数据
   */
	data: {
		winHeight: "",//窗口高度
		currentTab: 0, //预设当前项的值
		scrollLeft: 0, //tab标题的滚动条位置
	},

	onLoad: function () {
		this.props.LiveStore.currentPage = 1;
		this.props.LiveStore.count = 10;
		this.props.LiveStore.liveList = [];
		this.props.LiveStore.totalPage = 0;
		this.props.LiveStore.hasMore = false;
		this.props.LiveStore.getLiveList()
			.then(() => {
				if (this.props.LiveStore.status !== '0000') {
					wx.showToast({
						title: this.props.LiveStore.errorMsg,
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
	
	stopTouchMove: function () {
		return false;
	},

	loadMorePage() {
		if (this.props.LiveStore.currentPage >= this.props.LiveStore.totalPage) return
		this.props.LiveStore.currentPage++
		this.props.LiveStore.getLiveList()
			.then(() => {
				if (this.props.LiveStore.status !== '0000') {
					wx.showToast({
						title: this.props.LiveStore.errorMsg,
						image: '../../images/icon_gantanhao.png',
						icon: 'success',
						duration: 2000
					})
					return
				}

			})
			.catch((err) => {
				wx.showToast({
					title: err,
					image: '../../images/icon_gantanhao.png',
					icon: 'success',
					duration: 2000
				})
			})

	},

}))