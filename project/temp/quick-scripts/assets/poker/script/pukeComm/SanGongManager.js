(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/script/pukeComm/SanGongManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8265f0mtItErJK7rHKWSRFR', 'SanGongManager', __filename);
// poker/script/pukeComm/SanGongManager.js

'use strict';

var SanGongManager = {};
var PukeData = require('PukeData');
var funUtils = require('funUtils');
var PukeUtils = require('PukeUtils');
var PukeDefine = require('PukeDefine');
var Audio = require('Audio');

SanGongManager.initGame = function (gameUICB) {
    this.gameUICB = gameUICB;

    this.UserInfo = fun.db.getData('UserInfo', true);
    this.MineUserId = this.UserInfo.UserId;
    this.MineSeat = this.getSeatByNumber(1);
    this.data = fun.db.getData('RoomInfo');
    this.MineIsMaster = this.getRoomMasterByRoomInfo();
    this.FirstEnterRoom = true;
    this.initRoomInfo();
    this.initSeatInfo();
    this.initQZhuangFunction();
    this.initListener();
};

SanGongManager.update = function (dt) {
    if (this.StartChooseZhuang) {
        this.qzDtTime = (this.qzDtTime || 0) + dt;
        var chaTime = PukeDefine.QIANG_ZHUANG_WAIT_TIME - this.DingZhuangTime;
        if (this.qzDtTime >= chaTime) {
            this.gameUICB.setBtnQZhuangActive(false);
            this.gameUICB.showHint(false);
            this.seatNum = this.QiangZhuangSeat.length;
            var qzPersonNum = this.seatNum === 0 ? this.ZeroZhuangSeat.length : this.seatNum;
            this.TurnZhuangTime = PukeDefine.QIANG_ZHUANG_TURN_TIME / (5 * qzPersonNum);
            this.tzDtSingle = 0;
            this.tzDtMore = 0;
            this.TurnZhuangCount = 0;
            this.TurnZhuang = true;
            this.StartChooseZhuang = false;
            this.qzDtTime = 0;
        }
    }
    if (this.TurnZhuang) {
        if (this.seatNum === 0) {
            this.tzDtSingle += dt;
            if (this.tzDtSingle >= this.TurnZhuangTime) {
                this.tzDtSingle -= this.TurnZhuangTime;
                this.TurnZhuangCount = this.TurnZhuangCount === this.ZeroZhuangSeat.length ? 1 : this.TurnZhuangCount + 1;
                this.setZhuangFalse();
                var seat = this.getSeatByNumber(this.ZeroZhuangSeat[this.TurnZhuangCount - 1]);
                seat.Zhuang.active = true;
            }
        } else if (this.seatNum >= 2) {
            this.tzDtMore += dt;
            if (this.tzDtMore >= this.TurnZhuangTime) {
                this.tzDtMore -= this.TurnZhuangTime;
                this.TurnZhuangCount = this.TurnZhuangCount === this.seatNum ? 1 : this.TurnZhuangCount + 1;
                this.setZhuangFalse();
                var _seat = this.getSeatByNumber(this.QiangZhuangSeat[this.TurnZhuangCount - 1]);
                _seat.Zhuang.active = true;
            }
        }
    }
};

SanGongManager.onDestroy = function () {
    this.cleanListener();
    this.UserInfo.RoomId = 0;
    fun.db.setData('UserInfo', this.UserInfo);
    this.SeatArray = [];
    this.UserInfo = {};
    this.data = {};
    this.faPaiPukes = [];
    this.faPaiSeats = [];
    this.QiangZhuangSeat = [];
    this.ZeroZhuangSeat = [];
    this.copyDisbandPrefab = undefined;
    this.copyTotalAccount = undefined;
};

//-----------------------------------------------------------
//----- 座位号 调整
SanGongManager.updateSeatNumber = function (player) {
    var minePlayer = {};
    if (this.data.EnterRoom === 'enter') {
        for (var i in player) {
            var value = player[i];
            if (this.checkIsMineUserId(value.UserId)) {
                minePlayer = value;
            }
        }
    } else if (this.data.EnterRoom === 'create') {
        minePlayer = this.data;
    }
    this.SeatArray = new Array();
    for (var _i = 0; _i < 6; _i++) {
        if (_i === 0) {
            this.SeatArray[0] = minePlayer.RoomIdx;
        } else {
            this.SeatArray[_i] = '';
        }
    }
    if (this.data.EnterRoom === 'enter') {
        for (var _i2 in player) {
            var _value = player[_i2];
            var cha = Math.abs(minePlayer.RoomIdx - _value.RoomIdx);
            if (minePlayer.RoomIdx > _value.RoomIdx) {
                this.SeatArray[6 - cha] = _value.RoomIdx;
            } else if (minePlayer.RoomIdx < _value.RoomIdx) {
                this.SeatArray[cha] = _value.RoomIdx;
            }
        }
    }
};
//----- 根据 RoomIdx 返回座位号
SanGongManager.getSeatNumberByRoomIdx = function (roomIdx) {
    for (var i = 0; i < this.SeatArray.length; i++) {
        if (this.SeatArray[i] === roomIdx) {
            return i + 1;
        }
    }
    return roomIdx + 1;
};
//----- 根据 座位号 获取 Seat
SanGongManager.getSeatByNumber = function (num) {
    return this.gameUICB.getSeatByNumber(num);
};
//----- 根据 UserId 获取 Seat
SanGongManager.getSeatByUserId = function (id) {
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        if (parseInt(seat.UserId) === parseInt(id)) {
            return seat;
        }
    }
};
//----- 根据 牌ID 取牌
SanGongManager.getPukeSpriteById = function (id) {
    var paiId = id === 'pai' ? id : Math.abs(id) - 3;
    return this.gameUICB.getPukeSpriteById(paiId);
};
//----- 清空 座位 信息
SanGongManager.cleanSeatData = function () {
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        seat.Readying.active = false;
        for (var j = 1; j <= 3; j++) {
            seat['Puke' + j].active = false;
        }
        seat.ShuZi.active = false;
        seat.YaBox.active = false;
        seat.Ying.active = false;
        seat.Shu.active = false;
    }
};
//----- 金币押注动画
SanGongManager.pushGold = function (seatNumber, goldNum) {
    this.gameUICB.getGoldsNode().active = true;
    var min = 2,
        max = 8,
        divisor = 12;
    for (var j = 0; j < PukeDefine.PUSH_GOLD_NUMBER; j++) {
        var copyGold = this.gameUICB.getFromGoldPool();
        this.gameUICB.getGoldsNode().getChildByName('seat' + seatNumber).addChild(copyGold);
        var startPos = PukeDefine.POSITION.GOLD[seatNumber].START_POS;
        copyGold.setScale(0.6);
        copyGold.setPosition(cc.p(startPos.x, startPos.y));
        var time = funUtils.random(min, max) / divisor;
        var endPos = PukeDefine.POSITION.GOLD[seatNumber].END_POS;
        var randPx = endPos.x + funUtils.random(-30, 30);
        var randPy = endPos.y + funUtils.random(-30, 30);
        var distance = PukeUtils.pGetDistance(startPos, cc.p(randPx, randPy));
        var intCen = Math.floor(distance / time);
        copyGold.setLocalZOrder(1000 - intCen);
        var moveto = cc.moveTo(time, cc.p(randPx, randPy));
        moveto.easing(cc.easeSineInOut());
        copyGold.stopAllActions();
        copyGold.runAction(moveto);
    }
    Audio.playEffect('pork', 'gold.wav');
};
//----- 金币回收动画
SanGongManager.callInGold = function (winSeats) {
    this.gameUICB.getGoldsNode().active = true;
    var self = this;
    var overTime = 0;
    var min = 2,
        max = 10,
        min2 = 5,
        max2 = 15,
        divisor = 15;
    var zhuangSeatNumber = this.getSeatNumberByRoomIdx(this.CurrentZhuang);
    var zhuangStartPos = PukeDefine.POSITION.GOLD[zhuangSeatNumber].START_POS;
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        if (seat.RoomIdx != this.CurrentZhuang) {
            var goldSeat = this.gameUICB.getGoldsNode().getChildByName('seat' + i);
            if (goldSeat.childrenCount > 0) {
                var _loop = function _loop(_i3) {
                    var gold = goldSeat.children[_i3];
                    var time = funUtils.random(min, max) / divisor;
                    overTime = Math.max(time, overTime);
                    var moveto = cc.moveTo(time, cc.p(zhuangStartPos.x, zhuangStartPos.y));
                    moveto.easing(cc.easeSineInOut());
                    gold.runAction(cc.sequence(moveto, cc.callFunc(function () {
                        self.gameUICB.putInGoldPool(gold);
                    })));
                };

                for (var _i3 = 0; _i3 < goldSeat.children.length; ++_i3) {
                    _loop(_i3);
                }
            }
        }
    }
    Audio.playEffect('pork', 'gold.wav');
    this.gameUICB.scheduleOnceFunc(function () {
        var isZhuangShu = false;
        for (var _i4 in winSeats) {
            var winSeat = winSeats[_i4];
            if (winSeat.RoomIdx != self.CurrentZhuang) {
                (function () {
                    var goldWinSeat = self.gameUICB.getGoldsNode().getChildByName('seat' + winSeat.SeatNumber);
                    var goldStartPos = PukeDefine.POSITION.GOLD[winSeat.SeatNumber].START_POS;
                    for (var j in winSeat.Slice) {
                        var value = winSeat.Slice[j];
                        var maxTime = 0;
                        isZhuangShu = true;
                        for (var k = 0; k < PukeDefine.PUSH_GOLD_NUMBER; ++k) {
                            var _gold = self.gameUICB.getFromGoldPool();
                            goldWinSeat.addChild(_gold);
                            _gold.setPosition(cc.p(zhuangStartPos.x, zhuangStartPos.y));
                            var time = funUtils.random(min2, max2) / divisor;
                            maxTime = Math.max(time, maxTime);
                            var moveto = cc.moveTo(time, cc.p(goldStartPos.x, goldStartPos.y));
                            moveto.easing(cc.easeSineInOut());
                            _gold.stopAllActions();
                            _gold.runAction(cc.sequence(moveto, cc.callFunc(function () {
                                for (var m = 0; m < goldWinSeat.children.length; ++m) {
                                    var _gold2 = goldWinSeat.children[m];
                                    self.gameUICB.putInGoldPool(_gold2);
                                }
                            })));
                        }
                        self.gameUICB.scheduleOnceFunc(function () {
                            self.gameUICB.getGoldsNode().active = false;
                            for (var num in goldWinSeat.children) {
                                self.gameUICB.putInGoldPool(goldWinSeat.children[num]);
                            }
                        }, maxTime * 0.98);
                    }
                })();
            }
        }
        if (isZhuangShu) {
            Audio.playEffect('pork', 'gold.wav');
        }
    }, overTime);
};
//----- 发牌动画
SanGongManager.faPaiAnimation = function (index) {
    Audio.playEffect('pork', 'fapai.mp3');
    var self = this;
    if (index >= this.faPaiPukes.length) {
        this.gameUICB.scheduleOnceFunc(function () {
            self.setState('搓牌中');
            self.gameUICB.setBtnCuoPaiActive(true);
        }, PukeDefine.SEND_CARD_COMPLETE_TIME);
    } else {
        var _self = this;
        var time = PukeDefine.SEND_CARD_SINGLE_TIME;
        var copyPuke = this.gameUICB.getPukePool().get();
        copyPuke.setPosition(0, 0);
        this.gameUICB.getChildNode().getChildByName('puke').addChild(copyPuke);
        var px = this.faPaiPukes[index].x,
            py = this.faPaiPukes[index].y;
        var moveto = cc.moveTo(time, cc.p(px, py));
        moveto.easing(cc.easeSineInOut());
        copyPuke.runAction(cc.sequence(moveto, cc.callFunc(function () {
            _self.gameUICB.getPukePool().put(copyPuke);
            var count = index % 3 + 1;
            var seat = _self.faPaiSeats[Math.floor(index / 3)];
            var seatPuke = seat.getChildByName('puke' + count);
            if (_self.checkIsMineUserId(seat.UserId) && count != 3) {
                var puke = _self.faPaiSeats.myCards[count - 1];
                seatPuke.getComponent(cc.Sprite).spriteFrame = _self.getPukeSpriteById(puke);
            } else {
                seatPuke.getComponent(cc.Sprite).spriteFrame = _self.getPukeSpriteById('pai');
            }
            seatPuke.active = true;
            index += 1;
            _self.faPaiAnimation(index);
        })));
    }
};
//----- 搓牌动画
SanGongManager.cuoPaiAnimation = function (type, showType) {
    this.gameUICB.setBtnCuoPaiActive(false);
    this.isCuoPaiComplete = false;
    if (this.copyCuoPai) {
        this.gameUICB.getCuoPaiPool().put(this.copyCuoPai);
    }
    var self = this;
    var seat = this.getSeatByNumber(1);
    var pukeCuo = seat.getChildByName('puke3');
    pukeCuo.active = false;
    this.copyCuoPai = this.gameUICB.getCuoPaiPool().get();
    this.copyCuoPai.setPosition(0, 0);
    this.gameUICB.getChildNode().getChildByName('cuopai').addChild(this.copyCuoPai);
    var data = {};
    data.from = type;
    data.GameType = 'SANGONG';
    data.num = this.CuoPaiNumber;
    data.cb = function () {
        if (type != 'showCard') {
            fun.net.send('ShowCard', '');
        }
        if (showType !== undefined) {
            self.showTypeFunc(seat, showType);
        }
        self.isCuoPaiComplete = true;
        pukeCuo.active = true;
        pukeCuo.getComponent(cc.Sprite).spriteFrame = self.getPukeSpriteById(data.num);
        self.gameUICB.getCuoPaiPool().put(self.copyCuoPai);
    };
    this.copyCuoPai.getComponent('CuoPai').initPuke(data);
};
//----- 初始化抢庄
SanGongManager.initQZhuangFunction = function () {
    if (this.data != undefined && this.data.DZhuang === 3) {
        this.IsFreeQiangZhuang = true;
        this.QiangZhuangSeat = new Array();
        this.ZeroZhuangSeat = new Array();
        this.TurnZhuang = false;
    }
};
//----- 游戏重连 准备显示
SanGongManager.reconnectReadyFunc = function () {
    this.FirstEnterRoom = false;
    if (this.data.Players != undefined) {
        for (var i in this.data.Players) {
            var player = this.data.Players[i];
            var seat = this.getSeatByUserId(player.UserId);
            if (player.Ready) {
                seat.Readying.active = true;
            }
            if (this.checkIsMineUserId(player.UserId) && !player.Ready) {
                this.gameUICB.setBtnReadyActive(true);
            }
        }
    }
};
//----- 检测是否为房主
SanGongManager.getRoomMasterByRoomInfo = function () {
    if (this.data.RoomIdx !== undefined) {
        return this.data.RoomIdx === 0 ? true : false;
    } else {
        var players = this.data.Players;
        for (var key in players) {
            if (this.checkIsMineUserId(players[key].UserId)) {
                return players[key].RoomIdx === 0 ? true : false;
            }
        }
    }
};
//----- 庄显示为 false
SanGongManager.setZhuangFalse = function () {
    for (var i = 0; i < 6; ++i) {
        var seat = this.getSeatByNumber(i + 1);
        seat.Zhuang.active = false;
    }
};
//----- 检测是否为自己的UserId
SanGongManager.checkIsMineUserId = function (id) {
    if (parseInt(id) === this.MineUserId) return true;else return false;
};
//----- 设置游戏状态
SanGongManager.setState = function (content) {
    for (var i = 0; i < 6; ++i) {
        var seat = this.getSeatByNumber(i + 1);
        if (seat.active) {
            if (!content) {
                seat.State.active = false;
                this.gameUICB.jumpTextAnim(false);
            } else {
                var seatNumber = this.getSeatNumberByRoomIdx(this.CurrentZhuang);
                if (content === '下注中' && seatNumber === i + 1) console.log('庄家不下注');else this.gameUICB.setState({ state: seat.State, content: content, color: 0 });
            }
        }
    }
};

