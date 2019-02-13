var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		RecordStore: require('../../stores/RecordStore').default,
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
		this.props.RecordStore.currentPage = 1;
		this.props.RecordStore.count = 10;
		this.props.RecordStore.recordList = [];
		this.props.RecordStore.totalPage = 0;
		this.props.RecordStore.hasMore = false;
		this.props.RecordStore.getRecordList()
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
		if (this.props.RecordStore.currentPage >= this.props.RecordStore.totalPage) return
		this.props.RecordStore.currentPage++
		this.props.RecordStore.getRecordList()
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