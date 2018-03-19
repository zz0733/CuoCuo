(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/wahua/prefab/whSkin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4d0abWLkmRBPINNdoQJVrZY', 'whSkin', __filename);
// mahjong/script/wahua/prefab/whSkin.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            type: cc.Node,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.back.getChildByName('btnQuit').on('click', this.onBtnQuitClick, this);
    },
    onBtnQuitClick: function onBtnQuitClick() {
        this.node.destroy();
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
        //# sourceMappingURL=whSkin.js.map
        