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

    setData(data) {
        this.cardNumberL.string = 'x' + data.Cnt;
        let t = new Date(data.ExpiredAt * 1000);
        let date = t.getFullYear() + '年' + (t.getMonth()+1) + '月' + t.getDate() + '日';
        this.content.string = '将在' + date + '过期';
    },

});
