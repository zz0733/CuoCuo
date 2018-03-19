(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/script/PukeUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a95f8il81pO7JI8G4Gc87bv', 'PukeUI', __filename);
// poker/script/PukeUI.js

'use strict';

var PukeUtils = require('PukeUtils');
var PukeDefine = require('PukeDefine');
var PukeData = require('PukeData');
var Audio = require('Audio');
var PukeCfg = void 0,
    PukeManager = void 0;

cc.Class({
    extends: cc.Component,

    properties: {
        ChildNode: cc.Node,
        Background: cc.Node,
        RoomInfoNode: cc.Node,
        PukeAltas: cc.SpriteAtlas,
        MenuBg: cc.Node,
        Players: cc.Node,
        Golds: cc.Node,
        BtnReady: cc.Node,
        BtnQiangZhuang: cc.Node,
        BtnNotQiangZhuang: cc.Node,
        BtnCuoPai: cc.Node,
        BtnLiangPai: cc.Node,
        BtnInvite: cc.Node,
        BtnLeave: cc.Node,
        HintBack: cc.Node,
        XiaZhuBtns: cc.Node,
        BtnXuYa: cc.Node,
        BtnTuiZhu: cc.Node,
        BtnHead: cc.Prefab,
        Puke: cc.Prefab,
        Gold: cc.Prefab,
        Skin: cc.Prefab,
        PukeAccount: cc.Prefab,
        CuoPai: cc.Prefab,
        SetPrefab: cc.Prefab,
        DisbandPrefab: cc.Prefab,
        phoneStatus: cc.Node
    },

    onLoad: function onLoad() {
        fun.event.dispatch('Zhuanquan', { flag: false });
        cc.log(gameConst);
        if (fun.gameCfg.releaseType === gameConst.releaseType.apple) {
            this.BtnInvite.active = false;
            this.BtnLeave.setPositionX(0);
        }
        this.RoomInfoNode.getChildByName('nnRoomInfo').active = false;
        this.RoomInfoNode.getChildByName('sgRoomInfo').active = false;
        this.RoomInfo = fun.db.getData('RoomInfo');
        this.GameType = this.RoomInfo.GameType;
        var PukeCfg = this.GameType === 2 ? require('SanGongCfg') : require('NiuNiuCfg');
        fun.net.setGameMsgCfg(PukeCfg);
        this.initSeat();
        this.XiaZhu = new Array();
        for (var _i = 0; _i < 3; _i++) {
            this.XiaZhu[_i] = this.XiaZhuBtns.getChildByName('btnXiaZhu' + (_i + 1));
        }
        PukeManager = this.GameType === 2 ? require('SanGongManager') : require('NiuNiuManager');
        PukeManager.initGame(this);
    },

    start: function start() {
        var sg = this.Background.getChildByName('sangong');
        var nn = this.Background.getChildByName('niuniu');
        if (this.GameType === 2) {
            sg.active = true;
            nn.active = false;
        } else if (this.GameType === 4) {
            sg.active = false;
            nn.active = true;
        }
        this.Background.on('touchend', function () {
            if (this.MenuBg.active) {
                this.MenuBg.active = false;
            }
            if (this._roomInfoUp !== undefined && this._roomInfoUp) {
                this.onBtnRoomInfoClicked();
            }
        }, this);
        this.initPool();
        this.initNnRoomInfoDetail();
        this.initSgRoomInfoDetail();
        this.initState();
        fun.event.add('PukeUI_Chat', 'PukeChatUI', this.onPukeChatUI.bind(this));
        Audio.playMusic('pork', 'BGM150S.mp3');
    },

    update: function update(dt) {
        if (this.GameType === 2 && this.RoomInfo.DZhuang === 3 || this.GameType === 4) {
            PukeManager.update(dt);
        }
        if (this._isCountdownTime && this._CountdownTime > 0) {
            this._countDtTime += dt;
            if (this._countDtTime >= 1) {
                this._countDtTime -= 1;
                this._CountdownTime -= 1;
                this.HintBack.getChildByName('time').getComponent(cc.Label).string = this._CountdownTime;
                if (this._CountdownTime <= 0) {
                    this._isCountdownTime = false;
                }
            }
        }
        for (var _i2 = 0; _i2 < 6; _i2++) {
            if (this._isJumpText[_i2]) {
                this._jumpDtTime[_i2] += dt;
                if (this._jumpDtTime[_i2] >= this._jumpTextTime) {
                    this._jumpDtTime[_i2] -= this._jumpTextTime;
                    this._jumpTextNumber[_i2] = this._jumpTextNumber[_i2] === this._jumpTextLength[_i2] - 1 ? -2 : this._jumpTextNumber[_i2] + 1;
                    var jumpBy = cc.jumpBy(this._jumpTextTime, cc.p(0, 0), 20, 1);
                    if (this._jumpTextNumber[_i2] >= 0) {
                        if (this._jumpTextArray[_i2][this._jumpTextNumber[_i2]] !== undefined) {
                            this._jumpTextArray[_i2][this._jumpTextNumber[_i2]].stopAction(jumpBy);
                            this._jumpTextArray[_i2][this._jumpTextNumber[_i2]].runAction(jumpBy);
                        }
                    }
                }
            }
        }
    },

    onDestroy: function onDestroy() {
        fun.event.remove('PukeUI_Chat');
        PukeManager.onDestroy();
        Audio.stopMusic();
        this._jumpTextArray[i] = [];
    },

    //----- 根据 牌ID 取牌
    getPukeSpriteById: function getPukeSpriteById(paiId) {
        if (paiId === 'pai') {
            return this.PukeAltas.getSpriteFrame('Paiback');
        } else {
            return this.PukeAltas.getSpriteFrame(paiId);
        }
    },
    //----- 根据座位号获取 Seat
    getSeatByNumber: function getSeatByNumber(num) {
        return this.Players.getChildByName('player' + num);
    },
    //----- 初始化对象池
    initPool: function initPool() {
        this.GoldPool = new cc.NodePool(); //金币对象池
        for (var _i3 = 0; _i3 < PukeDefine.GOLD_POOL_NUMBER; ++_i3) {
            var gold = cc.instantiate(this.Gold);
            this.GoldPool.put(gold);
        }

        this.PukePool = new cc.NodePool(); //扑克对象池
        var pukePoolNumber = PukeDefine.GAME_TYPE[this.GameType].PUKE_NUMBER * 6;
        for (var _i4 = 0; _i4 < pukePoolNumber; ++_i4) {
            var puke = cc.instantiate(this.Puke);
            this.PukePool.put(puke);
        }

        this.CuoPaiPool = new cc.NodePool(); //搓牌对象池 只有一个
        var cuoPai = cc.instantiate(this.CuoPai);
        this.CuoPaiPool.put(cuoPai);
    },
    scheduleOnceFunc: function scheduleOnceFunc(func, time) {
        this.scheduleOnce(function () {
            func();
        }, time);
    },
    initState: function initState() {
        this._jumpTextArray = new Array();
        this._isJumpText = new Array();
        this._jumpDtTime = new Array();
        this._jumpTextNumber = new Array();
        this._jumpTextLength = new Array();
        this._jumpBy = new Array();
        this._jumpTextTime = PukeDefine.TEXT_JUMP_TIME;
        for (var _i5 = 0; _i5 < 6; ++_i5) {
            this._jumpTextArray[_i5] = new Array();
            this._jumpBy[_i5] = new Array();
        }
    },
    setState: function setState(msg) {
        msg.state.active = true;
        var txt = msg.state.getChildByName('label');
        txt.getComponent(cc.Label).string = msg.content;
        var rgb0 = { r: 148, g: 151, b: 221, a: 255 }; //do
        var rgb1 = { r: 190, g: 108, b: 53, a: 255 }; //not
        var color = msg.color === 0 ? rgb0 : rgb1;
        txt.color = new cc.Color(color);
        this.jumpTextAnim(txt, msg.content, color);
    },

    //----- 初始化座位
    initSeat: function initSeat() {
        var _this = this;

        var self = this;
        var pukeNumber = PukeDefine.GAME_TYPE[this.GameType].PUKE_NUMBER;
        var pukePosition = PukeDefine.GAME_TYPE[this.GameType].PUKE_POSITION;
        this._spineCacheComplete = new Array();

        var _loop = function _loop(_i6) {
            var seat = _this.getSeatByNumber(_i6);
            var HeadBox = seat.getChildByName('headBox');
            seat.HeadImg = HeadBox.getChildByName('headImg');
            seat.Mask = HeadBox.getChildByName('mask');
            seat.Name = seat.getChildByName('name').getComponent(cc.Label);
            seat.Fen = seat.getChildByName('fen').getChildByName('label').getComponent(cc.Label);
            seat.State = seat.getChildByName('state');
            seat.YaBox = seat.getChildByName('yaBox');
            seat.YaZhu = seat.YaBox.getChildByName('yaZhu').getComponent(cc.Label);
            seat.Ying = seat.getChildByName('ying');
            seat.YingLabel = seat.Ying.getChildByName('label').getComponent(cc.Label);
            seat.Shu = seat.getChildByName('shu');
            seat.ShuLabel = seat.Shu.getChildByName('label').getComponent(cc.Label);
            seat.ShuZi = seat.getChildByName('shuzi');
            seat.ShuZiSp = seat.ShuZi.getComponent(sp.Skeleton);
            if (_this.GameType === 4) {
                //牛牛
                var url = void 0;
                if (_i6 === 1) {
                    seat.ShuZi.setPosition(cc.p(490, -52));
                    seat.ShuZi.scale = 0.9;
                    url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Niuniu_Dazi;
                } else {
                    seat.ShuZi.setPosition(cc.p(10, -190));
                    seat.ShuZi.scale = 1;
                    url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Niuniu_Xiaozi;
                }
                PukeUtils.LoadRes(url, 'sp.SkeletonData', function (res) {
                    seat.ShuZiSp.skeletonData = res;
                    self._spineCacheComplete[self._spineCacheComplete.length] = _i6;
                });
            } else if (_this.GameType === 2) {
                //三公
                var _url = void 0;
                if (_i6 === 1) {
                    seat.ShuZi.setPosition(cc.p(475, -26));
                    seat.ShuZi.scale = 0.9;
                    _url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Sangong_Dazi;
                } else {
                    seat.ShuZi.setPosition(cc.p(20, -182));
                    seat.ShuZi.scale = 0.9;
                    _url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Sangong_Xiaozi;
                }
                PukeUtils.LoadRes(_url, 'sp.SkeletonData', function (res) {
                    seat.ShuZiSp.skeletonData = res;
                });
            }
            seat.Readying = seat.getChildByName('readying');
            seat.ChatImg = seat.getChildByName('chatImg');
            seat.Speaker = seat.getChildByName('speaker');
            var who = _i6 === 1 ? 'MINE_ACCOUNT' : 'OTHER_ACCOUNT';
            for (var num = 1; num <= 5; ++num) {
                seat['Puke' + num] = seat.getChildByName('puke' + num);
                if (num <= pukeNumber) {
                    var posx = PukeDefine.POSITION.PUKE[pukePosition][num][who].x;
                    seat['Puke' + num].setPositionX(posx);
                }
            }
            seat.Zhuang = seat.getChildByName('zhuang');
            seat.ZhuangSp = seat.Zhuang.getComponent(sp.Skeleton);
            if (_i6 === 1) {
                seat.Zhuang.scale = 1.3;
                var DZhuangSp = seat.Zhuang.getChildByName('dingZhuang');
                DZhuangSp.setPositionX(DZhuangSp.getPositionX() - 20);
            }
            _this.resetSeat(_i6);
        };

        for (var _i6 = 1; _i6 <= 6; _i6++) {
            _loop(_i6);
        }
    },
    //----- 重置位置
    resetSeat: function resetSeat(seatNumber) {
        var seat = this.getSeatByNumber(seatNumber);
        seat.active = false;
        seat.State.active = false;
        seat.Mask.active = false;
        seat.YaBox.active = false;
        seat.Shu.active = false;
        seat.Ying.active = false;
        seat.ShuZi.active = false;
        seat.Readying.active = false;
        seat.ChatImg.active = false;
        seat.Speaker.active = false;
        for (var num = 1; num <= 5; ++num) {
            seat['Puke' + num].active = false;
        }
        seat.Zhuang.active = false;
        seat.RoomIdx = -1;
        seat.Ip = '';
        seat.UserId = -1;
        seat.Sex = -1;
        seat.SeatNumber = seatNumber;
        var uN = this.ChildNode.getChildByName('userinfo');
        for (var _i7 = 0; _i7 < uN.children.length; ++_i7) {
            if (uN.children[_i7].getTag() === seatNumber) {
                uN.children[_i7].removeFromParent();
            }
        }
    },

    //----- 初始化房间信息
    initRoomInfo: function initRoomInfo(msg) {
        this.Background.getChildByName('version').getComponent(cc.Label).string = gameConst.version;
        this.RoomInfoNode.getChildByName('roomid').getComponent(cc.Label).string = msg.RoomId;
        this.setJuShuText(msg.Round + '/' + msg.Total);
        this.RoomInfoNode.getChildByName('zhuangwei').getComponent(cc.Label).string = msg.ZhuangWei;
        this.RoomInfoNode.getChildByName('difen').getComponent(cc.Label).string = msg.DiFen;
        this.BtnLeave.getChildByName('label').getComponent(cc.Label).string = msg.IsMaster;
        this.BtnReady.active = false;
        this.MenuBg.active = false;
        this.showHint(false);
        this.setBtnXiaZhuActive(false);
        this.setBtnQZhuangActive(false);
        this.setBtnCuoPaiActive(false);
        this.setBtnInviteActive(false);
    },
    initSgRoomInfoDetail: function initSgRoomInfoDetail() {
        if (this.GameType !== 2) return;
        var roomInfo = this.RoomInfo;
        var sginfo = this.RoomInfoNode.getChildByName('sgRoomInfo');
        var sx = PukeDefine.ROOM_INFO.SHI_XIAN[roomInfo.TimeLimit];
        sginfo.getChildByName('shixian').getComponent(cc.Label).string = sx;
        var func = function func(data) {
            return data ? data + '\n' : '';
        };
        var zsz = false,
            jzjr = false;
        for (var _i8 = 0; _i8 < roomInfo.Special.length; ++_i8) {
            if (roomInfo.Special[_i8] === 1) zsz = '涨缩注';
            if (roomInfo.Special[_i8] === 2) jzjr = '游戏开始后禁止加入';
        }
        var teshu = func(zsz) + func(jzjr);
        var teshuN = sginfo.getChildByName('teshu');
        teshuN.getComponent(cc.Label).string = teshu;
    },
    initNnRoomInfoDetail: function initNnRoomInfoDetail() {
        if (this.GameType !== 4) return;
        var roomInfo = this.RoomInfo.roomRule;
        var nninfo = this.RoomInfoNode.getChildByName('nnRoomInfo');
        var sx = ''; //PukeDefine.ROOM_INFO.SHI_XIAN[roomInfo.timeLimit];
        nninfo.getChildByName('shixian').getComponent(cc.Label).string = sx;
        var kd = roomInfo.kanDou === 1 ? '坎斗(x5)' : false;
        var whn = roomInfo.wuHua === 1 ? '五花牛(x6)' : false;
        var zdn = roomInfo.zhaDan === 1 ? '炸弹牛(x8)' : false;
        var wxn = roomInfo.wuXiao === 1 ? '五小牛(x10)' : false;
        var func = function func(data) {
            return data ? data + '\n' : '';
        };
        var wanfa = func(kd) + func(whn) + func(zdn) + func(wxn);
        var wanfaN = nninfo.getChildByName('wanfa');
        wanfaN.getComponent(cc.Label).string = wanfa;
        var bs = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[roomInfo.typeScore - 1];
        var beishuN = nninfo.getChildByName('beishu');
        beishuN.setPositionY(wanfaN.getPositionY() - wanfaN.getContentSize().height + 20);
        beishuN.getComponent(cc.Label).string = bs;
        var xjtz = roomInfo.xianJia === 1 ? '闲家推注' : false;
        var jzjr = roomInfo.joinLimit === 1 ? '游戏开始后禁止加入' : '游戏开始后可以加入';
        var zsz = roomInfo.zhangSuo === 1 ? '涨缩注' : false;
        var sd = roomInfo.shunDou === 1 ? '顺斗' : false;
        var teshu = func(xjtz) + func(jzjr) + func(zsz) + func(sd);
        var teshuN = nninfo.getChildByName('teshu');
        teshuN.setPositionY(beishuN.getPositionY() - beishuN.getContentSize().height - 5);
        teshuN.getComponent(cc.Label).string = teshu;
    },
    //----- 创建房间房主座位
    setCreateSeat: function setCreateSeat() {
        var seat = this.getSeatByNumber(1);
        seat.active = true;
        var UserInfo = fun.db.getData('UserInfo');
        cc.log(UserInfo);
        fun.utils.loadUrlRes(UserInfo.UserHeadUrl, seat.HeadImg);
        seat.Name.string = UserInfo.UserName;
        seat._Name = UserInfo.UserName; //test
        seat.UserId = UserInfo.UserId;
        seat.Fen.string = 0;
        seat.RoomIdx = 0;
        seat.Ip = UserInfo.Ip;
        seat.Location = UserInfo.location;
        seat.Sex = UserInfo.UserSex;
        seat.HeadUrl = UserInfo.UserHeadUrl;
        this.BtnReady.active = true;
        this.setBtnInviteActive(true);
        this.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
    },
    //----- 加入房间座位
    setEnterSeat: function setEnterSeat(seatNumber, player) {
        var UserInfo = fun.db.getData('UserInfo');
        var seat = this.getSeatByNumber(seatNumber);
        seat.active = true;
        fun.utils.loadUrlRes(player.HeadUrl, seat.HeadImg);
        seat.Name.string = player.Name;
        seat._Name = player.Name; //test
        seat.UserId = player.UserId;
        seat.Fen.string = player.Score;
        seat.RoomIdx = player.RoomIdx;
        seat.Ip = player.Ip;
        seat.Location = player.Address;
        seat.Sex = player.Sex;
        seat.HeadUrl = player.HeadUrl;
        if (player.Zhu <= 0) {
            seat.YaBox.active = false;
        } else {
            seat.YaBox.active = true;
            seat.YaZhu.string = player.Zhu;
        }

        var isMine = player.UserId === UserInfo.UserId ? true : false;
        if (this.GameType === 2) {
            // 三公
            if (this.getGameStatus() === 1 || this.getGameStatus() === 2) {
                if (this.getGameStatus() === 1) {
                    this.setBtnInviteActive(true);
                }
                seat.Readying.active = player.Ready;
                if (isMine) {
                    this.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
                    this.BtnReady.active = !player.Ready;
                }
            } else if (this.getGameStatus() === 3 && isMine) {
                this.showHint(PukeDefine.HINT_TEXT.WAIT_QIANG_ZHUANG);
            } else if (this.getGameStatus() === 5 && isMine) {
                this.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
            }
        } else if (this.GameType === 4) {
            // 牛牛
            if (this.getGameStatus() === 1 || this.getGameStatus() === 0) {
                if (this.getJuShuText().substring(0, 1) === '0' && this.getGameStatus() === 0) {
                    this.setBtnInviteActive(true);
                }
                if (isMine) {
                    this.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
                }
            }
            if (isMine) {
                if (player.newUser !== undefined && player.newUser && player.GamePhase > 1) {
                    this.showHint(PukeDefine.HINT_TEXT.WAIT_CURRENT_END);
                } else {
                    this.BtnReady.active = !player.Ready;
                }
            }
            if (this.getGameStatus() <= 1) {
                seat.Readying.active = player.Ready;
            } else {
                seat.Readying.active = false;
            }
        }
    },

    //----- 设置/获取 游戏状态 0/1-游戏未开始 2-开始游戏 3-游戏结束
    setGameStatus: function setGameStatus(status) {
        this.GameStatus = status;
    },
    getGameStatus: function getGameStatus() {
        return this.GameStatus;
    },
    //----- 点数/倍数Spine动画缓存完成
    getSpineCacheComplete: function getSpineCacheComplete() {
        return this._spineCacheComplete;
    },

    //----- 设置提示框显示信息
    showHint: function showHint(content, id) {
        if (content) {
            this.HintBack.active = true;
            var con = this.HintBack.getChildByName('content');
            con.getComponent(cc.Label).string = content;
        } else {
            this.HintBack.active = false;
        }
    },
    setCountDownTime: function setCountDownTime(active, time) {
        this.HintBack.getChildByName('time').active = active;
        this._countDtTime = 0;
        this._isCountdownTime = active;
        this._CountdownTime = time;
    },
    //----- 下注显示
    showXiaZhu: function showXiaZhu(zhus) {
        if (zhus.length >= 3) {
            //BUG 当 > 3 时  应显示更多下注按钮
            for (var _i9 = 0; _i9 < 3; _i9++) {
                this.XiaZhu[_i9].active = true;
                this.XiaZhu[_i9].getChildByName('label').getComponent(cc.Label).string = zhus[_i9];
                var posx = _i9 === 0 ? -195 : _i9 === 1 ? 0 : 195;
                this.XiaZhu[_i9].setPositionX(posx);
            }
        } else if (zhus.length === 2) {
            this.XiaZhu[0].active = false;
            this.XiaZhu[1].active = true;
            this.XiaZhu[1].setPositionX(-120);
            this.XiaZhu[2].setPositionX(120);
            this.XiaZhu[1].getChildByName('label').getComponent(cc.Label).string = zhus[0];
            this.XiaZhu[2].getChildByName('label').getComponent(cc.Label).string = zhus[1];
        } else if (zhus.length === 1) {
            this.XiaZhu[0].active = false;
            this.XiaZhu[1].active = false;
            this.XiaZhu[2].setPositionX(0);
            this.XiaZhu[2].getChildByName('label').getComponent(cc.Label).string = zhus[0];
        }
    },
    //----- 玩家是否选择续押
    getIsXuYa: function getIsXuYa() {
        return this.BtnXuYa.getComponent(cc.Toggle).isChecked;
    },
    //----- 单局结算后局数增加
    setJuShuText: function setJuShuText(text) {
        this.RoomInfoNode.getChildByName('jushu').getComponent(cc.Label).string = text;
    },
    getJuShuText: function getJuShuText() {
        return this.RoomInfoNode.getChildByName('jushu').getComponent(cc.Label).string;
    },

    //----- 获取 ChildNode
    getChildNode: function getChildNode() {
        return this.ChildNode;
    },
    //----- 获取总结算 Prefab
    onTotalAccountAck: function onTotalAccountAck() {
        return cc.instantiate(this.PukeAccount);
    },
    //----- 金币对象池操作
    putInGoldPool: function putInGoldPool(msg) {
        this.GoldPool.put(msg);
    },
    getFromGoldPool: function getFromGoldPool() {
        return this.GoldPool.get();
    },
    //----- 获取金币父节点
    getGoldsNode: function getGoldsNode() {
        return this.Golds;
    },
    //----- 获取扑克对象池
    getPukePool: function getPukePool() {
        return this.PukePool;
    },
    //----- 获取搓牌的对象池
    getCuoPaiPool: function getCuoPaiPool() {
        return this.CuoPaiPool;
    },
    //----- 获取解散房间 Prefab
    getDisband: function getDisband() {
        var copyDisband = cc.instantiate(this.DisbandPrefab);
        copyDisband.setPosition(cc.p(0, 0));
        copyDisband.parent = this.ChildNode.getChildByName('disband');
        return copyDisband;
    },

    //-------------------------------------------------------
    //--- 点击头像显示个人信息
    onBtnHeadClicked: function onBtnHeadClicked(sender, player) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var seat = this.getSeatByNumber(player);
        var data = {};
        data.name = seat.Name.string;
        data.id = 'ID: ' + seat.UserId;
        data.addr = seat.Location === null ? '未开启定位' : seat.Location.locdesc;
        data.url = seat.HeadUrl;
        data.isSelf = parseInt(player) === 1 ? true : false;
        data.isNoLocation = true;
        data.selfUid = fun.db.getData('UserInfo').UserId;
        data.curUid = seat.UserId;
        var head = cc.instantiate(this.BtnHead);
        var pos = PukeDefine.POSITION.DETAIL[player];
        head.setPosition(cc.p(pos.x, pos.y));
        head.getComponent('playerDetailUI').show(data);
        head.setTag(parseInt(player));
        head.parent = this.ChildNode.getChildByName('userinfo');
    },
    //--- 点击好友邀请
    onBtnInviteClicked: function onBtnInviteClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.wxShare();
    },
    //--- 点击设置
    onBtnSetClicked: function onBtnSetClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.setMenuBgActive(false);
        var set = cc.instantiate(this.SetPrefab);
        set.setPosition(0, 0);
        set.getComponent('set').setGameType('pork');
        set.parent = this.ChildNode.getChildByName('userinfo');
    },
    //--- 点击换肤
    onBtnSkinClicked: function onBtnSkinClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.setMenuBgActive(false);
        this.copyPrefabActive(this.Skin, 'copySkin');
    },
    //--- 点击准备
    onBtnReadyClicked: function onBtnReadyClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.ReadyFunction();
    },
    //--- 点击抢庄/不抢庄
    onBtnQiangZhuangClicked: function onBtnQiangZhuangClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.QZhuangFunction(0);
    },
    onBtnNotQiangZhuangClicked: function onBtnNotQiangZhuangClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.QZhuangFunction(1);
    },
    //--- 点击下注
    onBtnXiaZhuClicked: function onBtnXiaZhuClicked(sender, num) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.YaZhuFunction(num);
    },
    //--- 点击推注
    onBtnTuiZhuClicked: function onBtnTuiZhuClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.TuiZhuFunction();
    },
    //--- 点击自动续押
    onBtnXuYaClicked: function onBtnXuYaClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var isXuYa = this.BtnXuYa.getComponent(cc.Toggle).isChecked;
        PukeData.setXuYa(isXuYa);
    },
    //--- 点击搓牌
    onBtnCuoPaiClicked: function onBtnCuoPaiClicked(sender, type) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.cuoPaiAnimation(type);
    },
    //--- 点击菜单栏
    onBtnMenuClicked: function onBtnMenuClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.MenuBg.active = !this.MenuBg.active;
    },
    //--- 点击显示房间详细信息
    onBtnRoomInfoClicked: function onBtnRoomInfoClicked() {
        var roominfo = this.RoomInfoNode.getChildByName('roomInfo');
        var btn = this.RoomInfoNode.getChildByName('btnRoomInfo');
        var isUp = btn.getScaleY() < 0 ? true : false;
        this._roomInfoUp = isUp;
        var scaleX = isUp ? 1.5 : 2 / 3;
        var scaleY = isUp ? 3 : 1 / 3;
        var scaleBy = cc.scaleBy(0.1, scaleX, scaleY);
        roominfo.runAction(scaleBy);
        var pos = isUp ? { x: -500, y: -80 } : { x: -555, y: 215 };
        var moveTo = cc.moveTo(0.1, cc.p(pos.x, pos.y));
        btn.runAction(moveTo);
        if (this.GameType === 2) {
            var sg = this.RoomInfoNode.getChildByName('sgRoomInfo');
            sg.active = isUp;
        } else {
            this.scheduleOnce(function () {
                var nn = this.RoomInfoNode.getChildByName('nnRoomInfo');
                nn.active = isUp;
            }, 0.05);
        }
        btn.setScaleY(-btn.getScaleY());
    },

    //--- 点击离开(解散)房间
    onBtnLeaveClicked: function onBtnLeaveClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.setMenuBgActive(false);
        PukeManager.LeaveRoomFunction();
    },

    //-------------------------------------------------------
    //-- 检测 Prefab 是否存在 存在则 Actice 否则 instantiate
    copyPrefabActive: function copyPrefabActive(prefab, copyPrefab, func) {
        if (this[copyPrefab]) {
            this[copyPrefab].active = true;
        } else {
            this[copyPrefab] = cc.instantiate(prefab);
            this[copyPrefab].setPosition(0, 0);
            this[copyPrefab].parent = this.ChildNode.getChildByName('userinfo');
            if (func) {
                func(this[copyPrefab]);
            }
        }
    },

    //-- 准备按钮是否显示
    setBtnReadyActive: function setBtnReadyActive(active) {
        this.BtnReady.active = active;
    },
    //-- 抢庄按钮是否显示
    setBtnQZhuangActive: function setBtnQZhuangActive(active) {
        this.BtnQiangZhuang.active = active;
        this.BtnNotQiangZhuang.active = active;
    },
    //-- 邀请/离开按钮是否显示
    setBtnInviteActive: function setBtnInviteActive(active) {
        if (fun.gameCfg.releaseType !== gameConst.releaseType.apple) {
            this.BtnInvite.active = active;
        }
        this.BtnLeave.active = active;
    },
    //-- 下注按钮是否显示
    setBtnXiaZhuActive: function setBtnXiaZhuActive(active) {
        this.XiaZhuBtns.active = active;
    },
    //-- 推注按钮是否显示
    setBtnTuiZhuActive: function setBtnTuiZhuActive(active) {
        this.BtnTuiZhu.active = active;
    },
    //-- 搓牌按钮是否显示
    setBtnCuoPaiActive: function setBtnCuoPaiActive(active) {
        this.BtnCuoPai.active = active;
        this.BtnLiangPai.active = active;
    },
    //-- 菜单是否显示
    setMenuBgActive: function setMenuBgActive(active) {
        this.MenuBg.active = active;
    },
    //-- 自动续押是否显示
    setBtnXuYaActive: function setBtnXuYaActive(active) {
        this.BtnXuYa.active = active;
    },

    //-- 聊天消息
    onPukeChatUI: function onPukeChatUI(data) {
        var fromSeat = PukeManager.getSeatByUserId(data.fromId);
        var toSeat = data.toId === null ? null : PukeManager.getSeatByUserId(data.toId);
        data.func(fromSeat, toSeat);
    },
    //-- 字体跳动
    jumpTextAnim: function jumpTextAnim(node, text, color) {
        return;
        if (!node) {
            for (var _i10 = 0; _i10 < 6; ++_i10) {
                this._isJumpText[_i10] = false;
                for (var j = 0; j < this._isJumpText[_i10].length; ++j) {
                    this._isJumpText[_i10][j].stopAction();
                }
            }
        } else {
            var sn = node.parent.parent.SeatNumber - 1;
            node.active = false;
            var len = text.length;
            var pos = node.getPosition();
            for (var _i11 = 0; _i11 < len; ++_i11) {
                var label = void 0;
                if (this._jumpTextArray[sn][_i11] === undefined) {
                    this._jumpTextArray[sn][_i11] = new cc.Node('jumpText' + _i11);
                    label = this._jumpTextArray[sn][_i11].addComponent(cc.Label);
                } else {
                    label = this._jumpTextArray[sn][_i11].getComponent(cc.Label);
                }
                label.string = text.substring(_i11, _i11 + 1);
                label.fontSize = 30;
                this._jumpTextArray[sn][_i11].color = new cc.Color(color);
                this._jumpTextArray[sn][_i11].setPosition(cc.p(pos.x + _i11 * 25, pos.y));
                this._jumpTextArray[sn][_i11].parent = node.parent;
                this._jumpBy[sn][_i11] = cc.jumpBy(this._jumpTextTime, cc.p(0, 0), 20, 1);
            }
            this._jumpTextNumber[sn] = -1;
            this._jumpTextLength[sn] = len;
            this._jumpDtTime[sn] = 0;
            this._isJumpText[sn] = true;
        }
    }

});

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
        //# sourceMappingURL=PukeUI.js.map
        