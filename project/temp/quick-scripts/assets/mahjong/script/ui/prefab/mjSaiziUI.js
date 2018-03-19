(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/prefab/mjSaiziUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2192bt5kd1KTaStw6QG7wSM', 'mjSaiziUI', __filename);
// mahjong/script/ui/prefab/mjSaiziUI.js

"use strict";

var GameDefine = require("mjGameDefine");
cc.Class({
    extends: cc.Component,

    properties: {
        sai1N: cc.Node,
        sai2N: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log('--- saizi onlocad ---');
        var DefineType = GameDefine.DESKPOS_TYPE;
        this.directionList = {};
        this.directionList[DefineType.SHANG] = "Shang";
        this.directionList[DefineType.XIA] = "Xia";
        this.directionList[DefineType.ZUO] = "Zuo";
        this.directionList[DefineType.YOU] = "You";
        this.spAnim_1 = this.sai1N.getComponent(sp.Skeleton);
        var self = this;
        var completeFunc = function completeFunc(event) {
            self.onAnimFinish(event);
        };
        this.spAnim_1.setCompleteListener(completeFunc);
    },

    onAnimFinish: function onAnimFinish() {
        this.endCB.call(this.gameUI);
    },

    playAnim: function playAnim(saiNode, id, count) {
        //这个算法保证每家算的都一样，并且看起来是随机的
        var mjDataMgr = require("mjDataMgr");
        var roomID = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
        var saiNum = (parseInt(id) * 7 * count + roomID * 13) % 6 + 1;
        cc.log(arguments, "saiNum", saiNum, roomID, "end");
        var saiName = saiNum;
        var spAnim = saiNode.getComponent(sp.Skeleton);
        spAnim.setAnimation(0, saiName, false);
    },

    play: function play(saiziData, endCB, gameUI) {
        this.endCB = endCB;
        this.gameUI = gameUI;
        this.playAnim(this.sai1N, saiziData[GameDefine.DIRECTION_TYPE.DONG].PlayerIdx, saiziData.playCount + 13);
        this.playAnim(this.sai2N, saiziData[GameDefine.DIRECTION_TYPE.XI].PlayerIdx, saiziData.playCount + 7);
    },

    wahuaPlayAnim: function wahuaPlayAnim(saiNode, count) {
        var spAnim = saiNode.getComponent(sp.Skeleton);
        spAnim.setAnimation(0, count, false);
    },
    wahuaPlay: function wahuaPlay(point, endCB, gameUI) {
        this.endCB = endCB;
        this.gameUI = gameUI;
        this.wahuaPlayAnim(this.sai1N, point.p1);
        this.wahuaPlayAnim(this.sai2N, point.p2);
    }
}

// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },
);

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
        //# sourceMappingURL=mjSaiziUI.js.map
        