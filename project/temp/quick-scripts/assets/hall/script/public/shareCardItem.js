(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/public/shareCardItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '97df7E+L5lGmJoOmwtmFB7E', 'shareCardItem', __filename);
// hall/script/public/shareCardItem.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        cardNumberL: cc.Label,
        contentL: cc.Label,
        cardImg: cc.Node
    },

    onLoad: function onLoad() {
        this.node.getChildByName('btnFx').on('click', function () {
            if (this._data.isJiLu) {
                fun.event.dispatch('shareCardItemAgain', this._data);
            } else {
                fun.event.dispatch('shareCardItemNumber', this._data);
            }
        }.bind(this));
    },
    setData: function setData(data) {
        this.cardNumberL.string = 'x' + data.Cnt;
        var t = new Date((data.ExpiredAt || data.ExpireAt) * 1000);
        var date = t.getFullYear() + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日' + t.getHours() + '时' + t.getMinutes() + '分';
        this.contentL.string = '将在' + date + '过期';
        this.cardImg.getChildByName('ka' + data.GameType).active = true;
        data.date = date;
        this._data = data;
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
        //# sourceMappingURL=shareCardItem.js.map
        