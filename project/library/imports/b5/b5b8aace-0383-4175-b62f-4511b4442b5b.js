"use strict";
cc._RF.push(module, 'b5b8arOA4NBdbYvRRG0RCtb', 'NiuNiuManager');
// poker/script/pukeComm/NiuNiuManager.js

'use strict';

var NiuNiuManager = {};
var PukeData = require('PukeData');
var funUtils = require('funUtils');
var PukeUtils = require('PukeUtils');
var PukeDefine = require('PukeDefine');
var Audio = require('Audio');

NiuNiuManager.initGame = function (gameUICB) {
    this.gameUICB = gameUICB;

    this.UserInfo = fun.db.getData('UserInfo', true);
    this.MineUserId = this.UserInfo.UserId;
    this.MineSeat = this.getSeatByNumber(1);
    this.data = fun.db.getData('RoomInfo');
    this.MineIsMaster = this.getRoomMasterByRoomInfo();
    this._isShowCard = true;
    this._isMineNewUser = this.data.EnterRoom === 'create' ? true : this.data.userMap[this.MineUserId].newUser;
    this._checkSpineCacheComplete = {};
    for (var i = 1; i <= 6; ++i) {
        this._checkSpineCacheComplete[i] = false;
    }
    this.initRoomInfo();
    this.initSeatInfo();
    this.initQZhuangFunction();
    this.initListener();
};
NiuNiuManager.update = function (dt) {
    if (this.StartChooseZhuang) {
        this.qzDtTime = (this.qzDtTime || 0) + dt;
        var chaTime = PukeDefine.QIANG_ZHUANG_WAIT_TIME - this.DingZhuangTime;
        if (this.qzDtTime >= chaTime) {
            this.gameUICB.setBtnQZhuangActive(false);
            if (!this._isMineNewUser) {
                this.gameUICB.showHint(false);
            }
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
    for (var i = 1; i <= 6; ++i) {
        if (this._checkSpineCacheComplete !== undefined && this._checkSpineCacheComplete[i] !== undefined && this._checkSpineCacheComplete[i]) {
            if (this.gameUICB.getSpineCacheComplete().length === 6) {
                this._checkSpineCacheComplete[i] = false;
                this._spineCacheFunc(i);
            }
        }
    }
};
NiuNiuManager.onDestroy = function () {
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
    this._userMap = {};
    this.copyDisbandPrefab = undefined;
    this.copyTotalAccount = undefined;
    this.StartChooseZhuang = false;
    this.TurnZhuang = false;
};

//-----------------------------------------------------------
//----- 座位号 调整
NiuNiuManager.updateSeatNumber = function (player) {
    var minePlayer = {};
    if (this.data.EnterRoom === 'enter') {
        for (var id in player) {
            var value = player[id];
            if (this.checkIsMineUserId(value.userId)) {
                minePlayer = value;
            }
        }
    } else if (this.data.EnterRoom === 'create') {
        minePlayer = { sort: 0 };
    }
    this.SeatArray = new Array();
    for (var i = 0; i < 6; i++) {
        if (i === 0) {
            this.SeatArray[0] = minePlayer.sort;
        } else {
            this.SeatArray[i] = '';
        }
    }
    if (this.data.EnterRoom === 'enter') {
        for (var _i in player) {
            var _value = player[_i];
            var cha = Math.abs(minePlayer.sort - _value.sort);
            if (minePlayer.sort > _value.sort) {
                this.SeatArray[6 - cha] = _value.sort;
            } else if (minePlayer.sort < _value.sort) {
                this.SeatArray[cha] = _value.sort;
            }
        }
    }
};
//----- 根据 RoomIdx 返回座位号
NiuNiuManager.getSeatNumberByRoomIdx = function (roomIdx) {
    for (var i = 0; i < this.SeatArray.length; i++) {
        if (this.SeatArray[i] === parseInt(roomIdx)) {
            return i + 1;
        }
    }
    return roomIdx + 1;
};
//----- 根据 座位号 获取 Seat
NiuNiuManager.getSeatByNumber = function (num) {
    return this.gameUICB.getSeatByNumber(num);
};
//----- 根据 UserId 获取 Seat
NiuNiuManager.getSeatByUserId = function (id) {
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        if (parseInt(seat.UserId) === parseInt(id)) {
            return seat;
        }
    }
};
//----- 根据 牌ID 转换对应的 新牌ID
NiuNiuManager.getNewPaiIdById = function (id) {
    var addNum = void 0;
    if (id <= 13) {
        addNum = 1;
    } else if (id > 13 && id <= 26) {
        addNum = 2;
    } else if (id > 26 && id <= 39) {
        addNum = 3;
    } else if (id > 39 && id <= 52) {
        addNum = 4;
    } else {
        addNum = id;
    }
    var idx = id % 13 === 0 ? 13 - 1 : id % 13 - 1;
    var newPaiId = addNum === 'pai' ? id : idx * 4 + addNum;
    return newPaiId;
};
//----- 根据 牌ID 取牌
NiuNiuManager.getPukeSpriteById = function (id) {
    return this.gameUICB.getPukeSpriteById(this.getNewPaiIdById(id));
};
//----- 清空 座位 信息
NiuNiuManager.cleanSeatData = function () {
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        seat.Readying.active = false;
        for (var j = 1; j <= 5; j++) {
            seat['Puke' + j].active = false;
        }
        seat.ShuZi.active = false;
        seat.YaBox.active = false;
        seat.Ying.active = false;
        seat.Shu.active = false;
    }
};
//----- 金币押注动画
NiuNiuManager.pushGold = function (seatNumber, goldNum) {
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
NiuNiuManager.callInGold = function (msg) {
    this.gameUICB.getGoldsNode().active = true;
    var account = msg.gameOver;
    var self = this;
    var overTime = 0;
    var min = 5,
        max = 10,
        min2 = 5,
        max2 = 10,
        divisor = 10;
    var zhuangStartPos = void 0;
    if (this.data.roomRule.makersType === 4) {
        zhuangStartPos = { x: 0, y: 0 };
    } else {
        var zhuangSeatNumber = this.getSeatNumberByRoomIdx(this.CurrentZhuang);
        zhuangStartPos = PukeDefine.POSITION.GOLD[zhuangSeatNumber].START_POS;
    }
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        if (seat.RoomIdx != this.CurrentZhuang) {
            var goldSeat = this.gameUICB.getGoldsNode().getChildByName('seat' + i);
            if (goldSeat.childrenCount > 0) {
                var _loop = function _loop(_i2) {
                    var gold = goldSeat.children[_i2];
                    var time = funUtils.random(min, max) / divisor;
                    overTime = Math.max(time, overTime);
                    var moveto = cc.moveTo(time, cc.p(zhuangStartPos.x, zhuangStartPos.y));
                    moveto.easing(cc.easeSineInOut());
                    gold.runAction(cc.sequence(moveto, cc.callFunc(function () {
                        self.gameUICB.putInGoldPool(gold);
                    })));
                };

                for (var _i2 = 0; _i2 < goldSeat.children.length; ++_i2) {
                    _loop(_i2);
                }
            }
        }
    }
    Audio.playEffect('pork', 'gold.wav');
    if (this.data.roomRule.makersType === 4) {
        //通比牛牛
        this.gameUICB.scheduleOnceFunc(function () {
            for (var id in account) {
                var value = account[id];
                if (value.score > 0) {
                    (function () {
                        var winSeat = self.getSeatByUserId(id);
                        var goldWinSeat = self.gameUICB.getGoldsNode().getChildByName('seat' + winSeat.SeatNumber);
                        var goldStartPos = PukeDefine.POSITION.GOLD[winSeat.SeatNumber].START_POS;
                        var maxTime = 0;
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
                            for (var num in goldWinSeat.children) {
                                self.gameUICB.putInGoldPool(goldWinSeat.children[num]);
                            }
                        }, maxTime * 0.98);
                    })();
                }
            }
            Audio.playEffect('pork', 'gold.wav');
            self.onAccountFunc(msg);
        }, overTime);
        return;
    }
    this.gameUICB.scheduleOnceFunc(function () {
        var isZhuangShu = false;
        for (var id in account) {
            var value = account[id];
            if (value.score > 0) {
                var winSeat = self.getSeatByUserId(id);
                if (winSeat.RoomIdx != self.CurrentZhuang) {
                    (function () {
                        isZhuangShu = true;
                        var goldWinSeat = self.gameUICB.getGoldsNode().getChildByName('seat' + winSeat.SeatNumber);
                        var goldStartPos = PukeDefine.POSITION.GOLD[winSeat.SeatNumber].START_POS;
                        var maxTime = 0;
                        for (var k = 0; k < PukeDefine.PUSH_GOLD_NUMBER; ++k) {
                            var _gold3 = self.gameUICB.getFromGoldPool();
                            goldWinSeat.addChild(_gold3);
                            _gold3.setPosition(cc.p(zhuangStartPos.x, zhuangStartPos.y));
                            var time = funUtils.random(min2, max2) / divisor;
                            maxTime = Math.max(time, maxTime);
                            var moveto = cc.moveTo(time, cc.p(goldStartPos.x, goldStartPos.y));
                            moveto.easing(cc.easeSineInOut());
                            _gold3.stopAllActions();
                            _gold3.runAction(cc.sequence(moveto, cc.callFunc(function () {
                                for (var m = 0; m < goldWinSeat.children.length; ++m) {
                                    var _gold4 = goldWinSeat.children[m];
                                    self.gameUICB.putInGoldPool(_gold4);
                                }
                            })));
                        }
                        self.gameUICB.scheduleOnceFunc(function () {
                            self.gameUICB.getGoldsNode().active = false;
                            for (var num in goldWinSeat.children) {
                                self.gameUICB.putInGoldPool(goldWinSeat.children[num]);
                            }
                        }, maxTime * 0.98);
                    })();
                }
            }
        }
        if (isZhuangShu) {
            Audio.playEffect('pork', 'gold.wav');
        }
        self.onAccountFunc(msg);
    }, overTime);
};
//----- 发牌动画
NiuNiuManager.faPaiAnimation = function (index) {
    Audio.playEffect('pork', 'fapai.mp3');
    var self = this;
    if (index >= this.faPaiPukes.length) {
        this.gameUICB.scheduleOnceFunc(function () {
            if (!self._isMineNewUser) {
                self.setState('搓牌中');
                self.gameUICB.setBtnCuoPaiActive(true);
            }
        }, PukeDefine.SEND_CARD_COMPLETE_TIME);
    } else {
        var time = PukeDefine.SEND_CARD_SINGLE_TIME;
        var copyPuke = this.gameUICB.getPukePool().get();
        copyPuke.setPosition(0, 0);
        this.gameUICB.getChildNode().getChildByName('puke').addChild(copyPuke);
        var px = this.faPaiPukes[index].x,
            py = this.faPaiPukes[index].y;
        var moveto = cc.moveTo(time, cc.p(px, py));
        moveto.easing(cc.easeSineInOut());
        copyPuke.runAction(cc.sequence(moveto, cc.callFunc(function () {
            self.gameUICB.getPukePool().put(copyPuke);
            var count = index % 5 + 1;
            var seat = self.faPaiSeats[Math.floor(index / 5)];
            var seatPuke = seat.getChildByName('puke' + count);
            var type = seat.SeatNumber === 1 ? 'MINE' : 'OTHER';
            var posx = PukeDefine.POSITION.PUKE.NIU_NIU[count][type].x;
            seatPuke.setPositionX(posx);
            seatPuke.active = true;
            if (seat.UserId === self.MineUserId && count != 5) {
                var puke = self.faPaiSeats.myCards[count - 1];
                seatPuke.getComponent(cc.Sprite).spriteFrame = self.getPukeSpriteById(puke);
            } else {
                seatPuke.getComponent(cc.Sprite).spriteFrame = self.getPukeSpriteById('pai');
            }
            seatPuke.active = true;
            index += 1;
            self.faPaiAnimation(index);
        })));
    }
};
//----- 搓牌动画
NiuNiuManager.cuoPaiAnimation = function (type, showType) {
    this.gameUICB.setBtnCuoPaiActive(false);
    this.isCuoPaiComplete = false;
    if (this.copyCuoPai) {
        this.gameUICB.getCuoPaiPool().put(this.copyCuoPai);
    }
    var seat = this.getSeatByNumber(1);
    var pukeCuo = seat.getChildByName('puke5');
    pukeCuo.active = false;
    this.copyCuoPai = this.gameUICB.getCuoPaiPool().get();
    this.copyCuoPai.setPosition(0, 0);
    this.gameUICB.getChildNode().getChildByName('cuopai').addChild(this.copyCuoPai);
    var data = {};
    data.from = type;
    data.GameType = 'NIUNIU';
    data.num = this.getNewPaiIdById(this.CuoPaiNumber) + 3;
    data.cb = function () {
        if (type != 'showCard') {
            fun.net.send('NiuShowCards', {});
        }
        this.isCuoPaiComplete = true;
        pukeCuo.active = true;
        pukeCuo.getComponent(cc.Sprite).spriteFrame = this.getPukeSpriteById(this.CuoPaiNumber);
        this.gameUICB.getCuoPaiPool().put(this.copyCuoPai);
    }.bind(this);
    this.copyCuoPai.getComponent('CuoPai').initPuke(data);
};
//----- 初始化抢庄
NiuNiuManager.initQZhuangFunction = function () {
    if (this.data != undefined && this.data.roomRule.makersType === 3) {
        this.IsFreeQiangZhuang = true;
        this.QiangZhuangSeat = new Array();
        this.ZeroZhuangSeat = new Array();
        this.TurnZhuang = false;
    }
};
//----- setEnterSeat 数据结构改变
NiuNiuManager.resetUserInfo = function (info) {
    var newInfo = {};
    newInfo.HeadUrl = info.imageUrl;
    newInfo.Name = info.userName;
    newInfo.UserId = parseInt(info.userId);
    newInfo.Score = info.totalScore;
    newInfo.RoomIdx = info.sort;
    newInfo.Ip = info.ip;
    newInfo.Sex = info.sex;
    newInfo.Zhu = info.yaFeng || 0;
    newInfo.Ready = info.currentState === 0 || info.currentState === 3 ? false : true;
    newInfo.GamePhase = info.GamePhase;
    newInfo.newUser = info.newUser;
    newInfo.Address = info.Address;
    return newInfo;
};
//----- 检测是否为房主
NiuNiuManager.getRoomMasterByRoomInfo = function () {
    var idx = this.data.EnterRoom === 'create' ? 0 : this.data.userMap[this.MineUserId].sort;
    return idx === 0 ? true : false;
};
//----- 庄显示为 false
NiuNiuManager.setZhuangFalse = function () {
    for (var i = 0; i < 6; ++i) {
        var seat = this.getSeatByNumber(i + 1);
        seat.Zhuang.active = false;
    }
};
//----- 检测是否为自己的UserId
NiuNiuManager.checkIsMineUserId = function (id) {
    if (parseInt(id) === this.MineUserId) return true;else return false;
};
//----- 设置游戏状态
NiuNiuManager.setState = function (content) {
    for (var i = 0; i < 6; ++i) {
        var seat = this.getSeatByNumber(i + 1);
        if (seat.active) {
            if (!content) {
                // cc.log('--- setState false ---')
                seat.State.active = false;
                // this.gameUICB.jumpTextAnim(false);
            } else {
                var seatNumber = this.getSeatNumberByRoomIdx(this.CurrentZhuang);
                if (content === '下注中' && seatNumber === i + 1) console.log('庄家不下注');else this.gameUICB.setState({ state: seat.State, content: content, color: 0 });
            }
        }
    }
};

