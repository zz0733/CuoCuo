"use strict";
cc._RF.push(module, '38afa52xPxKqYb25UI49jK/', 'createMajiangRoom');
// hall/script/createRoom/createMajiangRoom.js

"use strict";

//******************************************** Majiang Sys  ********************
var Audio = require('Audio');
var majiangType = cc.Enum({
    maJiangWenLing: 1,
    maJiangHuangYan: 2
});

var wenlingMj = function wenlingMj() {
    this.init = function (node, context) {
        this.context = context;
        this.updataParentN(node, gameConst.gameType.maJiangWenLing);
        this.initQuanAndJu();

        var ZhiFuN = this.createN.getChildByName("fangfeiBox").getChildByName("shuoming");
        this.initExplainItem(ZhiFuN, "ZhiFu", require("mjGameDefine").CREATROOMWL.explain);
        this.initSwitchItem("fangfeiBox", [1, 2, 3], 0, "ZhiFu");;
        this.initSwitchItem("shengpaiBox", [1], 0, "ShengPaiTime");
        // this.initSwitchItem("renshuBox", [1, 2, 3], 0, "RenShu"); 
        this.initSwitchItem("renshuBox", [1], 0, "RenShu");
        this.initSwitchItem("moshiBox", [1, 2, 3], 0, "MoShi");
        this.initSwitchItem("wanfaBox", [1, 2, 3], 0, "WanFa");
        this.initSingleItem("teshuBox", false, "DingWei");
        this.initSingleItem("baopaiBox", true, "BaoPai");
        // this.initItemHideList("renshuBox", 2, "RenShu3", [{name:"moshiBox", index:3}]);
        // this.initItemHideList("moshiBox", 2, "MoShi3", [{name:"renshuBox", index:3}]);
    };
    this.initQuanAndJu = function () {
        var GameDefine = require("mjGameDefine");
        var defineData = GameDefine.CREATROOMWL.JuShu.data;
        var quanList = [11, 12, 14];
        var juList = [21, 22, 24];
        var jushuN = this.createN.getChildByName("jushuBox");
        var descL = jushuN.getChildByName("desc").getComponent(cc.Label);
        var self = this;
        var boxN = jushuN.getChildByName("box");
        var quanN = jushuN.getChildByName("quan").getChildByName("checkmark");
        var juN = jushuN.getChildByName("ju").getChildByName("checkmark");

        jushuN.getChildByName("quan").on("touchend", function () {
            self.setRoomInfo("JuShu", quanList[0]);
        });
        jushuN.getChildByName("ju").on("touchend", function () {
            self.setRoomInfo("JuShu", juList[0]);
        });

        jushuN.itemList = [{ n: quanN, l: quanList, desc: "选择游戏总圈数" }, { n: juN, l: juList, desc: "选择游戏总局数" }];
        jushuN.update = function () {
            var curJuShu = self.getRoomInfo()["JuShu"];
            jushuN.itemList.forEach(function (item) {
                item.n.active = false;
                item.l.forEach(function (lItem, nIndex) {
                    if (lItem == curJuShu) {
                        item.n.active = true;
                        self.curCountList = item.l;
                        self.curCountIndex = nIndex;
                    }
                });
                if (item.n.active) {
                    descL.string = item.desc;
                }
            });
            var disL = boxN.getChildByName("num").getComponent(cc.Label);
            var typeL = boxN.getChildByName("content").getComponent(cc.Label);
            disL.string = defineData[curJuShu].slice(0, -1);
            typeL.string = defineData[curJuShu].slice(-1);
        };
        this.jushuN = jushuN;
        var defaultV = this.oldCreate.JuShu || quanList[0];
        this.setRoomInfo("JuShu", defaultV);
        var btnIncrease = boxN.getChildByName("increase");
        var btnReduce = boxN.getChildByName("reduce");
        var onCountChange = function onCountChange(changeNum) {
            var newIndex = self.curCountIndex + changeNum;
            if (newIndex < 0 || newIndex > self.curCountList.length - 1) {
                return;
            }
            self.setRoomInfo("JuShu", self.curCountList[newIndex]);
        };
        btnIncrease.on("touchend", function () {
            onCountChange(1);
        });
        btnReduce.on("touchend", function () {
            onCountChange(-1);
        });
    };

    this.onInfoChange = function () {
        this.jushuN.update();
        var roomInfo = this.getRoomInfo();
        var per = roomInfo.ZhiFu == 2 ? 4 : 16;
        var cost = 0;
        if (roomInfo.JuShu > 20) {
            cost = (roomInfo.JuShu - 20) * per;
        } else {
            cost = (roomInfo.JuShu - 10) * per;
        }
        this.context.needCardL.string = cost;
    };

    this.onCreateClicked = function () {
        var roomInfo = this.getRoomInfo();
        roomInfo.GameType = this.gameType; //游戏种类 - wenling majiang  
        roomInfo.Address = fun.db.getData('UserInfo').location;
        fun.utils.saveCreateRoomData(roomInfo);
        fun.event.dispatch('Zhuanquan', { flag: true, text: "创建房间中，请稍后..." });
        fun.net.pSend('CreateRoom', roomInfo, function (rsp) {
            if (!rsp.RetCode) {
                rsp.EnterRoom = 'create';
                fun.db.setData('RoomInfo', rsp);
                cc.director.preloadScene("majiang", function () {
                    cc.director.loadScene('majiang');
                });
            } else {
                var mjGameDefine = require("mjGameDefine");
                fun.event.dispatch('Zhuanquan', false);
                var str = mjGameDefine.WLRETCODE[rsp.RetCode] || "失败 :" + rsp.RetCode;
                if (rsp.RetCode == 19) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: str, okBtnStr: "前往充值", okCb: this.onRechargeClicked.bind(this) });
                } else {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: str });
                }
            }
        }.bind(this));
    };
};
var huangyanMj = function huangyanMj() {
    this.init = function (node, context) {
        this.context = context;
        this.updataParentN(node, gameConst.gameType.maJiangHuangYan);
        this.initQuanAndJu();
        var ZhiFuN = this.createN.getChildByName("shouxufeiBox").getChildByName("shuoming");
        this.initExplainItem(ZhiFuN, "PaymentMethod", require("mjGameDefine").CREATROOMHY.explain);
        // this.initSwitchItem("tishiBox", [1, 2], 1, "NoticeType");
        // this.initSwitchItem("jushuBox", [1, 2, 4], 0, "GameNum");
        this.initSwitchItem("shouxufeiBox", [1, 2, 3], 0, "PaymentMethod");
        this.initSwitchItem("wanfaBox", [1, 2], 0, "GshOp");
        this.initSingleItem("teshuBox", false, "DingWei");
        // this.setRoomInfo("isAllowWatch", 2);
        // this.setRoomInfo("NoticeType", 2);

    };

    this.initQuanAndJu = function () {
        var GameDefine = require("mjGameDefine");
        var defineData = GameDefine.CREATROOMHY;
        var quanList = [1, 2, 4];
        var juList = [4, 8, 16];
        var jushuN = this.createN.getChildByName("jushuBox");
        var self = this;
        var boxN = jushuN.getChildByName("box");
        var quanN = jushuN.getChildByName("quan").getChildByName("checkmark");
        var juN = jushuN.getChildByName("ju").getChildByName("checkmark");
        var descL = jushuN.getChildByName("desc").getComponent(cc.Label);
        jushuN.getChildByName("quan").on("touchend", function () {
            self.setRoomInfo("SpendMethod", 1);
            self.setRoomInfo("GameNum", quanList[0]);
        });
        jushuN.getChildByName("ju").on("touchend", function () {
            self.setRoomInfo("SpendMethod", 2);
            self.setRoomInfo("GameNum", juList[0]);
        });

        jushuN.itemList = [{ n: quanN, l: quanList }, { n: juN, l: juList }];
        //SpendMethod 1表示按圈收费 2表示按局收费
        jushuN.update = function () {
            var curJuShu = self.getRoomInfo()["GameNum"];
            quanN.active = self.getRoomInfo()["SpendMethod"] == 1;
            juN.active = self.getRoomInfo()["SpendMethod"] == 2;
            var disL = boxN.getChildByName("num").getComponent(cc.Label);
            var typeL = boxN.getChildByName("content").getComponent(cc.Label);
            disL.string = curJuShu === undefined ? 1 : curJuShu;
            typeL.string = self.getRoomInfo()["SpendMethod"] == 1 ? "圈" : "局";
            self.curCountList = self.getRoomInfo()["SpendMethod"] == 1 ? quanList : juList;
            self.curCountList.forEach(function (item, index) {
                if (curJuShu == item) {
                    self.curCountIndex = index;
                }
            });
            descL.string = quanN.active ? "选择游戏总圈数" : "选择游戏总局数";
        };
        this.jushuN = jushuN;
        var defaultV = this.oldCreate.GameNum || quanList[0];
        var defMethod = this.oldCreate.SpendMethod || 1;
        this.setRoomInfo("SpendMethod", defMethod);
        this.setRoomInfo("GameNum", defaultV);
        var btnIncrease = boxN.getChildByName("increase");
        var btnReduce = boxN.getChildByName("reduce");
        var onCountChange = function onCountChange(changeNum) {
            var newIndex = self.curCountIndex + changeNum;
            if (newIndex < 0 || newIndex > self.curCountList.length - 1) {
                return;
            }
            self.setRoomInfo("GameNum", self.curCountList[newIndex]);
        };
        btnIncrease.on("touchend", function () {
            onCountChange(1);
        });
        btnReduce.on("touchend", function () {
            onCountChange(-1);
        });
    };

    this.onCreateClicked = function () {
        var roomInfo = this.getRoomInfo();
        var sendData = {
            PlayerID: fun.db.getData("UserInfo").UserId, //玩家帐号
            RoomInformation: roomInfo, //房间信息
            GameType: this.gameType,
            Address: fun.db.getData('UserInfo').location
        };
        fun.event.dispatch('Zhuanquan', { flag: true, text: "创建房间中，请稍后..." });
        fun.net.pSend('CreateRoom', sendData, function (rsp) {
            if (!rsp.RetCode) {
                sendData.RoomId = rsp.RoomID;
                fun.db.setData('hymajiang', rsp);
                fun.db.setData('RoomInfo', sendData);
                cc.director.preloadScene("majiang", function () {
                    cc.director.loadScene('majiang');
                });
                roomInfo.GameType = this.gameType; //游戏种类 - wenling majiang  
                fun.utils.saveCreateRoomData(roomInfo);
            } else {
                fun.event.dispatch('Zhuanquan', false);
                var mjGameDefine = require("mjGameDefine");
                var str = mjGameDefine.HYRETCODE[rsp.RetCode] || "失败 :" + rsp.RetCode;
                if (rsp.RetCode == 19) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: str, okBtnStr: "前往充值", okCb: this.onRechargeClicked.bind(this) });
                } else {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: str });
                }
            }
        }.bind(this));
    };

    this.onInfoChange = function () {
        this.jushuN.update();
        var roomInfo = this.getRoomInfo();
        var per = roomInfo.PaymentMethod == 2 ? 4 : 16;
        var gameCount = roomInfo.GameNum;
        if (roomInfo.SpendMethod == 2) {
            gameCount = gameCount / 4;
        }
        this.context.needCardL.string = gameCount * per;
    };
};
wenlingMj.prototype = require("createRoomSys").new();
huangyanMj.prototype = require("createRoomSys").new();

