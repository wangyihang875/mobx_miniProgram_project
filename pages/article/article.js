
var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		ArticleStore: require('../../stores/ArticleStore').default,
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

		if (e.detail.current==0){
			this.props.ArticleStore.currentTab = '最新';
		} else if (e.detail.current == 1){
			this.props.ArticleStore.currentTab = '前沿';
		} else if (e.detail.current == 2) {
			this.props.ArticleStore.currentTab = '疾病';
		} else if (e.detail.current == 3) {
			this.props.ArticleStore.currentTab = '科普';
		}
		this.props.ArticleStore.currentPage=1;
		this.props.ArticleStore.count= 10;
		this.props.ArticleStore.articleList= [];
		this.props.ArticleStore.totalPage= 0;
		this.props.ArticleStore.hasMore= false;

		this.props.ArticleStore.getArticleList(this.props.ArticleStore.currentTab)
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
	onLoad: function () {
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


		this.props.ArticleStore.currentPage = 1;
		this.props.ArticleStore.count = 10;
		this.props.ArticleStore.articleList = [];
		this.props.ArticleStore.totalPage = 0;
		this.props.ArticleStore.hasMore = false;
		this.props.ArticleStore.getArticleList('疾病')
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
		if (this.props.ArticleStore.currentPage >= this.props.ArticleStore.totalPage) return
		this.props.ArticleStore.currentPage++
		this.props.ArticleStore.getArticleList(this.props.ArticleStore.currentTab)
			.then(() => {
				if (this.props.ArticleStore.status !== '0000') {
					console.log(`this.props.ArticleStore.status=${this.props.ArticleStore.status}`)
					console.log(`this.props.ArticleStore.currentPage=${this.props.ArticleStore.currentPage}`)
					console.log(`this.props.ArticleStore.count=${this.props.ArticleStore.count}`)
					wx.showToast({
						title: this.props.ArticleStore.errorMsg,
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