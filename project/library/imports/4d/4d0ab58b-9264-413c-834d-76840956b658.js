"use strict";
cc._RF.push(module, '4d0abWLkmRBPINNdoQJVrZY', 'whSkin');
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