//-----------------------------------------------------------
//----- 初始化 房间 信息
SanGongManager.initRoomInfo = function () {
    this.gameUICB.setGameStatus(this.data.Status);
    this.RoundJuShu = this.data.Round;
    this.TotalJuShu = this.data.Total;
    this.DiFen = PukeDefine.ROOM_INFO.DI_FEN[this.data.DFeng - 1];
    this.ZhuangWei = PukeDefine.ROOM_INFO.ZHUANG_WEI[this.data.DZhuang - 1];
    this.Charge = PukeDefine.ROOM_INFO.COST[this.data.Charge - 1];
    this.IsMaster = PukeDefine.ROOM_INFO.ISMASTER[this.getRoomMasterByRoomInfo() ? 0 : 1];
    var msg = {
        RoomId: this.data.RoomId,
        Round: this.RoundJuShu,
        Total: this.TotalJuShu,
        ZhuangWei: this.ZhuangWei,
        DiFen: this.DiFen[0],
        IsMaster: this.IsMaster
    };
    this.gameUICB.initRoomInfo(msg);
};
//----- 初始化 座位 信息
SanGongManager.initSeatInfo = function () {
    if (this.data.EnterRoom === 'create') {
        this.updateSeatNumber();
        this.gameUICB.setCreateSeat();
    } else if (this.data.EnterRoom === 'enter') {
        this.CardsMap = {};
        this.updateSeatNumber(this.data.Players);
        for (var i = 0; i < this.data.Players.length; i++) {
            var value = this.data.Players[i];
            var roomIdx = value.RoomIdx;
            var seatNumber = this.getSeatNumberByRoomIdx(roomIdx);
            var seat = this.getSeatByNumber(seatNumber);
            if (!value.OnLine) {
                seat.Mask.active = true;
            }
            this.gameUICB.setEnterSeat(seatNumber, value);
            if (value.Cards && value.Cards[0] != 0) {
                this.CardsMap[value.UserId] = {};
                this.CardsMap[value.UserId].Cards = value.Cards;
                if (value.Cards.length === 2) {
                    for (var _i5 = 1; _i5 <= 3; _i5++) {
                        var puke = this.getPukeSpriteById('pai');
                        seat['Puke' + _i5].active = true;
                        seat['Puke' + _i5].getComponent(cc.Sprite).spriteFrame = puke;
                    }
                } else if (value.Cards.length === 3) {
                    for (var _i6 = 1; _i6 <= 3; _i6++) {
                        var _puke = this.getPukeSpriteById(value.Cards[_i6 - 1]);
                        seat['Puke' + _i6].active = true;
                        seat['Puke' + _i6].getComponent(cc.Sprite).spriteFrame = _puke;
                    }
                }
            }
            if (this.checkIsMineUserId(value.UserId)) {
                this.RecentYaZhu = value.Zhu === 0 ? 1 : value.Zhu;
            }
        }
        if (this.data.Zhuang > -1) {
            this.CurrentZhuang = this.data.Zhuang;
            for (var _i7 = 1; _i7 <= 6; _i7++) {
                var _seat2 = this.getSeatByNumber(_i7);
                if (_seat2.RoomIdx === this.data.Zhuang) {
                    _seat2.Zhuang.active = true;
                    _seat2.ZhuangSp.setAnimation(0, 'Zhong', false);
                }
            }
        }
    }
};
//----- 开始游戏准备
SanGongManager.startGameReady = function () {
    this.gameUICB.setGameStatus(6);
    this.gameUICB.setBtnInviteActive(false);
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        seat.Readying.active = false;
        seat.YaBox.active = false;
    }
};

