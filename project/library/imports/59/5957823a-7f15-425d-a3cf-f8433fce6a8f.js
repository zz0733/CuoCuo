"use strict";
cc._RF.push(module, '59578I6fxVCXaPP+EM/zmqP', 'playerUiWahua');
// mahjong/script/wahua/desk/playerUiWahua.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var SeatEnum = cc.Enum({
    xia: 0,
    you: 1,
    shang: 2,
    zuo: 3
});
var JiaWeiArr = ['tianjia', 'dijia', 'yinpai', 'changsan'];
var WhDefine = require('whDefine');
var WhUtils = require('whUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        orignalIcon: {
            type: cc.SpriteFrame,
            default: null
        },

        iconSp: {
            type: cc.Sprite,
            default: null
        },

        nameLabel: {
            type: cc.Label,
            default: null
        },

        scoreLabel: {
            type: cc.Label,
            default: null
        },

        scoreBg: {
            type: cc.Node,
            default: null
        },

        readyNode: {
            type: cc.Node,
            default: null
        },

        noCardNode: {
            type: cc.Node,
            default: null
        },

        quanNode: {
            type: cc.Node,
            default: null
        },

        directNode: {
            type: cc.Node,
            default: null
        },

        emojiNode: {
            type: cc.Node,
            default: null
        },

        textNode: {
            type: cc.Node,
            default: null
        },

        voiceNode: {
            type: cc.Node,
            default: null
        },

        offlineNode: {
            type: cc.Node,
            default: null
        },

        waitNode: {
            type: cc.Node,
            default: null
        },

        buhuaLabel: {
            type: cc.Label,
            default: null
        },

        paiPrefab: {
            type: cc.Prefab,
            default: null
        },

        tangPrefab: {
            type: cc.Prefab,
            default: null
        },

        optCardPrefab: {
            type: cc.Prefab,
            default: null
        },

        huPaiPrefab: {
            type: cc.Prefab,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.setWait();
        var paiNode = this.node.getChildByName('paiNode');
        this.shouPaiNode = paiNode.getChildByName('shouPai');
        this.pengGangNode = paiNode.getChildByName('pengGang');
        this.dachuPaiNode = paiNode.getChildByName('dachuPai');
        this.enableSendN = paiNode.getChildByName('enableSend');
        this._paiArray = new Array();
        this._chiGangArray = new Array();
    },
    setWait: function setWait() {
        this.iconSp.SpriteFrame = this.orignalIcon;
        this.nameLabel.string = '';
        this.scoreLabel.string = '';
        this.scoreBg.active = false;
        this.readyNode.active = false;
        this.offlineNode.active = false;
        this.waitNode.active = true;
        this.buhuaLabel.string = '';
    },
    setData: function setData(data, uipos) {
        this.data = data;
        fun.utils.loadUrlRes(data.imageUrl, this.node.getChildByName('icon'));
        this.nameLabel.string = data.userName + ' ' + data.userId;
        this.scoreLabel.string = data.score || 0; // totalScore;
        this.node.getChildByName('name').active = true;
        this.node.getChildByName('score').active = true;
        this.scoreBg.active = true;
        this.waitNode.active = false;
        if (data.onLine && data.onLine !== 1) {
            //1在线， 2不在线
            this.offlineNode.active = true;
        }
        if (data.currentState === 1) {
            this.showReady(true);
        }
        this._uipos = uipos;
        fun.event.dispatch('wahuaInitCompleted', uipos);
    },
    onDestroy: function onDestroy() {
        this._paiArray = [];
        this._cards = [];
        this._chiGangArray = [];
    },
    clearDesk: function clearDesk() {
        this._paiArray = [];
        this._cards = [];
        this._chiGangArray = [];
        this.shouPaiNode.removeAllChildren();
        this.pengGangNode.removeAllChildren();
        this.dachuPaiNode.removeAllChildren();
    },


    /**
     * 玩家摸排
     * @param {INT} cardNumber 牌id
     */
    moPai: function moPai(cardNumber) {
        cc.log('--- ' + this._uipos + ' moPai: ', cardNumber);
        switch (this._uipos) {
            case SeatEnum.xia:
                {
                    this.setEnableSend(true);
                    var paiN = cc.instantiate(this.paiPrefab);
                    paiN.parent = this.shouPaiNode;
                    paiN.getComponent('whPaiTouch').setCardNumber(cardNumber);
                    paiN.setPosition(cc.p(1160, -180));
                    this._paiArray[this._paiArray.length] = paiN;;
                    var pai = WhUtils.getCardById(cardNumber);
                    var card = paiN.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(pai);
                    var enable = WhUtils.checkCardEnable(cardNumber, this._cards);
                    if (enable) {
                        cc.log('--- enable, type: ', enable, typeof enable === 'undefined' ? 'undefined' : _typeof(enable));
                        WhUtils.setPaiEnable(paiN, false, false);
                        if (_typeof(enable !== 'boolean')) {
                            for (var _i = 0; _i < this._cards.cardArr.length; ++_i) {
                                if (this._cards.cardArr[_i] === enable) {
                                    WhUtils.setPaiEnable(this._paiArray[_i], false, false);
                                }
                            }
                        }
                        if ((typeof enable === 'undefined' ? 'undefined' : _typeof(enable)) === 'object') {
                            if (typeof enable.song === 'boolean') {
                                WhUtils.setPaiEnable(paiN, true, true);
                                paiN.getChildByName('song').active = true;
                            } else {
                                for (var _i2 = 0; _i2 < this._cards.cardArr.length; ++_i2) {
                                    if (this._cards.cardArr[_i2] === enable.song) {
                                        WhUtils.setPaiEnable(this._paiArray[_i2], true, true);
                                        this._paiArray[_i2].getChildByName('song').active = true;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case SeatEnum.you:
                this.setCardShow(this._paiLeftNumber + 1);
                break;
            case SeatEnum.shang:
                this.setCardShow(this._paiLeftNumber + 1);
                break;
            case SeatEnum.zuo:
                this.setCardShow(this._paiLeftNumber + 1);
                break;
            default:
                break;
        }
    },


    /**
     * 玩家出牌
     * @param {Array} cardInfo 牌的集合
     */
    chuPai: function chuPai(cardInfo) {
        var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!cardInfo) return;
        var sendCard = cc.instantiate(this.tangPrefab);
        var id = cardInfo.cardNumber ? cardInfo.cardNumber : cardInfo;
        sendCard.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(WhUtils.getCardById(id));
        sendCard.parent = this.dachuPaiNode;
        // sendCard.cardNumber = id;
        var chupaiNum = this.dachuPaiNode.children.length;
        switch (this._uipos) {
            case SeatEnum.xia:
                {
                    var posx = 34 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10),
                        posy = void 0;
                    if (chupaiNum <= 10) posy = 30;else if (chupaiNum > 10 && chupaiNum <= 20) posy = -15;else posy = -60;
                    sendCard.setPosition(cc.p(posx + 400, posy));
                    if (flag) {
                        fun.net.send('PlayCard', { showChess: id }, function (rsp) {
                            if (rsp.returnStatu && rsp.returnStatu !== 1) {
                                cc.log('--- 出牌错误 ---');
                            }
                        });
                        this.setEnableSend(false);
                        for (var _i3 = 0; _i3 < this._cards.cardArr.length; ++_i3) {
                            if (this._cards.cardArr[_i3] === id) {
                                this._cards.cardArr.splice(_i3, 1);
                            }
                        }
                        fun.event.dispatch('whNeedReSortCards', this._cards.cardArr);
                    }
                }
                break;
            case SeatEnum.you:
                {
                    var _posx = void 0,
                        _posy = -20 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10);
                    if (chupaiNum <= 10) _posx = 60;else if (chupaiNum > 10 && chupaiNum <= 20) _posx = 30;else _posx = 0;
                    sendCard.setPosition(cc.p(_posx, _posy));
                    if (flag) this.setCardShow(this._paiLeftNumber - 1);
                }
                break;
            case SeatEnum.shang:
                {
                    var _posx2 = -34 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10),
                        _posy2 = void 0,
                        order = 3;
                    if (chupaiNum <= 10) {
                        _posy2 = -120;
                        order = 3;
                    } else if (chupaiNum > 10 && chupaiNum <= 20) {
                        _posy2 = -75;
                        order = 2;
                    } else {
                        _posy2 = -30;
                        order = 1;
                    }
                    sendCard.setLocalZOrder(order);
                    sendCard.setPosition(cc.p(_posx2 - 205, _posy2));
                    if (flag) this.setCardShow(this._paiLeftNumber - 1);
                }
                break;
            case SeatEnum.zuo:
                {
                    var _posx3 = void 0,
                        _posy3 = 20 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10);
                    if (chupaiNum <= 10) _posx3 = 0;else if (chupaiNum > 10 && chupaiNum <= 20) _posx3 = 30;else _posx3 = 60;
                    sendCard.setPosition(cc.p(_posx3, _posy3));
                    if (flag) this.setCardShow(this._paiLeftNumber - 1);
                }
                break;
            default:
                break;
        }
    },


    /**
     * 牌的显示
     * @param {*} cards     下: 排序后的牌/ 其他: 牌的数量
     */
    setCardShow: function setCardShow(cards) {
        var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        cc.log('--- setCardShow  cards: ', cards);
        this.shouPaiNode.removeAllChildren();
        this._paiArray = [];
        this._paiLeftNumber = this._uipos === SeatEnum.xia ? cards.cardArr.length : cards;
        switch (this._uipos) {
            case SeatEnum.xia:
                {
                    this._cards = cards;
                    this._enableNumber = cards.enableNumber;
                    for (var _i4 = 0; _i4 < cards.cardArr.length; ++_i4) {
                        var posx = void 0,
                            pai = WhUtils.getCardById(cards.cardArr[_i4]);
                        if (cards.cardArr.length % 2 === 1) {
                            posx = (_i4 - cards.cardArr.length) * 60 + 1200;
                        } else {
                            posx = (_i4 - 1 - cards.cardArr.length) * 60 + 1200;
                            this.setEnableSend(false);
                        }
                        this._paiArray[_i4] = cc.instantiate(this.paiPrefab);
                        this._paiArray[_i4].setPosition(cc.p(posx, -180));
                        this._paiArray[_i4].parent = this.shouPaiNode;
                        this._paiArray[_i4].getChildByName('song').active = false;
                        this._paiArray[_i4].getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(pai);
                        this._paiArray[_i4].getComponent('whPaiTouch').setCardNumber(cards.cardArr[_i4]);
                        WhUtils.setPaiEnable(this._paiArray[_i4], true, true);
                        if (cards.songCardArr.length !== 0) {
                            WhUtils.setPaiEnable(this._paiArray[_i4], false, false);
                            for (var s = 0; s < cards.songCardArr.length; s++) {
                                if (cards.cardArr[_i4] === cards.songCardArr[s]) {
                                    this._paiArray[_i4].getChildByName('song').active = true;
                                    WhUtils.setPaiEnable(this._paiArray[_i4], true, true);
                                    break;
                                }
                            }
                        } else {
                            if (this._enableNumber > _i4) {
                                WhUtils.setPaiEnable(this._paiArray[_i4], false, false);
                            }
                        }
                    }
                }
                break;
            case SeatEnum.you:
                for (var _i5 = 0; _i5 < cards; ++_i5) {
                    this._paiArray[_i5] = cc.instantiate(this.paiPrefab);
                    var posy = (_i5 - cards) * 30;
                    this._paiArray[_i5].setPosition(cc.p(0, posy));
                    this._paiArray[_i5].parent = this.shouPaiNode;
                }
                break;
            case SeatEnum.shang:
                for (var _i6 = 0; _i6 < cards; ++_i6) {
                    this._paiArray[_i6] = cc.instantiate(this.paiPrefab);
                    var _posx4 = void 0;
                    if (cards % 2 === 1) {
                        _posx4 = (_i6 - 1) * 34 - 750;
                    } else {
                        _posx4 = _i6 * 34.5 - 750;
                    }
                    this._paiArray[_i6].setPosition(cc.p(_posx4, 50));
                    this._paiArray[_i6].parent = this.shouPaiNode;
                }
                if (cards % 2 === 1 && !flag) {
                    this._paiArray[0].setPositionX(this._paiArray[0].getPositionX() - 10);
                }
                break;
            case SeatEnum.zuo:
                for (var _i7 = 0; _i7 < cards; ++_i7) {
                    this._paiArray[_i7] = cc.instantiate(this.paiPrefab);
                    var _posx5 = (-cards - _i7) * 34 + 100;
                    this._paiArray[_i7].setPosition(cc.p(_posx5, -10));
                    this._paiArray[_i7].parent = this.shouPaiNode;
                }
                break;
            default:
                break;
        }
    },


    /**
     * 吃杠
     * @param {Array} cardArr 
     */
    setChiGang: function setChiGang(cardArr) {
        var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var type = cardArr.length === 3 ? 'gang' : 'chi';
        if (this._uipos === SeatEnum.xia && flag) {
            this.setEnableSend(true);
            for (var _i8 = 0; _i8 < this._cards.cardArr.length; ++_i8) {
                for (var j = 0; j < cardArr.length; ++j) {
                    if (this._cards.cardArr[_i8] === cardArr[j]) {
                        this._cards.cardArr.splice(_i8, 1);
                    }
                }
            }
            if (type === 'gang') this._paiArray[this._paiArray.length - 1].removeFromParent();
            fun.event.dispatch('whNeedReSortCards', this._cards.cardArr);
        } else {
            if (flag) this.setCardShow(this._paiLeftNumber - cardArr.length + 1, true);
        }

        var pos = void 0,
            dir = void 0,
            opsNum = this.pengGangNode.children.length;
        switch (this._uipos) {
            case SeatEnum.xia:
                dir = 'xia';
                pos = cc.p(120 * opsNum - 40, -180);
                break;
            case SeatEnum.you:
                dir = 'you';
                pos = cc.p(500, 40 * opsNum + 100);
                break;
            case SeatEnum.shang:
                dir = 'shang';
                pos = cc.p(-120 - 70 * opsNum, 50);
                break;
            case SeatEnum.zuo:
                dir = 'zuo';
                pos = cc.p(60, 500 - 40 * opsNum);
                break;
            default:
                break;
        }
        var opt = cc.instantiate(this.optCardPrefab);
        opt.setPosition(pos);
        opt.parent = this.pengGangNode;
        this._chiGangArray[this._chiGangArray.length] = cardArr;
        for (var _i9 = 0; _i9 < cardArr.length; ++_i9) {
            var typeN = opt.getChildByName(dir).getChildByName(type);
            typeN.active = true;
            var nd = typeN.getChildByName('card' + (_i9 + 1));
            nd.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(WhUtils.getCardById(cardArr[_i9]));
        }
    },


    /**
     * 替换白皮
     * @param {Array} cardArr 
     */
    setHuan: function setHuan(cardArr) {
        for (var _i10 = 0; _i10 < this._chiGangArray.length; ++_i10) {
            for (var j; j < cardArr.length; ++j) {
                if (this._chiGangArray[_i10] === cardArr[j]) {
                    cc.log('--- 替换白皮: i, j, sameCard: ', _i10, j, cardArr[j]);
                    // this.pengGangNode.children[this.pengGangNode.children.length - 1];
                    break;
                }
            }
        }
    },


    /**
     * 胡
     * @param {Object} data 
     */
    setHu: function setHu(cardArr) {
        cc.log('--- 胡牌 cardArr: ', cardArr);
        this.shouPaiNode.removeAllChildren();
        var pos = void 0,
            chiGangPos = void 0;
        if (this.pengGangNode.children.length !== 0) {
            this.pengGangNode.children[this.pengGangNode.children.length - 1].getPosition();
        }
        switch (this._uipos) {
            case SeatEnum.xia:
                chiGangPos = chiGangPos ? chiGangPos : -40;
                pos = cc.p(chiGangPos + i * 60 + 20, 180);
                break;
            case SeatEnum.you:
                chiGangPos = chiGangPos ? chiGangPos : -40;
                pos = cc.p(chiGangPos - i * 34, -360);
                break;
            case SeatEnum.shang:
                chiGangPos = chiGangPos ? chiGangPos : -120;
                pos = cc.p(chiGangPos - i * 34, -360);
                break;
            case SeatEnum.zuo:
                chiGangPos = chiGangPos ? chiGangPos : -40;
                pos = cc.p(chiGangPos - i * 34, -360);
                break;
            default:
                break;
        }
        cc.log('--- pos, chiGangPos: ', pos, chiGangPos);
        for (var _i11 = 0; _i11 < cardArr; ++_i11) {
            var c = cc.instantiate(this.huPaiPrefab);
            c.setPosition(pos);
            var pai = WhUtils.getCardById(cardArr[_i11]);
            c.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(pai);
            c.parent = this.shouPaiNode;
        }
    },


    /**
     * 牌全部放下
     */
    xiaPaiAllDown: function xiaPaiAllDown() {
        for (var _i12 = 0; _i12 < this._paiArray.length; ++_i12) {
            if (this._paiArray[_i12].getPositionY() !== -180) {
                this._paiArray[_i12].setPositionY(-180);
            }
        }
    },
    setEnableSend: function setEnableSend(flag) {
        this.enableSendN.active = !flag;
    },
    setScore: function setScore() {
        var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        this.scoreLabel.string = score;
    },
    showReady: function showReady(flag) {
        this.readyNode.active = flag;
    },
    showNoCard: function showNoCard(flag) {
        this.noCardNode.active = flag;
    },
    showQuan: function showQuan(flag) {
        this.quanNode.active = flag;
    },
    setDirect: function setDirect(direct) {
        this.setDirectEnable();
        this.directNode.active = true;
        for (var _i13 = 0; _i13 < JiaWeiArr.length; ++_i13) {
            this.directNode.getChildByName(JiaWeiArr[_i13]).active = false;
        }
        this.directNode.getChildByName(JiaWeiArr[direct]).active = true;
    },
    setDirectEnable: function setDirectEnable() {
        this.directNode.active = false;
    },
    setEmoji: function setEmoji(emoji) {},
    setText: function setText(text) {},
    setVoice: function setVoice(voice) {},
    showOffLine: function showOffLine(flag) {
        this.offlineNode.active = flag;
    },
    setBuhuaText: function setBuhuaText(text) {
        this.buhuaLabel.string = '补花: ' + text;
    },
    setXianVisible: function setXianVisible(flag) {
        this.node.getChildByName('xian').active = flag;
    },
    getSpriteFrameByCard: function getSpriteFrameByCard(card) {
        return this.node.parent.getComponent('gameMgrWahua').paiMianAltas.getSpriteFrame(card);;
    }
});

cc._RF.pop();