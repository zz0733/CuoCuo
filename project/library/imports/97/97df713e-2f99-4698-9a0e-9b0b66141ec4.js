"use strict";
cc._RF.push(module, '97df7E+L5lGmJoOmwtmFB7E', 'shareCardItem');
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