//-----------------------------------------------------------
// 监听函数初始化
SanGongManager.initListener = function () {
    this.ListenCBList = [];
    this.pListenCBList = [];
    var self = this;
    var listen = function listen(cmd, cb, isPingTai) {
        if (isPingTai) {
            fun.net.pListen(cmd, cb);
            self.pListenCBList.push(cmd);
        } else {
            fun.net.listen(cmd, cb);
            self.ListenCBList.push(cmd);
        }
    };
    listen('EnterRoom', this.onEnterRoomAck.bind(this), true);
    listen('OnLine', this.onOnLineAck.bind(this), true);
    listen('OffLine', this.onOffLineAck.bind(this), true);
    listen('ReadyNext', this.onReadyNextAck.bind(this));
    listen('Qzhuang', this.onQZhuangAck.bind(this));
    listen('Zhuang', this.onZhuangAck.bind(this));
    listen('YaZhu', this.onYaZhuAck.bind(this));
    listen('SomeOneYaZhu', this.onSomeOneYaZhuAck.bind(this));
    listen('StartGame', this.onStartGameAck.bind(this));
    listen('ShowCard', this.onShowCardAck.bind(this));
    listen('AccountOne', this.onSingleAccountAck.bind(this));
    listen('AccountAll', this.onTotalAccountAck.bind(this));
    listen('LeaveRoom', this.onLeaveRoomAck.bind(this));
    listen('DisbandRoomResult', this.onDisbandRoomResultAck.bind(this));
    listen('DisbandRoomVote', this.onDisbandRoomVoteAck.bind(this));
};
SanGongManager.cleanListener = function () {
    for (var i in this.ListenCBList) {
        fun.net.rmListen(this.ListenCBList[i]);
    }
    for (var _i8 in this.pListenCBList) {
        fun.net.rmPListen(this.pListenCBList[_i8]);
    }
    this.ListenCBList = [];
    this.pListenCBList = [];
};