//******************************************** UI  ********************
cc.Class({
    extends: cc.Component,

    properties: {
        gameName: {
            type: majiangType,
            default: majiangType.maJiangWenLing
        },
        store: cc.Prefab,
        roomCard: cc.Label,
        needCardL: cc.Label,
        freeCardL: cc.Label,
        freeTimeBox: cc.Node,
        freeBtn: cc.Node,
        freeTimeL: cc.Label,
        detailPrefab: cc.Prefab
    },

    onLoad: function onLoad() {
        var downNode = this.node.getChildByName('back').getChildByName('down');
        downNode.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        this.initMjList();
        this.updateMj();
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
        fun.event.add('CreateHYAddRoomCard', 'HuangYanAddRoomCard', function (addCard) {
            this._currentRoomCards = parseInt(this.roomCard.string) + parseInt(addCard);
            this._wxPaySuccess = true;
        }.bind(this));
    },


    onDestroy: function onDestroy() {
        fun.event.remove('CreateHYAddRoomCard');
    },

    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    initMjList: function initMjList() {
        this.mjSysList = {};
        this.mjSysList[majiangType.maJiangWenLing] = new wenlingMj();
        this.mjSysList[majiangType.maJiangHuangYan] = new huangyanMj();
    },
    updateMj: function updateMj() {
        this.curMj = this.mjSysList[this.gameName];
        this.curMj.init(this.node, this);
    },
    update: function update(dt) {
        if (this._wxPaySuccess) {
            this.roomCard.string = this._currentRoomCards;
            this._wxPaySuccess = false;
        }
    },
    showStore: function showStore(gameType) {
        fun.event.dispatch('MinSingleButtonPop', { contentStr: '公测期间，免费畅玩！' });
        return;
        if (fun.gameCfg.releaseType === gameConst.releaseType.release) {
            fun.event.dispatch('MinSingleButtonPop', { contentStr: '公测期间，免费畅玩！' });
        } else {
            var store = cc.instantiate(this.store);
            store.parent = this.node;
            store.getComponent('store').setGameType(gameType);
        }
    },
    showRoomCard: function showRoomCard(data, gameType) {
        var isFisher = fun.gameCfg.releaseType === gameConst.releaseType.fisher ? true : false;
        if (isFisher) {
            var cardShowN = this.node.getChildByName('back').getChildByName('down').getChildByName('cardShow');
            cardShowN.getChildByName('xskback').active = false;
            cardShowN.getChildByName('fkback').active = true;
            cardShowN.getChildByName('xianshika').active = false;
            return;
        }
        this.roomCard.string = data.TollCardCnt || data.Total || 0;
        this.freeBtn.on('click', function () {
            var detail = cc.instantiate(this.detailPrefab);
            detail.parent = this.node;
            detail.getComponent('freeCardDetail').setDetail(data.FreeCardList || undefined, gameType);
        }.bind(this));
        if (!data.FreeCardList || data.FreeCardList.length === 0) {
            this.freeCardL.string = 0;
            this.freeTimeBox.active = false;
            return;
        }
        this.freeTimeBox.active = true;
        var minTime = data.FreeCardList[0].ExpiredAt,
            totalFreeCard = 0;
        for (var i in data.FreeCardList) {
            var time = data.FreeCardList[i].ExpiredAt;
            totalFreeCard += data.FreeCardList[i].Cnt;
            if (minTime > time) {
                minTime = time;
            }
        }
        var t = new Date(minTime * 1000);
        var date = t.getFullYear().toString().substr(2, 2) + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日';
        this.freeTimeL.string = date + '过期';
        this.freeCardL.string = totalFreeCard;
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();