import regeneratorRuntime from '../assist/lib/regenerator-runtime/runtime.js';
import { DYSERVER } from '../config/Config';
var extendObservable = require('../assist/lib/mobx').extendObservable;
var runInAction = require('../assist/lib/mobx').runInAction;
var app = getApp();
var RecordStore = function () {
	extendObservable(this, {
		// observable data
		status:'',
		errorMsg:'',
		isLoading: false,
		currentPage:1,
		count:10,
		recordList: [],
		commentList: [],
		linkurl: '',
		title: '',
		description: '',
		vid: '',
		totalCommentRecord: 0,
		totalPage:0,
		hasMore:false,
		test:'test content',
		// computed data
		get total() {
			return this.recordList.length;
		},
		get totalComment() {
			return this.commentList.length;
		}
	});

	this.getRecordList = async () => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}zhiboList?currentPage=${this.currentPage}&count=${this.count}`)
			runInAction("update state after getRecordList", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data.records && resultData.data.records.length) {
						let recordList = this.recordList.concat(resultData.data.records)
						let totalPage = resultData.data.totalpage;
						this.recordList = recordList;
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

	//获取热门录播
	this.zhiboListOfXcxMainPage = async () => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}zhiboListOfXcxMainPage`)
			runInAction("update state after zhiboListOfXcxMainPage", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data && resultData.data.length) {
						this.recordList = resultData.data;
					}
					this.errorMsg = '';
				}
				this.isLoading = false;
			});
		} catch (error) {
			this.isLoading = false;
			this.errorMsg = error;
		}
	}


	this.zhiboInfo = async (zhibono) => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}zhiboInfo?zhibono=${zhibono}&currentPage=${this.currentPage}&count=${this.count}`)
			runInAction("update state after zhiboInfo", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data && resultData.data.zhibo) {
						this.title = resultData.data.zhibo.title;
						this.linkurl = resultData.data.zhibo.linkurl;
						this.description = resultData.data.zhibo.content;
						this.vid = resultData.data.zhibo.vid;
					}
					if (resultData.data && resultData.data.comments && resultData.data.comments.records) {
						let commentList = this.commentList.concat(resultData.data.comments.records)
						let totalPage = resultData.data.comments.recordstotalpage;
						this.totalCommentRecord = resultData.data.comments.totalrecord;
						this.commentList = commentList;
						this.totalPage = totalPage;
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

	this.addZhiboComment = async (zhibono, content) => {
		try {
			const resultData = await app.request(`${DYSERVER}addZhiboComment?zhibono=${zhibono}&openid=${app.globalData.userInfo.openid}&content=${content}`)
			runInAction("update state after addZhiboComment", () => {
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
	default: new RecordStore,
}