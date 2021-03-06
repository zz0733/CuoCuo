let GameCfg = require('GameCfg')
let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
        createMajiangRoomHY: {
            type: cc.Prefab,
            default: null,
        },
        createMajiangRoomWL: {
            type: cc.Prefab,
            default: null,
        },

        createSanGongRoomPre: {
            type: cc.Prefab,
            default: null,
        },

        createNiuNiuRoomPre: {
            type: cc.Prefab,
            default: null,
        },

        createRoomWahua: {
            type: cc.Prefab,
            default: null,
        },

        createRoomDDZ: {
            type: cc.Prefab,
            default: null,
        },

        createRoomXuezhan: {
            type: cc.Prefab,
            default: null,
        },

        zhanjiLayerPre: {
            type: cc.Prefab,
            default: null,
        },

        activityPre: {
            type: cc.Prefab,
            default: null,
        },

        hallSharePre: {
            type: cc.Prefab,
            default: null,
        },

        moreGamePre: {
            type: cc.Prefab,
            default: null,
        },

        newsLayerPre: {
            type: cc.Prefab,
            default: null,
        },

        renzhengPre: {
            type: cc.Prefab,
            default: null,
        },

        setPanelPre: {
            type: cc.Prefab,
            default: null,
        },

        storePre: {
            type: cc.Prefab,
            default: null,
        },
    },

    onLoad() {
        this._isTestnet = fun.gameCfg.loginUrl === gameConst.loginUrl[gameConst.loginUrlType.test] ? true : false;
        this._isIntranet = fun.gameCfg.loginUrl === gameConst.loginUrl[gameConst.loginUrlType.intranet] ? true : false;
        cc.YL._isTestServer = this._isTestnet || this._isIntranet;// 保存当前的服务器类型，是否是测试
        this._isRelease = fun.gameCfg.releaseType === gameConst.releaseType.release ? true : false;
        this._isApple = fun.gameCfg.releaseType === gameConst.releaseType.apple ? true : false;
        this._isFisher = fun.gameCfg.releaseType === gameConst.releaseType.fisher ? true : false;
        if (cc.sys.isNative) {
            require('JSPhoneBaiDu').getBaiDuLocation();
        }
        this.enterRoomHandle = [];
        this.addEnterRoomHandle(gameConst.gameType.universal, this.platformEnterRoomHandle.bind(this));
        this.addEnterRoomHandle(gameConst.gameType.maJiangHuangYan, this.mahjongEnterRoomHandle.bind(this));
        this.addEnterRoomHandle(gameConst.gameType.maJiangWenLing, this.mahjongEnterRoomHandle.bind(this));
        this.addEnterRoomHandle(gameConst.gameType.digFlower, this.digFlowerEnterRoomHandle.bind(this));
        this.addEnterRoomHandle(gameConst.gameType.DDZ, this.DDZEnterRoomHandle.bind(this));
        this.addEnterRoomHandle(gameConst.gameType.scMahjong, this.mahjongEnterRoomHandle.bind(this));
        fun.net.setGameMsgCfg({});
        fun.gameCfg.voiceLanguage = cc.sys.localStorage.getItem('voiceLanguage') || fun.gameCfg.voiceLanguage;
        let valumeData = cc.sys.localStorage.getItem('valumeData');
        if (valumeData) {
            valumeData = JSON.parse(valumeData);
            let s = valumeData.sound, m = valumeData.music;
            fun.gameCfg.soundValume = (s && s > 0) ? s : (s === 0 ? 0 : 0.8);
            fun.gameCfg.musicValume = (m && m > 0) ? m : (m === 0 ? 0 : 0.8);
        }

        this._mainBasic = this.node.getChildByName('mainBasic');
        this.upNode = this._mainBasic.getChildByName('up');
        this.renzhengBtn = this.upNode.getChildByName('renzhengBtn');
        this.renzhengBtn.on('click', this.onRenzhengBtnClick, this);
        this.head = this.upNode.getChildByName('head');
        this.head.on('click', this.onHeadClick, this);
        const userInfo = fun.db.getData('UserInfo');
        this.showUserInfo(userInfo);
        if (userInfo.RoomId && userInfo.RoomId != 0) {
            this.enterRoom(userInfo.RoomId);
        } else {
            // if (!this._isIntranet && !this._isTestnet) {
                let initNode = this.node;
                setTimeout(function () {
                    if (!fun.db.getNeedNotice()) {
                        let notice = initNode.getChildByName('notice');
                        notice.getComponent(cc.Animation).play('popScaleAnim');
                        notice.active = true;
                        fun.db.setNeedNotice(true);
                        notice.getChildByName('back').getChildByName('box').getChildByName('btnClose').on('click', function () {
                            let animState = notice.getComponent(cc.Animation).play('popScaleOut');
                            animState.once('finished', function () {
                                notice.active = false;
                            });
                        });
                    }
                }, 500);
            // }
        }
        this.leftNode = this._mainBasic.getChildByName('left');
        this.leftNode.getChildByName('btnJoin').on('click', this.onBtnJoinClick, this);

        this.gameBtns = [];
        this.rightNode = this._mainBasic.getChildByName('right');
        for (let i = 0; i < 4; i++) {
            this.gameBtns[i] = this.rightNode.getChildByName("btnGame" + (i + 1));
            this.gameBtns[i].active = true;
            this.gameBtns[i].on('click', this.onBtnGameClick.bind(this, i));
        }
        this.gameBtns.push(this.rightNode.getChildByName('btnGameMore'));
        this.gameBtns[this.gameBtns.length - 1].on('click', this.onBtnGameClick.bind(this, this.gameBtns.length - 1));
        
        this.appleReview(); //苹果审核用
        this.buttomNode = this._mainBasic.getChildByName('buttom');
        this.buttomNode.getChildByName('recordBtn').on('click', this.onRecordBtnClick, this);
        this.buttomNode.getChildByName('shareBtn').on('click', this.onShareBtnClick, this);
        this.buttomNode.getChildByName('setBtn').on('click', this.onSetBtnClick, this);
        this.buttomNode.getChildByName('activeBtn').on('click', this.onActiveBtnClick, this);
        let newsBtn = this.buttomNode.getChildByName('newsBtn');
        newsBtn.on('click', this.onNewsBtnClick, this);
        this.redPoint = newsBtn.getChildByName('redPoint');
        this.onNewMailIdIn(fun.db.getData('NewMailId'));

        Audio.playMusic('hall', 'BGM-mainUI.mp3');
        this.node.getChildByName('mainBasic').getChildByName('version').getComponent(cc.Label).string = gameConst.version;
        fun.event.add('HallUserInfo', 'UserInfo', this.showUserInfo.bind(this));
        fun.event.add('HallReplayInfo', 'ReplayInfo', this.onReplayInfoIn.bind(this));
        fun.event.add('HallEnterRoomId', 'EnterRoomId', this.enterRoom.bind(this));
        fun.event.add('HallNewMailId', 'NewMailId', this.onNewMailIdIn.bind(this));

        let applePayStr = JSON.parse(cc.sys.localStorage.getItem('applePayReceiptStr'));
        this.onPhonePayResultAck(applePayStr);


    },

    appleReview() {
        if (this._isApple) {
            let buttom = this.node.getChildByName('mainBasic').getChildByName('buttom');
            buttom.getChildByName('recordBtn').setPositionX(-420);
            buttom.getChildByName('activeBtn').setPositionX(-140);
            buttom.getChildByName('newsBtn').setPositionX(140);
            buttom.getChildByName('setBtn').setPositionX(420);
            buttom.getChildByName('shareBtn').active = false;
            this.upNode.getChildByName('storeBtn').active = true;
            this._mainBasic.getChildByName('Songka').active = false;

            this.gameBtns[0].setPositionY(100);
            this.gameBtns[1].setPositionY(100);
            this.gameBtns[2].active = false;
            this.gameBtns[3].active = false;
            let notice = this.leftNode.getChildByName('Notice');
            notice.setPositionY(notice.getPositionY() - 70);
            let btnJoin = this.leftNode.getChildByName('btnJoin');
            btnJoin.setPosition(cc.p(230, btnJoin.getPositionY() + 50));
        }
    },

    onPhonePayResultAck(msg) {
        if (msg && msg.check) {
            fun.net.pSend('ApPay', { ReceiptStr: msg.receipt }, function (data) {
                if (data.RetCode && data.RetCode !== 0) {
                    setTimeout(function () {
                        this.onPhonePayResultAck(msg);
                    }.bind(this), 5000);
                } else {
                    if (data.Status && data.Status === 1) {
                        cc.sys.localStorage.setItem('applePayReceiptStr', JSON.stringify({ check: false }));
                    } else {
                        setTimeout(function () {
                            this.onPhonePayResultAck(msg);
                        }.bind(this), 5000);
                    }
                }
            }.bind(this));
        }
    },

    addEnterRoomHandle(gameType, handler) {
        this.enterRoomHandle[gameType] = handler;
    },

    enterRoom(roomId = 0) {
        fun.event.dispatch('Zhuanquan', { flag: true, text: '加入房间中，请稍后...' });
        fun.net.pSend('EnterRoom', { RoomId: roomId, Address: fun.db.getData('UserInfo').location }, function (rsp) {
            if (rsp.GameType && this.enterRoomHandle[rsp.GameType]) {
                this.enterRoomHandle[rsp.GameType](rsp);
            } else {
                fun.event.dispatch('MinSingleButtonPop', { contentStr: gameConst.pRetCode[rsp.RetCode] });
                fun.event.dispatch('Zhuanquan', { flag: false });
            }

        }.bind(this));
    },

    platformEnterRoomHandle(data) {
        fun.event.dispatch('Zhuanquan', { flag: false });
        switch (data.RetCode) {
            case 1:
                fun.event.dispatch('MinSingleButtonPop', { contentStr: '服务器忙' });
                break;
            case 13:
                fun.event.dispatch('MinSingleButtonPop', { contentStr: '房间未找到' });
        }
    },

    digFlowerEnterRoomHandle(data) {
        if (data.returnStatu && data.returnStatu === 1) {
            fun.db.setData('RoomInfo', data);
            cc.director.loadScene(gameConst.gameTypeSceneNameMap[data.GameType]);
        } else {
            fun.event.dispatch('Zhuanquan', { flag: false });
        }
    },
    DDZEnterRoomHandle: function (data) {
        if (data.retMsg.code < 0) {
            cc.YL.err(data.retMsg.code);
        } else {
            cc.director.loadScene("DDZ_GameScene");
        }

    },
    mahjongEnterRoomHandle(data) {
        var codeCfg = {};
        var mjGameDefine = require("mjGameDefine");
        if (data.GameType == gameConst.gameType.maJiangHuangYan) {
            codeCfg = mjGameDefine.HYRETCODE;
        } else if (data.GameType == gameConst.gameType.maJiangWenLing) {
            codeCfg = mjGameDefine.WLRETCODE;
        } else if (data.GameType == gameConst.gameType.scMahjong) {
            codeCfg = mjGameDefine.SCRETCODE;
        }
        if (!data.RetCode) {
            data.EnterRoom = 'enter';
            fun.db.setData('RoomInfo', data);
            cc.director.loadScene(gameConst.gameTypeSceneNameMap[data.GameType]);
        } else {
            var self = this;
            //房卡不足，跳转商店
            if (data.RetCode == 19) {
                var gotoStore = function () {
                    self.showStore(data.GameType);
                };
                fun.event.dispatch('MinSingleButtonPop', {
                    contentStr: codeCfg[data.RetCode],
                    okBtnStr: "前往充值",
                    okCb: gotoStore
                });
            } else {
                fun.event.dispatch('MinSingleButtonPop', { contentStr: codeCfg[data.RetCode] });
            }
            fun.event.dispatch('Zhuanquan', { flag: false });
        }
    },

    showStore(gameType) {
        let isApple = fun.gameCfg.releaseType === gameConst.releaseType.apple ? true : false;
        let isIntranet = fun.gameCfg.loginUrl === gameConst.loginUrl[gameConst.loginUrlType.intranet] ? true : false;
        if (isApple || isIntranet) {
            let store = cc.instantiate(this.storePre);
            store.parent = this.node;
            store.getComponent('store').setGameType(gameType);
        } else {
            fun.event.dispatch('MinSingleButtonPop', { contentStr: '公测期间，免费畅玩！' });
        }
    },

    onRenzhengBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        if (this._isApple) {
            fun.event.dispatch('MinSingleButtonPop', { contentStr: '敬请期待！' });
        }
        return;
        let renzheng = cc.instantiate(this.renzhengPre);
        renzheng.parent = this.node;
    },

    onHeadClick() {

    },

    showUserInfo(data) {
        this.head.getChildByName('nickname').getComponent(cc.Label).string = data.UserName;
        this.head.getChildByName('userid').getComponent(cc.Label).string = data.UserId;
        fun.utils.loadUrlRes(data.UserHeadUrl, this.head.getChildByName('border'));
    },

    onReplayInfoIn(data) {
        data.record = JSON.parse(fun.base64.decode(data.record));
        switch (data.gameType) {
            case gameConst.gameType.maJiangWenLing:
                require("mjReplayMgr").setReplayData(gameConst.gameType.maJiangWenLing, data)
                break;
            case gameConst.gameType.maJiangHuangYan:
                require("mjReplayMgr").setReplayData(gameConst.gameType.maJiangHuangYan, data)
                break;
            case gameConst.gameType.DDZ: {
                cc.YL.DDZReplayData = data.record;
                cc.director.loadScene("DDZ_ReplayScene");
                break;
            }
        }
    },

    onNewMailIdIn(mId) {
        this.redPoint.active = mId > 0;
    },

    onBtnGameClick(index) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        switch (index) {
            case 0:
                fun.net.pSend('RoomCard', { GameType: gameConst.gameType.maJiangHuangYan }, function (data) {
                    if (data.RetCode && data.RetCode !== 0) return;
                    var hyNode = cc.instantiate(this.createMajiangRoomHY);
                    hyNode.parent = this.node;
                    hyNode.getComponent('createMajiangRoom').showRoomCard(data, gameConst.gameType.maJiangHuangYan);
                }.bind(this));
                break;
            case 1:
                fun.net.pSend('RoomCard', { GameType: gameConst.gameType.maJiangWenLing }, function (data) {
                    if (data.RetCode && data.RetCode !== 0) return;
                    var wlNode = cc.instantiate(this.createMajiangRoomWL);
                    wlNode.parent = this.node;
                    wlNode.getComponent('createMajiangRoom').showRoomCard(data, gameConst.gameType.maJiangWenLing);
                }.bind(this));
                break;
            case 2:
<<<<<<< HEAD
                fun.event.dispatch('MinSingleButtonPop', {contentStr: '敬请期待！'});
                return;
=======
                // fun.event.dispatch('MinSingleButtonPop', {contentStr: '敬请期待！'});
                // return;
>>>>>>> f8a5a6134d18df4ab898a5e431e5f0b36bc013ac
                // let sgNode = cc.instantiate(this.createSanGongRoomPre);
                // sgNode.parent = this.node;
                fun.net.pSend('RoomCard', { GameType: gameConst.gameType.DDZ }, function (data) {
                    if (data.RetCode && data.RetCode !== 0) return;
                    let DDZNode = cc.instantiate(this.createRoomDDZ);
                    DDZNode.parent = this.node;
                    DDZNode.getComponent('createDDZRoom').showRoomCard(data, gameConst.gameType.DDZ);
                }.bind(this));
                break;
            case 3:
                fun.event.dispatch('MinSingleButtonPop', {contentStr: '敬请期待！'});
                return;
                fun.net.pSend('RoomCard', { GameType: gameConst.gameType.scMahjong }, function (data) {
                    // if (data.RetCode && data.RetCode !== 0) return;
                    let xzNode = cc.instantiate(this.createRoomXuezhan);
                    xzNode.parent = this.node;
                    xzNode.getComponent('createScMahjongRoom').showRoomCard(data, gameConst.gameType.scMahjong);
                }.bind(this));
                /**
                 * 挖花
                fun.net.pSend('RoomCard', {GameType: gameConst.gameType.digFlower}, function (data) {
                    if (data.RetCode && data.RetCode !== 0) return;
                    let whNode = cc.instantiate(this.createRoomWahua);
                    whNode.parent = this.node;
                    whNode.getComponent('createWahuaRoom').showRoomCard(data, gameConst.gameType.digFlower);
                }.bind(this));
                */
                break;
        }
    },

    onBtnGameMoreClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        fun.event.dispatch('MinSingleButtonPop', { contentStr: '敬请期待！' });
        return;
        let gameMore = cc.instantiate(this.moreGamePre);
        gameMore.parent = this.node;
    },

    onRecordBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        const gameType = gameConst.gameType.maJiangHuangYan;
        fun.net.pSend('StandingBrief', { GameType: gameType, Start: 0 }, function (data) {
            let zhanjiLayer = cc.instantiate(this.zhanjiLayerPre);
            zhanjiLayer.parent = this.node;
            zhanjiLayer.getComponent('zhanjiLayer').init(gameType, data);
        }.bind(this));
    },

    onShareBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        fun.net.pSend('GoodCnt', { Type: gameConst.itemCsv.voucher }, function (data) {
            if (data.RetCode && data.RetCode !== 0) {
                fun.event.dispatch('MinSingleButtonPop', { contentStr: '查询兑换券失败!' });
                return;
            }
            let hallShare = cc.instantiate(this.hallSharePre);
            hallShare.parent = this.node;
            hallShare.getComponent('hallShare').setLeftTicket(data.Cnt);
        }.bind(this));
    },

    onNewsBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        if (this._isApple || this._isRelease) {
            let news = cc.instantiate(this.newsLayerPre);
            news.parent = this.node;
        } else {
            fun.net.pSend('MailList', { Page: 0, Count: 10 }, function (rsp) {
                fun.db.setData('NewMailId', false);
                let news = cc.instantiate(this.newsLayerPre);
                news.parent = this.node;
                news.getComponent('mailLayer').init(10, rsp.mInfos);
            }.bind(this));
        }
    },

    onSetBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let setPanel = cc.instantiate(this.setPanelPre);
        setPanel.parent = this.node;
    },

    onActiveBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let activity = cc.instantiate(this.activityPre);
        activity.parent = this.node;
    },

    onBtnJoinClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let enter = this.node.getChildByName('enterRoom');
        enter.active = true;
        enter.x = 0;
        enter.y = 0;
    },

    onStoreBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let store = cc.instantiate(this.storePre);
        store.parent = this.node;
    },

    onDestroy() {
        fun.event.remove('HallUserInfo');
        fun.event.remove('HallReplayInfo');
        fun.event.remove('HallEnterRoomId');
        fun.event.remove('HallNewMailId');
        Audio.stopMusic();

    },
});
