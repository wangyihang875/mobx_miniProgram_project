import regeneratorRuntime from '../assist/lib/regenerator-runtime/runtime.js';
import {
  DYSERVER
} from '../config/Config';
var extendObservable = require('../assist/lib/mobx').extendObservable;
var runInAction = require('../assist/lib/mobx').runInAction;
var app = getApp();
var SearchStore = function() {
  extendObservable(this, {
    // observable data
    status: '',
    errorMsg: '',
    isLoading: false,
    hotList: [],
		currentTab: 0, //视频0 直播1 文章3
    searchStr: '',
    searchList: [],
    currentPage: 1,
    count: 10,
    totalPage: 0,
    hasMore: false,
		state:'',
    get total() {
      return this.searchList.length;
    }
  });

  this.searchHistory = async() => {
    try {
      const resultData = await app.request(`${DYSERVER}searchHistory`)
      runInAction("update state after searchHistory", () => {
        this.isLoading = false;
        this.status = resultData.status;
        if (resultData.status != '0000') {
          this.errorMsg = resultData.msg;
        } else {
          this.hotList = resultData.data && resultData.data.hotList ? resultData.data.hotList : [];
          this.errorMsg = '';
        }
      });
    } catch (error) {
      this.isLoading = false;
      this.errorMsg = error;
    }
  }

  this.doSearch = async(searchType) => {
    try {
      //视频0 直播1 文章2
      const resultData = await app.request(`${DYSERVER}doSearch?searchStr=${this.searchStr}&searchType=${searchType}&currentPage=${this.currentPage}&count=${this.count}`)
      runInAction("update state after doSearch", () => {
        this.isLoading = false;
        this.status = resultData.status;
        if (resultData.status != '0000') {
          this.errorMsg = resultData.msg;
        } else {
					if (resultData.data.data.records && resultData.data.data.records.length) {
						let searchList = this.searchList.concat(resultData.data.data.records)
						let totalPage = resultData.data.data.totalpage;
            this.searchList = searchList;
            this.totalPage = totalPage;
            //this.test = resultData.msg;
          }
          if (this.totalPage > this.currentPage) {
            this.hasMore = true;
          } else {
            this.hasMore = false;
          }


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
  default: new SearchStore,
}