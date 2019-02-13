import regeneratorRuntime from '../assist/lib/regenerator-runtime/runtime.js';
import { DYSERVER } from '../config/Config';
var extendObservable = require('../assist/lib/mobx').extendObservable;
var runInAction = require('../assist/lib/mobx').runInAction;
var app = getApp();
var LiveStore = function () {
	extendObservable(this, {
		status:'',
		errorMsg:'',
		isLoading: false,
		currentPage:1,
		count:10,
		liveList: [],
		totalPage:0,
		hasMore:false,
		get total() {
			return this.liveList.length;
		}
	});

	this.getLiveList = async () => {
		try {
			this.isLoading = true;
			const resultData = await app.request(`${DYSERVER}zhiboList?currentPage=${this.currentPage}&count=${this.count}`)
			runInAction("update state after getLiveList", () => {
				this.isLoading = false;
				this.status = resultData.status;
				if (resultData.status != '0000') {
					this.errorMsg = resultData.msg;
				} else {
					if (resultData.data.records && resultData.data.records.length) {
						let liveList = this.liveList.concat(resultData.data.records)
						let totalPage = resultData.data.totalpage;
						this.liveList = liveList;
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
						this.liveList = resultData.data;
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
	default: new LiveStore,
}