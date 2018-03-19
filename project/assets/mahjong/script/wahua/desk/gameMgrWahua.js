const WhUtils = require('whUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnExit: {
            type: cc.Node,
            default: null,
        },

        btnReady: {
            type: cc.Node,
            default: null,
        },

        btnInvite: {
            type: cc.Node,
            default: null,
        },

        paiMianAltas: {
            type: cc.SpriteAtlas,
            default: null,
        },
    },

    onLoad () {
        fun.event.dispatch('Zhuanquan', {flag: false});
        fun.net.setGameMsgCfg(require('WahuaCfg'));
        this._userId = fun.db.getData('UserInfo').UserId;
        let roomInfo = fun.db.getData('RoomInfo');
        this._gameStatu = roomInfo.roomRule.gameStatu;
        this._isRoomOwner = (this._userId.toString() === roomInfo.roomRule.roomOwner);
        this._playerNum = roomInfo.roomRule.playerNum;
        this._seat = new Array();
        this._seatDir = ['xia', 'you', 'shang', 'zuo'];

        this.btnExit.on('click', this.onBtnExitClick, this);
        this.btnReady.on('click', this.onBtnReadyClick, this);
        this.btnInvite.on('click', this.onBtnInviteClick, this);
        this.registerListener();
    },

    start() {
        this.reconnet();

    },

    registerListener() {
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
    removeListener() {
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

    onDestroy() {
        this.removeListener();
        this._seat = [];
        this._seatDir = [];
    },

    updateSeats(p) {
        if (!p && p !== 0) return;
        this._seat[p] = {};
        this._seat[p].ui = this.node.getChildByName(this._seatDir[p]).getComponent('playerUiWahua');
        this._seat[p].pos = p;
        this._seat[p].id = this._seat[p].ui.data ? this._seat[p].ui.data.userId : undefined;
        cc.log('--- this._seat: ', this._seat);
    },

    getSeatByUserId(id) {
        for (let i=0; i<this._seat.length; ++i) {
            if (this._seat[i] && this._seat[i].id && this._seat[i].id === id) {
                return this._seat[i];
            }
        }
    },

    reconnet() {
        let roomInfo = fun.db.getData('RoomInfo');
        if(!roomInfo.userMap) return;
        let roomRule = roomInfo.roomRule;
        let userMap = roomInfo.userMap;
        let selfReadyState = userMap[this._userId].currentState;
        this.setReadyState(selfReadyState === 0 ? true : false);
        if (roomRule.nowZhuangjia) {
            this.setJiaWeiShow(roomRule.nowZhuangjia);
        }
        if (roomRule.rollChessDice) {
            this.showYaoZhang(roomRule.rollChessDice, true);
        }
        for (let id in userMap) {
            if (!userMap[id].alreadyChess) return;
            this.showCardById(id, userMap[id].alreadyChess);
        }
    },

    showYaoZhang(yaozhang, isReconnet) {
        let yzNode = this.node.getChildByName('yaozhang');
        for (let i=0; i<yaozhang.length; ++i) {
            let yz = WhUtils.getCardById(yaozhang[i]);
            let yzCard = yzNode.getChildByName('card'+(i+1)).getComponent(cc.Sprite);
            yzCard.spriteFrame = this.paiMianAltas.getSpriteFrame(yz);
        }
        if (isReconnet) {
            yzNode.active = true;
        }
    },

    showCardById(id, cards) {
        let seat = this.getSeatByUserId(id);
        if(!seat) return;
        seat.ui.setCardShow(cards);
    },

    setReadyState(flag) {
        this.btnReady.active = flag;
        if (this._gameStatu === 1) return;
        this.btnInvite.active = false;
        this.btnExit.active = false;
    },

    setJiaWeiShow(id) {
        this.node.getChildByName('roomDescScrollView').active = false;
        let tSeat = this.getSeatByUserId(id);
        let tPos = tSeat.pos;
        let newSeat = new Array(); // 0-天家 1-地家 2-银牌 3-长三
        for (let i=0; i<this._seat.length; ++i) {
            if (this._seat[i]) {
                let curPos = this._seat[i].pos;
                let dir = 0;
                let cha = curPos - tPos;
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
        for (let dir=0; dir<newSeat.length; ++dir) {
            if (newSeat[dir]) {
                newSeat[dir].ui.setDirect(dir);
            }
        }
    },

    onBtnExitClick() {
        if (this._gameStatu === 1) {
            if (this._isRoomOwner) {
                fun.net.send('DisbandRoom', {}, function(rsp) {
                    cc.log('DisbandRoom-----------', rsp);
                    this.exitRoom();
                }.bind(this));
            } else {
                fun.net.send('QuitRoom', {}, function(rsp) {
                    cc.log('QuitRoom---------', rsp);
                    this.exitRoom();
                }.bind(this));
            }
        } else {
            fun.net.send('DisbandRoomVote', {applyStatu: 0}, function(rsp) {
                cc.log('DisbandRoomVote--------', rsp);
                this.exitRoom();
            }.bind(this));
        }
    },

    onBtnReadyClick() {
        fun.net.send('Ready', {}, function(rsp) {
            if (rsp.returnStatu && rsp.returnStatu === 1) {
                let seat = this.getSeatByUserId(rsp.ready);
                if (!seat) return;
                seat.ui.showReady(true);
                this.setReadyState(false);
            }
        }.bind(this));
    },
    onBtnInviteClick() {
        cc.log('--- invite ---')
    },

    onEnterRoomIn(data) {
        let roomInfo = fun.db.getData('RoomInfo');
        if (!roomInfo.userMap) {
            roomInfo.userMap = {};
        }
        for (const key in data.userOneMap) {
            if (key === 'userId') {
                roomInfo.userMap[data.userOneMap.userId] = data.userOneMap;
                fun.db.setData('RoomInfo', roomInfo);
                return;
            }
        }
    },

    onReadyIn(data) {
        cc.log('onReadyIn--------', data);
        if (!data.ready) return;
        let seat = this.getSeatByUserId(data.ready);
        if (!seat) return;
        seat.ui.showReady(true);
    },

    onReadyNextIn(data) {
        cc.log('onReadyNextIn--------', data);
        this.setReadyState(true);
    },

    onBankerIn(data) {
        cc.log('onBankerIn--------', data);
        this._gameStatu = 2;
        this.setJiaWeiShow(data.Zhuangjia);
        this.setReadyState(false);
        for(let i=0; i<this._seat.length; ++i){
            if (this._seat[i]) {
                this._seat[i].ui.showReady(false);
            }
        }
    },

    onRockCardIn(data) {
        cc.log('onRockCardIn--------', data);
        let yzNode = this.node.getChildByName('yaozhang');
        this.showYaoZhang(data.rollChessDice);
        let szCallback = function(){
            yzNode.active = true;
        };
        let szCard = WhUtils.getCardById(data.rollChessDice[0]);
        let szPoint = WhUtils.getSaiziPointByCard(szCard);
        fun.event.dispatch('wahuaSaiziEnd', {point: szPoint, callback: szCallback});
    },

    onUserRefreshIn(data) {
        cc.log('onUserRefreshIn--------', data);
    },

    onNoneOpsIn(data) {
        cc.log('onNoneOpsIn--------', data);
    },

    onStartGameIn(data) {
        cc.log('onStartGameIn--------', data);
        this.showCardById(this._userId, data.alreadyChess);
    },

    onPlayCardIn(data) {
        cc.log('onPlayCardIn--------', data);
    },

    onDrawCardIn(data) {
        cc.log('onDrawCardIn--------', data);
    },

    onOpsAcceptIn(data) {
        cc.log('onOpsAcceptIn--------', data);
    },

    onRepairCardIn(data) {
        cc.log('onRepairCardIn--------', data);
    },

    onOneAccountIn(data) {
        cc.log('onOneAccountIn--------', data);
    },

    onAllAccountIn(data) {
        cc.log('onAllAccountIn--------', data);
    },

    onDisbandRoomIn(data) {
        cc.log('onDisbandRoomIn--------', data);
        this.exitRoom();
    },

    onQuitRoomIn(data) {
        let roomInfo = fun.db.getData('RoomInfo');
        delete roomInfo.userMap[data.userId];
        fun.db.setData('RoomInfo', roomInfo);
    },

    onDisbandRoomVoteIn(data) {
        cc.log('onDisbandRoomVoteIn--------', data);
    },

    onDisbandRoomResultIn(data) {
        cc.log("DisbandRoomResult---------------", data);
    },

    onOffLineIn(data) {
        fun.event.dispatch('OffLineState', {flag: true, userId: parseInt(data.outLine)});
    },

    onOnLineIn(data) {
        fun.event.dispatch('OffLineState', {flag: false, userId: parseInt(data.userId)});
    },

    exitRoom() {
        let userInfo = fun.db.getData('UserInfo');
        userInfo.RoomId = 0;
        fun.db.setData('UserInfo', userInfo);
        cc.director.loadScene('hall');
    },

});
