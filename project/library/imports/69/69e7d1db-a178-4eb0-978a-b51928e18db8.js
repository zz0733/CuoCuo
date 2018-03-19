"use strict";
cc._RF.push(module, '69e7dHboXhOsJeKtRko4Y24', 'createWahuaRoom');
// hall/script/createRoom/createWahuaRoom.js

'use strict';

var _properties;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Audio = require('Audio');
var ModelEnum = cc.Enum({
    None: 0,
    Quan: 1,
    Ju: 2
});
var MinJuShu = 4;
var MaxJuShu = 32;
var MinQuanShu = 1;
var MaxQuanShu = 4;
var PerJuCard = 0;
var PerQuanCard = 0;

cc.Class({
    extends: cc.Component,

    properties: (_properties = {
        btnAdd: {
            type: cc.Node,
            default: null
        },

        btnMinus: {
            type: cc.Node,
            default: null
        },

        btnQuan: {
            type: cc.Node,
            default: null
        },

        btnJu: {
            type: cc.Node,
            default: null
        },

        btnRecharge: {
            type: cc.Node,
            default: null
        },

        btnCreateRoom: {
            type: cc.Node,
            default: null
        },

        noChose: {
            type: cc.Node,
            default: null
        },

        btnClose: {
            type: cc.Node,
            default: null
        },

        fangFeiShuoming: {
            type: cc.Label,
            default: null
        },

        numLabel: {
            type: cc.Label,
            default: null
        },

        numTitleLabel: {
            type: cc.Label,
            default: null
        },

        labelModel: {
            type: cc.Label,
            default: null
        },

        needCard: {
            type: cc.Label,
            default: null
        },

        currentCardLabel: {
            type: cc.Label,
            default: null
        }

    }, _defineProperty(_properties, 'needCard', {
        type: cc.Label,
        default: null
    }), _defineProperty(_properties, 'fangFei', {
        type: cc.Node,
        default: null
    }), _defineProperty(_properties, 'renShu', {
        type: cc.Node,
        default: null
    }), _defineProperty(_properties, 'moShi', {
        type: cc.Node,
        default: null
    }), _defineProperty(_properties, 'teShu', {
        type: cc.Node,
        default: null
    }), _defineProperty(_properties, 'storePre', {
        type: cc.Prefab,
        default: null
    }), _properties),

    onLoad: function onLoad() {
        this._juShu = MinJuShu;
        this._quanShu = MinQuanShu;
        this._model = ModelEnum.Ju;
        this._hasCard = 0;
        this._needCard = 0;

        this.btnAdd.on('click', this.onBtnAddClick, this);
        this.btnMinus.on('click', this.onBtnMinusClick, this);
        this.btnQuan.on('click', this.onBtnQuanClick, this);
        this.btnJu.on('click', this.onBtnJuClick, this);
        this.btnRecharge.on('click', this.onBtnRechargeClick, this);
        this.btnCreateRoom.on('click', this.onBtnCreateRoomClick, this);
        this.btnClose.on('click', this.onBtnCloseClick, this);

        var createInfo = fun.utils.getCreateRoomData(gameConst.gameType.digFlower);
        if (createInfo) {
            this.setToggleChecked('fangFei', createInfo.reduceCard);
            this.setToggleChecked('renShu', createInfo.playerNum - 1);
            this.setToggleChecked('moShi', createInfo.patterns);
            this.teShu.getChildByName('toggle1').getComponent(cc.Toggle).isChecked = createInfo.needLocation;
            if (createInfo.makersType === ModelEnum.Quan) {
                this._quanShu = createInfo.ring;
                this.btnQuan.getComponent(cc.Toggle).isChecked = true;
                this.btnJu.getComponent(cc.Toggle).isChecked = false;
                this.onBtnQuanClick();
            } else {
                this._juShu = createInfo.roomNum;
                this.btnQuan.getComponent(cc.Toggle).isChecked = false;
                this.btnJu.getComponent(cc.Toggle).isChecked = true;
                this.onBtnJuClick();
            }
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();

        this.needCard.string = this._needCard;
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

    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },
    onBtnAddClick: function onBtnAddClick() {
        var needCard = this._needCard;
        switch (this._model) {
            case ModelEnum.Quan:
                if (this._quanShu >= MaxQuanShu) {
                    return;
                }
                this._quanShu += 1;
                this.numLabel.string = this._quanShu;
                needCard = this._quanShu * PerQuanCard;
                this.noChose.active = needCard > this._hasCard;
                this.needCard.string = needCard;
                break;
            case ModelEnum.Ju:
                if (this._juShu >= MaxJuShu) {
                    return;
                }
                this._juShu *= 2;
                this.numLabel.string = this._juShu;
                needCard = this._juShu * PerJuCard;
                this.noChose.active = needCard > this._hasCard;
                this.needCard.string = needCard;
                break;
        }
    },
    onBtnMinusClick: function onBtnMinusClick() {
        var needCard = this._needCard;
        switch (this._model) {
            case ModelEnum.Quan:
                if (this._quanShu <= MinQuanShu) {
                    return;
                }
                this._quanShu -= 1;
                this.numLabel.string = this._quanShu;
                needCard = this._quanShu * PerQuanCard;
                this.noChose.active = needCard > this._hasCard;
                this.needCard.string = this._quanShu * PerQuanCard;
                break;
            case ModelEnum.Ju:
                if (this._juShu <= MinJuShu) {
                    return;
                }
                this._juShu /= 2;
                this.numLabel.string = this._juShu;
                needCard = this._juShu * PerJuCard;
                this.noChose.active = needCard > this._hasCard;
                this.needCard.string = needCard;
                break;
        }
    },
    onBtnQuanClick: function onBtnQuanClick() {
        this._model = ModelEnum.Quan;
        this.numTitleLabel.string = '圈';
        this.labelModel.string = "选择游戏总圈数";
        this.numLabel.string = this._quanShu;
        var needCard = this._quanShu * PerQuanCard;
        this.noChose.active = needCard > this._hasCard;
        this.needCard.string = needCard;
    },
    onBtnJuClick: function onBtnJuClick() {
        this._model = ModelEnum.Ju;
        this.numTitleLabel.string = '局';
        this.labelModel.string = "选择游戏总局数";
        this.numLabel.string = this._juShu;
        var needCard = this._juShu * PerJuCard;
        this.noChose.active = needCard > this._hasCard;
        this.needCard.string = needCard;
    },
    onBtnRechargeClick: function onBtnRechargeClick() {
        cc.instantiate(this.storePre).parent = this.node;
    },
    onBtnCreateRoomClick: function onBtnCreateRoomClick() {
        var req = {
            GameType: gameConst.gameType.digFlower,
            Address: fun.db.getData('UserInfo').location,
            makersType: this._model,
            playerNum: 4,
            reduceCard: 1,
            patterns: 1,
            needLocation: this.teShu.getChildByName('toggle1').getComponent(cc.Toggle).isChecked
        };
        this.fangFei.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                req.reduceCard = parseInt(value.name.substring(value.name.length - 1));
            }
        });
        this.renShu.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                req.playerNum = parseInt(value.name.substring(value.name.length - 1)) + 1;
            }
        });
        this.moShi.children.forEach(function (value) {
            if (value.getComponent(cc.Toggle).isChecked) {
                req.patterns = parseInt(value.name.substring(value.name.length - 1));
            }
        });
        if (this._model === ModelEnum.Quan) {
            req.ring = this._quanShu;
        } else {
            req.roomNum = this._juShu;
        }
        fun.utils.saveCreateRoomData(req);
        fun.event.dispatch('Zhuanquan', { flag: true, text: "创建房间中，请稍后..." });
        fun.net.pSend('CreateRoom', req, function (rsp) {
            if (rsp.RetCode && rsp.RetCode !== 0) {
                fun.event.dispatch('Zhuanquan', { flag: false });
                return;
            }
            if (rsp.returnStatu && rsp.returnStatu !== 1) {
                fun.event.dispatch('Zhuanquan', { flag: false });
                return;
            }
            fun.db.setData('RoomInfo', rsp);
            cc.director.loadScene('wahua');
        });
    }
});

cc._RF.pop();