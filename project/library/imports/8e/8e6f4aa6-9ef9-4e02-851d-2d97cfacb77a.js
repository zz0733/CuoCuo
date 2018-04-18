"use strict";
cc._RF.push(module, '8e6f4qmnvlOAoUdLZfPrLd6', 'DDZ_FaiPaiAction');
// poker/DDZ/Script/Game/DDZ_FaiPaiAction.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.Prefab
    },

    onLoad: function onLoad() {
        this.bindNode();
        this.selfFly.setPosition(5, 9);
        this.rightFly.setPosition(49.1, 73.2);
        this.leftFly.setPosition(-15.7, 70.6);
        this.fapaiPoint = 0;
    },

    bindNode: function bindNode() {
        this.selfFly = this.node.getChildByName("SelfFlyNode");
        this.leftFly = this.node.getChildByName("LeftFlyNode");
        this.rightFly = this.node.getChildByName("RightFlyNode");
        this.leftPokerNode = this.node.getChildByName("LeftPokerNode");
        this.rightPokerNode = this.node.getChildByName("RightPokerNode");
        this.selfActiveNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker");
        this.selfHandPokerNode = this.selfActiveNode.getChildByName("HandPoker");
    },
    startFaPai: function startFaPai() {
        this.fapaiPoint = 0;
        this.schedule(this.actionFunc, 0.1);
    },
    actionFunc: function actionFunc() {
        if (this.fapaiPoint <= 16) {
            this.bindNode();
            this.selfFly.setPosition(5, 9);
            this.rightFly.setPosition(49.1, 73.2);
            this.leftFly.setPosition(-15.7, 70.6);
            this.selfFly.stopAllActions();
            this.rightFly.stopAllActions();
            this.leftFly.stopAllActions();
            cc.YL.DDZAudio.playFaPai();
            this.selfFly.runAction(cc.moveTo(0.08, 5, -125));
            this.rightFly.runAction(cc.moveTo(0.08, 397, 73));
            this.leftFly.runAction(cc.moveTo(0.08, -388, 71));
            this.showPokerFunc();
        } else {
            this.unschedule(this.actionFunc);
            this.node.active = false;
            this.node.destroy();
        }
    },
    showPokerFunc: function showPokerFunc() {
        this.bindNode();
        this.selfHandPokerNode.children[this.fapaiPoint].active = true;
        this.rightPokerNode.addChild(this.initPoker(1));
        this.leftPokerNode.addChild(this.initPoker(2));
        this.fapaiPoint++;
    },
    initPoker: function initPoker(type) {
        var node = cc.instantiate(this.poker);
        if (type == 1) {
            var posX = this.fapaiPoint * -10;
            node.setPosition(posX, 0);
        } else if (type == 2) {
            var posX = this.fapaiPoint * 10;
            node.setPosition(posX, 0);
        }
        return node;
    }
});

cc._RF.pop();