"use strict";
cc._RF.push(module, '5c2c986lEhMi7NzGu9qs5H1', 'createNiuNiuRoom');
// hall/script/createRoom/createNiuNiuRoom.js

'use strict';

var PukeDefine = require('PukeDefine');
var PukeUtils = require('PukeUtils');
var Audio = require('Audio');
var WanFaEnum = cc.Enum({
    kanDou: 1,
    wuHua: 2,
    zhaDan: 3,
    wuXiao: 4
});
var SpecialEnum = cc.Enum({
    xianJia: 1,
    joinLimit: 2,
    zhangSuo: 3,
    shunDou: 4
});

cc.Class({
    extends: cc.Component,

    properties: {
        FangFei: cc.Node,
        JuShu: cc.Label,
        CurrentCard: cc.Label,
        RoomCard: cc.Label,
        DingZhuang: cc.Node,
        DiFen: cc.Node,
        ShiXian: cc.Node,
        TeShu: cc.Node,
        WanFa: cc.Node,
        BeiShu: cc.Node,
        btnHitzone: cc.Node
    },

    onLoad: function onLoad() {
        if (fun.gameCfg.releaseType === gameConst.releaseType.apple) {
            var down = this.node.getChildByName('back').getChildByName('down');
            down.getChildByName('btnRecharge').active = false;
            var createN = down.getChildByName('btnCreateRoom');
            createN.getChildByName('text').active = false;
            createN.getChildByName('num').active = false;
        }
        this.ListBack = this.BeiShu.getChildByName("list").getChildByName("listback");
        this.BeiShuText = this.BeiShu.getChildByName("initLabel").getComponent(cc.Label);
        this.BeiShuText.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[0];
        for (var i = 0; i < this.ListBack.children.length; ++i) {
            var content = this.ListBack.getChildByName('content');
            for (var j in content.children) {
                var contentL = content.children[j].getComponent(cc.Label);
                contentL.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[j];
            }
        }
        this.setBeiShuBackActive(1);
        var createInfo = fun.utils.getCreateRoomData(gameConst.gameType.niuNiu);
        if (createInfo) {
            this.setToggleChecked('FangFei', createInfo.reduceCard);
            this.setToggleChecked('DingZhuang', createInfo.makersType);
            this.setToggleChecked('DiFen', createInfo.bottomScore);
            this.setToggleChecked('ShiXian', createInfo.timeLimit + 1);
            this.BeiShuText.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[createInfo.typeScore - 1];
            this.setBeiShuBackActive(createInfo.typeScore);
            this.JuShu.string = (createInfo.roomNum + 1) * 5;
            this.setMuToggleNotChecked();
            for (var key in createInfo.Special) {
                for (var k in WanFaEnum) {
                    if (key === k) {
                        this.WanFa.getChildByName('toggle' + WanFaEnum[k]).getComponent(cc.Toggle).isChecked = true;
                    }
                }
                for (var _k in SpecialEnum) {
                    if (key === _k) {
                        this.TeShu.getChildByName('toggle' + SpecialEnum[_k]).getComponent(cc.Toggle).isChecked = true;
                    }
                }
            }
        }
        this.RoomCard.string = this.JuShu.string;

        this.KanDou = this.WanFa.getChildByName("toggle1").getComponent(cc.Toggle);
        this.ShunDou = this.TeShu.getChildByName("toggle4");
        this.isShunDouShow(this.KanDou.isChecked);
        this.downAction = false;

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },


    setToggleChecked: function setToggleChecked(name, value) {
        for (var i = 0; i < this[name].children.length; ++i) {
            this[name].getChildByName('toggle' + (i + 1)).getComponent(cc.Toggle).isChecked = false;
        }
        this[name].getChildByName('toggle' + value).getComponent(cc.Toggle).isChecked = true;
    },

    setMuToggleNotChecked: function setMuToggleNotChecked() {
        for (var i = 0; i < this.WanFa.children.length; ++i) {
            this.WanFa.getChildByName('toggle' + (i + 1)).getComponent(cc.Toggle).isChecked = false;
        }
        for (var _i = 0; _i < this.TeShu.children.length; ++_i) {
            this.TeShu.getChildByName('toggle' + (_i + 1)).getComponent(cc.Toggle).isChecked = false;
        }
    },

    setBeiShuBackActive: function setBeiShuBackActive(num) {
        var back = this.ListBack.getChildByName('back');
        for (var i in back.children) {
            back.children[i].active = false;
        }
        back.getChildByName('back' + parseInt(num)).active = true;
    },

    // 牛牛倍数下拉列表
    niuBtnBeiShuList: function niuBtnBeiShuList() {
        this.listAction(this.downAction);
    },
    listAction: function listAction(isDown) {
        this.downAction = !this.downAction;
        this.btnHitzone.active = !isDown;
        var position = { x: 0, y: 220 };
        if (!isDown) {
            position.y = 0;
        }
        var moveto = cc.moveTo(0.3, position);
        moveto.easing(cc.easeSineInOut());
        this.ListBack.stopAllActions();
        this.ListBack.runAction(moveto);
    },
    onBtnHitzoneClicked: function onBtnHitzoneClicked() {
        this.btnHitzone.active = false;
        this.listAction(true);
    },
    // 牛牛选择倍数
    niuChooseBeiShu: function niuChooseBeiShu(sender, num) {
        this.BeiShuText.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[parseInt(num) - 1];
        this.setBeiShuBackActive(num);
        this.listAction(true);
    },

    // 减少局数
    onBtnLessClicked: function onBtnLessClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var juShu = parseInt(this.JuShu.string);
        if (juShu > PukeDefine.CREATE_JUSHU_MIN) {
            this.JuShu.string = juShu - PukeDefine.CREATE_JUSHU_SPACE;
            this.RoomCard.string = this.JuShu.string;
        }
    },

    // 增加局数
    onBtnAddClicked: function onBtnAddClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var juShu = parseInt(this.JuShu.string);
        if (juShu < PukeDefine.CREATE_JUSHU_MAX) {
            this.JuShu.string = juShu + PukeDefine.CREATE_JUSHU_SPACE;
            this.RoomCard.string = this.JuShu.string;
        }
    },

    // 牛牛创建房间
    onBtnCreateClicked: function onBtnCreateClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var data = {};
        data.Special = {};
        for (var i = 1; i <= 2; i++) {
            var togFF = this.FangFei.getChildByName("toggle" + i).getComponent(cc.Toggle);
            if (togFF.isChecked) {
                data.reduceCard = i; //房费
            }
        }
        for (var _i2 = 1; _i2 <= 4; _i2++) {
            var togDF = this.DiFen.getChildByName("toggle" + _i2).getComponent(cc.Toggle);
            if (togDF.isChecked) {
                data.bottomScore = _i2; //底分
            }
            var togSX = this.ShiXian.getChildByName("toggle" + _i2).getComponent(cc.Toggle);
            if (togSX.isChecked) {
                data.timeLimit = _i2 - 1; //时限
            }
            var togTS = this.TeShu.getChildByName("toggle" + _i2).getComponent(cc.Toggle);
            if (togTS.isChecked) {
                var name = PukeDefine.NIUNIU_ROOM_INFO.NIU_SPECIAL[_i2 - 1 + 4];
                data.Special[name] = 1; //特殊
            }
            var togWF = this.WanFa.getChildByName("toggle" + _i2).getComponent(cc.Toggle);
            if (togWF.isChecked) {
                var _name = PukeDefine.NIUNIU_ROOM_INFO.NIU_SPECIAL[_i2 - 1];
                data.Special[_name] = 1; //玩法
            }
        }
        for (var _i3 = 1; _i3 <= 5; _i3++) {
            var togDZ = this.DingZhuang.getChildByName("toggle" + _i3).getComponent(cc.Toggle);
            if (togDZ.isChecked) {
                data.makersType = _i3; //定庄
            }
        }
        var typeScore = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE;
        var typeScoreText = this.BeiShuText.string;
        for (var _i4 in typeScore) {
            if (typeScoreText === typeScore[parseInt(_i4)]) {
                data.typeScore = parseInt(_i4) + 1; //倍数
            }
        }
        data.Address = fun.db.getData('UserInfo').location;
        data.GameType = gameConst.gameType.niuNiu; //游戏种类 - 牛牛
        data.Zone = 0; //是否分区
        data.roomNum = parseInt(this.JuShu.string) / 5 - 1; //总局数
        fun.event.dispatch('Zhuanquan', true);
        fun.net.pSend('CreateRoom', data, function (rsp) {
            fun.event.dispatch('Zhuanquan', false);
            if (rsp.returnStatu !== undefined && rsp.returnStatu === 1) {
                rsp.EnterRoom = 'create';
                fun.db.setData('RoomInfo', rsp);
                fun.utils.saveCreateRoomData(data);
                cc.director.preloadScene('puke', function () {
                    fun.event.dispatch('Zhuanquan', false);
                    cc.director.loadScene('puke');
                });
            } else {
                fun.event.dispatch('Zhuanquan', false);
                if (rsp.RetCode !== undefined && rsp.RetCode === 10) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '服务未开启' });
                    fun.log('createNiuNiuRoom', 'CreateRoom RetCode = ' + rsp.RetCode);
                    return;
                }
                if (rsp.returnStatu === undefined || rsp.returnStatu === 2) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '用户参数异常' });
                } else if (rsp.returnStatu === 3) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '房卡不足' });
                } else {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '创建房间失败' });
                }
                fun.log('createNiuNiuRoom', 'CreateRoom returnStatu = ' + rsp.returnStatu);
            }
        }.bind(this));
    },

    isShunDouShow: function isShunDouShow(isChecked) {
        this.ShunDou.getComponent(cc.Toggle).isChecked = isChecked;
        this.ShunDou.getChildByName("mask").active = !isChecked;
    },

    // 选择坎斗
    onBtnKanDouClicked: function onBtnKanDouClicked() {
        this.isShunDouShow(this.KanDou.isChecked);
    },

    // 房卡充值
    onBtnRechargeClicked: function onBtnRechargeClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        cc.log('房卡充值');
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();