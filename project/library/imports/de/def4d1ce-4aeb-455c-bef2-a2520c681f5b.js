"use strict";
cc._RF.push(module, 'def4dHOSutFXL7yolIMaB9b', 'zhuanquan');
// hall/script/tishi/zhuanquan.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        textNode: {
            type: cc.Node,
            default: null
        }
    },

    onLoad: function onLoad() {},
    setString: function setString() {
        var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        this.textNode.getComponent(cc.Label).string = str;
    }
});

cc._RF.pop();