//--- 加入房间返回通知
SanGongManager.onEnterRoomAck = function (msg) {
    if (this.checkIsMineUserId(msg.Player.UserId)) return;
    if (this.SeatArray === undefined) return;
    var roomIdx = msg.Player.RoomIdx;
    var cha = Math.abs(this.SeatArray[0] - roomIdx);
    if (this.SeatArray[0] > roomIdx) {
        this.SeatArray[6 - cha] = roomIdx;
    } else {
        this.SeatArray[cha] = roomIdx;
    }
    this.gameUICB.setEnterSeat(this.getSeatNumberByRoomIdx(roomIdx), msg.Player);
};
//--- 准备返回通知
SanGongManager.onReadyNextAck = function (msg) {
    if (!msg) {
        return;
    }
    if (this.checkIsMineUserId(msg.UserId)) {
        this.gameUICB.setBtnReadyActive(false);
        this.MineSeat.Readying.active = true;
    } else {
        if (msg.UserId === 0) {
            if (this.FirstEnterRoom) {
                this.reconnectReadyFunc();
            } else {
                this.gameUICB.setBtnReadyActive(true);
            }
        } else {
            var seat = this.getSeatByUserId(msg.UserId);
            seat.Readying.active = true;
            seat.Ying.active = false;
            seat.Shu.active = false;
        }
    }
};
//--- 抢庄通知
SanGongManager.onQZhuangAck = function (msg) {
    if (msg.RetCode != undefined) {
        if (msg.RetCode === 0) {
            this.gameUICB.setBtnQZhuangActive(false);
        }
        return;
    }
    this.cleanSeatData();
    if (msg.UserId === 0) {
        Audio.playEffect('pork', 'remind.mp3');
        this.setState('抢庄中');
        this.gameUICB.setBtnInviteActive(false);
        this.gameUICB.setBtnQZhuangActive(true);
        this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_QIANG_ZHUANG);
        for (var i = 1; i <= 6; i++) {
            var seat = this.getSeatByNumber(i);
            if (seat.active) {
                this.ZeroZhuangSeat[this.ZeroZhuangSeat.length] = i;
            }
        }
        this.DingZhuangTime = 0;
        this.StartChooseZhuang = true;
    } else {
        var _seat3 = this.getSeatByUserId(msg.UserId);
        if (msg.Op === 0) {
            var seatNumber = _seat3.SeatNumber;
            this.QiangZhuangSeat[this.QiangZhuangSeat.length] = seatNumber;
            this.gameUICB.setState({ state: _seat3.State, content: '已抢庄', color: 0 });
        } else if (msg.Op === 1) {
            this.gameUICB.setState({ state: _seat3.State, content: '不抢庄', color: 1 });
        }
    }
};
//--- 下发庄家通知
SanGongManager.onZhuangAck = function (msg) {
    var self = this;
    this.CurrentZhuang = msg.Zhuang;
    this.setState(false);
    this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
    this.cleanSeatData();
    var zhuangFunc = function zhuangFunc() {
        self.setState('下注中');
        var zhuangSeat = self.getSeatByNumber(self.getSeatNumberByRoomIdx(msg.Zhuang));
        self.gameUICB.setBtnXuYaActive(self.checkIsMineUserId(zhuangSeat.UserId) ? false : true);
        self.startGameReady();
        self.gameUICB.setBtnQZhuangActive(false);
        self.setZhuangFalse();
        zhuangSeat.Zhuang.active = true;
        zhuangSeat.ZhuangSp.setAnimation(0, 'Zhong', false);
    };
    var resetFunc = function resetFunc() {
        self.TurnZhuang = false;
        self.ZeroZhuangSeat = [];
        self.QiangZhuangSeat = [];
        self.DingZhuangTime = 0;
        self.StartChooseZhuang = false;
        self.qzDtTime = 0;
    };
    if (this.IsFreeQiangZhuang && this.QiangZhuangSeat.length != 1) {
        this.DingZhuangTime = PukeDefine.QIANG_ZHUANG_WAIT_TIME;
        this.gameUICB.scheduleOnceFunc(function () {
            resetFunc();
            zhuangFunc();
        }, PukeDefine.QIANG_ZHUANG_TURN_TIME);
    } else if (this.IsFreeQiangZhuang && this.QiangZhuangSeat.length === 1) {
        resetFunc();
        zhuangFunc();
    } else {
        zhuangFunc();
    }
};
//--- 押注提示通知
SanGongManager.onYaZhuAck = function (msg) {
    if (msg === undefined || msg.Zhus === null) {
        return;
    }
    if (msg.RetCode != undefined) {
        return;
    }
    if (this.data.DZhuang !== 3) {
        Audio.playEffect('pork', 'remind.mp3');
    }
    var self = this;
    this.gameUICB.setBtnXiaZhuActive(true);
    this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
    this.startGameReady();
    this.gameUICB.showXiaZhu(msg.Zhus);
    this.cleanSeatData(); //清理单局结算
    if (this.gameUICB.getIsXuYa() && this.RecentYaZhu) {
        this.gameUICB.scheduleOnceFunc(function () {
            if (self.RecentYaZhu === 1) {
                self.gameUICB.onBtnXiaZhuClicked('', 1);
            } else if (self.RecentYaZhu === 2) {
                self.gameUICB.onBtnXiaZhuClicked('', 2);
            } else if (self.RecentYaZhu === 3) {
                self.gameUICB.onBtnXiaZhuClicked('', 3);
            }
        }, PukeDefine.ZI_DONG_XU_YA_TIME);
    }
};
//--- 押注通知
SanGongManager.onSomeOneYaZhuAck = function (msg) {
    if (this.checkIsMineUserId(msg.UserId)) {
        this.gameUICB.setBtnXiaZhuActive(false);
    }
    var seat = this.getSeatByUserId(msg.UserId);
    seat.YaBox.active = true;
    seat.YaZhu.string = msg.Zhu;
    this.gameUICB.setState({ state: seat.State, content: '已下注', color: 0 });
    this.pushGold(seat.SeatNumber, msg.Zhu);
};
//--- 开始游戏通知
SanGongManager.onStartGameAck = function (msg) {
    var self = this;
    this.gameUICB.showHint(false);
    this.setState(false);
    this.isCuoPaiComplete = false;
    this.gameUICB.scheduleOnceFunc(function () {
        self.CardsMap = msg.CardsMap;
        var sortCardsMap = new Array();
        var seatNumber = self.getSeatNumberByRoomIdx(self.CurrentZhuang);
        for (var userid in msg.CardsMap) {
            for (var i = 1; i <= 6; i++) {
                var seat = self.getSeatByNumber(i);
                if (seat.UserId === parseInt(userid)) {
                    var cha = seatNumber - seat.SeatNumber;
                    var _idx = cha >= 0 ? cha : 6 - Math.abs(cha);
                    sortCardsMap[_idx] = {};
                    sortCardsMap[_idx].UserId = userid;
                    sortCardsMap[_idx].Cards = msg.CardsMap[userid].Cards;
                }
            }
        }
        var pukes = [],
            idx = -1,
            seats = [];
        for (var k in sortCardsMap) {
            var value = sortCardsMap[k];
            for (var _i9 = 1; _i9 <= 6; _i9++) {
                var _seat4 = self.getSeatByNumber(_i9);
                _seat4.Readying.active = false;
                if (_seat4.UserId === parseInt(value.UserId)) {
                    seats.push(_seat4);
                    var pos = _seat4.getPosition();
                    if (_i9 === 1) {
                        seats.myCards = value.Cards;
                        self.CuoPaiNumber = value.Cards[2];
                    }
                    for (var j = 1; j <= 3; j++) {
                        idx += 1;
                        var fuhao = j === 1 ? -1 : j === 3 ? 1 : 0;
                        pukes[idx] = {};
                        pukes[idx].x = _i9 === 1 ? fuhao * 30 : pos.x + fuhao * 30;
                        pukes[idx].y = _i9 === 1 ? pos.y * 0.8 : pos.y - _seat4.getContentSize().width / 1.58;
                    }
                }
            }
        }
        self.faPaiPukes = pukes;
        self.faPaiSeats = seats;
        self.faPaiAnimation(0);
    }, PukeDefine.SEND_CARD_DELAY);
};
//--- 显示牌通知
SanGongManager.onShowCardAck = function (msg) {
    var seat = this.getSeatByUserId(msg.UserId);
    this.gameUICB.setState({ state: seat.State, content: '已亮牌', color: 0 });
    var showType = { Dian: msg.Dian, Bei: msg.Bei };
    if (msg.UserId === seat.UserId) {
        if (this.checkIsMineUserId(msg.UserId)) {
            this.CuoPaiNumber = msg.Card;
            if (!this.isCuoPaiComplete) {
                this.cuoPaiAnimation('showCard', showType);
            } else {
                this.showTypeFunc(seat, showType);
            }
        } else {
            for (var id in this.CardsMap) {
                if (parseInt(id) === msg.UserId) {
                    for (var i = 1; i <= 2; i++) {
                        var _puke2 = this.getPukeSpriteById(this.CardsMap[id].Cards[i - 1]);
                        seat['Puke' + i].getComponent(cc.Sprite).spriteFrame = _puke2;
                    }
                }
            }
            var puke = this.getPukeSpriteById(msg.Card);
            seat['Puke3'].getComponent(cc.Sprite).spriteFrame = puke;
            this.showTypeFunc(seat, showType);
        }
    }
};
//--- 点数倍数显示
SanGongManager.showTypeFunc = function (seat, value) {
    var anim = value.Dian;
    var effectName = void 0;
    if (value.Bei === 1 || value.Bei === 2 || value.Bei === 3) {
        anim = value.Dian + 'dian';
        effectName = value.Dian;
    } else if (value.Bei === 4) {
        anim = 'Hun';
        effectName = 10;
    } else if (value.Bei === 5) {
        anim = 'Fei';
        effectName = 11;
    } else if (value.Bei === 6) {
        anim = 'Da';
        effectName = 12;
    } else if (value.Bei === 9) {
        anim = 'Tian';
        effectName = 13;
    }
    seat.ShuZi.active = true;
    seat.ShuZiSp.setAnimation(0, anim, false);
    if (this.checkIsMineUserId(seat.UserId)) {
        var type = PukeDefine.NIUNIU_ROOM_INFO.PAI_JU_SCORE['SAN_GONG'][effectName];
        var sex = this.UserInfo.Sex === 1 ? 'male' : 'female';
        Audio.playEffect('pork', type + '.mp3', sex);
    }
};
//--- 单局结算通知
SanGongManager.onSingleAccountAck = function (msg) {
    this.setState(false);
    var accountMap = msg.AccountMap;
    var userArr = {};
    var winSeats = new Array();
    for (var id in accountMap) {
        var value = accountMap[id];
        var winSeat = this.getSeatByUserId(id);
        winSeat.Slice = value.Slice;
        winSeats[winSeats.length] = winSeat;
        var loseSeatArr = new Array();
        for (var i in value.Slice) {
            var slice = value.Slice[i];
            var loseId = slice.UserId;
            var score = slice.Score;
            loseSeatArr[i] = this.getSeatByUserId(loseId);
            winSeat.Fen.string = parseInt(winSeat.Fen.string) + score;
            loseSeatArr[i].Fen.string = parseInt(loseSeatArr[i].Fen.string) - score;
            userArr[id] = userArr[id] ? userArr[id] + score : score;
            userArr[loseId] = userArr[loseId] ? userArr[loseId] - score : -score;
        }
    }
    this.callInGold(winSeats);
    for (var _id in userArr) {
        var _value2 = userArr[_id];
        var seat = this.getSeatByUserId(_id);
        if (_value2 > 0) {
            seat.Ying.active = true;
            seat.Shu.active = false;
            seat.YingLabel.string = '+' + _value2;
        } else {
            seat.Ying.active = false;
            seat.Shu.active = true;
            seat.ShuLabel.string = _value2;
        }
    }
    for (var _id2 in msg.BeiDianMap) {
        var _value3 = msg.BeiDianMap[_id2];
        var _seat5 = this.getSeatByUserId(_id2);
        if (!_seat5.ShuZi) {
            this.showTypeFunc(_seat5, _value3);
        }
    }
    this.RoundJuShu += 1;
    if (this.RoundJuShu <= this.TotalJuShu) {
        this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
        this.gameUICB.setBtnReadyActive(true);
        this.gameUICB.setJuShuText(this.RoundJuShu + '/' + this.TotalJuShu);
    }
};
//--- 总结算通知
SanGongManager.onTotalAccountAck = function (msg) {
    msg.RoomId = this.data.RoomId;
    msg.JuShu = this.TotalJuShu;
    msg.DiFen = this.DiFen[0];
    msg.ZhuangWei = this.ZhuangWei;
    msg.highestScore = 0;
    var self = this;
    var count = -1;
    var newData = new Array();
    for (var id in msg.Accounts) {
        var value = msg.Accounts[id];
        var seat = this.getSeatByUserId(id);
        msg.highestScore = Math.max(value, msg.highestScore);
        count++;
        newData[count] = {};
        newData[count].id = id;
        newData[count].score = value;
        // newData[count].name  = seat.Name.string;
        newData[count].name = seat._Name;
        newData[count].head = seat.HeadUrl;
        newData[count].left = msg.RoomCards[id].Left;
        newData[count].lost = msg.RoomCards[id].Lost;
    }
    newData.sort(function (a, b) {
        return a.score < b.score;
    });
    msg.sortAccounts = newData;

    this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_TOTAL_ACCOUNT);
    var time = PukeDefine.TOTAL_ACCOUNT_SHOW_TIME;
    if (this.copyDisbandPrefab) {
        this.copyDisbandPrefab.removeFromParent();
        time = 0.1;
    }
    this.copyTotalAccount = this.gameUICB.onTotalAccountAck();
    this.copyTotalAccount.setPosition(0, 0);
    this.gameUICB.setCountDownTime(true, time);
    this.gameUICB.scheduleOnceFunc(function () {
        self.gameUICB.setCountDownTime(false);
        self.gameUICB.showHint(false);
        self.gameUICB.getChildNode().getChildByName('totalaccount').addChild(self.copyTotalAccount);
        self.copyTotalAccount.getComponent('PukeAccount').initTotalAccount(msg);
    }, time);
};

