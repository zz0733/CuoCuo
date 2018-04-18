"use strict";
cc._RF.push(module, '860a3+dHu5BtYpvy7w8LVFg', 'hallShare');
// hall/script/hall/hallShare.js

'use strict';

var Audio = require('Audio');
var HuoDongResult = cc.Enum({
    'FAILED': 0, //失败
    'SUCCESS': 1, //成功
    'EXPIRED': 2, //过期
    'WAITING': 3, //未开启
    'MISS': 4, //不存在
    'SUCCESSED': 5 //已完成
});
var TransformGameType = [3, 1, 5]; //3-黄岩 5-挖花 1-温岭
var ExchangeResult = cc.Enum({
    'FAIL': 0, //失败
    'SUCCESS': 1, //成功
    'NOWAY': 2, //无法兑换
    'LACKOFF': 3 //物品不足
});

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var bg = this.node.getChildByName('back');
        for (var i = 0; i < 3; ++i) {
            this['btnGame' + (i + 1)] = bg.getChildByName('btnGame' + (i + 1));
        }
        bg.getChildByName('btnShare').on('click', this.onBtnShareClick, this);
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        for (var _i = 0; _i < 3; ++_i) {
            bg.getChildByName('btnGame' + (_i + 1)).on('click', this.onBtnExchangeClick.bind(this, TransformGameType[_i]));
        }

        this.checkRoomCard();

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();

        this._leftTicket = bg.getChildByName('leftTicket').getComponent(cc.Label);
        fun.event.add('ShareWeChatShareResult', 'PhoneWeChatShareResult', function (result) {
            if (result) {
                fun.csv.getHuoDong('day_share', function (huodong) {
                    fun.net.pSend('HuoDong', { Type: parseInt(huodong.INT_Type) }, function (data) {
                        if (data.result === HuoDongResult.SUCCESS) {
                            fun.event.dispatch('MinSingleButtonPop', { contentStr: '获得房卡兑换券 ' + data.Delta + ' 张' });
                            this._leftTicket.string = parseInt(this._leftTicket.string) + data.Delta;
                        } else if (data.result === HuoDongResult.SUCCESSED) fun.event.dispatch('MinSingleButtonPop', { contentStr: '今日已完成分享获得房卡兑换券活动！' });else fun.event.dispatch('MinSingleButtonPop', { contentStr: '获取房卡兑换券失败！' });
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    },
    onDestroy: function onDestroy() {
        fun.event.remove('ShareWeChatShareResult');
    },
    checkRoomCard: function checkRoomCard() {
        fun.net.pSend('RoomCard', { GameType: gameConst.gameType.maJiangHuangYan }, function (data) {
            if (data.TollCardCnt !== undefined) {
                this.btnGame1.getChildByName('num').getComponent(cc.Label).string = data.TollCardCnt;
            }
            fun.net.pSend('RoomCard', { GameType: gameConst.gameType.maJiangWenLing }, function (data) {
                if (data.TollCardCnt !== undefined) {
                    this.btnGame2.getChildByName('num').getComponent(cc.Label).string = data.TollCardCnt;
                }
            }.bind(this));
        }.bind(this));
        this.btnGame3.getChildByName('num').getComponent(cc.Label).string = 0;
    },
    setLeftTicket: function setLeftTicket(num) {
        this._leftTicket.string = num;
    },
    onBtnShareClick: function onBtnShareClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        require('JSPhoneWeChat').WxShareCircle();
    },
    onBtnExchangeClick: function onBtnExchangeClick(gameType) {
        if (gameType === 5) {
            fun.event.dispatch('MinSingleButtonPop', { contentStr: '暂未开放兑换功能, 敬请期待！' });
            return;
        }
        if (parseInt(this._leftTicket.string) <= 0) {
            fun.event.dispatch('MinSingleButtonPop', { contentStr: '房卡兑换券不足，请分享朋友圈获得房卡兑换券！' });
            return;
        }
        var gameTypeCN = gameConst.gameTypeZhNameMap[gameType];
        var content = '您是否要将所有的房卡兑换券兑换成 ' + gameTypeCN + ' 的房卡？';
        var okCb = function () {
            fun.net.pSend('ExchgGood', { Type: gameConst.itemCsv.voucher, GameType: gameType }, function (data) {
                if (data.result === ExchangeResult.SUCCESS) {
                    var nowCnt = parseInt(this._leftTicket.string) - data.itemCnt;
                    this._leftTicket.string = nowCnt < 0 ? 0 : nowCnt;
                    var contentSuc = '使用了 ' + data.itemCnt + ' 房卡兑换券兑换了 ' + data.cardsCnt + ' 张 ' + gameTypeCN + ' 房卡';
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: contentSuc });
                    for (var i = 0; i < TransformGameType.length; ++i) {
                        if (TransformGameType[i] === gameType) {
                            var initNum = this['btnGame' + (i + 1)].getChildByName('num').getComponent(cc.Label).string;
                            this['btnGame' + (i + 1)].getChildByName('num').getComponent(cc.Label).string = initNum + data.cardsCnt;
                        }
                    }
                } else {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '兑换房卡失败！' });
                }
            }.bind(this));
        }.bind(this);
        fun.event.dispatch('MinSingleButtonPop', { contentStr: content, okCb: okCb });
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();