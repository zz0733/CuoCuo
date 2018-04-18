(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Player/DDZ_PlayerRightPoker.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e7731PMvjJFJ6yAaeTb0HEz', 'DDZ_PlayerRightPoker', __filename);
// poker/DDZ/Script/Player/DDZ_PlayerRightPoker.js

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
        cardNum: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},

    initHandPokerCount: function initHandPokerCount(cardNum) {
        this.cardNum = cardNum;
        cc.YL.info("右边玩家的手牌数", cardNum);
        this.node.getChildByName("CardBG").getChildByName("Num").getComponent(cc.Label).string = this.cardNum;
        this.node.getChildByName("CardBG").active = true;
    },
    cleanHandPokerCount: function cleanHandPokerCount() {
        this.node.getChildByName("CardBG").getChildByName("Num").getComponent(cc.Label).string = "";
        this.node.getChildByName("CardBG").active = false;
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
        //# sourceMappingURL=DDZ_PlayerRightPoker.js.map
        