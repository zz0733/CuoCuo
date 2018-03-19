"use strict";
cc._RF.push(module, '0c53cEZfWNEXL1BMf+CvH0b', 'mjNetMgr');
// mahjong/script/game/common/mjNetMgr.js

"use strict";

var mjNetMgrSys = function mjNetMgrSys() {
    this.reqCB = function (moduleName, netName, cb) {
        fun.net.listen(netName, cb);
        this.messageList[moduleName].push(netName);
    };

    this.reqPCB = function (moduleName, netName, cb) {
        fun.net.pListen(netName, cb);
        this.pMessageList[moduleName].push(netName);
    };

    this.init = function (KEYS) {
        this.KEYS = KEYS;
        var messageList = {};
        var pMessageList = {};
        for (var k in this.KEYS) {
            var value = this.KEYS[k];
            messageList[value] = [];
            pMessageList[value] = [];
        }
        this.messageList = messageList;
        this.pMessageList = pMessageList;
    };

    this.rmNet = function (gameType) {
        cc.log("------rmNet---------, gameType", gameType);
        this.messageList[gameType].forEach(function (meName) {
            fun.net.rmListen(meName);
        });
        this.messageList[gameType] = [];
        this.pMessageList[gameType].forEach(function (meName) {
            fun.net.rmPListen(meName);
        });
        this.pMessageList[gameType] = [];
    };
};

var curMgr;
module.exports = {
    init: function init() {
        var definedList = {};
        definedList[gameConst.gameType.maJiangWenLing] = require("wlmjNetMgr").new();
        definedList[gameConst.gameType.maJiangHuangYan] = require("hymjNetMgr").new();

        var curGameType = fun.db.getData('RoomInfo').GameType;
        var mgrSys = definedList[curGameType];
        if (mgrSys) {
            mgrSys.prototype = new mjNetMgrSys();
            curMgr = new mgrSys();
            curMgr.init(this.KEYS);
            fun.net.setGameMsgCfg(curMgr.getNetCfg());
        } else {
            fun.log("mj", "mjNetMgr init: this curGameType has no defined :" + curGameType);
        }
    },

    getIns: function getIns() {
        return curMgr;
    },

    KEYS: {
        GAME: "GameMgr",
        MENU: "MenuUI",
        REB: "Reconnect_before",
        REA: "Reconnect_after",
        CHAT: "chatUI"
    },

    cSend: function cSend(key, data, handler) {
        if (curMgr[key]) {
            var argumentList = [];
            for (var i = 0; i < arguments.length; i++) {
                if (i != 0) {
                    argumentList.push(arguments[i]);
                }
            }
            curMgr[key].apply(curMgr, argumentList);
        } else {
            fun.log("mj", "mjNetMgr cSend : --------key not  registe in mjNetMgr ---- key : " + key);
        }
    }
};

cc._RF.pop();