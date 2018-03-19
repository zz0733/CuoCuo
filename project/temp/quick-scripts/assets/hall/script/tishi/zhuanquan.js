(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/tishi/zhuanquan.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'def4dHOSutFXL7yolIMaB9b', 'zhuanquan', __filename);
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
        //# sourceMappingURL=zhuanquan.js.map
        