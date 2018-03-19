(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/common/hymjNetMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f306ce7AWxHhaevyLWKwPi3', 'hymjNetMgr', __filename);
// mahjong/script/game/common/hymjNetMgr.js

"use strict";

// var Mmgr    = require("NetMessageMgr");
// var NetList = require("NetProtocolList");
var log = cc.log;

var hymjNetMgr = function hymjNetMgr() {
    this.getNetCfg = function () {
        return require("hyMjCfg");
    };
    this.addGameNet = function (key, gameMgr) {
        this.reqPCB(key, "EnterRoom", function (data) {
            gameMgr.onUserEnterRoom(data.PlayerInformation, data.PlayerInformation.PlayerIdx);
        });
        this.reqCB(key, "OffLineNoticeNum", gameMgr.OffLineNotice.bind(gameMgr));
        this.reqCB(key, "ReconnectNoticeNum", gameMgr.OnLineNotice.bind(gameMgr));

        this.reqCB(key, "RingAddNum", gameMgr.onRingAddNum.bind(gameMgr));
        this.reqCB(key, "PrepareNoticeNum", gameMgr.prepareNoticeMessage.bind(gameMgr));
        this.reqCB(key, "ExitRoomNoticeNum", gameMgr.exitRoomNoticeIdx.bind(gameMgr));
        this.reqCB(key, "DissolveRoomNoticeNum", gameMgr.DissolveRoomNotice.bind(gameMgr));
        this.reqCB(key, "DissolveRoomAckMessageNum", gameMgr.exiteRoom.bind(gameMgr));

        this.reqCB(key, "ExitRoomAckMessageNum", gameMgr.exiteRoom.bind(gameMgr));
        this.reqCB(key, "PrepareAckMessageNum", function (data) {
            var mjDataMgr = require("mjDataMgr");
            gameMgr.prepareNoticeMessage({ PlayerIdx: mjDataMgr.get(mjDataMgr.KEYS.SELFID) });
        });

        this.reqCB(key, "FaPaiMessageNum", function (data) {
            var mjDataMgr = require("mjDataMgr");
            mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Round += 1;
            gameMgr.initGameCount();
            gameMgr.initStartPai(data);
        });
        this.reqCB(key, "CaiShengPaiNoticeNum", function (data) {
            gameMgr.caiShengPai([data.Atile]);
        });

        this.reqCB(key, "BenMenFengReminderNum", gameMgr.benmenFengNotice.bind(gameMgr));
        this.reqCB(key, "ShengPaiStageNoticeNum", function (data) {
            cc.log("'huangyan ShengPaiStageNoticeNum", data);
            gameMgr.onPaiTimeChange({ Time: 1 });
        });
        this.reqCB(key, "MoPaiNoticeNum", gameMgr.MoPaiNotice.bind(gameMgr));
        this.reqCB(key, "ChuPaiNoticeNum", gameMgr.ChuPaiNotice.bind(gameMgr));
        this.reqCB(key, "MoPaiMessageNum", gameMgr.MoPaiNotice.bind(gameMgr));
        this.reqCB(key, "ChuPaiZuHeReminderNum", gameMgr.ChuPaiZuHeReminder.bind(gameMgr));
        this.reqCB(key, "PengPaiAckMessageNum", gameMgr.PengPaiAckMessage.bind(gameMgr));
        this.reqCB(key, "MoPaiZuHeNoticeNum", gameMgr.ChuPaiZuHeNotice.bind(gameMgr));
        this.reqCB(key, "ChuPaiZuHeNoticeNum", gameMgr.ChuPaiZuHeNotice.bind(gameMgr));
        this.reqCB(key, "ChiPaiAckMessageNum", gameMgr.ChiPaiAckMessage.bind(gameMgr));
        this.reqCB(key, "ZhanJiNoticeNum", gameMgr.ZhanJiNoticeHy.bind(gameMgr));
        this.reqCB(key, "TotalZhanJiNoticeNum", gameMgr.TotalZhanJiHy.bind(gameMgr));
        this.reqCB(key, "MingGang2PaiAckMessageNum", gameMgr.MingGang2PaiAckMessage.bind(gameMgr));
        this.reqCB(key, "QiangGangReminderNum", gameMgr.QiangGangReminder.bind(gameMgr));
        this.reqCB(key, "QiangGangNoticeNum", gameMgr.QiangGangNotice.bind(gameMgr));
        this.reqCB(key, "QiangGangHuPaiAckMessageNum", gameMgr.ZiMoHuPaiAckMessage.bind(gameMgr));
        this.reqCB(key, "MingGang1PaiAckMessageNum", gameMgr.MingGang1PaiAckMessage.bind(gameMgr));
        this.reqCB(key, "AnGangPaiAckMessageNum", gameMgr.AnGangPaiAckMessage.bind(gameMgr));
        this.reqCB(key, "ZiMoHuPaiAckMessageNum", gameMgr.ZiMoHuPaiAckMessage.bind(gameMgr));
        this.reqCB(key, "MoPaiZuHeReminderNum", gameMgr.MoPaiZuHeReminder.bind(gameMgr));
        this.reqCB(key, "RestoreListenReminderNum", gameMgr.RestoreListenReminder.bind(gameMgr));

        this.reqCB(key, "VotingReminderNum", gameMgr.VotingReminder.bind(gameMgr));
        this.reqCB(key, "VotingRstNoticeNum", gameMgr.VotingRstNotice.bind(gameMgr));
        this.reqCB(key, "VotingPlayerRstNoticeNum", gameMgr.VotingPlayerRstNotice.bind(gameMgr));

        // this.reqCB(key, "DisbandRoomVote", gameMgr.onDisbandRoomVoteIn.bind(gameMgr));
        // this.reqCB(key, "DisbandRoomResult", gameMgr.onDisbandRoomResultIn.bind(gameMgr));

        this.reqCB(key, "VotingInformationNum", gameMgr.VotingInformation.bind(gameMgr));
        this.reqCB(key, "ChuPaiReminderNum", gameMgr.ChuPaiReminder.bind(gameMgr));
        this.reqCB(key, "ChatMessageAckNum", gameMgr.ChatMessageAck.bind(gameMgr));
        this.reqCB(key, "ChatNoticeNum", gameMgr.ChatNotice.bind(gameMgr));
        this.reqCB(key, "SyncTileInfoNum", gameMgr.onReconnectDataHy.bind(gameMgr));
        this.reqCB(key, "ReconnectNoticeFinishCountNum", gameMgr.renectCount.bind(gameMgr));
    };

    this.addMenuNet = function (key, menUI) {
        // this.reqCB(key, "DisbandRoomResult", menUI.DisbandRoomResultWL.bind(menUI));
    };

    this.addChatNet = function (key, ChatUI) {};

    this.addReadyNet = function (key, ReadyUI) {};

    this.addReaNet = function (key, Reconnect) {
        // this.reqCB(key, Reconnect, "LoginAckMessageNum" Reconnect.loginEnd);
        // this.reqCB(key, Reconnect, "WxLoginRspNum" Reconnect.loginEnd);
        // this.reqCB(key, Reconnect, "TokenLoginRspNum" Reconnect.loginEnd);
        // this.reqCB(key, Reconnect, "YKLoginRspNum" Reconnect.loginEnd);
        // this.reqCB(key, Reconnect, "EnterRoomAckMessageNum" Reconnect.inGmaeEnteredRoom);

    };

    this.addRebNet = function (key, Reconnect) {
        // this.reqCB(key, Reconnect, "SyncTileInfoNum" Reconnect.initDeskPaiData);
        // 
    };

    this.enterRoom = function (data) {
        fun.net.send("EnterRoomMessageNum", data);
    };

    this.gotoReady = function (data) {
        fun.net.send("PrepareMessageNum", data);
    };

    this.createRoom = function (data) {
        fun.net.send("CreateRoomMessageNum", data);
    };

    this.exitOutRoom = function (content) {
        fun.net.send("ExitRoomMessageNum", content);
    };

    this.dissolvedRoom = function (content) {
        fun.net.send("DissolveRoomMessageNum", content);
    };

    this.chuPai = function (content) {
        fun.net.send("ChuPaiMessageNum", content);
    };

    this.optPai = function (content, eatObj) {
        fun.net.send(eatObj.msName, content);
    };
    this.passOpt = function (content, eatTag) {
        var message;
        if (eatTag === "chuPai") {
            message = "GuoChuPaiMessageNum";
        } else if (eatTag === "QiangGang") {
            message = "GuoQiangGangMessageNum";
        } else {
            message = "GuoMoPaiMessageNum";
        }
        fun.net.send(message, content);
    };
    this.chiPaiOpt = function (content) {
        fun.net.send("ChiPaiMessageNum", content);
    };

    this.VoteOutRoom = function (content) {
        fun.net.send("VotingStartMessageNum", {});
    };

    this.disbandRoomVote = function (data) {
        var content = {};
        content.VotingRst = data.OP == 2;
        fun.net.send("VotingMessageNum", content);
    };
};

module.exports = {
    new: function _new() {
        return hymjNetMgr;
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
        //# sourceMappingURL=hymjNetMgr.js.map
        