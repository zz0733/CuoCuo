(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/common/mjPlayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e640cFixwhG7KzQXJybC/rW', 'mjPlayer', __filename);
// mahjong/script/game/common/mjPlayer.js

"use strict";

var GameDefine = require("mjGameDefine");
var mjDataMgr = require("mjDataMgr");
var gameManager = require("mjGameManager");

var playerCls = function playerCls() {};

playerCls.prototype.init = function (playerNode, desPosType, gameUI) {
    this.udidTag = 0;
    this.desPosType = desPosType;
    this.playerNode = playerNode;
    this.playerUI = playerNode.getComponent("mjPlayerUI");
    this.playerUI.init();
    this.playerUI.initDeskPosType(desPosType, gameUI, this);
    this.getPaiMgr().initPlayer(this);
    // this.getPaiMgr().clea
};

playerCls.prototype.setPlayerIdx = function (idxs) {
    this.PlayerIdx = idxs;
};

playerCls.prototype.refreshData = function () {
    var playerData = mjDataMgr.getInstance().getPlayerData(this.PlayerIdx);
    this.playerUI.refreshPlayerData(playerData);
    this.UserId = playerData ? playerData.UserId : undefined;
};

playerCls.prototype.initPlayerStatus = function () {
    var playerData = mjDataMgr.getInstance().getPlayerData(this.PlayerIdx);
    var status = playerData ? playerData.Status : GameDefine.PLAYER_READY.NO_READY;
    if (status == GameDefine.PLAYER_READY.READY && gameManager.isPlaying) {
        status = GameDefine.PLAYER_READY.DAPAIING;
    }
    this.setPlayerStatus(status);
    if (playerData && !playerData.OnLine) {
        this.offLine();
    }
};

playerCls.prototype.getCanChiData = function (paiID) {
    return this.paiDataObj.getCanChiData(paiID);
};

playerCls.prototype.getPaiData = function () {
    return this.paiDataObj;
};

//设置玩家的状态 对应GameDefine.PLAYER_READY
playerCls.prototype.setPlayerStatus = function (status) {
    cc.log("---ayerCls.prototype.setPlayerStatus-----", status);
    this.playerStatus = status;
    this.playerUI.refrePlayerStatus(status);
};

//设置玩家游戏中的状态 对应GameDefine.TURN_STATUS
playerCls.prototype.setGameStatus = function (status) {
    this.dapaiStatus = status;
    this.playerUI.refreGameStatus(status);
};

playerCls.prototype.offLine = function () {
    this.playerUI.refrePlayerStatus(GameDefine.PLAYER_READY.OFFLINE);
};

// playerCls.prototype.onLine = function(){
//     cc.log("--onLine----",  this.playerStatus);
//     this.playerUI.refrePlayerStatus(this.playerStatus);
// }


//是否改我出牌
playerCls.prototype.isTrunToMe = function () {
    return this.dapaiStatus == GameDefine.TURN_STATUS.TURNTOPLAY;
};

playerCls.prototype.showPaiOnBegin = function (huaData) {
    // var showTag = setInterval(function(){
    //     else {
    //         clearInterval(showTag);

    //     }
    // }.bind(this), 800);
    // if(.length > 0){
    for (var i = 0; i < huaData.showData.length; i++) {
        this.showPai(huaData.showData[i].Card);
        this.buPai(huaData.buData[i].Card);
    }
    //     var showID = huaData.showData.shift().Card;
    //     var buID   = huaData.buData.shift().Card;

    // }
    this.showBuHuaAnim();
    setTimeout(function () {
        this.paiDataObj.sortMajiang();
        this.getPaiMgr().refreShouPai();
    }.bind(this), 800);
};

playerCls.prototype.showPai = function (paiID) {
    if (this.isXiaDesk() || this.isReplay) {
        var pai = this.paiDataObj.showPai(paiID);
        this.getPaiMgr().rmShouPai(pai);
    }
    this.paiDataObj.buHuapai([paiID]);
    this.getPaiMgr().refreBuhua();
};

playerCls.prototype.showBuHuaAnim = function () {
    //让声音延后点点
    this.playerUI.showOptPaiAnim(GameDefine.EATPAI_TYPE.BuHua);
    this.playEffect("buhua");
};

playerCls.prototype.buPai = function (paiID, isSelf) {
    if (!this.isXiaDesk() && !this.isReplay) {
        return;
    }
    this.moPai(paiID);
};

playerCls.prototype.resetFanPai = function () {
    var fanList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    this.paiDataObj.buHuapai(fanList);
    this.getPaiMgr().refreBuhua();
};

playerCls.prototype.showPlayerInfo = function () {
    var playerData = mjDataMgr.getInstance().getPlayerData(this.PlayerIdx);
    fun.event.dispatch("mjPlayerDetail", { d: playerData, pos: this.desPosType });
};

playerCls.prototype.setDirection = function (direction) {
    var GameDefine = require("mjGameDefine");
    var dirIndex = 0;
    for (var k in GameDefine.DIRECTION_TYPE) {
        if (GameDefine.DIRECTION_TYPE[k] == direction) {
            break;
        }
        dirIndex += 1;
    }
    this.direction = direction;
    this.dirIndex = dirIndex;
    this.playerUI.setDirection(direction);
};

playerCls.prototype.getDirection = function () {
    return this.direction;
};

playerCls.prototype.isZhuangJia = function () {
    return this.direction == GameDefine.DIRECTION_TYPE.DONG;
};

playerCls.prototype.isXiaDesk = function () {
    return this.PlayerIdx == mjDataMgr.get(mjDataMgr.KEYS.SELFID);
};

playerCls.prototype.cleanPaiData = function () {
    this.playerUI.cleanPaiNode();
    this.paiDataObj = undefined;
    this.outPaiAnimdList = {};
};

playerCls.prototype.showDpAnim = function () {
    //温岭麻将有玩家已经打出牌了，牌不在自己手中还会认为你点炮的情况
    //这种情况不播放点炮动画
    var dachuList = this.paiDataObj.daPaiOutList;
    var isExit = false;
    dachuList.forEach(function (pai) {
        if (pai == this.curDaPai) {
            isExit = true;
        }
    }.bind(this));
    if (isExit) {
        this.getPaiMgr().showDpAnim(this.curDaPai);
    } else {
        cc.log("----showDpAnim-----show DP Anim");
        gameManager.checkResultAnim();
    }
};

playerCls.prototype.showHuPaiAnim = function (hupaiData) {
    var voiceName = hupaiData.iszm ? "zimo" : "hu";
    require('Audio').playEffect("mahjong", "mahjong.mp3");
    this.playEffect(voiceName);
    if (!hupaiData.hp) {
        return;
    }
    var pai = this.paiDataObj.createFullPai(hupaiData.hp);
    if (!hupaiData.iszm) {
        this.paiDataObj.getShouPaiList().push(pai);
    }

    this.playerUI.showHuPaiAnim(pai, hupaiData);
};

playerCls.prototype.reSetDapaiData = function (paiID, paiTag) {
    if (this.dapaiStatus == GameDefine.TURN_STATUS.WAITOPT) {
        var pai = this.paiDataObj.createFullPai(paiID);
        pai.isChuPai = true;
        pai.setShowType(GameDefine.PAISHOWTYPE.END);
        gameManager.chuPaiCount = paiTag;
        // gameManager.paiResultList[paiTag] = GameDefine.CHUPAIRESULT.NOEAT
        this.curDaPai = pai;
        // this.chuPaiTag   = paiTag;
        this.isDaAnimEnd = true;
        this.isTurnNext = false;
        this.paiDataObj.daPaiOutList.push(this.curDaPai);
        this.getPaiMgr().refreDachuPai();
    }
};

playerCls.prototype.showChoosePai = function (pai) {
    gameManager.showChoosePai(pai.id);
};

playerCls.prototype.showSamePaiTips = function (paiID) {
    this.getPaiMgr().showSamePaiTips(paiID);
};

playerCls.prototype.setDaPaiResult = function (isEat) {
    this.isTurnNext = true;
    this.paiIsEated = isEat;
    // this.daPaiRuslt = gameManager.paiResultList[this.chuPaiTag];
    this.checkPaiEnd();
};

//刷新打出去的牌最终去向
playerCls.prototype.checkPaiEnd = function () {
    if (this.isTurnNext && this.isDaAnimEnd) {
        if (this.paiIsEated) {
            this.paiDataObj.daPaiOutList.pop();
        }
        this.curDaPai.isChuPai = false;
        this.getPaiMgr().setPaiEnd(this.paiIsEated, this.curDaPai);
        this.cleanDaPaiStatus();
    }
};

playerCls.prototype.cleanDaPaiStatus = function () {
    this.isDaAnimEnd = false;
    this.isTurnNext = false;
    this.paiIsEated = false;
};

playerCls.prototype.addPaiOutList = function (paiList) {
    for (var i = 0; i < paiList.length; i++) {
        var paiID = paiList[i];
        var pai = this.paiDataObj.createFullPai(paiID);
        pai.setShowType(GameDefine.PAISHOWTYPE.END);
        this.paiDataObj.daPaiOutList.push(pai);
        this.getPaiMgr().refreDachuPai();
    }
};

playerCls.prototype.initRound = function () {
    this.paiDataObj = undefined;
    var gameReplayMgr = require("mjReplayMgr");
    this.isReplay = gameReplayMgr.isReplayPai();
    var paiDataMgr = require("mjPlayerPai");
    this.paiDataObj = paiDataMgr.new(this.isReplay);
    this.paiDataObj.setDeskType(this.desPosType);
    this.cleanDaPaiStatus();
    this.setGameStatus(GameDefine.TURN_STATUS.NOTURN);
    this.playerUI.initRound();
};

playerCls.prototype.faPai = function (paiData, isGai) {
    var addPaiList = this.paiDataObj.faPai(paiData, isGai);
    this.getPaiMgr().addFaPai(addPaiList);
};

playerCls.prototype.onFaPaiStart = function () {
    this.getPaiMgr().onFaPaiStart();
};

playerCls.prototype.setShouPai = function (paiData) {
    cc.log("---setShouPai-", paiData);
    var addPaiList = this.paiDataObj.setShouPai(paiData);
    this.getPaiMgr().addShouPai(addPaiList);
};

playerCls.prototype.faPaiEnd = function () {
    this.paiDataObj.sortMajiang();
    this.paiDataObj.cleanFaPaiList();
    this.getPaiMgr().refreShouPai();
    this.getPaiMgr().refreRelativePos();
    this.getPaiMgr().onFaPaiEnd();
};

playerCls.prototype.uprightPai = function () {
    // if(!this.isGai){return}
    this.paiDataObj.uprightPai();
    this.getPaiMgr().refreFaPai(this.paiDataObj);
};

playerCls.prototype.gaiAllPai = function () {
    // if(!this.isGai){return}
    // //先按id大小排序， 小在前
    // this.paiDataObj.getShouPaiList().sort(function(a, b){
    //     return a.id - b.id;
    // });
    this.paiDataObj.sortMajiang();
    this.paiDataObj.gaiAllPai();
    this.getPaiMgr().refreFaPai(this.paiDataObj);
};

//摸到新牌
playerCls.prototype.moPai = function (id) {
    require("Audio").playEffect("mahjong", "mahjong.mp3");
    this.paiDataObj.sortMajiang();
    this.getPaiMgr().refreShouPai();
    var pai = this.paiDataObj.addPai(id);
    this.curMoPaiUdid = pai.udid;
    this.getPaiMgr().moPai(pai, this.isReplay);
};

playerCls.prototype.rmZiMoPai = function () {
    this.getPaiMgr().rmZimoPai(this.curMoPaiUdid);
};

playerCls.prototype.playEffect = function (voiceName) {
    if (!voiceName) {
        return;
    }
    var lan = "mandarin/";
    //显示的是方言
    if (fun.gameCfg.voiceLanguage == gameConst.voiceLanguage.huangYan) {
        lan = mjDataMgr.get("CfgData").Dialect;
    }
    var sex = mjDataMgr.getInstance().getPlayerData(this.PlayerIdx).Sex == 2 ? "female" : "male";
    var name = sex + "_" + voiceName + ".mp3";
    var more = ["", "_1", "_2"][Math.floor(Math.random() * 2.999)];
    require("Audio").playEffect("mahjong", name, lan, more);
};

playerCls.prototype.getPaiVoice = function (paiID) {
    var commonType = { 1: "tong", 2: "tiao", 3: "wan" };
    var voiceName = "";
    if (paiID < 40) {
        voiceName = paiID % 10 + commonType[Math.floor(paiID / 10)];
    } else {
        var localID = mjDataMgr.getInstance().getLocalPaiID(paiID);
        voiceName = require('mjGameDefine').SP_PAIVOICE[localID];
    }
    return voiceName;
};

//出牌
playerCls.prototype.chuPai = function (paiID, paiUdid, paiTag) {
    var pai;
    this.playEffect(this.getPaiVoice(paiID));
    require("Audio").playEffect("mahjong", "mahjong.mp3");
    pai = this.paiDataObj.chuPai(paiUdid, paiID);
    pai.id = paiID;
    pai.refreshCaiShen();
    this.curDaPai = pai;
    this.paiDataObj.sortMajiang();
    // this.chuPaiTag   = paiTag;
    this.cleanDaPaiStatus();
    this.getPaiMgr().daPai(pai);
};

playerCls.prototype.daPaiAnimEnd = function () {
    this.isDaAnimEnd = true;
    this.checkPaiEnd();
};

playerCls.prototype.peng = function (paiID, isSelf, eatType) {
    var spliceList = this.paiDataObj.peng(paiID, isSelf);
    this.paiDataObj.sortMajiang();
    this.getPaiMgr().pengGangPai(spliceList);
    this.playerUI.showOptPaiAnim(GameDefine.EATPAI_TYPE.PengPai);
    require("Audio").playEffect("mahjong", "mahjong.mp3");
    this.playEffect("peng");
};

playerCls.prototype.resetPengGangPai = function (gangList, pengList) {
    this.paiDataObj.resetPengGangPai(gangList, pengList);
    this.getPaiMgr().pengGangPai([]);
};

playerCls.prototype.gang = function (paiID, isSelf, gangType) {
    gameManager.addLiujuCount();
    var spliceList = [];
    //每杠一张牌流局就多一张牌
    if (gangType === GameDefine.EATPAI_TYPE.MingGang1) {
        spliceList = this.paiDataObj.gang_0(paiID, isSelf);
    } else if (gangType === GameDefine.EATPAI_TYPE.AnGang) {
        spliceList = this.paiDataObj.gang_1(paiID, isSelf);
    } else {
        spliceList = this.paiDataObj.gang_2(paiID, isSelf);
    }
    this.getPaiMgr().pengGangPai(spliceList);
    this.playerUI.showOptPaiAnim(GameDefine.EATPAI_TYPE.MingGang1); //
    require("Audio").playEffect("mahjong", "mahjong.mp3");
    this.playEffect("gang");
};

playerCls.prototype.chi = function (paiData) {
    //最后一个是刚刚push进去的
    //如果是别人吃牌，后面代码则会继续处理前面两个
    var spliceList = this.paiDataObj.chi(paiData);
    this.getPaiMgr().pengGangPai(spliceList);
    this.playerUI.showOptPaiAnim(GameDefine.EATPAI_TYPE.ChiPai);
    require("Audio").playEffect("mahjong", "mahjong.mp3");
    this.playEffect("chi");
};

playerCls.prototype.showChat = function (content) {
    this.playerUI.showChat(content);
};

playerCls.prototype.getInteractPos = function () {
    return this.playerUI.getInteractPos();
};

playerCls.prototype.getPaiMgr = function () {
    return this.playerUI.getPaiMgr();
};

playerCls.prototype.turnToDaPai = function (pai) {
    if (this.dapaiStatus == GameDefine.TURN_STATUS.TURNTOPLAY) {
        gameManager.turnToChupai(pai);
    }
};

module.exports = {
    new: function _new() {
        return new playerCls();
    }
};

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
        //# sourceMappingURL=mjPlayer.js.map
        