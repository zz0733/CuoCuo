"use strict";
cc._RF.push(module, '12a0csaQuNApaNmLMkm09Yz', 'scmjNetMgr');
// mahjong/script/game/common/scmjNetMgr.js

"use strict";

var scmjNetMgr = function scmjNetMgr() {
    this.getNetCfg = function () {
        return require("scMjCfg");
    };
    this.addGameNet = function (key, gameMgr) {
        this.reqCB(key, "Ready", gameMgr.prepareNoticeMessage.bind(gameMgr));
        this.reqPCB(key, "EnterRoom", function (data) {
            gameMgr.onUserEnterRoom(data, data.RoomOrder);
        });
        this.reqCB(key, "LeaveRoom", gameMgr.exitRoomNoticeUserid.bind(gameMgr));
        this.reqCB(key, "DisbandRoomVote", gameMgr.onDisbandRoomVoteIn.bind(gameMgr));
        this.reqCB(key, "DisbandRoomResult", gameMgr.onDisbandRoomResultIn.bind(gameMgr));
        this.reqPCB(key, "OffLine", gameMgr.OffLineNotice.bind(gameMgr));
        this.reqPCB(key, "OnLine", gameMgr.OnLineNotice.bind(gameMgr));
        this.reqCB(key, "FaPai", function (data) {
            data.Tiles = data.Cards;
            data.TileCount = [];
            for (var i in gameMgr.playerList) {
                data.TileCount[i] = 16;
            }
            gameMgr.initStartPai(data);
        });
        this.reqCB(key, "Zhuang", gameMgr.zhuangNotify.bind(gameMgr));
        this.reqCB(key, "Mo", gameMgr.WLMoPaiNotice.bind(gameMgr));
        this.reqCB(key, "Da", function (data) {
            //card 0 是提示某人可以打牌
            if (!(data.Card == 0)) {
                data.Atile = data.Card;
                gameMgr.ChuPaiNotice(data);
            }
        });
        this.reqCB(key, "Ops", function (data) {
            var optData = [];
            data.Ops.forEach(function (item) {
                //吃牌本地获取，servar data  item.Combs不好获取
                var atile = item.Op == 64 || !item.Combs ? gameMgr.lastChuPaiID : item.Combs[0][0];
                optData.push({ Op: toLocalOptType[item.Op], Comb: item.Combs, Atile: atile });
            });
            gameMgr.showEatUI(optData);
        });
        this.reqCB(key, "Peng", function (data) {
            cc.log("--this.reqCB(key, peng---", data);
            data.Atile = data.Card;
            data.Opts = Math.pow(2, toLocalOptType[32]);
            gameMgr.ChuPaiZuHeNotice(data);
        });
        this.reqCB(key, "Gang", function (data) {
            data.Atile = data.Card;
            data.Opts = Math.pow(2, toLocalOptType[data.Type]);
            gameMgr.ChuPaiZuHeNotice(data);
        });
        this.reqCB(key, "ShowPai", function (data) {
            setTimeout(function () {
                gameMgr.ShowPaiNotify(data);
            }, 1000);
        });
        this.reqCB(key, "BuPai", function (data) {
            setTimeout(function () {
                gameMgr.BuPaiNotify(data);
            }, 1000);
        });
        this.reqCB(key, "RoundAcc", gameMgr.ZhanJiNoticeWl.bind(gameMgr));
        this.reqCB(key, "RoomAcc", gameMgr.TotalZhanJiWl.bind(gameMgr));
        this.reqCB(key, "PaiTime", gameMgr.onPaiTimeChange.bind(gameMgr));
        //断线重连
        this.reqCB(key, "PaiJuInfo", gameMgr.onReconnectDataWl.bind(gameMgr));
    };

    this.addChatNet = function (key, ChatUI) {};
    this.addReaNet = function (key, Reconnect) {};
    this.addRebNet = function (key, Reconnect) {};
    this.addMenuNet = function (key, menUI) {}
    // this.reqCB(key, "DisbandRoomResult", menUI.DisbandRoomResultWL.bind(menUI));


    //*************------------------------------send to server --------------------***************//
    ;this.gotoReady = function (data, handler) {
        var content = {};
        content.UserId = data.PlayerID;
        fun.net.send("Ready", {}, handler);
    };
    this.exitOutRoom = function (data, handler) {
        fun.net.send("LeaveRoom", data, handler);
    };
    this.dissolvedRoom = function (data, handler) {
        this.exitOutRoom({}, handler);
    };

    this.chuPai = function (data) {
        var content = { Card: data.Atile };
        fun.net.send("Da", content, function (rsp) {
            //打出的牌与服务器对不上
            //26非法操作
            //30 打出牌不能为特殊牌
            if (rsp && (rsp.RetCode == 26 || rsp.RetCode == 30)) {
                fun.net.close();
            }
        });
    };

    this.optPai = function (content, eatObj) {
        if (eatObj.dataIndex == toLocalOptType[32]) {
            this.pengOpt(content);
        }
        if (eatObj.dataIndex == toLocalOptType[1] || eatObj.dataIndex == toLocalOptType[2]) {
            this.huOpt(content);
        }
        if (eatObj.dataIndex == toLocalOptType[4]) {
            this.gangOpt(content, 4);
        }
        if (eatObj.dataIndex == toLocalOptType[8]) {
            this.gangOpt(content, 8);
        }
        if (eatObj.dataIndex == toLocalOptType[16]) {
            this.gangOpt(content, 16);
        }
    };

    this.passOpt = function () {
        fun.net.send("Pass", {});
    };
    this.pengOpt = function (data) {
        fun.net.send("Peng", { Card: data.Atile });
    };
    this.chiPaiOpt = function (chiData) {
        var content = { Comb: chiData.Data };
        fun.net.send("Chi", content);
    };
    this.huOpt = function (data) {
        fun.net.send("Hu", { Card: data.Atile });
    };
    this.gangOpt = function (data, gangType) {
        fun.net.send("Gang", { Type: gangType, Card: data.Atile });
    };
    this.VoteOutRoom = function (data, handler) {
        fun.net.send('DisbandRoomVote', data, handler);
    };
    this.disbandRoomVote = function (data, handler) {
        fun.net.send('DisbandRoomVote', data, handler);
    };
};

module.exports = {
    new: function _new() {
        return scmjNetMgr;
    }
};

cc._RF.pop();