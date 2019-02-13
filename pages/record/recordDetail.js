var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		RecordStore: require('../../stores/RecordStore').default,
	},
	data: {
		zhibono: '',
		content: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			zhibono: options.zhibono,
		});

		this.props.isLoading = true;
		this.props.RecordStore.currentPage = 1;
		this.props.RecordStore.count = 10;
		this.props.RecordStore.commentList = [];
		this.props.RecordStore.totalPage = 0;
		this.props.RecordStore.hasMore = false;
		this.props.RecordStore.zhiboInfo(this.data.zhibono)
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

	loadMorePage() {
		if (this.props.RecordStore.currentPage >= this.props.RecordStore.totalPage) return
		this.props.RecordStore.currentPage++
		this.props.RecordStore.zhiboInfo(this.data.zhibono)
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

	bindCommentInput(e) {
		this.setData({
			content: e.detail.value
		});
	},

	commentHandle() {
		if (!this.data.content) return;
		if (!(app.globalData.userInfo)) {
			wx.showModal({
				title: '提示',
				content: '请先登录再评论',
				showCancel: false,
				success(res) {

				}
			})
			return
		}

		this.props.RecordStore.addZhiboComment(this.data.zhibono, this.data.content)
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

				this.setData({
					content: ''
				});

				this.props.RecordStore.currentPage = 1;
				this.props.RecordStore.count = 10;
				this.props.RecordStore.commentList = [];
				this.props.RecordStore.totalPage = 0;
				this.props.RecordStore.hasMore = false;
				this.props.RecordStore.zhiboInfo(this.data.zhibono)
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

			})
			.catch((err) => {
				wx.showToast({
					title: err,
					image: '../../images/icon_gantanhao.png',
					icon: 'success',
					duration: 2000
				})
			})
	}

})
)