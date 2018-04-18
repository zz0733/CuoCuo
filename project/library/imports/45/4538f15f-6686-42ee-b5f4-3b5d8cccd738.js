"use strict";
cc._RF.push(module, '4538fFfZoZC7rX0O12MzNc4', 'createScMahjongRoom');
// hall/script/createRoom/createScMahjongRoom.js

'use strict';

var Audio = require('Audio');
var PerJuCard = 0;
var MinJuShu = 4;
var MaxJuShu = 32;
var FengDingArr = [3, 4, 5, 0];
var DiFenArr = [1, 2, 5, 10];
var GuiZeArr = [64, 32, 16, 8, 4, 2, 1];
var MoShiArr = [[10, 20, 30], [1, 2], [100, 200, 300]];

cc.Class({
    extends: cc.Component,

    properties: {
        btnAdd: cc.Node,
        btnMinus: cc.Node,
        btnRecharge: cc.Node,
        btnCreateRoom: cc.Node,
        btnClose: cc.Node,
        fangFeiShuomingL: cc.Label,
        JuNumL: cc.Label,
        needCardL: cc.Label,
        currentCardL: cc.Label,

        waFa: cc.Node,
        moShi: cc.Node,
        fengDing: cc.Node,
        diFen: cc.Node,
        fangFei: cc.Node,
        guiZe: cc.Node,
        dingWei: cc.Node,

        storePre: cc.Prefab,
        freeCardL: cc.Label,
        freeTimeBox: cc.Node,
        freeTimeL: cc.Label,
        freeBtn: cc.Node,
        detailPrefab: cc.Prefab
    },

    onLoad: function onLoad() {
        this._needCard = 4;
        this._juShu = MinJuShu;
        this.needCardL.string = 0;

        this.btnAdd.on('click', this.onBtnAddClick, this);
        this.btnMinus.on('click', this.onBtnMinusClick, this);
        this.btnRecharge.on('click', this.onBtnRechargeClick, this);
        this.btnCreateRoom.on('click', this.onBtnCreateRoomClick, this);
        this.btnClose.on('click', this.onBtnCloseClick, this);

        var createInfo = fun.utils.getCreateRoomData(gameConst.gameType.scMahjong);
        if (createInfo) {
            this.setToggleChecked(this.waFa, createInfo.WanFa);
            var msArr = [2, 1, 3];
            for (var i = 0; i < 3; ++i) {
                var msN = this.moShi.getChildByName('tog' + msArr[i]);
                var weishu = createInfo.MoShi.toString().substr(2 - i, 1);
                this.setToggleChecked(msN, weishu);
            }
            var fengding = { 3: 1, 4: 2, 5: 3, 0: 4 };
            this.setToggleChecked(this.fengDing, fengding[createInfo.FengDing]);
            var difen = { 1: 1, 2: 2, 5: 3, 10: 4 };
            this.setToggleChecked(this.diFen, difen[createInfo.DiFen]);
            this.setToggleChecked(this.fangFei, createInfo.FangFei);
            var gzBinary = createInfo.GuiZe.toString(2);
            gzBinary = gzBinary.length < 8 ? '0000000'.substr(gzBinary.length) + gzBinary : gzBinary;
            for (var _i = 0; _i < 7; ++_i) {
                if (parseInt(gzBinary.substr(_i, 1)) === 1) {
                    this.guiZe.getChildByName('toggle' + (_i + 1)).getComponent(cc.Toggle).isChecked = true;
                }
            }
            this.dingWei.getChildByName('toggle1').getComponent(cc.Toggle).isChecked = createInfo.DingWei;
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    setToggleChecked: function setToggleChecked(node, value) {
        for (var i = 0; i < node.children.length; ++i) {
            node.getChildByName('toggle' + (i + 1)).getComponent(cc.Toggle).isChecked = false;
        }
        node.getChildByName('toggle' + value).getComponent(cc.Toggle).isChecked = true;
    },
    onBtnAddClick: function onBtnAddClick() {
        var needCard = this._needCard;
        if (this._juShu >= MaxJuShu) return;
        this._juShu *= 2;
        this.JuNumL.string = this._juShu;
        needCard = this._juShu * PerJuCard;
        this.needCardL.string = needCard;
    },
    onBtnMinusClick: function onBtnMinusClick() {
        var needCard = this._needCard;
        if (this._juShu <= MinJuShu) return;
        this._juShu /= 2;
        this.JuNumL.string = this._juShu;
        needCard = this._juShu * PerJuCard;
        this.needCardL.string = needCard;
    },
    showRoomCard: function showRoomCard(data, gameType) {
        this.currentCardL.string = data.TollCardCnt || 0;
        this.freeBtn.on('click', function () {
            var detail = cc.instantiate(this.detailPrefab);
            detail.parent = this.node;
            if (!data.FreeCardList) return;
            detail.getComponent('freeCardDetail').setDetail(data.FreeCardList, gameType);
        }.bind(this));
        if (!data.FreeCardList || data.FreeCardList.length === 0) {
            this.freeCardL.string = 0;
            this.freeTimeBox.active = false;
        } else {
            this.freeTimeBox.active = true;
            var minTime = data.FreeCardList[0].ExpiredAt,
                freeCard = data.FreeCardList[0].Cnt;
            for (var i in data.FreeCardList) {
                var time = data.FreeCardList[i].ExpiredAt;
                if (minTime > time) {
                    minTime = time;
                    freeCard = data.FreeCardList[i].Cnt;
                }
            }
            var t = new Date(minTime * 1000);
            var date = t.getFullYear().toString().substr(2, 2) + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日';
            this.freeTimeL.string = date + '过期';
            this.freeCardL.string = freeCard;
        }
    },
    onBtnCreateRoomClick: function onBtnCreateRoomClick() {
        var _this = this;

        var req = {
            GameType: gameConst.gameType.scMahjong,
            Address: fun.db.getData('UserInfo').location,
            DingWei: this.dingWei.getChildByName('toggle1').getComponent(cc.Toggle).isChecked
        };
        this.waFa.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                req.WanFa = parseInt(value.name.substring(value.name.length - 1));
            }
        });
        var ms = 0;

        var _loop = function _loop(i) {
            _this.moShi.getChildByName('tog' + (i + 1)).children.forEach(function (value) {
                if (value.getComponent(cc.Toggle).isChecked) {
                    ms += MoShiArr[i][parseInt(value.name.substring(value.name.length - 1)) - 1];
                }
            });
        };

        for (var i = 0; i < 3; ++i) {
            _loop(i);
        }
        req.MoShi = ms;
        this.fengDing.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                req.FengDing = FengDingArr[parseInt(value.name.substring(value.name.length - 1)) - 1];
            }
        });
        this.diFen.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                req.DiFen = DiFenArr[parseInt(value.name.substring(value.name.length - 1)) - 1];
            }
        });
        this.fangFei.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                req.FangFei = parseInt(value.name.substring(value.name.length - 1));
            }
        });
        var gz = 0;
        this.guiZe.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                gz += GuiZeArr[parseInt(value.name.substring(value.name.length - 1)) - 1];
            }
        });
        req.GuiZe = gz;
        req.JuShu = this._juShu;

        fun.utils.saveCreateRoomData(req);
        fun.event.dispatch('Zhuanquan', { flag: true, text: "创建房间中，请稍后..." });
        fun.net.pSend('CreateRoom', req, function (rsp) {
            if (rsp.RetCode && rsp.RetCode !== 0) {
                fun.event.dispatch('Zhuanquan', { flag: false });
                var mjGameDefine = require("mjGameDefine");
                var str = mjGameDefine.SCRETCODE[rsp.RetCode] || "失败 :" + rsp.RetCode;
                if (rsp.RetCode == 19) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: str, okBtnStr: "前往充值", okCb: this.onRechargeClicked.bind(this) });
                } else {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: str });
                }
                return;
            }
            fun.db.setData('RoomInfo', rsp);
            fun.db.setData('scmahjong', rsp);
            cc.director.preloadScene("majiang", function () {
                cc.director.loadScene('majiang');
            });
        });
    },
    onBtnRechargeClick: function onBtnRechargeClick() {
        cc.instantiate(this.storePre).parent = this.node;
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();