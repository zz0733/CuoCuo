(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/common/mjGameManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ff61bGIi9tGsaKbd6JI2r/u', 'mjGameManager', __filename);
// mahjong/script/game/common/mjGameManager.js

"use strict";

/******
 *麻将游戏
 * 事件管理
 数据驱动部分
 再分发ui渲染
 ******/
var GameDefine = require("mjGameDefine");
// var NetMessageMgr   = require("NetMessageMgr");
////var Audio.           = require("Audio");
// var NetProtocolList = require("NetProtocolList");
var ReconnectMgr = require("mjReconnectMgr");
var mjNetMgr = require("mjNetMgr");
var mjDataMgr = require("mjDataMgr");
var log = cc.log;

// var FromPhone       = require("FromPhone");


var GameManager = {};
//初始化数据
GameManager.initGame = function (playerDeskList, gameUICB) {
	this.gameUICB = gameUICB;
	this.cleanData();
	this.leftPai = mjDataMgr.get(mjDataMgr.KEYS.CFG).totalPai;
	this.initGameCount();
	this.initPlayerData(playerDeskList);
	this.initMessage();
	this.initPhoneStatus();
	this.addDt = 0;
	this.faPaiPer = 0.2;
	this.inFaPai = false;
	this.reconnetCount = 0;
	this.setBtnBackVisi(false);
};

GameManager.reSetPlayerStatus = function () {
	var pos = this.ReconnentData.ChuPlayer;
	var deskType = mjDataMgr.get(mjDataMgr.KEYS.POSIDS)[pos];
	var player = this.playerList[pos];
	this.curPlayer = player;
	this.daPaiPlayer = player;
	this.gameUICB.setCurPaiDirection(player.getDirection());
	this.lastChuPaiDir = deskType;
	this.curPlayer = player;
	this.lastChuPaiID = this.ReconnentData.CurrentChuTile;
	player.setGameStatus(this.ReconnentData.ChuStatus);
	// this.chuPaiCount
	player.reSetDapaiData(this.ReconnentData.CurrentChuTile);
};

GameManager.initGameCount = function () {
	mjDataMgr.getInstance().refreRoomCount();
	var roomInfo = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
	this.gameUICB.setGameCount(roomInfo.gameCountStr);
	// this.gameUICB.hideRoomOptBtn();
};

GameManager.onDestroy = function () {
	this.cleanData();
	this.cleanMessage();
};

GameManager.onNetClose = function () {
	// this.reconnetCount += 1;
	// if(this.reconnetCount > 10){
	// 	NetMessageMgr.showRestartTips();
	// 	return;
	// }
	// if(this.reconnetCount > 1) {
	// 	NetMessageMgr.showTips("正在与服务器重连中,第 ["+this.reconnetCount + "/10] 次, 请等待", true)
	// }
	// NetMessageMgr.connect();

};

GameManager.onNetOpen = function () {
	this.reconnetCount = 0;
	var ReconnectMgr = require("mjReconnectMgr");
	ReconnectMgr.reConnectInGameUI();
};

GameManager.initMessage = function () {
	if (this.needNetWork()) {}
	// NetMessageMgr.addCloseCB(this.onNetClose, this);
	// NetMessageMgr.addOpenCB(this.onNetOpen, this);

	// var ReconnectMgr    = require("mjReconnectMgr");
	// ReconnectMgr.addReconentMessageCB();
	mjNetMgr.getIns().addGameNet(mjNetMgr.KEYS.GAME, this);
};

GameManager.cleanMessage = function () {
	mjNetMgr.getIns().rmNet(mjNetMgr.KEYS.GAME);
	// NetMessageMgr.rmCloseCB();
	// NetMessageMgr.rmOpenCB();
	// var ReconnectMgr    = require("mjReconnectMgr");
	// ReconnectMgr.rmReconentMessageCB();
};

GameManager.initPhoneStatus = function () {
	// //FromPhone.addStatusListener("Battery", {cb:this.onBatteryChange, env : this});
	// //FromPhone.addStatusListener("Net", {cb:this.onPhoneNetChange, env : this});
};

GameManager.initRoundData = function () {
	this.faPaiAnimEndList = [{ f: this.reCheckBuHua, stop: false }];
	this.isRoundIsOver = false;
	this.daPaiPlayer = undefined;
	this.inFaPai = false;
	this.totalReduce = 0;
	this.isShengPai = false;
	this.refreResidue(0);
	this.isPlaying = true;
	this.ShowHuaList = [];
	this.ShowBuHua = {};
	this.leftPai = mjDataMgr.get(mjDataMgr.KEYS.CFG).totalPai;
	// this.paiResultList = {};
	this.bindUserDirection();
	this.gameUICB.gameStart();
	this.liujupaiCount = mjDataMgr.get(mjDataMgr.KEYS.CFG).liujupai;
	this.setBtnBackVisi(true);
	for (var k in this.playerDeskList) {
		this.playerDeskList[k].getComponent("mjPlayerUI").hideWaitName();
	}
	for (var i in this.playerList) {
		var player = this.playerList[i];
		player.initRound();
		player.initPlayerStatus();
		// player.playerNode.active = true;
		// this.refrePlayerStatus(player, player.playerStatus);
	}
	this.initGameCount();
};

//发牌新一轮
GameManager.newRound = function (paiData) {
	this.isStartAnim = true;
	this.initRoundData();
	for (var i in this.playerList) {
		var player = this.playerList[i];
		player.setShouPai(this.startPaiData[i]);
		player.onFaPaiStart();
	}
	this.gameUICB.newRound({ saizi: this.saiziData });
};

GameManager.onFaPaiAnimEnd = function () {
	this.gameUICB.setCaiShenPai(this.CaiShenPai);
	this.gameUICB.showCaiShenAnim();
	// NetMessageMgr.reSendMessage();
};

GameManager.onKaishiAnimEnd = function () {
	this.isStartAnim = false;
	this.gameUICB.hidePaiHitzone();
	if (this.startOptData) {
		this.showEatUI(this.startOptData);
		this.startOptData = undefined;
	}
	var meIndex = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
	var mePlayer = this.playerList[meIndex];
	if (mePlayer.isZhuangJia()) {
		this.gameUICB.showChupaiTips();
	}
	for (var i in this.playerList) {
		var player = this.playerList[i];
		player.faPaiEnd();
	}
	this.turnToNextPlayer(this.curPlayer);
	this.daPaiPlayer = this.curPlayer;
	for (var _i = 0; _i < this.faPaiAnimEndList.length; _i++) {
		var excFucn = this.faPaiAnimEndList[_i].f;
		excFucn.call(this);
		if (this.faPaiAnimEndList[_i].stop) {
			break;
		}
	}
	this.faPaiAnimEndList = [];
};

// GameManager.showBuhuaAnim = function(){
// 	log("---showBuhuaAnim--2--", this.ShowHuaList.slice());

// 	log("---showBuhuaAnim---1-", this.ShowHuaList.slice());
// }


GameManager.reCheckBuHua = function () {
	if (this.ShowHuaList.length > 0) {
		var reBuhuaUpdate = function reBuhuaUpdate() {
			if (this.ShowHuaList.length > 0) {
				var huaData = this.ShowHuaList.shift();
				huaData.player.showPaiOnBegin(huaData);
				this.refreResidue(huaData.showData.length);
			} else {
				clearInterval(this.ShowHuaTag);
			}
		};
		this.ShowHuaTag = setInterval(reBuhuaUpdate.bind(this), 800);
	}
};

GameManager.cleanData = function () {
	this.isVoteOut = false;
	this.isPlaying = false;
	this.gameUICB.hdieReduceNode();
	this.cleanRoundData();
};

GameManager.cleanRoundData = function () {
	this.fapaiMo = undefined;
	this.startPaiData = undefined;
	this.meDirection = undefined;
	this.CaiShenPai = undefined;
	this.curChuPaiUdid = undefined;
	this.lastChuPaiDir = undefined;
};

GameManager.cleanPlayerPaiData = function () {
	for (var k in this.playerList) {
		var player = this.playerList[k];
		player.cleanPaiData();
	}
	this.cleanRoundData();
};

//设置中间的轮盘数据
GameManager.bindUserDirection = function () {
	var myDirection = this.meDirection;
	var DirectType = GameDefine.DIRECTION_TYPE;
	//because in main.fire Nan feng point to  the xia desk;
	var directionList = [];
	directionList.push(DirectType.NAN);
	directionList.push(DirectType.XI);
	directionList.push(DirectType.BEI);
	directionList.push(DirectType.DONG);
	var meDirIndex = directionList.findIndex(function (x) {
		return x == myDirection;
	});
	//先隐藏节点
	this.gameUICB.roDirectionNode(meDirIndex * 90);
	var deskType = GameDefine.DESKPOS_TYPE;
	this.saiziData = {};
	this.saiziData.playCount = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Round;
	var meDeskPos = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
	for (var i = 0; i < 4; i++) {
		var destPos = (meDeskPos + i) % 4;
		var dirIndex = (meDirIndex + i) % 4;
		var direction = directionList[dirIndex];
		var player = this.playerList[destPos];
		if (player) {
			player.setDirection(direction);
			this.saiziData[direction] = player;
		}
	}
	cc.log(this.saiziData, " saizi data");
	this.gameUICB.setCurPaiDirection(DirectType.DONG);
	this.zhuangIdx = parseInt(this.saiziData[DirectType.DONG].PlayerIdx);
	this.curPlayer = this.playerList[this.zhuangIdx];
};

//做事轮盘方向
GameManager.initDirectionNodeList = function () {
	var DirectionType = GameDefine.DIRECTION_TYPE;
	var nodeList = {};
	nodeList[DirectionType.DONG] = this.gameUICB.getCurDirectionN("dong");
	nodeList[DirectionType.XI] = this.gameUICB.getCurDirectionN("xi");
	nodeList[DirectionType.NAN] = this.gameUICB.getCurDirectionN("nan");
	nodeList[DirectionType.BEI] = this.gameUICB.getCurDirectionN("bei");
	this.directionNodeList = nodeList;
};

//给牌排序
GameManager.sortGroupPai = function (groupPai) {
	var self = this;
	groupPai.sort(function (a, b) {
		var aSort = self.getSortId(a);
		var bSort = self.getSortId(b);
		return aSort - bSort;
	});
	return groupPai;
};

GameManager.ShowPaiNotify = function (data) {
	var player = this.getPlayerByPaiData(data);
	if (this.isStartAnim) {
		var fIndex = this.ShowHuaList.findIndex(function (item) {
			return item.player == player;
		});
		if (fIndex != -1) {
			this.ShowHuaList[fIndex].showData.push(data);
		} else {
			this.ShowHuaList.push({ player: player, showData: [data] });
		}
	} else {
		player.showPai(data.Card);
		this.refreResidue(1);
		player.showBuHuaAnim();
	}
};

GameManager.BuPaiNotify = function (data) {
	var player = this.getPlayerByPaiData(data);
	if (this.isStartAnim) {
		var fIndex = this.ShowHuaList.findIndex(function (item) {
			return item.player == player;
		});
		this.ShowHuaList[fIndex].buData = this.ShowHuaList[fIndex].buData || [];
		this.ShowHuaList[fIndex].buData.push(data);
		return;
	}
	player.buPai(data.Card);
};

GameManager.getSortId = function (id) {
	var sortId = mjDataMgr.getInstance().isBaiBan(id) ? this.CaiShenPai[0] : id;
	sortId = this.isCaiShenPai(id).isMagic ? -1 : sortId;
	return sortId;
};

GameManager.creatPlayer = function (playerIndx) {
	var playerSys = require("mjPlayer");
	var deskType = mjDataMgr.get(mjDataMgr.KEYS.POSIDS)[playerIndx];
	var playerNode = this.playerDeskList[deskType];
	var player = playerSys.new();
	player.init(playerNode, deskType, this.gameUICB);
	player.setPlayerIdx(playerIndx);
	player.refreshData();
	player.initPlayerStatus();
	this.playerList[playerIndx] = player;
};

//设置座位上的玩家数据
GameManager.initPlayerData = function (playerDeskList) {
	this.playerList = {};
	this.playerDeskList = playerDeskList;
	var players = mjDataMgr.get(mjDataMgr.KEYS.PLAYERS);
	for (var idx in players) {
		this.creatPlayer(idx);
	}
};

// /* ---------------- Start Net Message --------------------------*/
//当玩家进入房间
GameManager.onUserEnterRoom = function (playerInfo, PlayerIdx) {
	cc.YL.info("玩家进入房间onUserEnterRoom");
	playerInfo.OnLine = true;
	mjDataMgr.getInstance().setPlayerData(playerInfo, PlayerIdx);
	this.creatPlayer(PlayerIdx);
};

GameManager.onRingAddNum = function (data) {
	mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Quan += 1;
	this.initGameCount();
};

//解散房间
GameManager.DissolveRoomNotice = function () {
	if (mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Round > 0) {
		this.gameUICB.showTotalReport();
		return;
	}
	var content = "房间已经被解散";
	fun.event.dispatch('MinSingleButtonPop', { contentStr: content, okCb: this.exiteRoom, hideCloseBtn: true });
};

//退出房间通知
GameManager.exitRoomNoticeIdx = function (data) {
	var PlayerIdx = data.PlayerIdx;
	mjDataMgr.getInstance().setPlayerData(undefined, PlayerIdx);
	var player = this.playerList[PlayerIdx];
	player.refreshData();
	delete this.playerList[player.PlayerIdx];
};

//退出房间通知wl
GameManager.exitRoomNoticeUserid = function (data) {
	cc.log("-GameManager.exitRoomNoticeUserid ---", data);
	var player = this.getplayerByUserID(data.UserId);
	mjDataMgr.getInstance().setPlayerData(undefined, player.PlayerIdx);
	player.refreshData();
	delete this.playerList[player.PlayerIdx];
};

GameManager.onDisbandRoomVoteIn = function (data) {
	this.gameUICB.updateVotingData(data);
};

GameManager.onDisbandRoomResultIn = function (data) {
	if (data.Disbanded) {
		this.DissolveRoomNotice();
	}
	this.gameUICB.removeVotingPop();
};

GameManager.prepareNoticeMessage = function (data) {
	var player = this.getPlayerByPaiData(data);
	mjDataMgr.getInstance().getPlayerData(player.PlayerIdx).Status = GameDefine.PLAYER_READY.READY;
	player.initPlayerStatus();
	fun.event.dispatch("selfReady", {});
};

GameManager.isCaiShenPai = function (paiID) {
	var isMagicPai = this.CaiShenPai.findIndex(function (id) {
		return id == paiID;
	}) > -1;
	var roomInfo = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
	var isWL = false; //(roomInfo.GameType == gameConst.gameType.maJiangWenLing);
	var caishenInfo = { isMagic: isMagicPai };
	caishenInfo.isCaiShen = isMagicPai && !isWL;
	caishenInfo.isBaiDa = isMagicPai && isWL;
	return caishenInfo;
};

GameManager.initReplayPai = function (paiData) {
	this.startPaiData = paiData;
};

GameManager.initStartPai = function (paiData) {
	cc.YL.info("黄岩麻将开始发牌initStartPai");
	var totalList = paiData.TileCount;
	this.startPaiData = [];
	var meDeskIndex = mjDataMgr.getInstance().get(mjDataMgr.KEYS.SELFID);
	for (var i in this.playerList) {
		this.startPaiData[i] = new Array(totalList[i]);
	}
	this.startPaiData[meDeskIndex] = paiData.Tiles;
};

GameManager.zhuangNotify = function (data) {
	// this.isStartFaPai  = true;
	this.zhuangIdx = parseInt(this.getplayerByUserID(data.UserId).PlayerIdx);
	var meIdx = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
	// GameDefine.DIRECTION_TYPE
	var dirList = [51, 52, 53, 54]; //dong nan xi bei
	for (var i = 0; i < dirList.length; i++) {
		var tempIdx = (i + this.zhuangIdx) % dirList.length;
		if (tempIdx == meIdx) {
			this.meDirection = dirList[i];
			break;
		}
	}
	var roomInfo = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
	roomInfo.Quan = data.Quan;
	roomInfo.Round = data.Round;
	this.initGameCount();
};

//isJustBegin 是否是刚开始莫玩牌
GameManager.faPaiNoAnim = function (isJustBegin) {
	var fapaiCount = 0;
	for (var i in this.playerList) {
		var player = this.playerList[i];
		fapaiCount += this.startPaiData[i].length;
		player.setShouPai(this.startPaiData[i]);
		player.faPaiEnd();
		if (player.isXiaDesk() && isJustBegin && player.isZhuangJia()) {
			this.gameUICB.showChupaiTips();
		}
	}
	// cai shen pai
	fapaiCount += 1;
	this.refreResidue(fapaiCount);
};

GameManager.update = function (dt) {
	if (!this.inFaPai) {
		return;
	}
	this.addDt += dt;
	if (this.addDt > this.faPaiPer) {
		this.addDt -= this.faPaiPer;
		this.nextFaPai();
	}
};

//有发牌动画
GameManager.faPaiWithAnim = function () {
	this.inFaPai = true;
	this.faPaiPerCount = 4;
	this.addDt = 0;
	this.lastFaPaiPlayer = undefined;
	this.fapaiPIndex = 0;
	this.playerArray = [];
	for (var k in this.playerList) {
		this.playerArray.push(this.playerList[k]);
	}

	this.gameUICB.showPaiHitzone();
	var maxLen = 0;
	this.startPaiData.forEach(function (item, index) {
		if (item.length > maxLen) {
			this.fapaiPIndex = index;
			maxLen = item.length;
		}
	}.bind(this));
	this.nextFaPai();
};

GameManager.faPaiEnd = function () {
	var gaiTime = 0.6;
	var self = this;
	for (var i in this.playerList) {
		var player = this.playerList[i];
		player.gaiAllPai();
	}
	setTimeout(function () {
		for (var _i2 in self.playerList) {
			var player = self.playerList[_i2];
			player.uprightPai();
		}
	}, gaiTime * 1000);
	this.refreResidue(1);
	this.inFaPai = false;
	setTimeout(function () {
		self.onFaPaiAnimEnd();
	}, 1000);
};

GameManager.nextFaPai = function () {
	if (!this.startPaiData) {
		return;
	}
	var playerIndx = this.playerArray[this.fapaiPIndex].PlayerIdx;
	this.fapaiPIndex = (this.fapaiPIndex + 1) % this.playerArray.length;
	this.faPaiPerCount = this.startPaiData[playerIndx].length > 4 ? 4 : this.startPaiData[playerIndx].length;
	if (this.faPaiPerCount < 1) {
		this.faPaiEnd();
		return;
	}
	require('Audio').playEffect("mahjong", "mahjong.mp3");
	var paiData = []; //this.startPaiData
	for (var i = 0; i < this.faPaiPerCount; i++) {
		var pai = this.startPaiData[playerIndx].pop();
		paiData.push(pai);
	}
	this.refreResidue(this.faPaiPerCount);
	var player = this.playerList[playerIndx];
	player.faPai(paiData, true);
	if (this.lastFaPaiPlayer) {
		this.lastFaPaiPlayer.uprightPai();
	}
	this.lastFaPaiPlayer = player;
};

GameManager.refreResidue = function (reduce) {
	this.totalReduce += reduce;
	this.leftPai = mjDataMgr.get(mjDataMgr.KEYS.CFG).totalPai - this.totalReduce;
	//本地出错了，导致小于0， 重新连接发牌
	if (this.leftPai < 0) {
		fun.net.close();
	}
	this.gameUICB.refreResidue(this.leftPai);
};

//刷新这几局中玩家的相对胡数
GameManager.refrePlayerXdhs = function (ReportData) {
	cc.log(ReportData, "ReportData");
	var mjDataMgr = require("mjDataMgr");
	var xdhsList = [0, 0, 0, 0];
	fun.utils.forEach(ReportData, function (item) {
		for (var i = 0; i < item.length; i++) {
			xdhsList[i] += item[i].xdhs;
		}
	});
	for (var i in this.playerList) {
		if (mjDataMgr.getInstance().getPlayerData(i)) {
			mjDataMgr.getInstance().getPlayerData(i).xdhs = xdhsList[i] || 0; // xdhsList[i] += item[i].xdhs;
			var player = this.playerList[i];
			player.refreshData();
		}
	}
};

GameManager.showChoosePai = function (paiID) {
	for (var i in this.playerList) {
		var player = this.playerList[i];
		player.showSamePaiTips(paiID);
	}
};

GameManager.showLiuJuAnim = function () {
	require('Audio').playEffect("mahjong", "result_null.mp3");
	this.gameUICB.showLiujuEffect();
};

GameManager.reSetResidue = function () {
	this.leftPai = this.ReconnentData.reSetLeft;
	this.totalReduce = mjDataMgr.get(mjDataMgr.KEYS.CFG).totalPai - this.leftPai;
	this.liujupaiCount = this.ReconnentData.weiCount;
	this.gameUICB.refreResidue(this.leftPai);
};

GameManager.reSetPengGangPai = function () {
	var gangPai = this.ReconnentData.gangPai;
	var pengPai = this.ReconnentData.pengPai;
	for (var i in this.playerList) {
		var player = this.playerList[i];
		var gangList = this.ReconnentData.gangPai[i];
		var pengList = this.ReconnentData.pengPai[i];
		player.resetPengGangPai(gangList, pengList);
	}
};

GameManager.reSetDadePai = function () {
	var paiOutList = this.ReconnentData.paiOutList;
	for (var i in this.playerList) {
		var player = this.playerList[i];
		player.addPaiOutList(paiOutList[i]);
	}
};

GameManager.reserFanPai = function () {
	var fanPaiList = this.ReconnentData.fanPai || [];
	for (var i in this.playerList) {
		var player = this.playerList[i];
		player.resetFanPai(fanPaiList[i]);
	}
};

GameManager.addLiujuCount = function () {
	this.liujupaiCount += 1;
};

//摸牌
GameManager.MoPaiNotice = function (data) {
	this.refreResidue(1);
	var destPos = data.PlayerIdx;
	//netID 102 没有推送PlayerIdx数据过来 102是自己摸牌
	if (destPos === undefined) {
		destPos = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
	}
	this.turnToNextPlayer(this.playerList[destPos]);
	this.curPlayer.moPai(data.Atile);
};

//wenling 摸牌
GameManager.WLMoPaiNotice = function (data) {
	var player = this.getplayerByUserID(data.UserId);
	if (this.isFaPaiEnd(data, player)) {
		return;
	}
	this.refreResidue(1);
	this.turnToNextPlayer(player);
	player.moPai(data.Card);
};

GameManager.isFaPaiEnd = function (data, player) {
	if (!this.fapaiMo) {
		this.fapaiMo = true;
		this.startPaiData[player.PlayerIdx].push(data.Card);
		return true;
	}
	return false;
};

//离开房间
GameManager.exiteRoom = function () {
	fun.db.getData('UserInfo').RoomId = 0;
	cc.director.loadScene("hall");
};

//定财神通知
GameManager.caiShengPai = function (data) {
	this.CaiShenPai = data; //data.Atile || data.Card;
};

//玩家出牌
GameManager.turnToChupai = function (pai) {
	this.showChoosePai(-999);
	var content = {};
	content.Atile = pai.id;
	this.curChuPaiUdid = pai.udid;
	if (mjDataMgr.getInstance().canQuickly(pai.id)) {
		this.ChuPai(this.curPlayer, { Atile: pai.id, PlayerIdx: this.curPlayer.PlayerIdx });
	}
	mjNetMgr.cSend("chuPai", content);
	this.gameUICB.hideChupaiTips();
};

//本门风提示
GameManager.benmenFengNotice = function (data) {
	this.meDirection = data.Atile;
	this.newRound();
};

//出牌提示
GameManager.ChuPaiNotice = function (data) {
	var player = this.getPlayerByPaiData(data); //this.playerList[data.PlayerIdx];
	var deskType = player.desPosType;
	if (deskType == GameDefine.DESKPOS_TYPE.XIA && !require("mjReplayMgr").isReplayPai()) {
		return;
	}
	this.ChuPai(player, data);
};

GameManager.ChuPai = function (player, data) {
	this.lastChuPaiDir = player.deskType;
	this.lastChuPaiID = data.Atile;
	player.setGameStatus(GameDefine.TURN_STATUS.WAITOPT);
	this.setLastPaiResult(false);
	this.daPaiPlayer = player;
	player.chuPai(data.Atile, this.curChuPaiUdid);
};

GameManager.getPlayerByPaiData = function (data) {
	if (data.UserId !== undefined) {
		return this.getplayerByUserID(data.UserId);
	}
	if (data.PlayerIdx !== undefined) {
		return this.playerList[data.PlayerIdx];
	}
};

GameManager.paiZuHeReminder = function (data) {
	var optList = fun.utils.getBinaryOpts(data.Opts);
	for (var i = 0; i < optList.length; i++) {
		optList[i].Comb = data.Data;
		optList[i].Atile = data.Atile;
	}
	return optList;
};

//{14 15 [[13 15] [15 16]]}
//别的玩家出牌后，你可以对此牌进行的操作
GameManager.ChuPaiZuHeReminder = function (data) {
	this.eatTag = "chuPai";
	var eatData = this.paiZuHeReminder(data);
	this.showEatUI(eatData);
};

GameManager.MoPaiZuHeReminder = function (data) {
	this.eatTag = "moPai";
	var eatData = fun.utils.getBinaryOpts(data.Opts);
	for (var i = 0; i < eatData.length; i++) {
		eatData[i].Comb = data.Data;
		eatData[i].Atile = data.Atile;
		var curOp = eatData[i].Op;
		if (data.Data && data.Data[curOp]) {
			eatData[i].Atile = data.Data[curOp][0];
		}
	}
	this.showEatUI(eatData);
};

GameManager.showEatUI = function (data) {
	if (this.isStartAnim) {
		this.startOptData = data;
		return;
	}
	this.eatPaiData = data[0];
	if (this.isShowGuo()) {
		//add guo
		data.unshift({ Op: 8 });
	}
	this.gameUICB.showCanEatUI(data);
};

//过牌
GameManager.guoPaiToServer = function () {
	var content = {
		Atile: this.eatPaiData.Atile
	};
	mjNetMgr.cSend("passOpt", content, this.eatTag);
};

//吃牌
GameManager.chiPaiToServer = function (eatData, comb) {
	var content = {
		Atile: eatData.Atile,
		Data: comb
	};
	this.chiPaiData = content;
	mjNetMgr.cSend("chiPaiOpt", content);
};

GameManager.getEatPaiId = function (dataIndex) {
	var paiID;
	if (this.eatTag === "moPai") {
		paiID = this.eatPaiData.Data ? this.eatPaiData.Data[dataIndex] : undefined;
		paiID = paiID !== undefined ? paiID[0] : this.eatPaiData.Atile;
	} else {
		paiID = this.eatPaiData.Atile;
	}
	return paiID;
};

//碰杠胡牌
GameManager.eatPaiToServer = function (eatObj, eatData) {
	this.eatPaiData.Atile = eatData.Atile;
	var content = {
		Atile: eatData.Atile
	};
	mjNetMgr.cSend("optPai", content, eatObj);
};
// 碰牌 AcK
GameManager.PengPaiAckMessage = function (data) {
	if (data.Rst == true) {
		var player = this.playerList[mjDataMgr.get(mjDataMgr.KEYS.SELFID)];
		player.peng(this.eatPaiData.Atile, true);
		// this.paiResultList[this.chuPaiCount] = GameDefine.CHUPAIRESULT.EATED;
		this.turnToNextPlayer(player);
		this.setLastPaiResult(GameDefine.EATPAI_TYPE.PengPai);
	}
};

//某人碰||杠||胡||吃牌了
GameManager.ChuPaiZuHeNotice = function (data) {
	var eatType = fun.utils.getBinaryOpts(data.Opts)[0].Op; //this.getEatTypeList(data.Opts)[0];
	var player = this.getPlayerByPaiData(data); //this.playerList[data.PlayerIdx];
	this.gameUICB.cleanEatUI();
	var meUserId = mjDataMgr.get(mjDataMgr.KEYS.UID);
	var isSelf = data.UserId && meUserId == data.UserId;
	if (!(eatType == GameDefine.EATPAI_TYPE.PuTongHu)) {
		// this.paiResultList[this.chuPaiCount] = GameDefine.CHUPAIRESULT.EATED;
		this.turnToNextPlayer(player);
	}
	//碰牌
	if (eatType === GameDefine.EATPAI_TYPE.PengPai) {
		player.peng(data.Atile, isSelf);
	}
	if (eatType === GameDefine.EATPAI_TYPE.ChiPai) {
		player.chi({ d: data.Data, s: isSelf, card: data.Atile, sheng: this.isShengPai });
	}
	//min gang
	if (eatType === GameDefine.EATPAI_TYPE.MingGang2 || eatType === GameDefine.EATPAI_TYPE.AnGang || eatType === GameDefine.EATPAI_TYPE.MingGang1) {
		player.gang(data.Atile, isSelf, eatType);
	}
	this.setLastPaiResult(eatType);
	this.lastChuPaiData = data;
};

//吃牌的 ACK
GameManager.ChiPaiAckMessage = function (data) {
	if (data.Rst == true) {
		var player = this.playerList[mjDataMgr.get(mjDataMgr.KEYS.SELFID)];
		this.chiPaiData.Data.push(this.chiPaiData.Atile);
		player.chi({ d: this.chiPaiData.Data, s: true, card: this.chiPaiData.Atile, sheng: this.isShengPai });
		this.turnToNextPlayer(player);
	}
};

//明杠牌 ACK
GameManager.MingGang2PaiAckMessage = function (data) {
	if (data.Rst == true) {
		this.gangPaiAck(GameDefine.EATPAI_TYPE.MingGang2);
	}
};

//明杠牌 ACK
GameManager.MingGang1PaiAckMessage = function (data) {
	if (data.Rst == true) {
		this.gangPaiAck(GameDefine.EATPAI_TYPE.MingGang1);
	}
};

GameManager.AnGangPaiAckMessage = function (data) {
	if (data.Rst == true) {
		this.gangPaiAck(GameDefine.EATPAI_TYPE.AnGang);
	}
};

GameManager.gangPaiAck = function (eatType) {
	var player = this.playerList[mjDataMgr.get(mjDataMgr.KEYS.SELFID)];
	player.gang(this.eatPaiData.Atile, true, eatType);
	// this.paiResultList[this.chuPaiCount] = GameDefine.CHUPAIRESULT.EATED;
	this.turnToNextPlayer(player);
	this.setLastPaiResult(eatType);
};

GameManager.ZiMoHuPaiAckMessage = function (data) {
	if (data.Rst) {}
};

GameManager.setLastPaiResult = function (eatType) {
	var isPaiEat = eatType == GameDefine.EATPAI_TYPE.PengPai || eatType == GameDefine.EATPAI_TYPE.ChiPai || eatType == GameDefine.EATPAI_TYPE.MingGang2;
	if (this.daPaiPlayer) {
		this.daPaiPlayer.setDaPaiResult(isPaiEat);
		this.daPaiPlayer = undefined;
	}
};

GameManager.turnToNextPlayer = function (player) {
	if (this.curPlayer) {
		this.curPlayer.setGameStatus(GameDefine.TURN_STATUS.NOTURN);
		// this.curPlayer.setDaPaiResult(isPaiEat);
	}
	this.curPlayer = player;
	this.curPlayer.setGameStatus(GameDefine.TURN_STATUS.TURNTOPLAY);
	this.gameUICB.setCurPaiDirection(player.getDirection());
};

GameManager.setBtnBackVisi = function (isVisi) {}
// this.gameUICB.setBtnBackVisi(isVisi);


//抢杠提示
;GameManager.QiangGangReminder = function (data) {
	data.Opts = 128; //2^7 就是128， index是7
	this.eatPaiData = data;
	this.eatTag = "QiangGang";
	var eatData = this.paiZuHeReminder(data);
	this.showEatUI(eatData);
};
GameManager.isShowGuo = function () {
	var ishaveNext = this.leftPai > this.liujupaiCount;
	return ishaveNext;
};

GameManager.QiangGangNotice = function (data) {
	data.Opts = 1;
	this.ChuPaiZuHeNotice(data);
};

GameManager.RestoreListenReminder = function (data) {
	this.gameUICB.cleanEatUI();
};

GameManager.roundOver = function () {
	for (var k in this.playerList) {
		var player = this.playerList[k];
		mjDataMgr.getInstance().getPlayerData(player.PlayerIdx).Status = GameDefine.PLAYER_READY.NO_READY;
		player.initPlayerStatus();
		// player.setPlayerStatus(GameDefine.PLAYER_READY.NO_READY)
	}
};

GameManager.getFanhuDataHy = function (itemData) {
	var fanData = "";
	var huData = "";
	var hsList = [];
	var fsList = [];
	//2018/3/5 美术修改，个人觉得比以前丑，可能还要修改，先保留之前的吧
	// var lColor    = itemData.isWin ? "<color=#792f19>" : "<color=#454964>";
	// var sColor    = itemData.isWin ? "<color=#372b2b>" : "<color=#2e2121>";
	var lColor = "<color=#552e21>";
	var sColor = "<color=#552e21>";
	var endTag = "</c>";
	itemData.hsxq = itemData.hsxq || {};
	for (var k in itemData.hsxq) {
		if (GameDefine.FSTEXT[k]) {
			var fsData = GameDefine.FSTEXT[k];
			fsData.count = itemData.hsxq[k];
			fsList.push(fsData);
		}
		if (GameDefine.HSTEXT[k]) {
			var hsData = GameDefine.HSTEXT[k];
			hsData.count = itemData.hsxq[k];
			hsList.push(hsData);
		}
	}
	fsList.sort(function (a, b) {
		return b.sort - a.sort;
	});
	hsList.sort(function (a, b) {
		return b.sort - a.sort;
	});
	for (var i = 0; i < fsList.length; i++) {
		fanData += lColor + fsList[i].name + endTag + sColor + "+" + fsList[i].count + endTag + " ";
	}
	for (var _i3 = 0; _i3 < hsList.length; _i3++) {
		huData += lColor + hsList[_i3].name + endTag + sColor + "+" + hsList[_i3].count + endTag + " ";
	}
	huData = huData.length < 1 ? "0" : huData;
	if (fanData.length > 0) {
		fanData = lColor + "番数: " + endTag + fanData;
		huData = lColor + "胡数: " + endTag + huData;
	} else {
		fanData = lColor + "胡数: " + endTag + huData;
		huData = "";
	}
	return { fan: fanData, hu: huData };
};

//huang yan majiang
GameManager.ZhanJiNoticeHy = function (data) {
	var result = data.info || [];
	var roundData = {};

	for (var i in this.playerList) {
		var itemData = result[i] || {};
		itemData.shouPai = itemData.sp;
		itemData.xdhs = itemData.xdhs || 0;
		itemData.pxdhs = itemData.pxdhs || {};
		itemData.isWin = itemData.iszm || itemData.ishu;
		itemData.Scores = [];
		var fanhuData = this.getFanhuDataHy(itemData);
		itemData.fanData = fanhuData.fan;
		itemData.huData = fanhuData.hu;
		var player = this.playerList[i];
		//dong nan xi bei;
		for (var k = 0; k < 4; k++) {
			var curIdx = (k + this.zhuangIdx) % 4;
			if (curIdx != player.PlayerIdx) {
				itemData.Scores[k] = itemData.pxdhs[curIdx] || 0;
			} else {
				itemData.Scores[k] = itemData.xdhs;
			}
		}
		roundData[i] = itemData;
	}
	this.analyzeZhanji(roundData);
};

//wen ling majiang
GameManager.ZhanJiNoticeWl = function (data) {
	var roundData = {};
	for (var UserId in data.Players) {
		var PlayerIdx = this.getplayerByUserID(UserId).PlayerIdx;
		var itemData = data.Players[UserId];
		var huList = fun.utils.getBinaryOpts(itemData.Type);
		huList.forEach(function (item) {
			itemData.ishu = item.Op == 0 ? true : itemData.ishu;
			itemData.isdp = item.Op == 1 ? true : itemData.isdp;
			itemData.iszm = item.Op == 2 ? true : itemData.iszm;
			itemData.isby = item.Op == 3 ? true : itemData.isby;
			itemData.islz = item.Op == 4 ? true : itemData.islz;
		});
		itemData.hp = itemData.HuCard;
		itemData.shouPai = itemData.HandCards;
		itemData.jdhs = itemData.HuShu;
		itemData.isWin = itemData.iszm || itemData.ishu;
		//2018/3/5 美术修改，个人觉得比以前丑，可能还要修改，先保留之前的吧
		// var lColor           = itemData.isWin ? "<color=#792f19>" : "<color=#454964>";
		// var sColor           = itemData.isWin ? "<color=#372b2b>" : "<color=#2e2121>";
		var sColor = "<color=#552e21>";
		var lColor = '<color=#552e21>';
		var endTag = "</c>";
		itemData.fanData = lColor + "台数: " + endTag + sColor + itemData.TaiShu + endTag;
		itemData.huData = lColor + "胡数: " + endTag + sColor + itemData.DiHu + endTag;
		itemData.xdhs = itemData.Scores[itemData.Feng];

		roundData[PlayerIdx] = itemData;
	}
	//2018/2/26 陈锋修改结算界面将碰吃牌不横着
	for (var k in this.playerList) {
		var peng = this.playerList[k].paiDataObj.pengGangPai.peng;
		cc.log(" 陈锋修改结算界面将碰吃牌不横着", peng);
		for (var i = 0; i < peng.length; i++) {
			for (var _k = 0; _k < peng[i].length; _k++) {
				var pai = peng[i][_k];
				pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			}
		}
	}

	this.analyzeZhanji(roundData);
};

GameManager.analyzeZhanji = function (roundData) {
	var _this = this;

	this.gameUICB.cleanEatUI();
	var singleZhanjiData = [];
	var reportData = [];
	var mjPai = require("mjPai");
	var meIdx = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
	//从东南西北开始显示

	var _loop = function _loop(i) {
		curIdx = (i + _this.zhuangIdx) % 4;

		if (!_this.playerList[curIdx]) {
			return "continue";
		}
		var endData = roundData[curIdx];
		// endData
		endData.player = _this.playerList[curIdx];
		endData.isZhuangJia = curIdx == _this.zhuangIdx;
		endData.playerData = mjDataMgr.getInstance().getPlayerData(curIdx);
		endData.jdhs = endData.jdhs || 0; //juedui hu shu
		endData.xdhs = endData.xdhs || 0; //xiangdui hushu
		endData.shouPai.sort();
		mjDataMgr.getInstance().getPlayerData(curIdx).xdhs += endData.xdhs;
		endData.player.refreshData();
		endData.isWiner = endData.ishu || endData.iszm;
		if (endData.isWiner) {
			singleZhanjiData.meIsWiner = curIdx == meIdx;
		}
		var spPaiList = endData.shouPai.slice();
		for (var paiIndex = 0; paiIndex < spPaiList.length; paiIndex++) {
			pai = mjPai.new(spPaiList[paiIndex]);

			pai.refreshCaiShen();
			pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
			endData.shouPai[paiIndex] = pai;
		}
		if (endData.Fan) {
			endData.FanList = [];
			endData.Fan.forEach(function (paiID) {
				var pai = mjPai.new(paiID);
				pai.refreshCaiShen();
				pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
				endData.FanList.push(pai);
			}.bind(_this));
		}
		singleZhanjiData.push(endData);
		reportData[curIdx] = endData;
	};

	for (var i = 0; i < 4; i++) {
		var curIdx;
		var pai;

		var _ret = _loop(i);

		if (_ret === "continue") continue;
	}
	this.gameRoundata = roundData;
	this.singleZhanjiData = singleZhanjiData;
	fun.event.dispatch("addReportData", reportData);
	if (this.isStartAnim) {
		this.faPaiAnimEndList.unshift({ f: this.showPaijuEndAnim, stop: true });
	} else {
		this.showPaijuEndAnim();
	}
};

GameManager.TotalZhanJiWl = function (data) {
	var totalData = {};
	totalData.players = {};
	var maxCount = 1;
	for (var UserId in data.Players) {
		var PlayerIdx = this.getplayerByUserID(UserId).PlayerIdx;
		var pData = data.Players[UserId];
		var itemData = pData;
		itemData.playerData = mjDataMgr.getInstance().getPlayerData(PlayerIdx);
		itemData.detail = [];
		itemData.detail.push({ name: "自摸", value: pData.ZiMo });
		itemData.detail.push({ name: "胡牌", value: pData.HuPai });
		itemData.detail.push({ name: "辣子", value: pData.LaZi });
		itemData.detail.push({ name: "包圆", value: pData.BaoPai });
		itemData.detail.push({ name: "点炮", value: pData.DianPao });
		// itemData.detail.push({name : "地胡次数:", value : data[5]});
		itemData.score = pData.Score;
		maxCount = itemData.score > maxCount ? itemData.score : maxCount;
		totalData.players[PlayerIdx] = itemData;
	}
	totalData.maxCount = maxCount;
	this.TotalZhanJiNotice(totalData);
};

GameManager.TotalZhanJiHy = function (hyData) {
	var data = hyData.TotalInfos;
	var totalData = {};
	totalData.players = {};
	var maxCount = 1;
	for (var i in data) {
		var pData = data[i];
		var itemData = {};
		itemData.playerData = mjDataMgr.getInstance().getPlayerData(i);
		itemData.detail = [];
		itemData.detail.push({ name: "自摸", value: pData[0] });
		itemData.detail.push({ name: "胡牌", value: pData[1] });
		itemData.detail.push({ name: "辣子", value: pData[2] });
		itemData.detail.push({ name: "包圆", value: pData[3] });
		itemData.detail.push({ name: "天胡", value: pData[4] });
		// itemData.detail.push({name: "地胡次数:", value : pData[5]});
		itemData.score = pData[6];
		itemData.Spend = pData[7];
		itemData.Left = pData[8];
		maxCount = itemData.score > maxCount ? itemData.score : maxCount;
		totalData.players[i] = itemData;
	}
	totalData.maxCount = maxCount;
	this.TotalZhanJiNotice(totalData);
};

GameManager.TotalZhanJiNotice = function (data) {
	for (var i in data.players) {
		var itemData = data.players[i];
		itemData.hasWin = itemData.score > 0;
		itemData.winCount = itemData.hasWin ? "+" + itemData.score : itemData.score;
		itemData.isBigWiner = itemData.score == data.maxCount;
	}
	var meIdx = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
	cc.log("--------- data.players---------", data.players, meIdx);
	data.meIsWiner = data.players[meIdx].isBigWiner;
	this.gameUICB.setTotalReport(data);
	this.totalZhanJiData = data;
	// if(!this.singleZhanjiData){
	// 
	// }
};

GameManager.showPaijuEndAnim = function () {
	var roundData = this.gameRoundata;
	this.isPlaying = false;
	var dpIndex = -1;
	var huIndex = -1;
	var zmIndex = -1;
	for (var idx in roundData) {
		var item = roundData[idx];
		if (item.isdp) {
			dpIndex = idx;
		}
		if (item.ishu || item.iszm) {
			huIndex = idx;
		}
		if (item.iszm) {
			zmIndex = idx;
		}
	}
	this.ResultAnimList = [];
	if (zmIndex > -1) {
		var player = this.playerList[zmIndex];
		player.rmZiMoPai();
	}
	if (dpIndex > -1) {
		this.ResultAnimList.push(function () {
			this.showDianPaoAnim(dpIndex);
		}.bind(this));
	}
	if (huIndex > -1) {
		this.ResultAnimList.push(function () {
			this.showHuPaiAnim(huIndex, roundData[huIndex]);
		}.bind(this));
	} else {
		this.ResultAnimList.push(function () {
			this.showLiuJuAnim();
		}.bind(this));
	}
	cc.log("---GameManager.showPaijuEndAnim------");
	this.checkResultAnim();
};

GameManager.checkResultAnim = function () {
	cc.log("checkResultAnim 1za  ", this.ResultAnimList);
	if (this.ResultAnimList.length === 0) {
		cc.log("show showSingleReport", this.singleZhanjiData);
		this.gameUICB.showSingleReport(this.singleZhanjiData);
		this.roundOver();
		return;
	}
	var cb = this.ResultAnimList.splice(0, 1)[0];
	setTimeout(function () {
		cb();
	}, 300);
};

GameManager.showDianPaoAnim = function (pos) {
	var player = this.playerList[pos];
	player.showDpAnim();
	require('Audio').playEffect("mahjong", "fangpao.mp3");
};

GameManager.showHuPaiAnim = function (pos, itemData) {
	var player = this.playerList[pos];
	player.showHuPaiAnim(itemData);
	require('Audio').playEffect("mahjong", "hupai.mp3");
	setTimeout(function () {
		require('Audio').playEffect("mahjong", "cpghz.mp3");
	}, 250);
};

//show votiing window
GameManager.VotingReminder = function (data) {
	var playersInfo = {};
	var votePlayerIdx = 0;
	var votePlayer = {};
	var roomPlayers = mjDataMgr.get(mjDataMgr.KEYS.PLAYERS);
	for (var idx in roomPlayers) {
		var player = roomPlayers[idx];
		var UserId = player.UserId;
		playersInfo[UserId] = idx == data.PlayerIdx ? 1 : 0;
		cc.log(data.vInfos);

		if (data.vInfos && data.vInfos[idx] && data.vInfos[idx].isVoted) {
			playersInfo[UserId] = 2;
		}
	}
	data.VoteInfo = playersInfo;
	data.EndTime = data.VotingTime;
	this.gameUICB.updateVotingData(data);
};

GameManager.VotingRstNotice = function (data) {
	this.gameUICB.removeVotingPop();
	if (data.VotingRst) {
		this.DissolveRoomNotice();
	} else {
		var player = mjDataMgr.getInstance().getPlayerData(data.PlayerRefused);
		var content = player.showName + " 拒绝解散房间!";
		fun.event.dispatch('MinSingleButtonPop', { contentStr: content });
	}
};

GameManager.VotingPlayerRstNotice = function (data) {
	var player = this.playerList[data.pIdx];
	this.gameUICB.onUserVoted({ UserId: player.UserId, code: data.vRst ? 2 : 3 });
};

GameManager.VotingInformation = function (data) {
	this.VotingReminder(data);
};

GameManager.getplayerByUserID = function (UserId) {
	for (var k in this.playerList) {
		var player = this.playerList[k];
		if (player.UserId == UserId) {
			return player;
		}
	}
};

GameManager.OffLineNotice = function (data) {
	var player = this.getplayerByUserID(data.UserId);
	mjDataMgr.getInstance().getPlayerData(player.PlayerIdx).OnLine = false;
	player.initPlayerStatus();
};

GameManager.OnLineNotice = function (data) {
	var player = this.getplayerByUserID(data.UserId);
	if (data.Status != undefined) {
		mjDataMgr.getInstance().getPlayerData(player.PlayerIdx).Status = data.Status;
	}
	mjDataMgr.getInstance().getPlayerData(player.PlayerIdx).OnLine = true;
	player.initPlayerStatus();
};

GameManager.refrePlayerStatus = function (player, status) {
	if (status == GameDefine.PLAYER_READY.READY && this.isPlaying) {
		status = GameDefine.PLAYER_READY.DAPAIING;
	}
	player.setPlayerStatus(status);
};

GameManager.ChuPaiReminder = function () {
	// ChuPaiReminder
};

GameManager.ChatToOther = function (item) {
	// var content = {
	// 	pIdx : mjDataMgr.get(mjDataMgr.KEYS.SELFID),
	// 	cId : item.type + ":::" + item.id, //::: 是分隔F
	// }
	// this.SendChatData = content;
	// NetMessageMgr.send(NetProtocolList.ChatMessageNum.netID, content);

};

GameManager.ChatNotice = function (data) {
	var chatData = data.cId.split(":::");
	var type = chatData[0];
	var cb = this.chatTypeList[type];
	if (cb) {
		cb.call(this, data.pIdx, chatData[1]);
	}
};

GameManager.ChatMessageAck = function (data) {
	if (data.rst) {
		this.ChatNotice(this.SendChatData);
	}
};

GameManager.showTextChat = function (idx, cId) {
	var chatData = {};
	fun.utils.forEach(GameDefine.CHATCOMMONTEXT, function (item) {
		if (item.id == cId) {
			chatData = item;
		}
	});
	chatData.type = GameDefine.CHATTYPE.TEXT;
	var player = this.playerList[idx];
	player.showChat(chatData);
};

GameManager.showEmojiChat = function (idx, cId) {
	var chatData = {};
	fun.utils.forEach(GameDefine.CHATCOMMONEMOJI, function (item) {
		if (item.id == cId) {
			chatData = item;
		}
	});
	chatData.type = GameDefine.CHATTYPE.EMOJI;
	var player = this.playerList[idx];
	player.showChat(chatData);
};

GameManager.setPlayerCOORD = function (idx, coordData) {
	var coord = {};
	coordData = coordData.split(",,");
	coord.lng = coordData[0];
	coord.lat = coordData[1];
	mjDataMgr.getInstance().setPlayerCOORD(idx, coord);
};

GameManager.onBatteryChange = function (status, level) {
	this.gameUICB.setPhoneBattery(status, level);
};

GameManager.onPhoneNetChange = function (status, strength, signal) {
	this.gameUICB.setPhoneNet(status, strength, signal);
};

//回放是不需要网络操作
GameManager.needNetWork = function () {
	var gameReplayMgr = require("mjReplayMgr");
	var need = true;
	need = gameReplayMgr.isReplayPai() ? false : need;
	return need;
};

GameManager.onReconnectDataWl = function (data) {
	var ReconnectMgr = require("mjReconnectMgr");
	ReconnectMgr.wlReconnected(data);
	this.gameUICB.hideReadyNode();
};

GameManager.onReconnectDataHy = function (data) {
	var ReconnectMgr = require("mjReconnectMgr");
	ReconnectMgr.inGmaeSyncData(data);
	this.gameUICB.hideReadyNode();
};

GameManager.renectCount = function (data) {
	var ReconnectMgr = require("mjReconnectMgr");
	var mjDataMgr = require("mjDataMgr");
	var curReportData = ReconnectMgr.getReportData(data.allzj);
	var roomInfo = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
	roomInfo.Quan = data.fcount || 1;
	roomInfo.Round = curReportData.length;
	this.initGameCount();
	fun.event.dispatch("resetReportData", curReportData);
	this.refrePlayerXdhs(curReportData);
};

GameManager.onPaiTimeChange = function (data) {
	if (data.Time == 1) {
		this.gameUICB.showShengPaiKuang();
		this.isShengPai = true;
		require('Audio').playEffect("mahjong", "dangerstage.mp3");
		this.gameUICB.showAnimEffect("AnimShengpai");
	}
};

// /* ---------------- End Net Message --------------------------*/


module.exports = GameManager;

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
        //# sourceMappingURL=mjGameManager.js.map
        