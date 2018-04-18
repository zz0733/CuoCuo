(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Poker/DDZ_Poker.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0c5c9q5IctLSpuAWCw/LFOx', 'DDZ_Poker', __filename);
// poker/DDZ/Script/Poker/DDZ_Poker.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
/********
 * 单张手牌的挂载
 * 注册touch事件
 * 手牌初始化
 * 运动等
 * *******/
cc.Class({
    extends: cc.Component,

    properties: {
        pokerAtals: cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.bindNode();
    },

    bindNode: function bindNode() {
        this._bgNode = this.node.getChildByName("BG");
        this._frontNode = this.node.getChildByName("Front");
        this._ownerSign = this.node.getChildByName("OwnerSign");
        this._cardNum = this.node.getChildByName("CardNum");
    },
    initPoker: function initPoker(object) {
        //todo
        this.bindNode();
        this.pokerID = object.ID;
        this.pokerTypeArr = object.typeArr;
        this.pokerValue = object.valueArr;
        this.pokerNum = object.Num;
        // cc.YL.info("initPoker扑克牌的ID:%s，type:%s，图集名:%s，值:%s",this.pokerID,this.pokerTypeArr,this.pokerValue,this.pokerNum);
        if (this.pokerTypeArr == "00") {
            this._frontNode.getChildByName("typeSmall").getComponent(cc.Sprite).spriteFrame = this.pokerAtals.getSpriteFrame(this.pokerValue);
            this._frontNode.getChildByName("typeSmall").setPosition(cc.p(0, 0));
            this._frontNode.getChildByName("typeSmall").width = 154;
            this._frontNode.getChildByName("typeSmall").height = 208;
            this._frontNode.getChildByName("typeSmall").setScale(0.9);
            this._frontNode.getChildByName("typeSmall").active = true;
            this._frontNode.getChildByName("typeBig").active = false;
            this._frontNode.getChildByName("Num").active = false;
        } else {
            this._frontNode.getChildByName("typeBig").getComponent(cc.Sprite).spriteFrame = this.pokerAtals.getSpriteFrame(this.pokerTypeArr);
            this._frontNode.getChildByName("typeSmall").getComponent(cc.Sprite).spriteFrame = this.pokerAtals.getSpriteFrame(this.pokerTypeArr);
            this._frontNode.getChildByName("Num").getComponent(cc.Sprite).spriteFrame = this.pokerAtals.getSpriteFrame(this.pokerValue);
            this._frontNode.getChildByName("typeBig").setPosition(10, -47);
            this._frontNode.getChildByName("typeBig").width = 105;
            this._frontNode.getChildByName("typeBig").height = 85;
            this._frontNode.getChildByName("typeBig").setScale(1);
            this._frontNode.getChildByName("typeSmall").setPosition(-43, 26.7);
            this._frontNode.getChildByName("typeSmall").width = 105;
            this._frontNode.getChildByName("typeSmall").height = 85;
            this._frontNode.getChildByName("typeSmall").setScale(0.35);
            this._frontNode.getChildByName("Num").setPosition(-43, 72);
            this._frontNode.getChildByName("Num").width = 50;
            this._frontNode.getChildByName("Num").height = 51;
            this._frontNode.getChildByName("Num").setScale(0.9);
            this._frontNode.getChildByName("typeBig").active = true;
            this._frontNode.getChildByName("typeSmall").active = true;
            this._frontNode.getChildByName("Num").active = true;
        }
        this._bgNode.active = false;
        this._frontNode.active = true;
        this._ownerSign.active = false;
        this._cardNum.active = false;
    },
    showBG: function showBG() {
        this._bgNode.active = true;
        this._frontNode.active = false;
        this._ownerSign.active = false;
        this._cardNum.active = false;
    },
    showOwner: function showOwner() {
        this._bgNode.active = false;
        this._frontNode.active = true;
        this._ownerSign.active = true;
        this._cardNum.active = false;
    },
    showNum: function showNum(num) {
        this._bgNode.active = true;
        this._frontNode.active = false;
        this._ownerSign.active = false;
        this._cardNum.active = true;
        this._cardNum.getComponent(cc.Label).string = num;
    },
    hide: function hide(type) {
        if (type) {
            var nodeArr = [this._bgNode, this._frontNode, this._ownerSign, this._cardNum];
            nodeArr[type].active = false;
        } else {
            this._bgNode.active = false;
            this._frontNode.active = false;
            this._ownerSign.active = false;
            this._cardNum.active = false;
        }
    }
    // update (dt) {},
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
        //# sourceMappingURL=DDZ_Poker.js.map
        