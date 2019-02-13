
var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		SearchStore: require('../../stores/SearchStore').default,
	},
  /**
   * 页面的初始数据
   */
	data: {
		winHeight: "",//窗口高度
		currentTab: 0, //预设当前项的值
		scrollLeft: 0, //tab标题的滚动条位置
	},

	// 滚动切换标签样式
	switchTab: function (e) {
		this.setData({
			currentTab: e.detail.current
		});
		this.checkCor();

		this.props.SearchStore.currentTab = e.detail.current;
		
		this.props.SearchStore.currentPage = 1;
		this.props.SearchStore.count = 10;
		this.props.SearchStore.searchList = [];
		this.props.SearchStore.totalPage = 0;
		this.props.SearchStore.hasMore = false;

		this.props.SearchStore.doSearch(e.detail.current)
			.then(() => {
				if (this.props.SearchStore.status !== '0000') {
					wx.showToast({
						title: this.props.SearchStore.errorMsg,
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
	onLoad: function (options) {
		var that = this;
		//  高度自适应
		wx.getSystemInfo({
			success: function (res) {
				var clientHeight = res.windowHeight,
					clientWidth = res.windowWidth,
					rpxR = 750 / clientWidth;
				var calc = clientHeight * rpxR - 180;
				that.setData({
					winHeight: calc
				});
			}
		});

		if (options.searchStr!=undefined){
			this.props.SearchStore.searchStr = options.searchStr
		}
		this.props.SearchStore.currentTab = 0;
		this.props.SearchStore.currentPage = 1;
		this.props.SearchStore.count = 10;
		this.props.SearchStore.searchList = [];
		this.props.SearchStore.totalPage = 0;
		this.props.SearchStore.hasMore = false;
		this.props.SearchStore.doSearch(this.props.SearchStore.currentTab)
			.then(() => {
				if (this.props.SearchStore.status !== '0000') {
					wx.showToast({
						title: this.props.SearchStore.errorMsg,
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
	footerTap: app.footerTap,

	stopTouchMove: function () {
		return false;
	},

	loadMorePage() {
		if (this.props.SearchStore.currentPage >= this.props.SearchStore.totalPage) return
		this.props.SearchStore.currentPage++
		this.props.SearchStore.doSearch(this.props.SearchStore.currentTab)
			.then(() => {
				if (this.props.SearchStore.status !== '0000') {
					wx.showToast({
						title: this.props.SearchStore.errorMsg,
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