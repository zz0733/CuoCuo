(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/public/interact.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fc1adNrH8BJcK6KWtYPnMIa', 'interact', __filename);
// hall/script/public/interact.js

"use strict";

var interactCfg = {
    "Jidan": { node: "liwu_0" },
    "Tuoxie": { node: "liwu_0" },
    "Hua": { node: "liwu_1" },
    "Wen": { node: "liwu_1" },
    "Bianpao": { node: "liwu_2" },
    "Hongbao": { node: "liwu_2" },
    "Xueqiu": { node: "liwu_2" },
    "Shoulei": { node: "liwu_3" },
    "Yan": { node: "liwu_3" }
};
var Audio = require('Audio');

cc.Class({
    extends: cc.Component,

    properties: {},
    // onLoad () {},

    start: function start() {},

    // update (dt) {},

    show: function show(data, startWorldPos, endWoldPos, isExchange) {
        this.hideAll();
        if (isExchange == true) {
            var startPos = startWorldPos;
            var endPos = endWoldPos;
        } else {
            var startPos = this.node.convertToNodeSpaceAR(startWorldPos);
            var endPos = this.node.convertToNodeSpaceAR(endWoldPos);
        }
        var nodeName = interactCfg[data.content].node;
        this.animNode = this.node.getChildByName(nodeName);
        this.animNode.active = true;
        this.animNode.setPosition(startPos);
        this.spAnim = this.animNode.getComponent(sp.Skeleton);
        var moveTime = cc.pDistance(startPos, endPos) / 1500;
        var moveAct = cc.sequence(cc.moveTo(moveTime, endPos), cc.callFunc(function () {
            Audio.playEffect('hall', data.content + '.mp3');
            this.moveActEnd(data);
        }.bind(this)));
        this.animNode.runAction(moveAct);
        this.spAnim.setAnimation(0, data.content + "_fei", true);
    },
    hideAll: function hideAll() {
        this.node.children.forEach(function (child) {
            child.active = false;
        });
    },
    moveActEnd: function moveActEnd(data) {
        this.spAnim.setCompleteListener(this.close.bind(this));
        this.spAnim.setAnimation(0, data.content + "_dao", false);
    },
    close: function close() {
        this.node.removeFromParent();
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
        //# sourceMappingURL=interact.js.map
        