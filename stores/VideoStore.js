import regeneratorRuntime from '../assist/lib/regenerator-runtime/runtime.js';
import { DYSERVER } from '../config/Config';
var extendObservable = require('../assist/lib/mobx').extendObservable;
var runInAction = require('../assist/lib/mobx').runInAction;
var app = getApp();
var VideoStore = function () {
	extendObservable(this, {
		status:'',
		errorMsg:'',
		isLoading: false,
		currentTab:'健康食谱',
		currentPage:1,
		count:10,
		videoList: [],
		commentList:[],
		linkurl:'',
		linkurlEncode:'',
		title:'',
		description:'',
		totalCommentRecord:0,
		totalPage:0,
		hasMore:false,
		get total() {
			return this.videoList.length;
		},
		get totalComment() {
			return this.commentList.length;
		}
	});

	this.getVideoList = async (lm) => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}shortVideoList?lm=${lm}&currentPage=${this.currentPage}&count=${this.count}`)
			runInAction("update state after getVideoList", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data.records && resultData.data.records.length) {
						let videoList = this.videoList.concat(resultData.data.records)
						let totalPage = resultData.data.totalpage;
						this.videoList = videoList;
						this.totalPage = totalPage;	
						//this.test = resultData.msg;			
					}
					if (this.totalPage > this.currentPage) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					
				
					this.errorMsg = '';
					this.isLoading = false;
				}
			});
		} catch (error) {
			this.isLoading = false;
			this.errorMsg = error;
		}
	}


	//获取热门视频
	this.shortVideoListOfXcxMainPage = async () => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}shortVideoListOfXcxMainPage`)
			runInAction("update state after shortVideoListOfXcxMainPage", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data && resultData.data.length) {
						this.videoList = resultData.data;
					}

					this.errorMsg = '';
					this.isLoading = false;
				}
			});
		} catch (error) {
			this.isLoading = false;
			this.errorMsg = error;
		}
	}


	this.shortVideoInfo = async (videono) => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}shortVideoInfo?videono=${videono}&currentPage=${this.currentPage}&count=${this.count}`)
			runInAction("update state after shortVideoInfo", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data && resultData.data.video ){
						this.title = resultData.data.video.title;
						this.linkurl = resultData.data.video.linkurl;
						this.linkurlEncode = encodeURI(resultData.data.video.linkurl);
						this.description = resultData.data.video.content;
					}
					if (resultData.data && resultData.data.comments && resultData.data.comments.records) {
						let commentList = this.commentList.concat(resultData.data.comments.records)
						let totalPage = resultData.data.comments.recordstotalpage;
						this.totalCommentRecord = resultData.data.comments.totalrecord;
						this.commentList = commentList;
						this.totalPage = totalPage;
						

						//this.test = resultData.msg;
					}
					if (this.totalPage > this.currentPage) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}

					this.errorMsg = '';
					this.isLoading = false;
				}
			});
		} catch (error) {
			this.isLoading = false;
			this.errorMsg = error;
		}
	}

	this.addVideoComment = async (videono,content) => {
		try {
			const resultData = await app.request(`${DYSERVER}addVideoComment?videono=${videono}&openid=${app.globalData.userInfo.openid}&content=${content}`)
			runInAction("update state after addVideoComment", () => {
				//this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					
					this.errorMsg = '';
				}
			});
		} catch (error) {
			this.isLoading = false;
			this.errorMsg = error;
		}
	}
}

module.exports = {
	default: new VideoStore,
}