(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/common/mjReconnectMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cfc4378vqlEEImhNIYypZLk', 'mjReconnectMgr', __filename);
// mahjong/script/game/common/mjReconnectMgr.js

"use strict";

var ReconnectMgr = {};
// var NetMessageMgr   = require("NetMessageMgr");
// var NetProtocolList = require("NetProtocolList");

var GameDefine = require("mjGameDefine");

var log = cc.log;

ReconnectMgr.initLoginData = function (data) {
	this.roomId = data.RoomId || 0;
	this.needEnterRoom = data.RoomId != 0;
	this.reconneting = data.RoomId != 0;
};

ReconnectMgr.addPaiListener = function () {
	var mjNetMgr = require("mjNetMgr");
	mjNetMgr.getIns().addRebNet(mjNetMgr.KEYS.REB, this);
};

ReconnectMgr.rmPaisyncListener = function () {
	var mjNetMgr = require("mjNetMgr");
	mjNetMgr.getIns().rmNet(mjNetMgr.KEYS.REB);
};

ReconnectMgr.initDeskPaiData = function (paiData) {
	this.rmPaisyncListener();
	this.needSetPaiju = true;
	this.deskPaiData = paiData.Infos;
};

ReconnectMgr.wlReconnected = function (paiData) {
	this.deskPaiData = paiData;
	this.setWLPaiData();
	this.startPlay();
};

ReconnectMgr.setWLPaiData = function () {
	var gameManager = require("mjGameManager");
	var mjDataMgr = require("mjDataMgr");
	var GameDefine = require("mjGameDefine");
	var mUid = mjDataMgr.get(mjDataMgr.KEYS.UID);

	var startPai = {};
	var paiData = this.deskPaiData;
	startPai.TileCount = [];
	//
	var dadePai = [];
	var pengPai = [];
	var gangPai = [];
	var fanPai = [];

	//peng and chi belong to pengPai;


	for (var UserId in paiData.Players) {
		// cc.log("----------------reconnect ------------UserId:"+ UserId,  paiData.Players[UserId], gameManager.getplayerByUserID(UserId));
		var idx = parseInt(gameManager.getplayerByUserID(UserId).PlayerIdx);
		var paiInfo = paiData.Players[UserId];
		var len = paiInfo.Hand.shift();
		if (paiInfo.Mo) {
			paiInfo.Hand.push(paiInfo.Mo);
		}
		startPai.TileCount[idx] = len;
		if (UserId == mUid) {
			startPai.Tiles = paiInfo.Hand;
		}
		dadePai[idx] = paiInfo.Da || [];
		fanPai[idx] = paiInfo.Fan || [];
		var pengList = [];
		var gangList = [];
		paiInfo.Chi = paiInfo.Chi || [];
		paiInfo.Peng = paiInfo.Peng || [];

		paiInfo.Chi.forEach(function (chiItem) {
			var lastIdx = (idx + 3) % 4;
			pengList.push({ pId: lastIdx, data: chiItem });
		});

		paiInfo.Peng.forEach(function (pengItem) {
			var lastIdx = (idx + 2) % 4;
			pengList.push({ pId: lastIdx, data: [pengItem, pengItem, pengItem] });
		});
		pengPai[idx] = pengList;

		paiInfo.AnGang = paiInfo.AnGang || [];
		paiInfo.AnGang.forEach(function (gangItem) {
			gangList.push({ pId: idx, data: [gangItem, gangItem, gangItem, gangItem], type: GameDefine.EATPAI_TYPE.AnGang });
		});
		paiInfo.MingGang = paiInfo.MingGang || [];
		paiInfo.MingGang.forEach(function (gangItem) {
			gangList.push({ pId: idx, data: [gangItem, gangItem, gangItem, gangItem] });
		});
		gangPai[idx] = gangList;

		// var gangList = paiInfo.AnGang || [];
		// gangList = gangList.concat(paiInfo.MingGang)
		// gangPai.push(gangList);
	}

	this.isBegin = false;
	var roomInfo = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
	gameManager.fapaiMo = true;
	gameManager.initStartPai(startPai);
	gameManager.zhuangNotify({ UserId: paiData.Zhuang, Round: roomInfo.Round, Quan: roomInfo.Quan });
	gameManager.CaiShenPai = paiData.CaiShen;
	gameManager.ReconnentData = {};
	gameManager.ReconnentData.paiOutList = dadePai;
	gameManager.ReconnentData.pengPai = pengPai;
	gameManager.ReconnentData.gangPai = gangPai;
	gameManager.ReconnentData.fanPai = fanPai;
	gameManager.ReconnentData.ChuPlayer = gameManager.getplayerByUserID(paiData.LastCard.UserId).PlayerIdx;
	gameManager.ReconnentData.ChuStatus = paiData.LastCard.Type;
	gameManager.ReconnentData.CurrentChuTile = paiData.LastCard.Card;
	// fun.event.dispatch("resetReportData", []);
	gameManager.ReconnentData.weiCount = 0; //paiData.LeftGangTileCount;
	gameManager.ReconnentData.reSetLeft = paiData.Left;
};

ReconnectMgr.setNormalPaiData = function () {
	var gameManager = require("mjGameManager");
	var mjDataMgr = require("mjDataMgr");
	var startPai = {};
	var paiData = this.deskPaiData;
	startPai.TileCount = [];
	startPai.Tiles = paiData.SelfCurrentTiles;
	var dadePai = [];
	var pengPai = [];
	var gangPai = [];
	var totalOutPai = 0;

	//peng and chi belong to pengPai;
	for (var k in paiData.TileInfos) {
		var paiInfo = paiData.TileInfos[k];
		startPai.TileCount.push(paiInfo.HandTileCount);
		paiInfo.ChuTilesInfo = paiInfo.ChuTilesInfo || [];
		dadePai.push(paiInfo.ChuTilesInfo);
		totalOutPai += paiInfo.ChuTilesInfo.length;
		var pengList = [];
		if (paiInfo.ZHInfo.chi) {
			totalOutPai += paiInfo.ZHInfo.chi.length;
			pengList = pengList.concat(paiInfo.ZHInfo.chi);
		}
		if (paiInfo.ZHInfo.peng) {
			totalOutPai += paiInfo.ZHInfo.peng.length;
			pengList = pengList.concat(paiInfo.ZHInfo.peng);
		}
		pengList.sort(function (a, b) {
			return a.order - b.order;
		});
		pengPai.push(pengList);
		var gangList = [];
		if (paiInfo.ZHInfo.minggang) {
			totalOutPai += paiInfo.ZHInfo.minggang.length;
			fun.utils.forEach(paiInfo.ZHInfo.minggang, function (item) {
				item.type = GameDefine.EATPAI_TYPE.MingGang1;
			});
			gangList = gangList.concat(paiInfo.ZHInfo.minggang);
		}
		if (paiInfo.ZHInfo.angang) {
			totalOutPai += paiInfo.ZHInfo.angang.length;
			fun.utils.forEach(paiInfo.ZHInfo.angang, function (item) {
				item.type = GameDefine.EATPAI_TYPE.AnGang;
			});
			gangList = gangList.concat(paiInfo.ZHInfo.angang);
		}
		gangList.sort(function (a, b) {
			return a.order - b.order;
		});
		gangPai.push(gangList);
	}

	// this.isBegin = (totalOutPai == 0);
	this.isBegin = false;
	gameManager.initStartPai(startPai);
	gameManager.CaiShenPai = [paiData.JokerTile];
	gameManager.meDirection = paiData.SelfFeng;
	gameManager.ReconnentData = {};
	var leftPaiCount = paiData.LeftShuTileCount + paiData.LeftShengTileCount + paiData.LeftGangTileCount;
	gameManager.ReconnentData.reSetLeft = leftPaiCount;
	gameManager.ReconnentData.weiCount = paiData.LeftGangTileCount;
	gameManager.ReconnentData.paiOutList = dadePai;
	gameManager.ReconnentData.pengPai = pengPai;
	gameManager.ReconnentData.gangPai = gangPai;
	gameManager.ReconnentData.ChuPlayer = paiData.ChuPlayer;
	gameManager.ReconnentData.ChuStatus = paiData.ChuStatus;
	gameManager.ReconnentData.CurrentChuTile = paiData.CurrentChuTile;
	var curReportData = this.getReportData(paiData.AllZhanJiInfo);
	// gameManager.playCount                    = paiData.FinishGameCount  || 0;
	var roomInfo = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
	roomInfo.Quan = paiData.FinishGameCount || 0;
	roomInfo.Round = curReportData.length + 1;
	fun.event.dispatch("resetReportData", curReportData);
	gameManager.initGameCount();
	if (paiData.LeftShuTileCount == 0) {
		gameManager.onPaiTimeChange({ Time: 1 });
	}
	gameManager.refrePlayerXdhs(curReportData);
};

ReconnectMgr.getDeskPaiData = function () {
	return this.deskPaiData;
};

ReconnectMgr.isReconneting = function () {
	return this.reconneting;
};
ReconnectMgr.reConnectEnd = function () {
	this.reconneting = false;
	this.needSetPaiju = false;
};

ReconnectMgr.isNeedSetPaiju = function () {
	cc.log("----isNeedSetPaiju----this.needSetPaiju;--", this.needSetPaiju);
	return this.needSetPaiju;
};

ReconnectMgr.checkGotoRoom = function () {
	return this.needEnterRoom;
};

ReconnectMgr.getRoomID = function (sendFucn, env) {
	return this.roomId;
};

ReconnectMgr.enteredRoom = function () {
	this.needEnterRoom = false;
};

ReconnectMgr.checkPaiData = function () {};

ReconnectMgr.startPlay = function () {
	var gameManager = require("mjGameManager");
	this.newRound();
	gameManager.reSetResidue();
	gameManager.reSetDadePai();
	gameManager.reSetPengGangPai();
	gameManager.reSetPlayerStatus();
	gameManager.reserFanPai();
};

//equal to gameManager newRound
ReconnectMgr.newRound = function () {
	var gameManager = require("mjGameManager");
	gameManager.initRoundData();
	gameManager.gameUICB.setCaiShenPai(gameManager.CaiShenPai);
	gameManager.faPaiNoAnim(this.isBegin);
	gameManager.gameUICB.showReduceNode();
};

/*------------------- START -------IN  GameUI Reconnect -----------------*/

ReconnectMgr.reConnectInGameUI = function () {
	// var UserLocalData = require("UserLocalData");
	// NetMessageMgr.send(UserLocalData.CurloginID, UserLocalData.CurloginData, undefined, true, "重新连接中……");
};

ReconnectMgr.addReconentMessageCB = function () {
	var mjNetMgr = require("mjNetMgr");
	mjNetMgr.getIns().addReaNet(mjNetMgr.KEYS.REA, this);
};

ReconnectMgr.rmReconentMessageCB = function () {
	var mjNetMgr = require("mjNetMgr");
	mjNetMgr.getIns().rmNet(mjNetMgr.KEYS.REA);
};

ReconnectMgr.loginEnd = function (data) {
	// var gameManager     = require("mjGameManager");
	// if(data.RetCode && (data.RetCode == 3 || data.RetCode == 1)){
	//        fun.utils.restart();
	//        return 
	//    }
	//    var errorCB = function(errorTip){
	//    	errorTip = errorTip || "房间不存在";
	//    	NetMessageMgr.showTips(errorTip);
	//    	setTimeout(function(){
	//    		gameManager.exiteRoom();
	//    	}, 1000);
	//    }
	//    var roomID    = data.RoomId;
	//    if(!roomID || roomID < 1){
	//    	errorCB();
	//    	return
	//    }

	// var UserLocalData   = require("UserLocalData");
	// var mjDataMgr = require("mjDataMgr");
	// mjDataMgr.set(mjDataMgr.KEYS.ROOMID, roomID);
	//    var sendData = {
	//        PlayerID : UserLocalData.getUserID(),//玩家帐号
	//        RoomID   : roomID,//房间id
	//    }
	//    NetMessageMgr.send(NetProtocolList.EnterRoomMessageNum.netID, sendData, errorCB, true, "重新连接中……");
};

ReconnectMgr.inGmaeEnteredRoom = function (data) {
	var gameManager = require("mjGameManager");
	var mjDataMgr = require("mjDataMgr");
	var roomInfo = data.RoomInformation;
	roomInfo.RoomID = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
	mjDataMgr.set(mjDataMgr.KEYS.ROOMID, roomInfo.RoomID);
	mjDataMgr.set(mjDataMgr.KEYS.ROOMINFO, roomInfo);
	mjDataMgr.getInstance().initRoomPlayers(data.PlayersInfo);
	for (var destPos = 0; destPos < 4; destPos++) {
		var player = gameManager.playerList[destPos];
		player.refreshData();
		player.initPlayerStatus();
	}
};

//在房间内重连
ReconnectMgr.inGmaeSyncData = function (paiData) {
	cc.log("---//在房间内重连-----", paiData);
	this.deskPaiData = paiData.Infos;
	this.setNormalPaiData();
	this.startPlay();
};

ReconnectMgr.getReportData = function (allzj) {
	var gameManager = require("mjGameManager");
	allzj = allzj || [];
	gameManager.gameJuCount = allzj.length;
	if (allzj.length < 1) {
		return allzj;
	}
	var zhuangIndex = 0;
	allzj[0][zhuangIndex].isZhuangJia = true;
	if (allzj.length > 1) {
		for (var i = 1; i < allzj.length; i++) {
			var lastZhuang = allzj[i - 1][zhuangIndex];
			var isWin = lastZhuang.ishu || lastZhuang.iszm;
			if (!isWin) {
				zhuangIndex = (zhuangIndex + 1) % 4;
			}
			allzj[i][zhuangIndex].isZhuangJia = true;
		}
	}

	return allzj;
};

/*--------------------- END -----IN  GameUI Reconnect -----------------*/

module.exports = ReconnectMgr;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=mjReconnectMgr.js.map
        