//-----------------------------------------------------------
//----- 初始化 房间 信息
NiuNiuManager.initRoomInfo = function () {
    var roomRule = this.data.roomRule;
    var userMap = this.data.userMap;
    this.gameUICB.setGameStatus(roomRule.gamePhase);
    this.RoomId = roomRule.RoomId;
    this.RoundJuShu = roomRule.currentNum;
    this.TotalJuShu = roomRule.roomNum;
    this.DiFen = PukeDefine.ROOM_INFO.DI_FEN[roomRule.bottomScore - 1];
    this.ZhuangWei = PukeDefine.NIUNIU_ROOM_INFO.MASKERS_TYPE[roomRule.makersType - 1];
    this.Charge = PukeDefine.ROOM_INFO.COST[roomRule.reduceCard - 1];
    this.IsMaster = PukeDefine.ROOM_INFO.ISMASTER[this.getRoomMasterByRoomInfo() ? 0 : 1];
    var msg = {
        RoomId: this.RoomId,
        Round: this.RoundJuShu,
        Total: this.TotalJuShu,
        ZhuangWei: this.ZhuangWei,
        DiFen: this.DiFen[0],
        IsMaster: this.IsMaster,
        GamePhase: roomRule.gamePhase
    };
    this.gameUICB.initRoomInfo(msg);
    this.TypeScore = roomRule.typeScore;
    this.KanDou = roomRule.kanDou || 0;
    this.ShunDou = roomRule.shunDou || 0;
    this.WuHua = roomRule.wuHua || 0;
    this.WuXiao = roomRule.wuXiao || 0;
    this.ZhaDan = roomRule.zhaDan || 0;
};
//----- 初始化 座位 信息
NiuNiuManager.initSeatInfo = function () {
    var roomRule = this.data.roomRule;
    var userMap = this.data.userMap;
    this._userMap = {};
    if (this.data.EnterRoom === 'create') {
        this.updateSeatNumber();
        this.gameUICB.setCreateSeat();
        this.RecentYaZhu = 1;
    } else if (this.data.EnterRoom === 'enter') {
        this.updateSeatNumber(userMap);
        for (var id in userMap) {
            var value = userMap[id];
            var seatNumber = this.getSeatNumberByRoomIdx(value.sort);
            var seat = this.getSeatByNumber(seatNumber);
            if (value.onLine != 1) {
                // onLine-2 不在线 onLine-1 在线
                seat.Mask.active = true;
            }
            var isMine = this.checkIsMineUserId(id);
            value.GamePhase = roomRule.gamePhase;
            this.gameUICB.setEnterSeat(seatNumber, this.resetUserInfo(value));
            if (value.niuThree && value.niuThree !== null && value.niuThree !== undefined) {
                if (value.niuThree.length <= 0) return;
                for (var i = 1; i <= 3; ++i) {
                    var puke = this.getPukeSpriteById(value.niuThree[i - 1]);
                    seat['Puke' + i].getComponent(cc.Sprite).spriteFrame = puke;
                    seat['Puke' + i].active = true;
                }
                for (var _i3 = 4; _i3 <= 5; ++_i3) {
                    var _puke = this.getPukeSpriteById(value.niuTwo[_i3 - 4]);
                    seat['Puke' + _i3].getComponent(cc.Sprite).spriteFrame = _puke;
                    seat['Puke' + _i3].active = true;
                }
                this._checkSpineCacheComplete[seat.SeatNumber] = true;
                this._userMap[seat.SeatNumber] = {};
                this._userMap[seat.SeatNumber].value = value;
                this._userMap[seat.SeatNumber].seat = seat;
                this._spineCacheFunc = function (sn) {
                    this.showTypeFunc(this._userMap[sn].seat, this._userMap[sn].value);
                }.bind(this);
            } else if (value.alreadyChess && value.alreadyChess !== undefined) {
                for (var _i4 = 1; _i4 <= 5; ++_i4) {
                    var pukeid = isMine ? _i4 === 5 ? 'pai' : value.alreadyChess[_i4 - 1] : 'pai';
                    seat['Puke' + _i4].getComponent(cc.Sprite).spriteFrame = this.getPukeSpriteById(pukeid);
                    seat['Puke' + _i4].active = true;
                }
                if (isMine) this.CuoPaiNumber = value.alreadyChess[4];
            }
            if (isMine) this.RecentYaZhu = value.yaFeng === 0 || value.yaFeng === undefined ? 1 : value.yaFeng;
            if (value.zhuang === 1) {
                // 1-庄家 2-闲家
                this.CurrentZhuang = value.sort;
                for (var _i5 = 1; _i5 <= 6; _i5++) {
                    var _seat2 = this.getSeatByNumber(_i5);
                    if (_seat2.RoomIdx === value.sort) {
                        _seat2.Zhuang.active = true;
                        _seat2.ZhuangSp.setAnimation(0, 'Zhong', false);
                    }
                }
            }
        }
    }
};
//----- 开始游戏准备
NiuNiuManager.startGameReady = function () {
    this.gameUICB.setBtnInviteActive(false);
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        seat.Readying.active = false;
        seat.YaBox.active = false;
    }
};

