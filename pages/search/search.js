
var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		SearchStore: require('../../stores/SearchStore').default,
	},
  
	data: {
		searchHis:[]
	},

	onLoad: function () {
		let arr = wx.getStorageSync('searchHis');
		
		this.setData({
			searchHis: !arr ? [] : arr.slice(0,6)
		});
		this.props.SearchStore.searchHistory()
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

	searchHandle: function () {
		if (!this.props.SearchStore.searchStr){
			return;
		}
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
				let hisArr = wx.getStorageSync('searchHis');
				if (!hisArr) {
					var arr = new Array();
					arr.unshift(this.props.SearchStore.searchStr);
					wx.setStorageSync('searchHis', arr);
				} else {
					if (!hisArr.includes(this.props.SearchStore.searchStr)){
						hisArr.unshift(this.props.SearchStore.searchStr);
						wx.setStorageSync('searchHis', hisArr);
					}
					
				}
				wx.navigateTo({
					url: './searchPage'
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

	bindSearchInput: function (e) {
		this.props.SearchStore.searchStr = e.detail.value
	},

	deleteSearchHandle: function () {
		let that = this;
		wx.showModal({
			title: '提示',
			content: '确定要删除历史记录吗？',
			success(res) {
				if (res.confirm) {
					that.setData({
						searchHis:[]
					})
					wx.setStorageSync('searchHis',[]);
				} else if (res.cancel) {
					
				}
			}
		})
	},

}))