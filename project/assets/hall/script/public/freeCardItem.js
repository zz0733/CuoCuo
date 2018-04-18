cc.Class({
    extends: cc.Component,

    properties: {
        cardNumberL: {
            type: cc.Label,
            default: null,
        },

        content: {
            type: cc.Label,
            default: null,
        },
    },

    setData(data, gameType) {
        this.cardNumberL.string = 'x' + data.Cnt;
        let t = new Date(data.ExpiredAt * 1000);
        let date = t.getFullYear() + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日' + t.getHours() + '时' + t.getMinutes() + '分';
        this.content.string = '将在' + date + '过期';
        let ka = this.node.getChildByName('ka');
        for (let i = 0; i < ka.children.length; ++i) {
            ka.children[i].active = false;
        }
        ka.getChildByName('ka' + gameType).active = true;
    },

});
