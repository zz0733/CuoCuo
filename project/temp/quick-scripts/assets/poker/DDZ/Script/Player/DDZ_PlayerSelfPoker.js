(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Player/DDZ_PlayerSelfPoker.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3959a/y++FL+4743mtmETw6', 'DDZ_PlayerSelfPoker', __filename);
// poker/DDZ/Script/Player/DDZ_PlayerSelfPoker.js

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
        _selfPlayerHandPoker: [],
        _scale: 1,
        _pos: cc.p(0, -193),
        _pokerMargin: 50
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.node.setPosition(this._pos);
    },


    initHandPoker: function initHandPoker(handPokerList) {
        this._selfPlayerHandPoker = this.sortHnadPoker(handPokerList);
        this._updateHandPoker(this._selfPlayerHandPoker);
    },
    _updateHandPoker: function _updateHandPoker(pokerList) {},
    sortHnadPoker: function sortHnadPoker() {
        var temp = [];
        return temp;
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
        //# sourceMappingURL=DDZ_PlayerSelfPoker.js.map
        