//-----------------------------------------------------------
// 监听函数初始化
NiuNiuManager.initListener = function () {
    this.ListenCBList = [];
    this.pListenCBList = [];
    var listen = function (cmd, cb, isPingTai) {
        if (isPingTai) {
            fun.net.pListen(cmd, cb);
            this.pListenCBList.push(cmd);
        } else {
            fun.net.listen(cmd, cb);
            this.ListenCBList.push(cmd);
        }
    }.bind(this);
    listen('EnterRoom', this.onEnterRoomAck.bind(this), true);
    listen('OffLine', this.onOffLineAck.bind(this), true);
    listen('NiuReady', this.onReadyNextAck.bind(this));
    listen('NiuQZhuang', this.onQZhuangAck.bind(this));
    listen('NiuYaFen', this.onSomeOneYaZhuAck.bind(this));
    listen('NiuStartGame', this.onStartGameAck.bind(this));
    listen('NiuShowCards', this.onShowCardAck.bind(this));
    listen('NiuSingalAccount', this.onSingalAccountAck.bind(this));
    listen('NiuTotalAccount', this.onTotalAccountAck.bind(this));
    listen('NiuLeaveRoom', this.onLeaveRoomAck.bind(this));
    listen('NiuDisbandRoom', this.onDisbandRoomAck.bind(this));
    listen('NiuDisbandRoomVote', this.onDisbandRoomVoteAck.bind(this));
    listen('NiuDisbandRoomResult', this.onDisbandRoomResultAck.bind(this));
};
NiuNiuManager.cleanListener = function () {
    for (var i in this.ListenCBList) {
        fun.net.rmListen(this.ListenCBList[i]);
    }
    for (var _i6 in this.pListenCBList) {
        fun.net.rmPListen(this.pListenCBList[_i6]);
    }
    this.ListenCBList = [];
    this.pListenCBList = [];
};

