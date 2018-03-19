"use strict";
cc._RF.push(module, 'a8b3fDbHOlI15rfQ0EE4lp1', 'mjPlayerPai');
// mahjong/script/game/common/mjPlayerPai.js

"use strict";

var GameDefine = require("mjGameDefine");
// var utils       = require("utils");
var log = cc.log;
var gameManager = require("mjGameManager");
var mjPai = require("mjPai");
// /*
// 	牌的数据结构
// */


var paiObjCls = function paiObjCls() {
	this.setDeskType = function (posType) {
		this.desPosType = posType;
	};
	this.createPai = function (id) {
		return mjPai.new(id);
	};
	this.createFullPai = function (id) {
		var pai = this.createPai(id);
		pai.refreshCaiShen();
		pai.refreshSort();
		return pai;
	};

	this.creatPengGangPai = function (id) {
		var pai = this.createFullPai(id);
		pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
		return pai;
	};

	this.spliceShouShangPai = function (targetID) {
		var splicePai;
		var handPaiList = this.getShouPaiList();
		for (var i = handPaiList.length - 1; i > -1; i--) {
			var curPai = handPaiList[i];
			if (curPai.id == targetID) {
				splicePai = handPaiList.splice(i, 1)[0];
				break;
			}
		}
		return splicePai;
	};

	//碰牌
	this.chi = function (paiData) {
		var chiData = paiData.d;
		var isSelf = paiData.s;
		var paiID = paiData.card;
		var isSheng = paiData.sheng;
		log("THIS IS OLD chi", chiData, paiID);
		var rotateData = this.getEatPaiRotate(gameManager.lastChuPaiDir);
		var pai = this.creatPengGangPai(paiID);
		var pengList = [];
		this.pengGangPai.all.push(pai);
		for (var i = 0; i < 3; i++) {
			if (chiData[i] == paiID) {
				continue;
			}
			var spliceID = this.getSlipceID(isSelf, chiData[i]);
			var splicePai = this.spliceShouShangPai(spliceID);
			splicePai.id = chiData[i];
			this.pengGangPai.all.push(splicePai);
			splicePai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			pengList.push(splicePai);
		}
		if (rotateData.index == 0) {
			pengList.unshift(pai);
		} else {
			pengList.push(pai);
		}
		pengList[rotateData.index].setShowType(GameDefine.PAISHOWTYPE.PENGBY);
		this.addPengList(pengList);
		return pengList;
	};

	this.getCanChiData = function (paiid) {
		var chiData = [];
		var shouPaiList = this.getShouPaiList().slice();
		shouPaiList.push({ id: paiid });
		for (var id = paiid - 2; id < paiid + 1; id++) {
			var count = 0;
			for (var i = 0; i < 3; i++) {
				var curID = id + i;
				var isExit = shouPaiList.some(function (pai) {
					return pai.id == curID;
				});
				if (isExit) {
					count += 1;
				}
			}
			if (count == 3) {
				chiData.push([id, id + 1, id + 2]);
			}
		}
		return chiData;
	};

	this.addPengList = function (pengList) {
		this.pengGangPai.peng.push(pengList);
	};

	//碰牌
	this.peng = function (paiID, isSelf) {
		var rotateData = this.getEatPaiRotate(gameManager.lastChuPaiDir);
		var pai = this.creatPengGangPai(paiID);
		var pengList = [pai];
		var targetID = this.getSlipceID(isSelf, pai.id); //isSelf ? pai.id : 0;
		log("--targetID-------", targetID);
		this.pengGangPai.all.push(pai);
		for (var i = 0; i < 2; i++) {

			var curPai = this.spliceShouShangPai(targetID);
			curPai.id = pai.id;
			curPai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			pengList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		if (rotateData.rotate != 0) {
			pengList[rotateData.index].setShowType(GameDefine.PAISHOWTYPE.PENGBY);
		}
		this.addPengList(pengList);
		this.pengCount += 1;
		return pengList;
	};

	//杠牌， 从碰的拍上杠牌
	this.gang_0 = function (id, isSelf) {
		var pai = this.creatPengGangPai(id);
		var gangList = [];
		this.pengGangPai.all.push(pai);
		for (var i = 0; i < this.pengGangPai.peng.length; i++) {
			var pengList = this.pengGangPai.peng[i];
			if (pengList[0].id === pai.id) {
				gangList = pengList;
				gangList.forEach(function (item) {
					item.setRotate(0);
				});
				var targetID = this.getSlipceID(isSelf, pai.id); //isSelf ? pai.id : 0;
				var curPai = this.spliceShouShangPai(targetID);
				curPai.setShowType(GameDefine.PAISHOWTYPE.PENG);
				curPai.id = pai.id;
				gangList.push(curPai);
				this.pengGangPai.peng.splice(i, 1);
			}
		}
		this.pengGangPai.gang.push(gangList);
		return gangList;
	};

	//暗杠
	this.gang_1 = function (id, isSelf) {
		var gangList = [];
		var targetID = this.getSlipceID(isSelf, id); //isSelf ? pai.id : 0;
		for (var i = 0; i < 4; i++) {
			var curPai = this.spliceShouShangPai(targetID);
			curPai.id = id;
			var showTp = i < 3 ? GameDefine.PAISHOWTYPE.GAI : GameDefine.PAISHOWTYPE.PENG;
			curPai.setShowType(showTp);
			gangList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		this.pengGangPai.gang.push(gangList);
		return gangList;
	},

	//杠牌， 自己手中有三张 杠别人打出来的牌 
	this.gang_2 = function (id, isSelf) {
		var rotateData = this.getEatPaiRotate(gameManager.lastChuPaiDir);
		var pai = this.creatPengGangPai(id);
		var gangList = [pai];
		var targetID = this.getSlipceID(isSelf, pai.id); //isSelf ? pai.id : 0;
		this.pengGangPai.all.push(pai);
		for (var i = 0; i < 3; i++) {
			var curPai = this.spliceShouShangPai(targetID);
			curPai.id = pai.id;
			curPai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			gangList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		var changeIndex = rotateData.rotate == 0 ? 3 : rotateData.index;
		gangList[changeIndex].setShowType(GameDefine.PAISHOWTYPE.PENGBY);
		this.pengGangPai.gang.push(gangList);
		return gangList;
	};

	this.addPai = function (id) {
		cc.log("---this.addPai--" + id);
		var pai = this.createFullPai(id);
		var shouPaiList = this.getShouPaiList();
		shouPaiList.push(pai);
		return pai;
	};

	this.getEatPaiRotate = function (chupaiDeskType) {
		var rotate = 90;
		for (var i = 1; i < 4; i++) {
			var targetDest = (this.desPosType + i) % 4;
			if (targetDest == chupaiDeskType) {
				break;
			}
			rotate -= 90;
		}
		var index = rotate > 0 ? 2 : 0;
		return { rotate: rotate, index: index };
	};

	this.checkPai = function (pai) {
		pai = pai || {};
		pai.id = pai.id || 0;
		pai.sortId = pai.sortId || 0;
	},
	//手上的牌排序
	this.sortMajiang = function () {
		var shouPaiList = this.getShouPaiList();
		for (var i = 0; i < shouPaiList.length; i++) {
			var pai = shouPaiList[i];
			pai.refreshSort();
			pai.refreshCaiShen();
		}
		this.sortGroupPai(shouPaiList);
	};

	this.cleanReplayData = function () {};

	this.sortPengGangPai = function () {
		var gangList = this.pengGangPai.gang;
		for (var i = 0; i < gangList.length; i++) {
			this.sortGroupPai(gangList[i]);
		}
		var pengList = this.pengGangPai.peng;
		for (var _i = 0; _i < pengList.length; _i++) {
			this.sortGroupPai(pengList[_i]);
		}
	};

	this.sortGroupPai = function (groupPai) {
		var self = this;
		groupPai.sort(function (a, b) {
			self.checkPai(a);
			self.checkPai(b);
			return a.sortId - b.sortId;
		});
	};

	this.setShouPai = function (paiList, isGai) {
		var shouPaiList = this.getShouPaiList();
		var addShoupai = [];
		for (var i = 0; i < paiList.length; i++) {
			var pai = this.createPai(paiList[i]);
			shouPaiList.push(pai);
			pai.showType = isGai ? GameDefine.PAISHOWTYPE.SHOUGAI : pai.showType;
			addShoupai.push(pai);
		}
		return addShoupai;
	};

	this.faPai = function (paiList, isGai) {
		var addShoupai = [];
		for (var i = 0; i < paiList.length; i++) {
			var pai = this.createPai(paiList[i]);
			this.faPaiList.push(pai);
			pai.showType = isGai ? GameDefine.PAISHOWTYPE.SHOUGAI : pai.showType;
			addShoupai.push(pai);
		}
		return addShoupai;
	};

	this.uprightPai = function () {
		for (var i = 0; i < this.faPaiList.length; i++) {
			this.faPaiList[i].showType = GameDefine.PAISHOWTYPE.SHOU;
		}
	};

	this.gaiAllPai = function () {
		for (var i = 0; i < this.faPaiList.length; i++) {
			var pai = this.faPaiList[i];
			pai.refreshSort();
			pai.refreshCaiShen();
			this.faPaiList[i].showType = GameDefine.PAISHOWTYPE.SHOUGAI;
		}
		this.sortGroupPai(this.faPaiList);
	};

	this.cleanFaPaiList = function () {
		this.faPaiList = [];
	};

	this.resetPengGangPai = function (gangList, pengList) {
		this.resetPengGang("gang", gangList);
		this.resetPengGang("peng", pengList);
	};

	this.resetPengGang = function (name, paiList) {
		paiList = paiList || [];
		var self = this;
		var changeList = [];
		paiList.forEach(function (item) {
			if (item.type == GameDefine.EATPAI_TYPE.AnGang) {
				changeList.push(self.resetAngang(item));
			} else {
				changeList.push(self.resetNorGangPeng(item));
			}
		});
		this.pengGangPai[name] = changeList;
	};

	this.resetNorGangPeng = function (item) {
		var self = this;
		var mjDataMgr = require("mjDataMgr");
		var s = mjDataMgr.get(mjDataMgr.KEYS.POSIDS);
		var chuPaiDesk = mjDataMgr.get(mjDataMgr.KEYS.POSIDS)[item.pId];
		var rotateData = self.getEatPaiRotate(chuPaiDesk);
		var temList = [];
		item.data.forEach(function (id) {
			var pai = self.creatPengGangPai(id);
			temList.push(pai);
			self.pengGangPai.all.push(pai);
		});
		if (rotateData.rotate != 0) {
			temList[rotateData.index].setShowType(GameDefine.PAISHOWTYPE.PENGBY);
		}
		return temList;
	};

	this.resetAngang = function (item) {
		var self = this;
		var temList = [];
		item.data.forEach(function (id, index) {
			var pai = self.createFullPai(id);
			var showType = index < 3 ? GameDefine.PAISHOWTYPE.GAI : GameDefine.PAISHOWTYPE.PENG;
			pai.setShowType(showType);
			temList.push(pai);
			self.pengGangPai.all.push(pai);
		});
		return temList;
	};

	this.showPai = function (paiid) {
		var handPaiList = this.getShouPaiList();
		var spliceIndex = handPaiList.findIndex(function (item) {
			return item.id == paiid;
		});
		var chuPai = handPaiList.splice(spliceIndex, 1)[0];
		return chuPai;
	};

	this.buHuapai = function (idList) {
		idList.forEach(function (id) {
			var pai = this.createFullPai(id);
			pai.setShowType(GameDefine.PAISHOWTYPE.END);
			this.puhuaList.push(pai);
		}.bind(this));
	},

	//从pai obj中移出pai
	this.chuPai = function (udid, paiid) {
		var handPaiList = this.getShouPaiList();
		var spliceIndex = handPaiList.findIndex(function (item) {
			return item.udid == udid;
		});
		var randomIndex = Math.floor(Math.random() * handPaiList.length);
		spliceIndex = spliceIndex == -1 ? randomIndex : spliceIndex;
		var chuPai = handPaiList.splice(spliceIndex, 1)[0];
		this.daPaiOutList.push(chuPai);
		return chuPai;
	};
	this.getShouPaiList = function () {
		return this.shouShangPai;
	};
	this.init = function () {
		this.pengCount = 0; //碰的牌
		this.shouShangPai = []; //手上没有碰和杠的牌
		this.faPaiList = []; //发牌只做动画显示，显示完毕后清空
		this.pengGangPai = {};
		this.pengGangPai.all = []; //碰和杠出去的牌
		this.pengGangPai.peng = []; //碰出去的牌
		this.pengGangPai.gang = []; //杠出去的牌
		this.daPaiOutList = []; //打出去没有被人吃的牌
		this.puhuaList = [];
	};
};
//黄岩麻将	
var hymjPai = function hymjPai() {
	this.puhuaList = [];
	this.getSlipceID = function (isSelf, chiID) {
		return isSelf ? chiID : 0;
	};
};

//温岭麻将	
var wlmjPai = function wlmjPai() {

	this.getSlipceID = function (isSelf, chiID) {
		return isSelf ? chiID : 0;
	};

	//碰牌
	this.peng = function (paiID, isSelf) {
		var pai = this.creatPengGangPai(paiID);
		var pengList = [pai];
		var targetID = this.getSlipceID(isSelf, pai.id); //isSelf ? pai.id : 0;
		this.pengGangPai.all.push(pai);
		for (var i = 0; i < 2; i++) {

			var curPai = this.spliceShouShangPai(targetID);
			curPai.id = pai.id;
			curPai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			pengList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		this.addPengList(pengList);
		this.pengCount += 1;
		return pengList;
	};

	//杠牌， 自己手中有三张 杠别人打出来的牌 
	this.gang_2 = function (id, isSelf) {
		var pai = this.creatPengGangPai(id);
		var gangList = [pai];
		var targetID = this.getSlipceID(isSelf, pai.id); //isSelf ? pai.id : 0;
		this.pengGangPai.all.push(pai);
		for (var i = 0; i < 3; i++) {
			var curPai = this.spliceShouShangPai(targetID);
			curPai.id = pai.id;
			curPai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			gangList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		// gangList[3].setShowType(GameDefine.PAISHOWTYPE.PENGBY);
		this.pengGangPai.gang.push(gangList);
		return gangList;
	};

	// //吃
	// this.chi = function(paiData){
	// 	let chiData = paiData.d;
	// 	let isSelf  = paiData.s;
	// 	let paiID   = paiData.card;
	// 	let isSheng = paiData.sheng
	// 	if(isSheng){
	// 		return 	this.__proto__.chi(paiData);
	// 	}
	// 	var pai = this.creatPengGangPai(paiID);
	// 	var pengList = []; 
	// 	this.pengGangPai.all.push(pai);
	// 	for(let i = 0; i < 3; i++){
	// 		if(chiData[i] == paiID){continue}
	// 		var spliceID = this.getSlipceID(isSelf, chiData[i]);
	// 		let splicePai = this.spliceShouShangPai(spliceID);
	// 		splicePai.id = chiData[i];
	// 		this.pengGangPai.all.push(splicePai);
	// 		splicePai.setShowType(GameDefine.PAISHOWTYPE.PENG)
	// 		pengList.push(splicePai);
	// 	}
	// 	pengList.push(pai);
	// 	pengList.sort(function(a, b){
	// 		return a.id - b.id;
	// 	})
	// 	this.addPengList(pengList);
	// 	return pengList;
	// }


	this.resetNorGangPeng = function (item) {
		var isChi = item.data[0] != item.data[1];
		if (isChi) {
			return this.__proto__.resetNorGangPeng.call(this, item);
		}
		var self = this;
		var mjDataMgr = require("mjDataMgr");
		var chuPaiDesk = mjDataMgr.get(mjDataMgr.KEYS.POSIDS)[item.pId];
		var rotateData = self.getEatPaiRotate(chuPaiDesk);
		var temList = [];
		item.data.forEach(function (id) {
			var pai = self.creatPengGangPai(id);
			temList.push(pai);
			self.pengGangPai.all.push(pai);
		});
		return temList;
	};
};

//黄岩麻将回放
var hymjReplayPai = function hymjReplayPai() {
	this.puhuaList = [];
	// this.getShouPaiList = function(){
	// 	//回放时候的手上牌
	// 	var pengLen = this.pengGangPai.peng.length;
	// 	return this.pengGangPai.peng[pengLen - 1];
	// }

	this.getSlipceID = function (isSelf, chiID) {
		return chiID;
	};

	this.replayChupai = function (paiID) {
		var handPaiList = this.getShouPaiList();
		var spliceIndex = handPaiList.findIndex(function (item) {
			return item.id == paiID;
		});
		spliceIndex = spliceIndex == -1 ? 0 : spliceIndex;
		var chuPai = handPaiList.splice(spliceIndex, 1)[0];
		this.daPaiOutList.push(chuPai);
		return chuPai;
	};

	//从pai obj中移出pai
	this.chuPai = function (udid, paiID) {
		return this.replayChupai(paiID);
	};
	this.cleanReplayData = function () {};

	this.setShouPai = function (paiList) {
		var shouPaiList = this.getShouPaiList();
		var addShoupai = [];
		for (var i = 0; i < paiList.length; i++) {
			var pai = this.createPai(paiList[i]);
			pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			shouPaiList.push(pai);
			addShoupai.push(pai);
		}
		return addShoupai;
	};

	this.addPai = function (id) {
		var pai = this.createFullPai(id);
		pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
		var shouPaiList = this.getShouPaiList();
		shouPaiList.push(pai);
		return pai;
	};
};

var wlmjReplayPai = function wlmjReplayPai() {
	this.puhuaList = [];
	this.getSlipceID = function (isSelf, chiID) {
		return chiID;
	};

	this.replayChupai = function (paiID) {
		var handPaiList = this.getShouPaiList();
		var spliceIndex = handPaiList.findIndex(function (item) {
			return item.id == paiID;
		});
		spliceIndex = spliceIndex == -1 ? 0 : spliceIndex;
		var chuPai = handPaiList.splice(spliceIndex, 1)[0];
		this.daPaiOutList.push(chuPai);
		return chuPai;
	};

	//从pai obj中移出pai
	this.chuPai = function (udid, paiID) {
		return this.replayChupai(paiID);
	};
	this.cleanReplayData = function () {};

	this.setShouPai = function (paiList) {
		var shouPaiList = this.getShouPaiList();
		var addShoupai = [];
		for (var i = 0; i < paiList.length; i++) {
			var pai = this.createPai(paiList[i]);
			pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			shouPaiList.push(pai);
			addShoupai.push(pai);
		}
		return addShoupai;
	};

	this.addPai = function (id) {
		var pai = this.createFullPai(id);
		pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
		var shouPaiList = this.getShouPaiList();
		shouPaiList.push(pai);
		return pai;
	};
};

//添加继承 
hymjPai.prototype = new paiObjCls();
wlmjPai.prototype = new paiObjCls();
hymjReplayPai.prototype = new paiObjCls();
wlmjReplayPai.prototype = new wlmjPai();

module.exports = {
	new: function _new() {
		var isReplay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		var dfDataList = {};
		dfDataList[gameConst.gameType.maJiangWenLing + "false"] = wlmjPai;
		dfDataList[gameConst.gameType.maJiangHuangYan + "false"] = hymjPai;
		dfDataList[gameConst.gameType.maJiangWenLing + "true"] = wlmjReplayPai;
		dfDataList[gameConst.gameType.maJiangHuangYan + "true"] = hymjReplayPai;
		var curGameType = fun.db.getData('RoomInfo').GameType;
		isReplay = isReplay + "";
		var curMjSys = dfDataList[curGameType + isReplay];
		var paiObj;
		if (curMjSys) {
			paiObj = new curMjSys();
			paiObj.init();
		} else {
			fun.log("mj", "mjPlayerPai new : curGameType: " + curGameType + "isReplay:" + isReplay + " has no defined");
		}
		return paiObj;
		// return new paiObjCls(paiList);
	}
};

cc._RF.pop();