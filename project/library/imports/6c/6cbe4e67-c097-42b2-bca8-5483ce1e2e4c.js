"use strict";
cc._RF.push(module, '6cbe45nwJdCsryoVIPOHi5M', 'createDDZRoom');
// hall/script/createRoom/createDDZRoom.js

'use strict';

var Audio = require('Audio');

cc.Class({
    extends: cc.Component,
    properties: {
        detailPrefab: {
            type: cc.Prefab,
            default: null
        },
        storePre: {
            type: cc.Prefab,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.bindNode();
        this.initUI();
    },
    onEnable: function onEnable() {
        this.animation.play("popScaleAnim");
    },
    Destroy: function Destroy() {
        fun.event.dispatch('Zhuanquan', false);
    },

    bindNode: function bindNode() {
        this.downNode = this.node.getChildByName("back").getChildByName("down");
        this.fangFeiNode = this.downNode.getChildByName("fangfeiBox");
        this.diZhuFenNode = this.downNode.getChildByName("dizhuBox");
        this.renShuNode = this.downNode.getChildByName("renshuBox");
        this.fengDingNode = this.downNode.getChildByName("fengdingBox");
        this.wanFaNode = this.downNode.getChildByName("wanfaBox");
        this.GPSNode = this.downNode.getChildByName("gpsBox");
        this.fangKaNode = this.downNode.getChildByName("fangKaBox");
        this.deadLineNode = this.downNode.getChildByName("time");
        this.jushuNode = this.downNode.getChildByName("jushuBox");
        this.animation = this.node.getComponent(cc.Animation);
    },
    initUI: function initUI() {
        this.DDZCreateInfo = JSON.parse(cc.sys.localStorage.getItem("DDZCreateRoomInfo"));
        if (this.DDZCreateInfo) {
            this.initFangFeiToggle(this.DDZCreateInfo.roomInfo.payMode);
            this.initDiZhuFenToggle(this.DDZCreateInfo.roomInfo.base);
            this.initRenShuToggle();
            this.initWanFaToggle(this.DDZCreateInfo.roomInfo.canDouble, this.DDZCreateInfo.roomInfo.canSanDaiDui, this.DDZCreateInfo.roomInfo.canSiDaiDui);
            this.initFengDingToggle(this.DDZCreateInfo.roomInfo.boomLimit);
            this.initGPSToggle(this.DDZCreateInfo.roomInfo.needGPS);
            this.initJuShu(this.DDZCreateInfo.roomInfo.RoundLimit);
        } else {
            this.initFangFeiToggle();
            this.initDiZhuFenToggle();
            this.initRenShuToggle();
            this.initWanFaToggle();
            this.initFengDingToggle();
            this.initGPSToggle();
            this.initJuShu();
        }
    },
    initJuShu: function initJuShu(jushu) {
        if (jushu) {
            this.jushu = jushu;
            this.jushuNode.getChildByName("box").getChildByName("num").getComponent(cc.Label).string = jushu + "";
        } else {
            this.jushu = 8;
            this.jushuNode.getChildByName("box").getChildByName("num").getComponent(cc.Label).string = 8 + "";
        }
    },
    initGPSToggle: function initGPSToggle(isGPS) {
        if (isGPS == true) {
            this.isGPS = true;
            this.GPSNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.isGPS = false;
            this.GPSNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
        }
    },
    initDiZhuFenToggle: function initDiZhuFenToggle(base) {
        if (base == 1) {
            this.diZhuFen = 1;
            this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        } else if (base == 3) {
            this.diZhuFen = 3;
            this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.diZhuFen = 1;
            this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        }
    },
    initFangFeiToggle: function initFangFeiToggle(fangfei) {
        if (fangfei == 1) {
            this.fangfei = 1;
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false; //房主支付
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true; //平均支付
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false; //冠军支付
        } else if (fangfei == 2) {
            this.fangfei = 2;
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false; //房主支付
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false; //平均支付
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true; //冠军支付
        } else if (fangfei == 3) {
            this.fangfei = 3;
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true; //房主支付
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false; //平均支付
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false; //冠军支付
        } else {
            this.fangfei = 3;
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        }
    },
    initRenShuToggle: function initRenShuToggle() {
        this.renshu = 3;
        this.renShuNode.getChildByName("toggle1").active = true;
        this.renShuNode.getChildByName("toggle2").active = false;
        this.renShuNode.getChildByName("toggle3").active = false;
        //todo 暂时只有三人的
    },
    initWanFaToggle: function initWanFaToggle(double, san, si) {
        if (double == true) {
            this.isDouble = true;
            this.wanFaNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.isDouble = false;
            this.wanFaNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        }
        if (san == true) {
            this.isThreeAndOne = true;
            this.wanFaNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.isThreeAndOne = false;
            this.wanFaNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
        }
        if (si == true) {
            this.isFourAndTwo = true;
            this.wanFaNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.isFourAndTwo = false;
            this.wanFaNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        }
    },
    initFengDingToggle: function initFengDingToggle(fengding) {
        if (fengding == 4) {
            this.fengDing = 4;
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        } else if (fengding == 5) {
            this.fengDing = 5;
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        } else if (fengding == 6) {
            this.fengDing = 6;
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.fengDing = 4;
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        }
    },
    /****************点击事件处理**********/
    onClickDiZhuFenToggle: function onClickDiZhuFenToggle(event, custom) {
        if (custom == "1") {
            this.diZhuFen = 1;
            this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        } else if (custom == "3") {
            this.diZhuFen = 3;
            this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        }
    },
    onClickFangFeiToggle: function onClickFangFeiToggle(event, custom) {
        // AVG_PAY = 1; //平均支付
        // CHAMPION_PAY = 2; //冠军支付
        // OWNER_PAY = 3; //房主支付
        if (custom == "1") {
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fangfei = 3;
        } else if (custom == "2") {
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fangfei = 1;
        } else if (custom == "3") {
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
            this.fangfei = 2;
        }
    },
    onClickWanFaToggle: function onClickWanFaToggle(event, custom) {
        if (custom == "1") {
            this.isThreeAndOne = this.wanFaNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked;
        } else if (custom == "2") {
            this.isFourAndTwo = this.wanFaNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked;
        } else if (custom == "3") {
            this.isDouble = this.wanFaNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked;
        }
    },
    onClickFenDingToggle: function onClickFenDingToggle(event, custom) {
        if (custom == "4") {
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fengDing = 4;
        } else if (custom == "5") {
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fengDing = 5;
        } else if (custom == "6") {
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
            this.fengDing = 6;
        }
    },
    onClickGPSToggle: function onClickGPSToggle(event, custom) {
        this.isGPS = this.GPSNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked;
    },
    onClickJuShu: function onClickJuShu(event, custom) {
        if (custom == "1") {
            this.jushu = this.jushu == 24 ? 24 : this.jushu + 8;
            this.jushuNode.getChildByName("box").getChildByName("num").getComponent(cc.Label).string = this.jushu + "";
        } else if (custom == "2") {
            this.jushu = this.jushu == 8 ? 8 : this.jushu - 8;
            this.jushuNode.getChildByName("box").getChildByName("num").getComponent(cc.Label).string = this.jushu + "";
        }
    },

    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play("popScaleOut").once('finished', function () {
            this.node.active = false;
            this.node.destroy();
        }, this);
    },
    onBtnRechargeClick: function onBtnRechargeClick() {
        cc.instantiate(this.storePre).parent = this.node;
    },


    onClickDetails: function onClickDetails() {
        var detail = cc.instantiate(this.detailPrefab);
        detail.parent = this.node;
        detail.getComponent('freeCardDetail').setDetail(this.showData.FreeCardList, this._gameType);
    },
    showRoomCard: function showRoomCard(data, gameType) {
        this.showData = data;
        this._gameType = gameType;
        this.node.getChildByName("back").getChildByName("down").getChildByName("fangKaBox").getChildByName("card").getComponent(cc.Label).string = data.TollCardCnt || 0;
        var freeTimeBox = this.node.getChildByName("back").getChildByName("down").getChildByName("time");
        var freeCardL = this.node.getChildByName("back").getChildByName("down").getChildByName("fangKaBox").getChildByName("cardlimited");
        if (!data.FreeCardList || data.FreeCardList.length === 0) {
            freeCardL.getComponent(cc.Label).string = 0;
            freeTimeBox.active = false;
        } else {
            freeTimeBox.active = true;
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
            freeTimeBox.getChildByName("time").getComponent(cc.Label).string = date + '过期';
            freeCardL.getComponent(cc.Label).string = freeCard;
        }
    },
    onBtnCreateRoomClick: function onBtnCreateRoomClick() {
        var DDZRoomInfo = {
            gameType: 6,
            payMode: this.fangfei,
            playerNum: this.renshu,
            base: this.diZhuFen,
            boomLimit: this.fengDing,
            playMode: null,
            canSanDaiDui: this.isThreeAndOne,
            canSiDaiDui: this.isFourAndTwo,
            canDouble: this.isDouble,
            RoundLimit: this.jushu,
            needGPS: this.isGPS
        };
        if (this.isGPS) {
            var gpsInfo = fun.db.getData('UserInfo').location;
        } else {
            var gpsInfo = {};
        }
        var createInfo = {
            GameType: 6,
            roomInfo: DDZRoomInfo,
            userId: fun.db.getData('UserInfo').UserId,
            gpsInfo: gpsInfo
        };
        cc.sys.localStorage.setItem("DDZCreateRoomInfo", JSON.stringify(createInfo));
        fun.event.dispatch('Zhuanquan', { flag: true, text: "创建房间中，请稍后..." });
        fun.net.pSend('CreateRoom', createInfo, function (msg) {
            if (msg.RetCode > 0 && msg.RetCode <= 15) {
                fun.event.dispatch('Zhuanquan', false);
            } else {
                cc.director.loadScene("DDZ_GameScene");
            }
        });
    }
});

cc._RF.pop();