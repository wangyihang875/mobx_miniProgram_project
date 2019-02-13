import regeneratorRuntime from '../assist/lib/regenerator-runtime/runtime.js';
import { DYSERVER } from '../config/Config';
var extendObservable = require('../assist/lib/mobx').extendObservable;
var runInAction = require('../assist/lib/mobx').runInAction;
var app = getApp();
var ArticleStore = function () {
	extendObservable(this, {
		// observable data
		status:'',
		errorMsg:'',
		isLoading: false,
		currentTab:'疾病',
		currentPage:1,
		count:10,
		articleList: [],
		totalPage:0,
		hasMore:false,
		test:'test content',
		// computed data
		get total() {
			return this.articleList.length;
		}
	});

	this.getArticleList = async (lm) => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}articleList303?lm=${lm}&currentPage=${this.currentPage}&count=${this.count}&title=`)
			runInAction("update state after getArticleList", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data.records && resultData.data.records.length) {
						let articleList = this.articleList.concat(resultData.data.records)
						let totalPage = resultData.data.totalpage;
						this.articleList = articleList;
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

	//获取精品文章
	this.articleListOfXcxMainPage = async () => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}articleListOfXcxMainPage`)
			runInAction("update state after articleListOfXcxMainPage", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data && resultData.data.length) {
						this.articleList = resultData.data;
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
}

module.exports = {
	default: new ArticleStore,
}