// 离开(解散)房间
SanGongManager.onLeaveRoomAck = function (msg) {
    if (msg.UserId && msg.UserId >= 0) {
        var seat = this.getSeatByUserId(msg.UserId);
        var pukeNumber = PukeDefine.GAME_TYPE[this.data.GameType].PUKE_NUMBER;
        this.gameUICB.resetSeat(seat.SeatNumber, pukeNumber);
    }
};
SanGongManager.onDisbandRoomResultAck = function (msg) {
    var self = this;
    this.gameUICB.setMenuBgActive(false);
    if (msg.Disbanded) {
        this.gameUICB.scheduleOnceFunc(function () {
            if (!self.copyTotalAccount) {
                cc.director.loadScene('hall');
            }
        }, PukeDefine.DISBAND_ROOM_DELAY_TIME);
    } else {
        this.gameUICB.scheduleOnceFunc(function () {
            if (self.copyDisbandPrefab) {
                self.copyDisbandPrefab.active = false;
            }
        }, PukeDefine.DISBAND_ROOM_DELAY_TIME);
    }
};
SanGongManager.onDisbandRoomVoteAck = function (msg) {
    if (!msg) {
        return;
    }
    if (msg.RetCode !== undefined) {
        if (msg.RetCode === 0) {
            cc.director.loadScene('hall');
        }
        return;
    }
    if (!this.copyDisbandPrefab) {
        this.copyDisbandPrefab = this.gameUICB.getDisband();
    }
    this.gameUICB.setMenuBgActive(false);
    this.copyDisbandPrefab.active = true;
    msg.GameType = 'sangong';
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        for (var id in msg.VoteInfo) {
            if (id == seat.UserId) {
                var state = msg.VoteInfo[id];
                msg.VoteInfo[id] = {};
                msg.VoteInfo[id].state = state;
                msg.VoteInfo[id].name = seat.Name.string;
                msg.VoteInfo[id].headUrl = seat.HeadUrl;
            }
        }
    }
    this.copyDisbandPrefab.getComponent('PukeDisband').disbandRoomInit(msg);
};
// 上线 离线
SanGongManager.onOnLineAck = function (msg) {
    var seat = this.getSeatByUserId(msg.UserId);
    seat.Mask.active = false;
};
SanGongManager.onOffLineAck = function (msg) {
    var seat = this.getSeatByUserId(msg.UserId);
    seat.Mask.active = true;
};

