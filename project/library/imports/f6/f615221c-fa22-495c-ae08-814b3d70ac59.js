"use strict";
cc._RF.push(module, 'f6152Ic+iJJXK4IgUs9cKxZ', 'zhanjiDetailItem');
// hall/script/zhanji/zhanjiDetailItem.js

'use strict';

var Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {

        ownNameColor: {
            default: cc.Color.WHITE,
            displayName: '自己名字颜色'
        },

        otherNameColor: {
            default: cc.Color.WHITE,
            displayName: '别人名字颜色'
        },

        addScoreColor: {
            default: cc.Color.WHITE,
            displayName: '加分颜色'
        },

        subScoreColor: {
            default: cc.Color.WHITE,
            displayName: '减分颜色'
        },

        maxUser: {
            default: 4,
            displayName: '最多玩家数'
        },

        juShuLabel: {
            type: cc.Label,
            default: null
        },

        btnShare: {
            type: cc.Node,
            default: null
        },

        btnPlay: {
            type: cc.Node,
            default: null
        }
    },

    onLoad: function onLoad() {
        if (this.btnShare) {
            this.btnShare.on('click', this.onBtnShareClick, this);
        }
        if (this.btnPlay) {
            this.btnPlay.on('click', this.onBtnPlayClick, this);
        }
    },
    init: function init(uid, gameType, accountData, userData) {
        this._selfId = fun.db.getData('UserInfo').UserId;
        this._uid = uid;
        this._gameType = gameType;
        this._round = accountData.round;
        var round = this._round;
        if (round < 10) {
            round = "0" + round;
        }
        this.juShuLabel.string = round;
        for (var i = 0; i < this.maxUser; i++) {
            var head = this.node.getChildByName('head' + (i + 1));
            if (accountData.players[i]) {
                var nameNode = head.getChildByName('name');
                nameNode.getComponent(cc.Label).string = userData[accountData.players[i].userId].name;
                fun.utils.loadUrlRes(userData[accountData.players[i].userId].url, head.getChildByName('icon'));
                if (this._selfId === accountData.players[i].userId) {
                    nameNode.color = this.ownNameColor;
                } else {
                    nameNode.color = this.otherNameColor;
                    head.cascadeOpacity = false;
                    head.opacity = 0;
                }
                var score = accountData.players[i].score || 0;
                var scoreNode = head.getChildByName('fenshu');
                scoreNode.getComponent(cc.Label).string = score;
                if (score >= 0) {
                    scoreNode.color = this.addScoreColor;
                } else {
                    scoreNode.color = this.subScoreColor;
                }
            } else {
                head.active = false;
            }
        }
    },
    onBtnShareClick: function onBtnShareClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        fun.net.pSend('ShareRecord', { GameType: this._gameType, Id: this._uid, Round: this._round }, function (data) {
            var title = gameConst.gameTypeZhNameMap[this._gameType] + '-\u56DE\u653E\u7801\uFF1A' + data.shareCode;
            require('JSPhoneWeChat').WxShareFriend({ title: title, content: '在战绩界面输入回放码即可查看战绩录像' });
        }.bind(this));
    },
    onBtnPlayClick: function onBtnPlayClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        fun.event.dispatch('Zhuanquan', { flag: true, text: '回放加载中，请稍后...' });
        fun.net.pSend('ReplayRecord', { GameType: this._gameType, Id: this._uid, Round: this._round }, function (data) {
            if (data.RetCode && data.RetCode !== 0) {
                fun.event.dispatch('Zhuanquan', { flag: false });
            }
            fun.db.setData('ReplayInfo', data);
        }.bind(this));
    }
});

cc._RF.pop();