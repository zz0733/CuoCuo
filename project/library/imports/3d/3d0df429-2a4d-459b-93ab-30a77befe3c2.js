"use strict";
cc._RF.push(module, '3d0dfQpKk1Fm5OrMKd77+PC', 'createSanGongRoom');
// hall/script/createRoom/createSanGongRoom.js

'use strict';

var PukeDefine = require('PukeDefine');
var Audio = require('Audio');

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
        TeShu: cc.Node
    },

    onLoad: function onLoad() {
        if (fun.gameCfg.releaseType === gameConst.releaseType.apple) {
            var down = this.node.getChildByName('back').getChildByName('down');
            down.getChildByName('btnRecharge').active = false;
            var createN = down.getChildByName('btnCreateRoom');
            createN.getChildByName('text').active = false;
            createN.getChildByName('num').active = false;
        }
        var createInfo = fun.utils.getCreateRoomData(gameConst.gameType.sanGong);
        if (createInfo) {
            this.setToggleChecked('FangFei', createInfo.Charge);
            this.setToggleChecked('DingZhuang', createInfo.DZhuang);
            this.setToggleChecked('DiFen', createInfo.DFeng);
            this.setToggleChecked('ShiXian', createInfo.TimeLimit + 1);
            this.JuShu.string = (createInfo.Total + 1) * 5;
            this.setMuToggleNotChecked();
            for (var i = 0; i < createInfo.Special.length; ++i) {
                this.TeShu.getChildByName('toggle' + createInfo.Special[i]).getComponent(cc.Toggle).isChecked = true;
            }
        }
        this.RoomCard.string = this.JuShu.string;

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
        for (var i = 0; i < this.TeShu.children.length; ++i) {
            this.TeShu.getChildByName('toggle' + (i + 1)).getComponent(cc.Toggle).isChecked = false;
        }
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

    // 三公创建房间
    onBtnCreateClicked: function onBtnCreateClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var data = {};
        data.Special = [];
        for (var i = 1; i <= 2; i++) {
            var togFF = this.FangFei.getChildByName("toggle" + i).getComponent(cc.Toggle);
            if (togFF.isChecked) {
                data.Charge = i; //房费
            }
            var togTS = this.TeShu.getChildByName("toggle" + i).getComponent(cc.Toggle);
            if (togTS.isChecked) {
                data.Special[data.Special.length] = i; //特殊
            }
        }
        for (var _i = 1; _i <= 3; _i++) {
            var toggle = this.DiFen.getChildByName("toggle" + _i).getComponent(cc.Toggle);
            if (toggle.isChecked) {
                data.DFeng = _i; //底分
                break;
            }
        }
        for (var _i2 = 1; _i2 <= 4; _i2++) {
            var togDZ = this.DingZhuang.getChildByName("toggle" + _i2).getComponent(cc.Toggle);
            if (togDZ.isChecked) {
                data.DZhuang = _i2; //定庄
            }
            var togSX = this.ShiXian.getChildByName("toggle" + _i2).getComponent(cc.Toggle);
            if (togSX.isChecked) {
                data.TimeLimit = _i2 - 1; //时限
            }
        }
        data.GameType = gameConst.gameType.sanGong; //游戏种类 - 三公
        data.Address = fun.db.getData('UserInfo').location;
        data.Zone = 0; //是否分区
        data.Total = parseInt(this.JuShu.string) / 5 - 1; //总局数
        fun.net.pSend('CreateRoom', data, function (rsp) {
            if (rsp.RetCode !== undefined && rsp.RetCode !== 0) {
                fun.event.dispatch('Zhuanquan', false);
                if (rsp.RetCode === 10) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '服务未开启' });
                } else if (rsp.RetCode === 16) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '房间配置错误' });
                } else if (rsp.RetCode === 17) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '房卡不足' });
                } else {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '创建房间失败' });
                }
            } else {
                rsp.EnterRoom = 'create';
                fun.db.setData('RoomInfo', rsp);
                fun.utils.saveCreateRoomData(data);
                cc.director.preloadScene('puke', function () {
                    fun.event.dispatch('Zhuanquan', false);
                    cc.director.loadScene('puke');
                });
            }
        }.bind(this));
    },

    // 房卡充值
    onBtnRechargeClicked: function onBtnRechargeClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        cc.log('房卡');
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();