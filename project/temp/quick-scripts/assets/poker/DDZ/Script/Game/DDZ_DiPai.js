(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Game/DDZ_DiPai.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '630c5SRp6BEXb/4UiYbskhd', 'DDZ_DiPai', __filename);
// poker/DDZ/Script/Game/DDZ_DiPai.js

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

cc.Class({
    extends: cc.Component,

    properties: {
        pokerPre: cc.Prefab
    },

    onLoad: function onLoad() {},


    clearDiPai: function clearDiPai() {
        this.node.removeAllChildren();
        this.node.parent.getChildByName("GameInfo").getChildByName("DiPaiBack").active = true;
        this.node.active = false;
    },
    initDiPai: function initDiPai(list, isReconnect) {
        this._childScale = 0.25;
        this._childScale_old = 0.7;
        this._diPaiArr = [];
        this._diPaiPosArr = [cc.p(-41, 0), cc.p(0, 0), cc.p(41, 0)];
        this._diPaiPosArr_old = [cc.p(-200, -300), cc.p(0, -300), cc.p(200, -300)];
        this.node.parent.getChildByName("GameInfo").getChildByName("DiPaiBack").active = false;
        var lists = [];
        lists = cc.YL.DDZTools.SortPoker(list);
        this._diPaiArr = lists;
        lists = lists.reverse();
        for (var i = 0; i < lists.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(lists[i]);
            var newNode = cc.instantiate(this.pokerPre);
            newNode.setScale(this._childScale_old);
            newNode.setPosition(this._diPaiPosArr_old[i]);
            newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
            this.node.addChild(newNode);
            newNode.getChildByName("BG").active = true;
        }
        this.node.active = true;
        if (isReconnect == true) {
            this.node.children[0].setScale(this._childScale);
            this.node.children[0].setPosition(this._diPaiPosArr[0]);
            this.node.children[1].setScale(this._childScale);
            this.node.children[1].setPosition(this._diPaiPosArr[1]);
            this.node.children[2].setScale(this._childScale);
            this.node.children[2].setPosition(this._diPaiPosArr[2]);
            this.node.children[0].getChildByName("BG").active = false;
            this.node.children[1].getChildByName("BG").active = false;
            this.node.children[2].getChildByName("BG").active = false;
        } else {
            setTimeout(function () {
                this.node.children[0].stopAllActions();
                var midFunc = cc.callFunc(function () {
                    this.node.children[0].getChildByName("BG").active = false;
                }.bind(this));
                this.node.children[0].runAction(cc.sequence(cc.scaleTo(0.12, 0.5, this._childScale_old), cc.scaleTo(0.12, 0, this._childScale_old), midFunc, cc.scaleTo(0.12, 0.5, this._childScale_old), cc.scaleTo(0.12, 1, this._childScale_old), cc.spawn(cc.moveTo(0.2, this._diPaiPosArr[0]), cc.scaleTo(0.2, this._childScale))));

                this.node.children[1].stopAllActions();
                var midFunc = cc.callFunc(function () {
                    this.node.children[1].getChildByName("BG").active = false;
                }.bind(this));
                this.node.children[1].runAction(cc.sequence(cc.scaleTo(0.12, 0.5, this._childScale_old), cc.scaleTo(0.12, 0, this._childScale_old), midFunc, cc.scaleTo(0.12, 0.5, this._childScale_old), cc.scaleTo(0.12, 1, this._childScale_old), cc.spawn(cc.moveTo(0.2, this._diPaiPosArr[1]), cc.scaleTo(0.2, this._childScale))));

                this.node.children[2].stopAllActions();
                var midFunc = cc.callFunc(function () {
                    this.node.children[2].getChildByName("BG").active = false;
                }.bind(this));
                this.node.children[2].runAction(cc.sequence(cc.scaleTo(0.12, 0.5, this._childScale_old), cc.scaleTo(0.12, 0, this._childScale_old), midFunc, cc.scaleTo(0.12, 0.5, this._childScale_old), cc.scaleTo(0.12, 1, this._childScale_old), cc.spawn(cc.moveTo(0.2, this._diPaiPosArr[2]), cc.scaleTo(0.2, this._childScale))));
            }.bind(this), 200);
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
        //# sourceMappingURL=DDZ_DiPai.js.map
        