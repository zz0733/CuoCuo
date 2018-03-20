(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/wahua/desk/playerUiWahua.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '59578I6fxVCXaPP+EM/zmqP', 'playerUiWahua', __filename);
// mahjong/script/wahua/desk/playerUiWahua.js

'use strict';

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

        xiaPaiPrefab: {
            type: cc.Prefab,
            default: null
        },

        shangPaiPrefab: {
            type: cc.Prefab,
            default: null
        },

        zuoPaiPrefab: {
            type: cc.Prefab,
            default: null
        },

        youPaiPrefab: {
            type: cc.Prefab,
            default: null
        },

        xiaPengPrefab: {
            type: cc.Prefab,
            default: null
        },

        shangPengPrefab: {
            type: cc.Prefab,
            default: null
        },

        hengPengPrefab: {
            type: cc.Prefab,
            default: null
        },

        paiMianAltas: {
            type: cc.SpriteAtlas,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.setWait();
        var paiNode = this.node.getChildByName('paiNode');
        this.shouPaiNode = paiNode.getChildByName('shouPai');
        this.pengGangNode = paiNode.getChildByName('pengGang');
        this.dachuPaiNode = paiNode.getChildByName('dachuPai');
        this._cardPool = new cc.NodePool();
        this._paiArray = new Array();
    },
    setWait: function setWait() {
        this.iconSp.SpriteFrame = this.orignalIcon;
        this.nameLabel.string = '';
        this.scoreLabel.string = '';
        this.scoreBg.active = false;
        this.readyNode.active = false;
        this.offlineNode.active = false;
        this.waitNode.active = true;
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
        this.initPool();
        fun.event.dispatch('wahuaInitCompleted', uipos);
    },
    onDestroy: function onDestroy() {
        this._cardPool = [];
        this._paiArray = [];
    },
    initPool: function initPool() {
        if (this._initFlag) return;
        this._initFlag = true;
        var paiPerfabName = 'xiaPaiPrefab';
        switch (this._uipos) {
            case SeatEnum.xia:
                paiPerfabName = 'xiaPaiPrefab';
                break;
            case SeatEnum.you:
                paiPerfabName = 'youPaiPrefab';
                break;
            case SeatEnum.shang:
                paiPerfabName = 'shangPaiPrefab';
                break;
            case SeatEnum.zuo:
                paiPerfabName = 'zuoPaiPrefab';
                break;
            default:
                break;
        }
        for (var i = 0; i < WhDefine.InitCardsNumber; ++i) {
            var pai = cc.instantiate(this[paiPerfabName]);
            this._cardPool.put(pai);
        }
    },
    setXiaPai: function setXiaPai(cards) {
        for (var i = 0; i < cards.length; ++i) {
            this._paiArray[i] = this._cardPool.get();
            var posx = (WhDefine.InitCardsNumber - cards.length + i) * 60 + 20;
            // let posx = -100 - ((10 - (i + 1)) * 60);
            this._paiArray[i].setPosition(cc.p(posx, -30));
            this._paiArray[i].parent = this.shouPaiNode;
            var pai = WhUtils.getCardById(cards[i]);
            var card = this._paiArray[i].getChildByName('content').getComponent(cc.Sprite);
            card.spriteFrame = this.paiMianAltas.getSpriteFrame(pai);
        }
    },
    setYouPai: function setYouPai(cards) {
        for (var i = 0; i < cards.length; ++i) {
            this._paiArray[i] = this._cardPool.get();
            var posy = (WhDefine.InitCardsNumber - cards.length + i) * 30;
            this._paiArray[i].setPosition(cc.p(0, posy));
            this._paiArray[i].parent = this.shouPaiNode;
        }
    },
    setShangPai: function setShangPai(cards) {
        for (var i = 0; i < cards.length; ++i) {
            this._paiArray[i] = this._cardPool.get();
            var posx = (WhDefine.InitCardsNumber - cards.length - i) * 34 + 100;
            this._paiArray[i].setPosition(cc.p(posx, -10));
            this._paiArray[i].parent = this.shouPaiNode;
        }
    },
    setZuoPai: function setZuoPai(cards) {},
    setCardShow: function setCardShow(cards) {
        switch (this._uipos) {
            case SeatEnum.xia:
                this.setXiaPai(cards);
                break;
            case SeatEnum.you:
                this.setYouPai(cards);
                break;
            case SeatEnum.shang:
                this.setShangPai(cards);
                break;
            case SeatEnum.zuo:
                this.setZuoPai(cards);
                break;
            default:
                break;
        }
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
        for (var i = 0; i < JiaWeiArr.length; ++i) {
            this.directNode.getChildByName(JiaWeiArr[i]).active = false;
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
        //# sourceMappingURL=playerUiWahua.js.map
        