//-----------------------------------------------------------
//--- 押注大小
SanGongManager.YaZhuFunction = function (yanum) {
    this.RecentYaZhu = parseInt(yanum);
    fun.net.send('YaZhu', { Zhu: this.DiFen[yanum - 1] }, function (rsp) {
        if (rsp.RetCode !== undefined && rsp.RetCode != 0) {
            this.gameUICB.setBtnXiaZhuActive(false);
        }
    }.bind(this));
};
//--- 离开(解散)房间
SanGongManager.LeaveRoomFunction = function () {
    if (this.gameUICB.getGameStatus() === 1) {
        if (this.MineIsMaster) {
            fun.net.send('DisbandRoomVote', { OP: 1 }, function (rsp) {
                if (rsp.RetCode !== undefined && rsp.RetCode === 0) {
                    cc.director.loadScene('hall');
                }
            }.bind(this));
        } else {
            fun.net.send('LeaveRoom', { OP: 1 }, function (rsp) {
                if (rsp.Leave) {
                    cc.director.loadScene('hall');
                }
            }.bind(this));
        }
    } else {
        fun.net.send('DisbandRoomVote', { OP: 1 });
    }
};
//--- 准备
SanGongManager.ReadyFunction = function () {
    fun.net.send('ReadyNext', '', function (rsp) {
        if (rsp.RetCode !== undefined && rsp.RetCode === 0) {
            this.gameUICB.setBtnReadyActive(false);
            this.MineSeat.Readying.active = true;
        }
    }.bind(this));
};
//--- 抢庄
SanGongManager.QZhuangFunction = function (type) {
    fun.net.send('Qzhuang', { OP: type }, function (rsp) {
        if (rsp.RetCode !== undefined && rsp.RetCode === 0) {
            this.gameUICB.setBtnQZhuangActive(false);
        }
    }.bind(this));
};
//--- 微信分享
SanGongManager.wxShare = function () {
    var jushu = this.TotalJuShu + '局';
    var difen = '底分' + this.DiFen[0];
    var info = {};
    info.title = '三公-房间号：' + this.data.RoomId;
    info.content = jushu + ', ' + this.Charge + ', ' + this.ZhuangWei + ', ' + difen;
    require('JSPhoneWeChat').WxShareFriend(info);
};

module.exports = SanGongManager;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=SanGongManager.js.map
        