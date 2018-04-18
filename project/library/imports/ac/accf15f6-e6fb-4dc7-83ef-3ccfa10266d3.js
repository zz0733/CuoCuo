"use strict";
cc._RF.push(module, 'accf1X25vtNx4PvPM+hAmbT', 'freeCardItem');
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