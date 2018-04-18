(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/public/freeCardItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'accf1X25vtNx4PvPM+hAmbT', 'freeCardItem', __filename);
// hall/script/public/freeCardItem.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        cardNumberL: {
            type: cc.Label,
            default: null
        },

        content: {
            type: cc.Label,
            default: null
        }
    },

    setData: function setData(data, gameType) {
        this.cardNumberL.string = 'x' + data.Cnt;
        var t = new Date(data.ExpiredAt * 1000);
        var date = t.getFullYear() + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日' + t.getHours() + '时' + t.getMinutes() + '分';
        this.content.string = '将在' + date + '过期';
        var ka = this.node.getChildByName('ka');
        for (var i = 0; i < ka.children.length; ++i) {
            ka.children[i].active = false;
        }
        ka.getChildByName('ka' + gameType).active = true;
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
        //# sourceMappingURL=freeCardItem.js.map
        