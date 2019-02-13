var observer = require('../../assist/lib/observer').observer;
var app = getApp();
Page(observer({
	props: {
		VideoStore: require('../../stores/VideoStore').default,
	},
	data: {
		videono:'',
		content:'',
	},
	onReady: function (res) {
		this.videoContext = wx.createVideoContext('myVideo')
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			videono: options.videono,
		});
		this.props.isLoading = true;
		this.props.VideoStore.currentPage = 1;
		this.props.VideoStore.count = 10;
		this.props.VideoStore.commentList = [];
		this.props.VideoStore.totalPage = 0;
		this.props.VideoStore.hasMore = false;
		this.props.VideoStore.shortVideoInfo(this.data.videono)
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
		if (this.props.VideoStore.currentPage >= this.props.VideoStore.totalPage) return
		this.props.VideoStore.currentPage++
		this.props.VideoStore.shortVideoInfo(this.data.videono)
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

	bindCommentInput(e){
		this.setData({
			content: e.detail.value
		});
	},

	commentHandle(){
		if(!this.data.content)return;
		if(!(app.globalData.userInfo)){
			wx.showModal({
				title: '提示',
				content: '请先登录再评论',
				showCancel: false,
				success(res) {
					
				}
			})
			return
		}

		this.props.VideoStore.addVideoComment(this.data.videono,this.data.content)
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

				this.setData({
					content: ''
				});
				
				this.props.VideoStore.currentPage = 1;
				this.props.VideoStore.count = 10;
				this.props.VideoStore.commentList = [];
				this.props.VideoStore.totalPage = 0;
				this.props.VideoStore.hasMore = false;
				this.props.VideoStore.shortVideoInfo(this.data.videono)
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