//--- 加入房间返回通知
NiuNiuManager.onEnterRoomAck = function (msg) {
    if (this.checkIsMineUserId(msg.userOneMap.userId)) return;
    if (this.SeatArray === undefined) return;
    var roomIdx = msg.userOneMap.sort;
    var cha = Math.abs(this.SeatArray[0] - roomIdx);
    if (this.SeatArray[0] > roomIdx) {
        this.SeatArray[6 - cha] = roomIdx;
    } else {
        this.SeatArray[cha] = roomIdx;
    }
    var seatNumber = this.getSeatNumberByRoomIdx(roomIdx);
    this.gameUICB.setEnterSeat(seatNumber, this.resetUserInfo(msg.userOneMap));
    this.onOnLineAck({ userId: msg.userOneMap.userId });
};

//-----------------------------------------------------------
//--- 准备通知
NiuNiuManager.onReadyNextAck = function (msg) {
    if (msg.hint !== undefined && msg.hint === 1) {
        this.gameUICB.setBtnReadyActive(true);
    } else {
        var seat = this.getSeatByUserId(msg.ready);
        seat.Readying.active = true;
        seat.Ying.active = false;
        seat.Shu.active = false;
    }
};
//--- 抢庄通知
NiuNiuManager.onQZhuangAck = function (msg) {
    if (msg.hint !== undefined && msg.hint === 1) {
        if (this.data.roomRule.makersType === 3) {
            // 通知抢庄
            Audio.playEffect('pork', 'remind.mp3');
            this.setState('抢庄中');
            this.gameUICB.setBtnInviteActive(false);
            this.gameUICB.setBtnQZhuangActive(true);
            this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_QIANG_ZHUANG);
            for (var i = 1; i <= 6; i++) {
                var seat = this.getSeatByNumber(i);
                seat.Readying.active = false;
                if (seat.active) {
                    this.ZeroZhuangSeat[this.ZeroZhuangSeat.length] = i;
                }
            }
            this.DingZhuangTime = 0;
            this.StartChooseZhuang = true;
        }
    }
    this.cleanSeatData();
    if (msg.RobMakersPeopl !== undefined) {
        //抢庄消息
        var _seat3 = this.getSeatByUserId(msg.RobMakersPeopl);
        this.QiangZhuangSeat[this.QiangZhuangSeat.length] = _seat3.SeatNumber;
        if (this.checkIsMineUserId(msg.RobMakersPeopl)) {
            this.gameUICB.setBtnQZhuangActive(false);
        }
    }
    if (msg.robMakers !== undefined) {
        var _seat4 = this.getSeatByUserId(msg.RobMakersPeopl);
        if (msg.robMakers === 1) {
            this.gameUICB.setState({ state: _seat4.State, content: '已抢庄', color: 0 });
        } else if (msg.Op === 2) {
            this.gameUICB.setState({ state: _seat4.State, content: '不抢庄', color: 1 });
        }
    }
    if (msg.Zhuangjia !== undefined) {
        //下发庄家
        this.gameUICB.setBtnReadyActive(false);
        this.onZhuangAck(msg);
    }
};
//--- 游戏结算后 房间局数增加
NiuNiuManager.roomJuShuAdd = function () {
    this.RoundJuShu += 1;
    if (this.RoundJuShu <= this.TotalJuShu) {
        this.gameUICB.setJuShuText(this.RoundJuShu + '/' + this.TotalJuShu);
    }
};
//--- 下发庄家通知
NiuNiuManager.onZhuangAck = function (msg) {
    this.gameUICB.setGameStatus(2);
    var self = this;
    this.CurrentZhuang = this.getSeatByUserId(msg.Zhuangjia).RoomIdx;
    this.setState(false);
    var zhuangFunc = function zhuangFunc() {
        self.setState('下注中');
        self.gameUICB.setBtnXuYaActive(parseInt(msg.Zhuangjia) === self.MineUserId ? false : true);
        self.startGameReady();
        if (!self._isMineNewUser) {
            self.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
        }
        self.gameUICB.setBtnInviteActive(false);
        self.gameUICB.setBtnQZhuangActive(false);
        self.setZhuangFalse();
        var zhuangSeat = self.getSeatByUserId(msg.Zhuangjia);
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
//--- 押注通知
NiuNiuManager.onSomeOneYaZhuAck = function (msg) {
    if (msg.hint !== undefined && msg.hint === 1) {
        if (this.data.roomRule.makersType !== 3) {
            Audio.playEffect('pork', 'remind.mp3');
        }
        this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
        this.gameUICB.setBtnXiaZhuActive(true);
        this.startGameReady();
        this.gameUICB.showXiaZhu(msg.canBetScore);
        this.cleanSeatData(); //清理单局结算
        if (this.gameUICB.getIsXuYa() && this.RecentYaZhu) {
            this.gameUICB.scheduleOnceFunc(function () {
                if (this.RecentYaZhu === 1) {
                    this.gameUICB.onBtnXiaZhuClicked('', 1);
                } else if (this.RecentYaZhu === 2) {
                    this.gameUICB.onBtnXiaZhuClicked('', 2);
                } else if (this.RecentYaZhu === 3) {
                    this.gameUICB.onBtnXiaZhuClicked('', 3);
                }
            }.bind(this), PukeDefine.ZI_DONG_XU_YA_TIME);
        }
        if (msg.xianScore !== undefined && msg.xianScore > 0) {
            this.XianTuiZhuScore = msg.xianScore;
            this.gameUICB.setBtnTuiZhuActive(true);
        }
    } else {
        if (this.checkIsMineUserId(msg.userId)) {
            this.gameUICB.setBtnXiaZhuActive(false);
            this.gameUICB.setBtnTuiZhuActive(false);
        }
        var seat = this.getSeatByUserId(msg.userId);
        seat.YaBox.active = true;
        seat.YaZhu.string = msg.betScore;
        this.gameUICB.setState({ state: seat.State, content: '已下注', color: 0 });
        this.pushGold(seat.SeatNumber, msg.betScore);
    }
};
//--- 开始游戏通知
NiuNiuManager.onStartGameAck = function (msg) {
    var self = this;
    this._isShowCard = false;
    this._showType = { niuThree: msg.niuThree, niuTwo: msg.niuTwo, niuType: msg.niuType };
    this.roomJuShuAdd();
    this.gameUICB.setGameStatus(6);
    if (!self._isMineNewUser) {
        this.gameUICB.showHint(false);
    }
    this.setState(false);
    this.isCuoPaiComplete = false;
    this.gameUICB.scheduleOnceFunc(function () {
        var sortCardsMap = new Array();
        var seatNumber = void 0;
        if (self.data.roomRule.makersType === 4) {
            seatNumber = 1;
        } else {
            seatNumber = self.getSeatNumberByRoomIdx(self.CurrentZhuang);
        }
        for (var i in msg.currentPlayer) {
            var id = msg.currentPlayer[i];
            for (var _i7 = 1; _i7 <= 6; ++_i7) {
                var seat = self.getSeatByNumber(_i7);
                if (parseInt(id) === seat.UserId) {
                    var cha = seatNumber - seat.SeatNumber;
                    var _idx = cha >= 0 ? cha : 6 - Math.abs(cha);
                    sortCardsMap[_idx] = {};
                    sortCardsMap[_idx].UserId = id;
                    sortCardsMap[_idx].Cards = parseInt(id) === self.MineUserId ? msg.alreadyChess : {};
                }
            }
        }
        var pukes = [],
            idx = -1,
            seats = [];
        for (var k in sortCardsMap) {
            var value = sortCardsMap[k];
            for (var _i8 = 1; _i8 <= 6; ++_i8) {
                var _seat5 = self.getSeatByNumber(_i8);
                _seat5.Readying.active = false;
                if (_seat5.UserId === parseInt(value.UserId)) {
                    seats.push(_seat5);
                    var pos = _seat5.getPosition();
                    if (_i8 === 1) {
                        seats.myCards = value.Cards;
                        self.CuoPaiNumber = value.Cards[4];
                    }
                    for (var j = 1; j <= 5; ++j) {
                        idx++;
                        var fuhao = j === 1 || j === 2 ? -j : j === 4 || j === 5 ? j - 3 : 0;
                        pukes[idx] = {};
                        pukes[idx].x = _i8 === 1 ? fuhao * 30 : pos.x + fuhao * 30;
                        pukes[idx].y = _i8 === 1 ? pos.y * 0.8 : pos.y - _seat5.getContentSize().width / 1.58;
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
NiuNiuManager.onShowCardAck = function (msg) {
    if (msg.hint !== undefined && msg.hint === 1) {
        if (this._isShowCard) {
            this.gameUICB.setBtnCuoPaiActive(true);
        }
        return;
    }
    this.gameUICB.setGameStatus(3);
    var showType = msg.showType;
    if (showType.niuTwo === undefined || showType.niuTwo[0] === undefined) return;
    var seat = this.getSeatByUserId(msg.userId);
    this.gameUICB.setState({ state: seat.State, content: '已亮牌', color: 0 });
    if (parseInt(msg.userId) === seat.UserId) {
        var isMine = this.checkIsMineUserId(msg.userId);
        if (isMine && !this.isCuoPaiComplete) {
            this.cuoPaiAnimation('showCard', showType);
            this.showTypeFunc(seat, showType);
        } else {
            var pos = isMine ? 'MINE_ACCOUNT' : 'OTHER_ACCOUNT';
            for (var i = 1; i <= 3; ++i) {
                var puke = this.getPukeSpriteById(showType.niuThree[i - 1]);
                seat['Puke' + i].getComponent(cc.Sprite).spriteFrame = puke;
                seat['Puke' + i].setPositionX(PukeDefine.POSITION.PUKE.NIU_NIU[i][pos].x);
            }
            for (var _i9 = 4; _i9 <= 5; ++_i9) {
                var _puke2 = this.getPukeSpriteById(showType.niuTwo[_i9 - 4]);
                seat['Puke' + _i9].getComponent(cc.Sprite).spriteFrame = _puke2;
                seat['Puke' + _i9].setPositionX(PukeDefine.POSITION.PUKE.NIU_NIU[_i9][pos].x);
            }
            this.showTypeFunc(seat, showType);
        }
    }
};
//--- 显示点数
NiuNiuManager.showTypeFunc = function (seat, value) {
    var anim = 'WuniuX1';
    var niuType = value.niuType;
    if (niuType === 0) {
        anim = 'WuniuX1';
    } else if (niuType >= 6 && niuType <= 10) {
        anim = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE_EN[this.TypeScore - 1][niuType - 6];
    } else if (niuType === 11) {
        anim = 'KandouX5';
    } else if (niuType === 12) {
        anim = 'SihuaX5';
    } else if (niuType === 13) {
        anim = this.WuHua === 1 ? 'WuhuaX6' : 'WuhuaX5';
    } else if (niuType === 14) {
        anim = this.ZhaDan === 1 ? 'ZhadanX8' : 'ZhadanX6';
    } else if (niuType === 15) {
        anim = this.WuXiao === 1 ? 'WuxiaoniuX10' : 'WuxiaoniuX6';
    } else {
        anim = 'Niu' + niuType + 'X1';
    }
    cc.log('--- anim : ' + anim + ', ' + niuType);
    seat.ShuZi.active = true;
    seat.ShuZiSp.setAnimation(0, anim, false);
    if (this.checkIsMineUserId(seat.UserId)) {
        var type = PukeDefine.NIUNIU_ROOM_INFO.PAI_JU_SCORE['NIU_NIU'][value.niuType];
        var sex = this.UserInfo.Sex === 1 ? 'male' : 'female';
        Audio.playEffect('pork', type + '.mp3', sex);
    }
};
//--- 单局通知
NiuNiuManager.onSingalAccountAck = function (msg) {
    if (msg.isClean !== undefined && msg.isClean === 1) return;
    this.gameUICB.setGameStatus(4);
    this.callInGold(msg);
    this.setState(false);
};
NiuNiuManager.onAccountFunc = function (msg) {
    for (var id in msg.gameOver) {
        cc.log(id);
        var value = msg.gameOver[id];
        if (value.newUser === undefined) {
            var seat = this.getSeatByUserId(id);
            if (value.score > 0) {
                seat.Ying.active = true;
                seat.Shu.active = false;
                seat.YingLabel.string = '+' + value.score;
            } else {
                seat.Ying.active = false;
                seat.Shu.active = true;
                seat.ShuLabel.string = value.score;
            }
            seat.Fen.string = value.totalScore;
            if (!seat.ShuZi.active) {
                this.showTypeFunc(seat, value);
            }
        }
    }
    if (this.RoundJuShu < this.TotalJuShu) {
        this.gameUICB.scheduleOnceFunc(function () {
            this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
            this._isMineNewUser = false;
            this.gameUICB.setBtnReadyActive(true);
            this.gameUICB.setGameStatus(1);
        }.bind(this), PukeDefine.ACCOUNT_CURRENT_JUSHU);
    }
};
//--- 总结算通知
NiuNiuManager.onTotalAccountAck = function (msg) {
    msg.RoomId = this.RoomId;
    msg.JuShu = this.TotalJuShu;
    msg.DiFen = this.DiFen[0];
    msg.ZhuangWei = this.ZhuangWei;
    msg.highestScore = 0;
    var count = -1;
    var newData = new Array();
    for (var id in msg.gameOver) {
        var value = msg.gameOver[id];
        var seat = this.getSeatByUserId(id);
        msg.highestScore = Math.max(value.totalScore, msg.highestScore);
        count++;
        newData[count] = {};
        newData[count].id = id;
        newData[count].score = value.totalScore;
        // newData[count].name  = seat.Name.string;
        newData[count].name = seat._Name;
        newData[count].head = seat.HeadUrl;
        newData[count].left = 99;
        newData[count].lost = value.Deduc;
    }
    newData.sort(function (a, b) {
        return a.score < b.score;
    });
    msg.sortAccounts = newData;

    this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_TOTAL_ACCOUNT);
    var time = PukeDefine.TOTAL_ACCOUNT_SHOW_TIME;
    if (this.copyDisbandPrefab) {
        this.copyDisbandPrefab.destroy();
        time = 0.1;
    }
    this.copyTotalAccount = this.gameUICB.onTotalAccountAck();
    this.copyTotalAccount.setPosition(0, 0);
    this.gameUICB.setCountDownTime(true, time);
    this.gameUICB.scheduleOnceFunc(function () {
        this.gameUICB.setCountDownTime(false);
        this.gameUICB.showHint(false);
        this.gameUICB.getChildNode().getChildByName('totalaccount').addChild(this.copyTotalAccount);
        this.copyTotalAccount.getComponent('PukeAccount').initTotalAccount(msg);
    }.bind(this), time);
};

// 离开(解散)房间
NiuNiuManager.onLeaveRoomAck = function (msg) {
    if (this.checkIsMineUserId(msg.userId)) {
        cc.director.loadScene('hall');
    } else {
        var seat = this.getSeatByUserId(msg.userId);
        var pukeNumber = PukeDefine.GAME_TYPE[this.data.GameType].PUKE_NUMBER;
        this.gameUICB.resetSeat(seat.SeatNumber, pukeNumber);
    }
};
NiuNiuManager.onDisbandRoomAck = function (msg) {
    if (msg.breakStatu === 1) {
        cc.director.loadScene('hall');
    }
};
NiuNiuManager.onDisbandRoomVoteAck = function (msg) {
    this.gameUICB.setGameStatus(6);
    this.gameUICB.setMenuBgActive(false);
    for (var id in msg.applyBreakStatu) {
        if (msg.applyBreakStatu[id] === 2) {
            this.gameUICB.scheduleOnceFunc(function () {
                if (this.copyDisbandPrefab) {
                    this.copyDisbandPrefab.active = false;
                }
            }.bind(this), PukeDefine.DISBAND_ROOM_DELAY_TIME);
        }
    }
    this.inDisbandRoomFunc(msg);
};
NiuNiuManager.onDisbandRoomResultAck = function (msg) {
    if (msg.breakStatu !== undefined && msg.breakStatu !== 1) {
        fun.event.dispatch('MinSingleButtonPop', { contentStr: '解散房间失败' });
    }
};
NiuNiuManager.inDisbandRoomFunc = function (msg) {
    if (!this.copyDisbandPrefab) {
        this.copyDisbandPrefab = this.gameUICB.getDisband();
    }
    this.copyDisbandPrefab.active = true;
    msg.GameType = 'niuniu';
    for (var i = 1; i <= 6; i++) {
        var seat = this.getSeatByNumber(i);
        for (var id in msg.applyStatu) {
            if (id == seat.UserId) {
                var state = msg.applyStatu[id];
                msg.applyStatu[id] = {};
                msg.applyStatu[id].state = state;
                msg.applyStatu[id].name = seat.Name.string;
                msg.applyStatu[id].headUrl = seat.HeadUrl;
            }
        }
    }
    this.copyDisbandPrefab.getComponent('PukeDisband').disbandRoomInit(msg);
};
// 上线 离线
NiuNiuManager.onOnLineAck = function (msg) {
    if (!msg || msg.userId === undefined) return;
    var seat = this.getSeatByUserId(msg.userId);
    seat.Mask.active = false;
};
NiuNiuManager.onOffLineAck = function (msg) {
    if (!msg || msg.userId === undefined) return;
    var seat = this.getSeatByUserId(msg.userId);
    seat.Mask.active = true;
};

//-----------------------------------------------------------
//--- 押注大小
NiuNiuManager.YaZhuFunction = function (yanum) {
    if (this.data.roomRule.bottomScore == 4) {
        yanum = 1;
    }
    this.RecentYaZhu = parseInt(yanum);
    var yaFen = {
        betScore: this.DiFen[yanum - 1], //压分
        xianScore: 0 //闲家推注分数
    };
    fun.net.send('NiuYaFen', yaFen);
};
//--- 推注
NiuNiuManager.TuiZhuFunction = function () {
    var seat = this.getSeatByUserId(this.MineUserId);
    var yaFen = {
        betScore: 0, //压分
        xianScore: this.XianTuiZhuScore //闲家推注分数
    };
    fun.net.send('NiuYaFen', yaFen, function (rsp) {
        if (rsp.returnStatu !== undefined && rsp.returnStatu === 1) {
            this.gameUICB.setBtnXiaZhuActive(false);
            this.gameUICB.setBtnTuiZhuActive(false);
        }
    }.bind(this));
};
//--- 离开(解散)房间
NiuNiuManager.LeaveRoomFunction = function () {
    var state = this.gameUICB.getGameStatus();
    var jushu = this.gameUICB.getJuShuText();
    if ((state === 1 || state == 0) && jushu.substring(0, 1) === '0' || this._isMineNewUser) {
        if (this.MineIsMaster) {
            fun.net.send('NiuDisbandRoom', {}, function (rsp) {
                cc.log(rsp);
                if (rsp.returnStatu !== undefined && rsp.returnStatu === 1) {
                    cc.director.loadScene('hall');
                }
            }.bind(this));
        } else {
            fun.net.send('NiuLeaveRoom', {}, function (rsp) {
                if (rsp.returnStatu !== undefined && rsp.returnStatu === 1) {
                    cc.director.loadScene('hall');
                }
            }.bind(this));
        }
    } else {
        fun.net.send('NiuDisbandRoomVote', { applyStatu: 0 });
    }
};
//--- 准备
NiuNiuManager.ReadyFunction = function () {
    fun.net.send('NiuReady', {}, function (rsp) {
        this._isMineNewUser = false;
        this.gameUICB.setBtnReadyActive(false);
        this.MineSeat.Readying.active = true;
    }.bind(this));
};
//--- 抢庄
NiuNiuManager.QZhuangFunction = function (type) {
    var qz = type === 0 ? 1 : 2;
    fun.net.send('NiuQZhuang', { robMakers: qz });
    this.gameUICB.setBtnQZhuangActive(false);
};
//--- 微信分享
NiuNiuManager.wxShare = function () {
    var jushu = this.TotalJuShu + '局';
    var difen = '底分' + this.DiFen[0];
    var info = {};
    info.title = '牛牛-房间号：' + this.data.roomRule.RoomId;
    info.content = jushu + ', ' + this.Charge + ', ' + this.ZhuangWei + ', ' + difen;
    require('JSPhoneWeChat').WxShareFriend(info);
};

module.exports = NiuNiuManager;

cc._RF.pop();