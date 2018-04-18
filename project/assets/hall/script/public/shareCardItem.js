cc.Class({
    extends: cc.Component,

    properties: {
        cardNumberL: cc.Label,
        contentL: cc.Label,
        cardImg: cc.Node,
    },

    onLoad() {
        this.node.getChildByName('btnFx').on('click', function() {
            if (this._data.isJiLu) {
                fun.event.dispatch('shareCardItemAgain', this._data);
            } else {
                fun.event.dispatch('shareCardItemNumber', this._data);
            }
        }.bind(this));
    },

    setData(data) {
        this.cardNumberL.string = 'x' + data.Cnt;
        let t = new Date((data.ExpiredAt || data.ExpireAt) * 1000);
        let date = t.getFullYear() + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日' + t.getHours() + '时' + t.getMinutes() + '分';
        this.contentL.string = '将在' + date + '过期';
        this.cardImg.getChildByName('ka' + data.GameType).active = true;
        data.date = date;
        this._data = data;
    },

});
