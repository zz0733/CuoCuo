"use strict";
cc._RF.push(module, '62981jDNQZBwpvR7LlpEfYs', 'gameMgrWahua');
// mahjong/script/wahua/desk/gameMgrWahua.js

'use strict';

var JiaWeiEnum = cc.Enum({
    tianjia: 0,
    dijia: 1,
    yinpai: 2,
    changsan: 3
});
var JiaWeiArr = ['tianjia', 'dijia', 'yinpai', 'changsan'];
var WhUtils = require('whUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnExit: {
            type: cc.Node,
            default: null
        },

        btnReady: {
            type: cc.Node,
            default: null
        },

        btnInvite: {
            type: cc.Node,
            default: null
        },

        paiMianAltas: {
            type: cc.SpriteAtlas,
            default: null
        }
    },

    onLoad: function onLoad() {
        fun.event.dispatch('Zhuanquan', { flag: false });
        fun.net.setGameMsgCfg(require('WahuaCfg'));
        this._userId = fun.db.getData('UserInfo').UserId;
        var roomInfo = fun.db.getData('RoomInfo');
        this._gameStatu = roomInfo.roomRule.gameStatu;
        this._isRoomOwner = this._userId.toString() === roomInfo.roomRule.roomOwner;
        this._playerNum = roomInfo.roomRule.playerNum;
        this._seat = new Array();
        this._seatDir = ['xia', 'you', 'shang', 'zuo'];

        this.btnExit.on('click', this.onBtnExitClick, this);
        this.btnReady.on('click', this.onBtnReadyClick, this);
        this.btnInvite.on('click', this.onBtnInviteClick, this);
        this.registerListener();
    },
    start: function start() {
        this.reconnet();
    },
    registerListener: function registerListener() {
        fun.net.pListen('EnterRoom', this.onEnterRoomIn.bind(this));
        fun.net.pListen('OffLine', this.onOffLineIn.bind(this));
        fun.net.pListen('OnLine', this.onOnLineIn.bind(this));
        fun.net.listen('DisbandRoom', this.onDisbandRoomIn.bind(this));
        fun.net.listen('Ready', this.onReadyIn.bind(this));
        fun.net.listen('ReadyNext', this.onReadyNextIn.bind(this));
        fun.net.listen('DisbandRoomVote', this.onDisbandRoomVoteIn.bind(this));
        fun.net.listen('DisbandRoomResult', this.onDisbandRoomResultIn.bind(this));
        fun.net.listen('Banker', this.onBankerIn.bind(this));
        fun.net.listen('RockCard', this.onRockCardIn.bind(this));
        fun.net.listen('UserRefresh', this.onUserRefreshIn.bind(this));
        fun.net.listen('NoneOps', this.onNoneOpsIn.bind(this));
        fun.net.listen('StartGame', this.onStartGameIn.bind(this));
        fun.net.listen('PlayCard', this.onPlayCardIn.bind(this));
        fun.net.listen('DrawCard', this.onDrawCardIn.bind(this));
        fun.net.listen('OpsAccept', this.onOpsAcceptIn.bind(this));
        fun.net.listen('RepairCard', this.onRepairCardIn.bind(this));
        fun.net.listen('OneAccount', this.onOneAccountIn.bind(this));
        fun.net.listen('QuitRoom', this.onQuitRoomIn.bind(this));
        fun.net.listen('AllAccount', this.onAllAccountIn.bind(this));

        fun.event.add('gameMgrWahuaInitCompleted', 'wahuaInitCompleted', this.updateSeats.bind(this));
        fun.event.add('gameMgrWahuaQuitFromSetting', 'wahuaQuitFromSetting', this.onBtnExitClick.bind(this));
    },
    removeListener: function removeListener() {
        fun.net.rmPListen('EnterRoom');
        fun.net.rmPListen('OffLine');
        fun.net.rmPListen('OnLine');
        fun.net.rmListen('DisbandRoom');
        fun.net.rmListen('Ready');
        fun.net.rmListen('ReadyNext');
        fun.net.rmListen('DisbandRoomVote');
        fun.net.rmListen('DisbandRoomResult');
        fun.net.rmListen('Banker');
        fun.net.rmListen('RockCard');
        fun.net.rmListen('UserRefresh');
        fun.net.rmListen('NoneOps');
        fun.net.rmListen('StartGame');
        fun.net.rmListen('PlayCard');
        fun.net.rmListen('DrawCard');
        fun.net.rmListen('OpsAccept');
        fun.net.rmListen('RepairCard');
        fun.net.rmListen('OneAccount');
        fun.net.rmListen('QuitRoom');
        fun.net.rmListen('AllAccount');

        fun.event.remove('gameMgrWahuaInitCompleted');
        fun.event.remove('gameMgrWahuaQuitFromSetting');
    },
    onDestroy: function onDestroy() {
        this.removeListener();
        this._seat = [];
        this._seatDir = [];
    },
    updateSeats: function updateSeats(p) {
        if (!p && p !== 0) return;
        this._seat[p] = {};
        this._seat[p].ui = this.node.getChildByName(this._seatDir[p]).getComponent('playerUiWahua');
        this._seat[p].pos = p;
        this._seat[p].id = this._seat[p].ui.data ? this._seat[p].ui.data.userId : undefined;
        cc.log('--- this._seat: ', this._seat);
    },
    getSeatByUserId: function getSeatByUserId(id) {
        for (var i = 0; i < this._seat.length; ++i) {
            if (this._seat[i] && this._seat[i].id && this._seat[i].id === id) {
                return this._seat[i];
            }
        }
    },
    reconnet: function reconnet() {
        var roomInfo = fun.db.getData('RoomInfo');
        if (!roomInfo.userMap) return;
        var selfReadyState = roomInfo.userMap[this._userId].currentState;
        this.setReadyState(selfReadyState === 0 ? true : false);
        if (roomInfo.roomRule.nowZhuangjia) {
            this.setJiaWeiShow(roomInfo.roomRule.nowZhuangjia);
        }
    },
    setReadyState: function setReadyState(flag) {
        this.btnReady.active = flag;
        if (this._gameStatu === 1) return;
        this.btnInvite.active = false;
        this.btnExit.active = false;
    },
    setJiaWeiShow: function setJiaWeiShow(id) {
        var tSeat = this.getSeatByUserId(id);
        var tPos = tSeat.pos;
        var newSeat = new Array(); // 0-天家 1-地家 2-银牌 3-长三
        for (var i = 0; i < this._seat.length; ++i) {
            if (this._seat[i]) {
                var curPos = this._seat[i].pos;
                var dir = 0;
                var cha = curPos - tPos;
                if (cha === 1 || cha === -3) {
                    dir = 1;
                } else if (cha === 2 || cha === -2) {
                    dir = 2;
                } else if (cha === 3 || cha === -1) {
                    dir = 3;
                } else {
                    dir = 0;
                }
                newSeat[dir] = this._seat[i];
            }
        }
        for (var _dir = 0; _dir < newSeat.length; ++_dir) {
            if (newSeat[_dir]) {
                newSeat[_dir].ui.setDirect(_dir);
            }
        }
    },
    onBtnExitClick: function onBtnExitClick() {
        if (this._gameStatu === 1) {
            if (this._isRoomOwner) {
                fun.net.send('DisbandRoom', {}, function (rsp) {
                    cc.log('DisbandRoom-----------', rsp);
                    this.exitRoom();
                }.bind(this));
            } else {
                fun.net.send('QuitRoom', {}, function (rsp) {
                    cc.log('QuitRoom---------', rsp);
                    this.exitRoom();
                }.bind(this));
            }
        } else {
            fun.net.send('DisbandRoomVote', { applyStatu: 0 }, function (rsp) {
                cc.log('DisbandRoomVote--------', rsp);
                this.exitRoom();
            }.bind(this));
        }
    },
    onBtnReadyClick: function onBtnReadyClick() {
        fun.net.send('Ready', {}, function (rsp) {
            if (rsp.returnStatu && rsp.returnStatu === 1) {
                var seat = this.getSeatByUserId(rsp.ready);
                if (!seat) return;
                seat.ui.showReady(true);
                this.setReadyState(false);
            }
        }.bind(this));
    },
    onBtnInviteClick: function onBtnInviteClick() {
        cc.log('--- invite ---');
    },
    onEnterRoomIn: function onEnterRoomIn(data) {
        var roomInfo = fun.db.getData('RoomInfo');
        if (!roomInfo.userMap) {
            roomInfo.userMap = {};
        }
        for (var key in data.userOneMap) {
            if (key === 'userId') {
                roomInfo.userMap[data.userOneMap.userId] = data.userOneMap;
                fun.db.setData('RoomInfo', roomInfo);
                return;
            }
        }
    },
    onReadyIn: function onReadyIn(data) {
        cc.log('onReadyIn--------', data);
        if (!data.ready) return;
        var seat = this.getSeatByUserId(data.ready);
        if (!seat) return;
        seat.ui.showReady(true);
    },
    onReadyNextIn: function onReadyNextIn(data) {
        cc.log('onReadyNextIn--------', data);
        this.setReadyState(true);
    },
    onBankerIn: function onBankerIn(data) {
        cc.log('onBankerIn--------', data);
        this._gameStatu = 2;
        this.setJiaWeiShow(data.Zhuangjia);
        this.node.getChildByName('roomDescScrollView').active = false;
    },
    onRockCardIn: function onRockCardIn(data) {
        cc.log('onRockCardIn--------', data);
        var yzNode = this.node.getChildByName('yaozhang');
        for (var i = 0; i < data.rollChessDice.length; ++i) {
            var yz = WhUtils.getCardById(data.rollChessDice[i]);
            var yzCard = yzNode.getChildByName('card' + (i + 1)).getComponent(cc.Sprite);
            yzCard.spriteFrame = this.paiMianAltas.getSpriteFrame(yz);
        }
        var szCallback = function szCallback() {
            yzNode.active = true;
        };
        var szCard = WhUtils.getCardById(data.rollChessDice[0]);
        var szPoint = WhUtils.getSaiziPointByCard(szCard);
        fun.event.dispatch('wahuaSaiziEnd', { point: szPoint, callback: szCallback });
    },
    onUserRefreshIn: function onUserRefreshIn(data) {
        cc.log('onUserRefreshIn--------', data);
    },
    onNoneOpsIn: function onNoneOpsIn(data) {
        cc.log('onNoneOpsIn--------', data);
    },
    onStartGameIn: function onStartGameIn(data) {
        cc.log('onStartGameIn--------', data);
    },
    onPlayCardIn: function onPlayCardIn(data) {
        cc.log('onPlayCardIn--------', data);
    },
    onDrawCardIn: function onDrawCardIn(data) {
        cc.log('onDrawCardIn--------', data);
    },
    onOpsAcceptIn: function onOpsAcceptIn(data) {
        cc.log('onOpsAcceptIn--------', data);
    },
    onRepairCardIn: function onRepairCardIn(data) {
        cc.log('onRepairCardIn--------', data);
    },
    onOneAccountIn: function onOneAccountIn(data) {
        cc.log('onOneAccountIn--------', data);
    },
    onAllAccountIn: function onAllAccountIn(data) {
        cc.log('onAllAccountIn--------', data);
    },
    onDisbandRoomIn: function onDisbandRoomIn(data) {
        cc.log('onDisbandRoomIn--------', data);
        this.exitRoom();
    },
    onQuitRoomIn: function onQuitRoomIn(data) {
        var roomInfo = fun.db.getData('RoomInfo');
        delete roomInfo.userMap[data.userId];
        fun.db.setData('RoomInfo', roomInfo);
    },
    onDisbandRoomVoteIn: function onDisbandRoomVoteIn(data) {
        cc.log('onDisbandRoomVoteIn--------', data);
    },
    onDisbandRoomResultIn: function onDisbandRoomResultIn(data) {
        cc.log("DisbandRoomResult---------------", data);
    },
    onOffLineIn: function onOffLineIn(data) {
        fun.event.dispatch('OffLineState', { flag: true, userId: parseInt(data.outLine) });
    },
    onOnLineIn: function onOnLineIn(data) {
        fun.event.dispatch('OffLineState', { flag: false, userId: parseInt(data.userId) });
    },
    exitRoom: function exitRoom() {
        var userInfo = fun.db.getData('UserInfo');
        userInfo.RoomId = 0;
        fun.db.setData('UserInfo', userInfo);
        cc.director.loadScene('hall');
    }
});

cc._RF.pop();